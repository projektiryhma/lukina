/*
 * src/db/dataCache.js
 * IndexedDB cache for data
 *
 * Purpose:
 * - Fetches the generated `public/data/data.json` file and caches it into
 *   IndexedDB for client-side reads.
 * - Stores each top-level collection as an
 *   individual record so the app can read/update a single collection.
 *
 * Exports:
 * - `initAndCacheData()` — fetch and cache data
 * - `getCollections()` — assemble and return all collections from the DB
 *
 * Github Copilot GPT-5 mini was used to check and suggest code in this file.
 * Instructions and code snippets were used from:
 * https://medium.com/@shashika.silva88/indexeddb-a-comprehensive-
 * overview-for-frontend-developers-6b47a9f32e23
 */

const DB_NAME = "lukina-data";
const DB_VERSION = 1;
const DATA_STORE = "lukina-data-store";

let _dbPromise = null;
let _initPromise = null;

function openDB() {
  if (_dbPromise) return _dbPromise;

  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    // Ensure object store exists when DB is created or upgraded.
    // This handler runs when the DB is first created or when DB_VERSION increases.
    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains(DATA_STORE)) {
        // Create a key-value store keyed by the `name` property.
        db.createObjectStore(DATA_STORE, { keyPath: "name" });
      }
    };
    // Resolve with the IDBDatabase instance when ready, or reject on error.
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return _dbPromise;
}

/**
 * Store a collection record in the DB.
 *
 * @param {IDBDatabase} db - Open IDB database instance
 * @param {string} name - Collection name (used as the record key)
 * @param {object|array} rows - Collection payload (mapping or array)
 * @returns {Promise<void>} resolves when the put completes
 */
function putCollection(db, name, rows) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DATA_STORE, "readwrite");
    const store = tx.objectStore(DATA_STORE);
    // Put upserts the record (insert or replace existing)
    const req = store.put({ name, rows });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Fetch `/data/data.json` from the server and cache its collections into
 * IndexedDB.
 *
 * @returns {Promise<object>} the parsed JSON data
 */
export async function initAndCacheData() {
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const res = await fetch("/data/data.json");
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
    const data = await res.json();

    const db = await openDB();

    // Clear existing data
    await clearStore(db);

    // Write each collection as its own record
    const writes = [];
    for (const collectionName of Object.keys(data)) {
      writes.push(putCollection(db, collectionName, data[collectionName]));
    }
    await Promise.all(writes);
    return data;
  })();

  return _initPromise;
}

/**
 * Read all collection records from the DB and assemble a single object
 *
 * @returns {Promise<Object|undefined>} assembled collections or undefined when none
 */
export async function getCollections() {
  const db = await openDB();

  const all = await new Promise((resolve, reject) => {
    const tx = db.transaction(DATA_STORE, "readonly");
    const store = tx.objectStore(DATA_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });

  if (all && all.length) {
    const result = {};
    for (const rec of all) {
      result[rec.name] = rec.rows;
    }
    return result;
  }
}

/**
 * Remove all records from the data object store.
 *
 * @param {IDBDatabase} db - open IDB database instance
 * @returns {Promise<void>} resolves when the clear operation completes
 */
function clearStore(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DATA_STORE, "readwrite");
    const store = tx.objectStore(DATA_STORE);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
