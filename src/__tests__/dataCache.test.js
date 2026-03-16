/*
 * dataCache.test.js
 * Jest tests for the data caching functionality.
 *
 * Github Copilot GPT-5 mini was used to check and suggest code in this file.
 */

import { DifficultyLevels } from "../enums/DifficultyLevels";
import fs from "fs";
import path from "path";

//needed with fakeIndexedDB to simulate the internal cloning process of objects in IndexedDB
if (typeof structuredClone === "undefined") {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock fetch to read from filesystem
const testDataPath = path.join(__dirname, "../../public/data/testdata.json");
const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));

process.env.REACT_APP_DB_NAME = "lukina";
process.env.REACT_APP_DB_VERSION = "1";
process.env.REACT_APP_META_STORE = "meta";
process.env.REACT_APP_META_RECORD_ID = "meta-id";
process.env.REACT_APP_KEY_ID = "id";
process.env.REACT_APP_OUTPUT = "/data/testdata.json";
let getFromStore, initAndCacheData, deleteDatabase, openDB;

beforeEach(async () => {
  jest.resetModules();
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(testData) }),
  );
  const dataCache = await import("../db/dataCache");
  ({ getFromStore, initAndCacheData, deleteDatabase, openDB } = dataCache);
  await deleteDatabase();
  await initAndCacheData();
});

afterEach(async () => {
  const existingDB = await openDB();
  if (existingDB && typeof existingDB.close === "function") {
    existingDB.close();
  }
  await deleteDatabase();
});

describe("getFromStore tests:", () => {
  // TC-DATACACHE-001
  // Description: Retrieve an item from EASY store
  // Preconditions: DB initialized and EASY store contains test data
  // Expected result: Returned item exists and matches known EASY text
  it("getFromStore easy returns data from store 0", async () => {
    const result = await getFromStore(DifficultyLevels.EASY);
    expect(result).toBeDefined();
    expect(["Easy test item"]).toContain(result["Virheetön teksti"]);
  });

  // TC-DATACACHE-002
  // Description: Retrieve an item from MEDIUM store
  // Preconditions: DB initialized and MEDIUM store contains test data
  // Expected result: Returned item exists and matches known MEDIUM text
  it("getFromStore medium returns data from store 1", async () => {
    const result = await getFromStore(DifficultyLevels.MEDIUM);
    expect(result).toBeDefined();
    expect(["Medium test item"]).toContain(result["Virheetön teksti"]);
  });

  // TC-DATACACHE-003
  // Description: Retrieve an item from HARD store
  // Preconditions: DB initialized and HARD store contains test data
  // Expected result: Returned item exists and matches known HARD text
  it("getFromStore hard returns data from store 2", async () => {
    const result = await getFromStore(DifficultyLevels.HARD);
    expect(result).toBeDefined();
    expect(["Hard test item"]).toContain(result["Virheetön teksti"]);
  });

  // TC-DATACACHE-004
  // Description: Validate required input parameter for getFromStore
  // Preconditions: getFromStore is called without storeName
  // Expected result: Function rejects with "storeName is required" error
  it("throws when storeName missing", async () => {
    const resultPromise = getFromStore();
    await expect(resultPromise).rejects.toThrow("storeName is required");
  });

  // TC-DATACACHE-005
  // Description: Ensure unique-item iteration returns all items once before reset
  // Preconditions: EASY store has N items and function is called N times
  // Expected result: Set of returned ids contains exactly N unique values
  it("returns all different items from store", async () => {
    const items = [];
    const storeSize = testData[DifficultyLevels.EASY].length;
    let itemSet = new Set();
    for (let i = 0; i < storeSize; i++) {
      items.push(await getFromStore(DifficultyLevels.EASY));
    }

    for (const item of items) {
      expect(item).toBeDefined();
      itemSet.add(item.id);
    }
    expect(itemSet.size).toBe(storeSize);
  });

  // TC-DATACACHE-006
  // Description: Verify uniqueness counter resets after full store traversal
  // Preconditions: EASY store has N items and function is called N+1 times
  // Expected result: Unique id count remains N, showing reset after exhaustion
  it("resets the counter for unique items after all items have been called", async () => {
    const items = [];
    const storeSize = testData[DifficultyLevels.EASY].length;
    let itemSet = new Set();
    for (let i = 0; i < storeSize + 1; i++) {
      items.push(await getFromStore(DifficultyLevels.EASY));
    }

    for (const item of items) {
      expect(item).toBeDefined();
      itemSet.add(item.id);
    }
    expect(itemSet.size).toBe(storeSize);
  });

  // TC-DATACACHE-007
  // Description: Handle reads from a valid but empty store
  // Preconditions: Store "3" exists and has no records
  // Expected result: Function resolves to undefined
  it("returns undefined for an empty store", async () => {
    const result = await getFromStore("3");
    expect(result).toBeUndefined();
  });

  // TC-DATACACHE-008
  // Description: Unique item serving doesn't crash when different stores are accessed
  // Preconditions: EASY and MEDIUM stores are populated
  // Expected result: MEDIUM sequence is unaffected by EASY exhaustion and EASY resets independently
  it("per-store independence: calls to one store don't affect another", async () => {
    let m = [];
    let e = [];
    const eSize = testData[DifficultyLevels.EASY].length;
    let eSet = new Set();

    // Fetch one item from MEDIUM and record its id
    m.push(await getFromStore(DifficultyLevels.MEDIUM));
    expect(m[0]).toBeDefined();

    // Exhaust EASY store by calling it size - 1 times
    for (let i = 0; i < eSize - 1; i++) {
      e.push(await getFromStore(DifficultyLevels.EASY));
      eSet.add(e[i].id);
    }
    expect(eSet.size).toBe(eSize - 1);

    // Fetch from MEDIUM again; it should return the same item
    m.push(await getFromStore(DifficultyLevels.MEDIUM));
    expect(m[1]).toBeDefined();
    expect(m[1].id).toBe(m[0].id);

    // Fetch from EASY again; it should return another unique item
    e.push(await getFromStore(DifficultyLevels.EASY));
    eSet.add(e[eSize - 1].id);
    expect(eSet.size).toBe(eSize);

    // Fetch from EASY again; it should reset and return an allready existing item
    e.push(await getFromStore(DifficultyLevels.EASY));
    eSet.add(e[eSize].id);
    expect(eSet.size).toBe(eSize);
  });
});

describe("initAndCacheData tests:", () => {
  // TC-DATACACHE-009
  // Description: Initialize object stores when DB exists but schema is empty
  // Preconditions: Database exists at configured version without object stores
  // Expected result: initAndCacheData creates/populates stores
  it("populates when DB exists but has no object stores", async () => {
    const existingDB = await openDB();
    if (existingDB && typeof existingDB.close === "function") {
      existingDB.close();
    }
    await deleteDatabase();

    // Create an empty DB
    await new Promise((resolve, reject) => {
      const req = indexedDB.open(
        process.env.REACT_APP_DB_NAME,
        Number(process.env.REACT_APP_DB_VERSION),
      );
      req.onupgradeneeded = () => {};
      req.onsuccess = () => {
        req.result.close();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });

    jest.resetModules();
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(testData) }),
    );
    const dataCache = await import("../db/dataCache");
    ({ initAndCacheData, openDB } = dataCache);

    await initAndCacheData();
    const db = await openDB();
    expect(db.objectStoreNames.length).toBeGreaterThan(0);
  });

  // TC-DATACACHE-010
  // Description: Reinitialize cache when remote version is newer than local meta.version
  // Preconditions: Existing DB populated; fetched dataset has a newer `version` value
  // Expected result: Meta record is updated and stored version equals remote version
  it("if meta.version differs, re-init populates the database", async () => {
    const dbBefore = await openDB();
    dbBefore.close();

    // Re-import module with a newer remote version
    const newVersion = new Date().toISOString();
    jest.resetModules();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...testData, version: newVersion }),
      }),
    );
    const dataCache = await import("../db/dataCache");
    ({ initAndCacheData, openDB } = dataCache);

    await initAndCacheData();
    const dbAfter = await openDB();
    const txAfter = dbAfter.transaction(
      process.env.REACT_APP_META_STORE,
      "readonly",
    );
    const storeAfter = txAfter.objectStore(process.env.REACT_APP_META_STORE);
    const reqAfter = storeAfter.get(process.env.REACT_APP_META_RECORD_ID);
    const metaAfter = await new Promise((res, rej) => {
      reqAfter.onsuccess = () => res(reqAfter.result);
      reqAfter.onerror = () => rej(reqAfter.error);
    });
    expect(metaAfter).toBeDefined();
    expect(metaAfter.version).toBe(newVersion);
  });
});
