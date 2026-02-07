/*
 * src/db/dataCache.js
 * IndexedDB cache for data
 *
 * Purpose:
 * - Fetch `/data/data.json` and cache it into IndexedDB using one object
 *   store per sheet (store names are sheet index strings like "0", "1").
 *
 * Exports:
 * - `initAndCacheData()` — fetch `/data/data.json`. Returns the parsed JSON.
 * - `getFromStore(storeName)` — return a single record from an object store.
 *   When called the function selects a random, not-yet-served key from the
 *   store and returns its value. Randomly-served IDs are tracked in
 *   `_usedDataIDs` to avoid repeats; once all IDs have been served the
 *   tracking set is cleared and serving restarts.
 *
 * Notes:
 * - `_initPromise` prevents duplicate initial fetch/populate runs.
 * - `_dbPromise` caches the opened `IDBDatabase`.
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
 * provided mapping. Writes use out-of-line keys via `store.put(value, key)`.
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
          db.createObjectStore(storeName);
        }
        const store = tx.objectStore(storeName);
        const mapping = data[sheetName] || {};
        for (const id of Object.keys(mapping)) {
          const row = mapping[id];
          store.put(row, id);
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
 * Fetch `/data/data.json` from the server and cache its collections into
 * IndexedDB.
 *
 * The function deletes the existing DB then opens/repopulates it.
 * @returns {Promise<object>} the parsed JSON data
 */
export async function initAndCacheData() {
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const res = await fetch(process.env.REACT_APP_OUTPUT);
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
    const data = await res.json();

    // Recreate database structure: delete existing DB then create per-sheet stores.
    // TODO: a version-check could be added to avoid deleting/repopulating
    // when the on-disk data is already up-to-date.
    await deleteDatabase();

    // Invalidate cached DB promise so openDB creates a new one
    _dbPromise = null;
    const db = await openDB(data);
    // cache the opened DB promise so subsequent calls reuse it
    _dbPromise = Promise.resolve(db);
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
