/*
 * convertXlsx.test.js
 * Jest tests for the Excel → JSON converter.
 *
 * Github Copilot GPT-5 mini was used to check and suggest code in this file.
 */

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import XLSX from "xlsx";
import dotenv from "dotenv";
import { DifficultyLevels } from "../enums/DifficultyLevels";

dotenv.config();

const execAsync = promisify(exec);

const TMP_DIR = path.resolve(process.cwd(), "tmp/testdata");
const TMP_XLSX = path.join(TMP_DIR, "tmp.xlsx");
const TMP_JSON = path.join(TMP_DIR, "out.json");

const REQUIRED_FIELDS = JSON.parse(process.env.REQUIRED_FIELDS_JSON || "[]");

function isCleanRow(row) {
  return (
    Object.keys(row).length === REQUIRED_FIELDS.length &&
    REQUIRED_FIELDS.every((field) => Object.hasOwn(row, field)) &&
    Object.values(row).every((value) => value !== null && value !== undefined)
  );
}

// create a temporary XLSX and run the converter
beforeAll(async () => {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const wb = XLSX.utils.book_new();
  const data = [
    {
      "Virheetön teksti": "ok",
      "Virheellinen teksti, virheet punaisella": "bad",
      "Virheiden lukumäärä tekstissä": 1,
      "Virheelliset sanat": "x",
      "Oikeat sanat": "y",
    },
    {
      "Virheetön teksti": "null row",
      "Virheellinen teksti, virheet punaisella": null,
      "Virheiden lukumäärä tekstissä": 2,
      "Virheelliset sanat": "z",
      "Oikeat sanat": "w",
    },
    {
      "Virheetön teksti": "junk row",
      "Virheellinen teksti, virheet punaisella": "bad",
      "Virheiden lukumäärä tekstissä": 3,
      "Virheelliset sanat": "x",
      "Oikeat sanat": "y",
      __EMPTY: "junk",
    },
  ];
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const ws2 = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws2, "Sheet2");
  XLSX.writeFile(wb, TMP_XLSX);

  await execAsync("node scripts/convert-xlsx.mjs", {
    env: {
      ...process.env,
      INPUT: TMP_XLSX,
      OUTPUT: TMP_JSON,
    },
  });
});

// clean up temporary files after tests
afterAll(async () => {
  await execAsync(`rm -rf "${TMP_DIR}"`);
});

// TC-CONVERTXLSX-001
// Description: Basic existence check: converter created the JSON file
// Preconditions: `node scripts/convert-xlsx.mjs` ran in beforeAll with test env vars set
// Expected result: Output JSON file exists at `TMP_JSON`
test("convert-xlsx produces JSON", () => {
  expect(fs.existsSync(TMP_JSON)).toBe(true);
});

// TC-CONVERTXLSX-002
// Description: Basic existence check: converter created the JSON file
// Preconditions: converter ran in `beforeAll`; `TMP_JSON` points to expected file
// Expected result: Output JSON file exists at `TMP_JSON`
test("JSON datafile has expected structure", () => {
  const obj = JSON.parse(fs.readFileSync(TMP_JSON, "utf8"));

  // Ensure sheet '0' exists and is an array with at least one row
  expect(Array.isArray(obj[DifficultyLevels.EASY])).toBe(true);
  expect(obj[DifficultyLevels.EASY].length).toBeGreaterThan(0);

  expect(obj[DifficultyLevels.EASY][0]).toMatchObject({
    "Virheetön teksti": expect.any(String),
    "Virheellinen teksti, virheet punaisella": expect.any(String),
    "Virheiden lukumäärä tekstissä": expect.any(Number),
    "Virheelliset sanat": expect.any(String),
    "Oikeat sanat": expect.any(String),
  });
});

// TC-CONVERTXLSX-003
// Description: Structural assertions for the EASY sheet and first-row fields
// Preconditions: `TMP_JSON` exists and contains at least one sheet with rows
// Expected result: `obj[DifficultyLevels.EASY]` is a non-empty array and first row matches required keys/types
test("Generated JSON includes version timestamp", () => {
  const obj = JSON.parse(fs.readFileSync(TMP_JSON, "utf8"));
  expect(typeof obj.version).toBe("string");
  const d = new Date(obj.version);
  expect(d.toString()).not.toBe("Invalid Date");
});

// TC-CONVERTXLSX-004
// Description: Running converter with missing INPUT env should report an error
// Preconditions: `INPUT` environment variable overridden to a non-existent file path
// Expected result: `npm run convert-data` logs an error to stderr and does not create output file
test("convert fails when INPUT is missing", async () => {
  const env = {
    ...process.env,
    INPUT: "imaginary_file.xlsx",
    OUTPUT: "missing.json",
  };

  const { stderr } = await execAsync("npm run convert-data", { env });
  expect(stderr).toBeTruthy();
  expect(stderr).toMatch(/Input file not found:/);
  expect(fs.existsSync("missing.json")).toBe(false);
});

// TC-CONVERTXLSX-005
// Description: Parse a valid .xlsx with multiple sheets and typed cells
// Preconditions: A small .xlsx exists with 2 sheets, several rows, and date cells
// Expected result: Returns an object with keys "0","1"
test("convertXlsx converts a datafile with multiple sheets", () => {
  const obj = JSON.parse(fs.readFileSync(TMP_JSON, "utf8"));

  // Ensure sheet '1' exists and is an array with at least one row
  expect(Array.isArray(obj[DifficultyLevels.MEDIUM])).toBe(true);
  expect(obj[DifficultyLevels.MEDIUM].length).toBeGreaterThan(0);

  expect(obj[DifficultyLevels.MEDIUM][0]).toMatchObject({
    "Virheetön teksti": expect.any(String),
    "Virheellinen teksti, virheet punaisella": expect.any(String),
    "Virheiden lukumäärä tekstissä": expect.any(Number),
    "Virheelliset sanat": expect.any(String),
    "Oikeat sanat": expect.any(String),
  });
});

// TC-CONVERTXLSX-006
// Description: Rows with null values or junk keys should be removed from output
// Preconditions: the temporary workbook includes valid, null, and junk rows
// Expected result: only clean rows remain in both sheets
test("convert-xlsx filters out junk and null rows", () => {
  const obj = JSON.parse(fs.readFileSync(TMP_JSON, "utf8"));

  expect(Array.isArray(obj[DifficultyLevels.EASY])).toBe(true);
  expect(Array.isArray(obj[DifficultyLevels.MEDIUM])).toBe(true);
  expect(obj[DifficultyLevels.EASY]).toHaveLength(1);
  expect(obj[DifficultyLevels.MEDIUM]).toHaveLength(1);

  for (const sheetName of [DifficultyLevels.EASY, DifficultyLevels.MEDIUM]) {
    for (const row of obj[sheetName]) {
      expect(isCleanRow(row)).toBe(true);
    }
  }
});
