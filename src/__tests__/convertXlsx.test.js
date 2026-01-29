/*
 * convertXlsx.test.js
 * Jest tests for the Excel → JSON converter pipeline.
 * - Runs `npm run convert-data` in `beforeAll` to generate `public/data/data.json`.
 * - Verifies the generated JSON exists and that sheet "0" contains expected fields.
 * - Removes the generated file in `afterAll` so tests don't leave artifacts.
 * Notes: These tests invoke a Node script, so Node must be available in the test environment.
 */

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

// Path to the generated JSON file that the converter should produce
const FILEUNDERTEST = "../../public/data/data.json";
const OUTPUTPATH = path.resolve(__dirname, FILEUNDERTEST);

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

// Basic existence check: converter created the JSON file
test("convert-xlsx produces JSON", () => {
  expect(fs.existsSync(OUTPUTPATH)).toBe(true);
});

// Structural assertions: sheet '0' exists and first row contains expected fields
test("File under test has expected structure", () => {
  const obj = JSON.parse(fs.readFileSync(OUTPUTPATH, "utf8"));

  expect(obj["0"][0]).toMatchObject({
    id: expect.any(Number),
    "Virheetön teksti": expect.any(String),
    "Virheellinen teksti, virheet punaisella": expect.any(String),
    "Virheiden lukumäärä tekstissä": expect.any(Number),
    "Virheelliset sanat": expect.any(String),
    "Oikeat sanat": expect.any(String),
  });
});
