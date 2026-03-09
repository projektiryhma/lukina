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
  it("getFromStore easy returns data from store 0", async () => {
    const result = await getFromStore(DifficultyLevels.EASY);
    expect(result).toBeDefined();
    expect(["Easy test item"]).toContain(result["Virheetön teksti"]);
  });

  it("getFromStore medium returns data from store 1", async () => {
    const result = await getFromStore(DifficultyLevels.MEDIUM);
    expect(result).toBeDefined();
    expect(["Medium test item"]).toContain(result["Virheetön teksti"]);
  });

  it("getFromStore hard returns data from store 2", async () => {
    const result = await getFromStore(DifficultyLevels.HARD);
    expect(result).toBeDefined();
    expect(["Hard test item"]).toContain(result["Virheetön teksti"]);
  });

  it("throws when storeName missing", async () => {
    const resultPromise = getFromStore();
    await expect(resultPromise).rejects.toThrow("storeName is required");
  });

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
    expect(itemSet.size).toBe(3);
  });

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
    expect(itemSet.size).toBe(3);
  });

  it("returns undefined for an empty store", async () => {
    const result = await getFromStore("3");
    expect(result).toBeUndefined();
  });

  it("per-store independence: calls to one store don't affect another", async () => {
    // Fetch one item from MEDIUM and record its id
    const m1 = await getFromStore(DifficultyLevels.MEDIUM);
    expect(m1).toBeDefined();

    // Exhaust EASY store by calling it three times
    const e1 = await getFromStore(DifficultyLevels.EASY);
    const e2 = await getFromStore(DifficultyLevels.EASY);
    const e3 = await getFromStore(DifficultyLevels.EASY);
    const eSet = new Set([e1.id, e2.id, e3.id]);
    expect(eSet.size).toBe(3);

    // Fetch from MEDIUM again; it should return the same item
    const m2 = await getFromStore(DifficultyLevels.MEDIUM);
    expect(m2).toBeDefined();
    expect(m2.id).toBe(m1.id);

    // Fetch from EASY again; it should reset and return one of the three items again
    const e4 = await getFromStore(DifficultyLevels.EASY);
    eSet.add(e4.id);
    expect(eSet.size).toBe(3);
  });
});

describe("initAndCacheData tests:", () => {
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

  it("if META_STORE is missing, re-init populates the database", async () => {
    const dbBefore = await openDB();
    const txBefore = dbBefore.transaction(
      process.env.REACT_APP_META_STORE,
      "readonly",
    );
    const storeBefore = txBefore.objectStore(process.env.REACT_APP_META_STORE);
    const reqBefore = storeBefore.get(process.env.REACT_APP_META_RECORD_ID);
    const metaBefore = await new Promise((resolve, reject) => {
      reqBefore.onsuccess = () => resolve(reqBefore.result);
      reqBefore.onerror = () => reject(reqBefore.error);
    });
    expect(metaBefore).toBeDefined();
    expect(metaBefore.version).toBe(testData.version);

    // remove META_STORE. onugrade is needed when changing schema
    const upgradeVersion = Number(process.env.REACT_APP_DB_VERSION) + 1;
    dbBefore.close();
    await new Promise((resolve, reject) => {
      const req = indexedDB.open(process.env.REACT_APP_DB_NAME, upgradeVersion);
      req.onupgradeneeded = (ev) => {
        const db = ev.target.result;
        if (db.objectStoreNames.contains(process.env.REACT_APP_META_STORE)) {
          db.deleteObjectStore(process.env.REACT_APP_META_STORE);
        }
      };
      req.onsuccess = () => {
        req.result.close();
        resolve();
      };
      req.onerror = () => reject(req.error);
    });

    // Re-import the module to reset all
    const newVersion = new Date().toISOString();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...testData, version: newVersion }),
      }),
    );
    jest.resetModules();
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
    expect(metaAfter.version).not.toBe(metaBefore.version);
  });
});
