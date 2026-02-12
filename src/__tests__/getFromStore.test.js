import { getFromStore, initAndCacheData } from "../db/dataCache";
import { DifficultyLevels } from "../enums/DifficultyLevels";
import fs from 'fs';
import path from 'path';

//needed with fakeIndexedDB to simulate the internal cloning process of objects in IndexedDB
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock fetch to read from filesystem
const testDataPath = path.join(__dirname, '../../public/data/testdata.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(testData),
  })
);

process.env.REACT_APP_DB_NAME = "lukina";
process.env.REACT_APP_DB_VERSION = "1";
process.env.REACT_APP_META_STORE = "meta";
process.env.REACT_APP_META_RECORD_ID = "meta-id";
process.env.REACT_APP_KEY_ID = "id";
process.env.REACT_APP_OUTPUT = "/data/testdata.json";

describe("test fetching from correct store", () => {

  beforeAll(async () => {
    await initAndCacheData();
  });


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
});