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

it("throws when storeName missing", async () => {
  const resultPromise = getFromStore();
  await expect(resultPromise).rejects.toThrow("storeName is required");
});

describe("test fetching from correct store", () => {
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

  it("returns three distinct items when called three times", async () => {
    const a = await getFromStore(DifficultyLevels.EASY);
    const b = await getFromStore(DifficultyLevels.EASY);
    const c = await getFromStore(DifficultyLevels.EASY);

    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(c).toBeDefined();
    const set = new Set([a.id, b.id, c.id]);
    expect(set.size).toBe(3);
  });

  it("resets the counter after all items have been called times", async () => {
    const a = await getFromStore(DifficultyLevels.EASY);
    const b = await getFromStore(DifficultyLevels.EASY);
    const c = await getFromStore(DifficultyLevels.EASY);
    const d = await getFromStore(DifficultyLevels.EASY);

    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(c).toBeDefined();
    expect(d).toBeDefined();
    const set = new Set([a.id, b.id, c.id, d.id]);
    expect(set.size).toBe(3);
  });

  it("returns undefined for an empty store", async () => {
    const result = await getFromStore("3");
    expect(result).toBeUndefined();
  });
});
