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
import dotenv from "dotenv";
dotenv.config();
const execAsync = promisify(exec);

// Read output path from project .env (OUTPUT)
const OUTPUT = process.env.OUTPUT;
const OUTPUTPATH = path.resolve(process.cwd(), OUTPUT);

// Run the converter once before the test suite so tests assert against
// the freshly generated `public/data/data.json` file.
beforeAll(async () => {
  const { stderr } = await execAsync("npm run convert-data");
  if (stderr) {
    throw new Error(stderr);
  }
});

// Clean up generated file after tests
afterAll(async () => {
  if (fs.existsSync(OUTPUTPATH)) {
    await execAsync(`rm "${OUTPUTPATH}"`);
  }
});

// TC-CONVERTXLSX-001
// Description: Basic existence check: converter created the JSON file
// Preconditions: `npm run convert-data` ran in beforeAll; `OUTPUT` env var points to expected file
// Expected result: Output JSON file exists at `OUTPUTPATH`
test("convert-xlsx produces JSON", () => {
  expect(fs.existsSync(OUTPUTPATH)).toBe(true);
});

// TC-CONVERTXLSX-002
// Description: Structural assertions for sheet '0' and first-row fields
// Preconditions: Output JSON exists and contains at least one sheet with rows
// Expected result: `obj["0"]` is a non-empty array and first row matches required keys/types
test("JSON datafile has expected structure", () => {
  const obj = JSON.parse(fs.readFileSync(OUTPUTPATH, "utf8"));

  // Ensure sheet '0' exists and is an array with at least one row
  expect(Array.isArray(obj["0"])).toBe(true);
  expect(obj["0"].length).toBeGreaterThan(0);

  expect(obj["0"][0]).toMatchObject({
    "Virheetön teksti": expect.any(String),
    "Virheellinen teksti, virheet punaisella": expect.any(String),
    "Virheiden lukumäärä tekstissä": expect.any(Number),
    "Virheelliset sanat": expect.any(String),
    "Oikeat sanat": expect.any(String),
  });
});

// TC-CONVERTXLSX-003
// Description: Ensure output JSON contains a valid `version` timestamp
// Preconditions: Output JSON file exists and includes a `version` property
// Expected result: `version` is a string parseable to a valid Date
test("Generated JSON includes version timestamp", () => {
  const obj = JSON.parse(fs.readFileSync(OUTPUTPATH, "utf8"));
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
  };
  const { stderr } = await execAsync("npm run convert-data", { env });
  expect(stderr);
});

// TC-CONVERTXLSX-005
// Description: Parse a valid .xlsx with multiple sheets and typed cells
// Preconditions: A small .xlsx exists with 2 sheets, several rows, and date cells
// Expected result: Returns an object with keys "1","1"
test("convertXlsx converts a datafile with multiple sheets", () => {
  const obj = JSON.parse(fs.readFileSync(OUTPUTPATH, "utf8"));

  // Ensure sheet '1' exists and is an array with at least one row
  expect(Array.isArray(obj["1"])).toBe(true);
  expect(obj["1"].length).toBeGreaterThan(0);

  expect(obj["1"][1]).toMatchObject({
    "Virheetön teksti": expect.any(String),
    "Virheellinen teksti, virheet punaisella": expect.any(String),
    "Virheiden lukumäärä tekstissä": expect.any(Number),
    "Virheelliset sanat": expect.any(String),
    "Oikeat sanat": expect.any(String),
  });
});
