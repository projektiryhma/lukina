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
 * - `getFromStore(storeName, key?)` — read a single record from an object
 *   store; `storeName` is required, `key` is optional (when omitted a key is
 *   selected from the store).
 *
 * Notes:
 * - `_initPromise` prevents duplicate initial fetch/populate runs.
 * - `_dbPromise` caches the opened `IDBDatabase`.
 *
 * Github Copilot GPT-5 mini was used to check and suggest code in this file.
 * Instructions and code snippets were used from:
 * https://medium.com/@shashika.silva88/indexeddb-a-comprehensive-overview-for-frontend-developers-6b47a9f32e23
 */

const DB_NAME = "lukina";
const DB_VERSION = 1;
const META_STORE = "meta";
const META_RECORD_ID = "meta";
const KEY_ID = "id";

let _dbPromise = null;
let _initPromise = null;

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
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: KEY_ID });
      }

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
 * Fetch `/data/data.json` from the server and cache its collections into
 * IndexedDB.
 *
 * The function deletes the existing DB then opens/repopulates it.
 * @returns {Promise<object>} the parsed JSON data
 */
export async function initAndCacheData() {
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const res = await fetch("/data/data.json");
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
 * `storeName` is required. If `key` is omitted a random key will be
 * generated.
 * The function returns the stored value or `undefined` when missing.
 *
 * @param {string} storeName - object store name (required)
 * @param {any} [key] - optional key; when omitted a random key is generated
 * @returns {Promise<any>}
 */
export async function getFromStore(storeName, key) {
  if (!storeName) throw new Error("storeName is required");

  const db = await openDB();

  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);

      // If no key provided, pick a random key from 0..(n-1) where n is the
      // number of keys in the store.
      if (key === undefined) {
        const reqKeys = store.getAllKeys();
        reqKeys.onsuccess = () => {
          const keys = reqKeys.result || [];
          if (keys.length === 0) return resolve(undefined);
          const idx = Math.floor(Math.random() * keys.length);
          const picked = keys[idx];
          const req = store.get(picked);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        };
        reqKeys.onerror = () =>
          reject(reqKeys.error || new Error("getAllKeys failed"));
        return;
      }

      // Key provided: return directly
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}
