/*
 * src/db/dataCache.js
 * IndexedDB cache for data
 *
 * Purpose:
 * - Fetch the generated JSON (`REACT_APP_OUTPUT`) and cache it
 *   into IndexedDB using one object store per sheet (store names are sheet
 *   index strings like "0", "1").
 *
 * Exports:
 * - `initAndCacheData()` — fetch the JSON and ensure IndexedDB is populated.
 *   The function will avoid unnecessary repopulation by checking a stored
 *   meta `version` record in the DB and only delete/repopulate when the
 *   fetched `data.version` differs or the DB is missing.
 * - `getFromStore(storeName)` — return a single randomly-selected record
 *   from a given object store. Returned IDs are tracked per-store so the
 *   same entry isn't served again until all entries have been returned.
 *
 * Notes / Behavior changes:
 * - Storage: per-sheet stores are created with `keyPath: KEY_ID` and
 *   `autoIncrement: true`
 * - `_initPromise` prevents duplicate initial fetch/populate runs in a
 *   single browser session
 * - `_dbPromise` caches the opened `IDBDatabase` instance for reuse.
 * - `_usedDataIDs` (Map<storeName,Set<id>>) tracks IDs that were served via
 *   random selection so the same game data isn't served twice until all
 *   entries have been returned.
 *
 * Github Copilot GPT-5 mini was used to check and suggest code in this file.
 * Instructions and code snippets were used from:
 * https://medium.com/@shashika.silva88/indexeddb-a-comprehensive-overview-for-frontend-developers-6b47a9f32e23
 */

const DB_NAME = process.env.REACT_APP_DB_NAME;
const DB_VERSION = Number(process.env.REACT_APP_DB_VERSION);
const META_STORE = process.env.REACT_APP_META_STORE;
const META_RECORD_ID = process.env.REACT_APP_META_RECORD_ID;
const KEY_ID = process.env.REACT_APP_KEY_ID;

let _dbPromise = null;
let _initPromise = null;
// Map<storeName, Set<id>> - track ids that were served randomly per sheet
let _usedDataIDs = new Map();

/**
 * Open the IndexedDB database. If `data` is provided, the function will
 * populate per-sheet stores inside the `onupgradeneeded` handler using the
 * provided mapping. Per-sheet stores use an inline keyPath and autoIncrement
 *
 * @param {Object|null} data - optional parsed JSON to populate into DB
 * @returns {Promise<IDBDatabase>} resolves with the opened DB or rejects on error
 */
function openDB(data = null) {
  if (_dbPromise) return _dbPromise;

  _dbPromise = new Promise((resolve, reject) => {
    // TODO: on version bump onupgradeneeded will run even without data
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (ev) => {
      // The DB instance that's being upgraded/created
      const db = ev.target.result;

      if (!data) return;
      // Use the upgrade transaction to create per-sheet stores and write
      // all rows.
      const tx = ev.target.transaction;
      const sheetNames = Object.keys(data).filter((k) => k !== "version");
      for (const sheetName of sheetNames) {
        const storeName = String(sheetName);
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            keyPath: KEY_ID,
            autoIncrement: true,
          });
        }
        const store = tx.objectStore(storeName);
        const rows = data[sheetName] || [];
        for (const row of rows) {
          store.put(row);
        }
      }

      // Write a meta record so we can check the `version` later.
      // TODO: use this to avoid re-fetching/repopulating when up-to-date
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: KEY_ID });
      }
      const metaStore = tx.objectStore(META_STORE);
      const rec = { version: data.version };
      rec[KEY_ID] = META_RECORD_ID;
      metaStore.put(rec);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      // Clear cached promise so callers can retry opening the DB.
      _dbPromise = null;
      reject(req.error);
    };
  });

  return _dbPromise;
}

/**
 * Delete the entire IndexedDB database for this app.
 *
 * @returns {Promise<void>} resolves when deletion completes or rejects on error
 */
function deleteDatabase() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Pick a random key from `store`, skipping IDs already recorded in the
 * `_usedDataIDs` set for `storeName`. If all keys have been served the set
 * is cleared and selection restarts. Resolves to the picked key or
 * `undefined` when the store is empty.
 */
function _pickRandomKeyFromStore(store, storeName) {
  return new Promise((resolve, reject) => {
    const reqKeys = store.getAllKeys();
    reqKeys.onsuccess = () => {
      const keys = reqKeys.result;
      if (keys.length === 0) return resolve(undefined);

      // Ensure we have a Set for this store
      let used = _usedDataIDs.get(storeName);
      if (!used) {
        used = new Set();
        _usedDataIDs.set(storeName, used);
      }

      // If all keys have been served, reset and start over
      if (used.size >= keys.length) {
        used.clear();
      }

      // Filter out already-used keys
      const available = keys.filter((k) => !used.has(k));
      if (available.length === 0) return resolve(undefined);

      const idx = Math.floor(Math.random() * available.length);
      const picked = available[idx];
      // mark as used
      used.add(picked);
      resolve(picked);
    };
    reqKeys.onerror = () =>
      reject(reqKeys.error || new Error("getAllKeys failed"));
  });
}

/**
 * Fetch the generated JSON (URL configured by `REACT_APP_OUTPUT`) and cache
 * its collections into IndexedDB.
 *
 * The function will check the on-disk DB meta version and only delete and
 * repopulate when necessary (missing DB/meta or version mismatch). Returns
 * the parsed JSON data.
 * @returns {Promise<object>} the parsed JSON data
 */
export async function initAndCacheData() {
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const res = await fetch(process.env.REACT_APP_OUTPUT);
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
    const data = await res.json();

    // Determine whether we need to populate the DB.
    // 1) If no DB/stores exist -> populate
    // 2) If META_STORE missing or meta.version differs -> delete & populate
    // 3) Else reuse existing DB and do nothing
    let existingDB = null;
    let needPopulate = false;
    try {
      existingDB = await openDB();

      // If there are no object stores, treat as missing DB
      if (!existingDB || existingDB.objectStoreNames.length === 0) {
        needPopulate = true;
      } else if (!existingDB.objectStoreNames.contains(META_STORE)) {
        // No meta store present: must populate
        needPopulate = true;
      } else {
        // Read meta record and compare versions
        const tx = existingDB.transaction(META_STORE, "readonly");
        const store = tx.objectStore(META_STORE);
        const req = store.get(META_RECORD_ID);
        const meta = await new Promise((resolve, reject) => {
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        });
        if (!meta || meta.version !== data.version) {
          needPopulate = true;
        }
      }
    } catch (err) {
      // Any error while probing the existing DB -> repopulate
      console.debug("DB probe failed, will (re)populate:", err);
      needPopulate = true;
    }

    if (needPopulate) {
      // Close any open connection so `deleteDatabase` is not blocked.
      try {
        if (existingDB && typeof existingDB.close === "function") {
          existingDB.close();
        }
      } catch (err) {
        console.debug("Failed to close existing DB connection:", err);
      }

      await deleteDatabase();
      _dbPromise = null;
      const db = await openDB(data);
      _dbPromise = Promise.resolve(db);
    } else {
      // Reuse existing DB
      _dbPromise = Promise.resolve(existingDB);
    }

    return data;
  })();

  return _initPromise;
}

/**
 * Read a single record from an object store.
 * `storeName` is required. This implementation selects a random key that
 * hasn't been served before and returns the corresponding value. The
 * randomly-served key is recorded in `_usedDataIDs` so it won't be returned
 * again until every entry in the store has been served, at which point the
 * per-store used-set is cleared and selection restarts.
 *
 * Returns `undefined` when the store is empty.
 *
 * @param {string} storeName - object store name (required)
 * @returns {Promise<any>}
 */
export async function getFromStore(storeName) {
  if (!storeName) throw new Error("storeName is required");

  const db = await openDB();
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);

  const key = await _pickRandomKeyFromStore(store, storeName);
  if (!key) return undefined;

  const _req = store.get(key);
  const value = await new Promise((resolve, reject) => {
    _req.onsuccess = () => resolve(_req.result);
    _req.onerror = () => reject(_req.error);
  });
  return value;
}
