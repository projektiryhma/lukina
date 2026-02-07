/*
 * convertXlsx.test.js
 * Jest tests for the Excel → JSON converter pipeline.
 * - Runs `npm run convert-data` in `beforeAll` to generate `public/data/data.json`.
 * - Verifies the generated JSON exists and that collection "0" contains expected fields.
 * - Removes the generated file in `afterAll` so tests don't leave artifacts.
 * Notes: These tests invoke a Node script, so Node must be available in the test environment.
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

// Basic existence check: converter created the JSON file
test("convert-xlsx produces JSON", () => {
  expect(fs.existsSync(OUTPUTPATH)).toBe(true);
});

// Structural assertions: collection '0' exists and first row contains expected fields
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

test("Generated JSON includes version timestamp", () => {
  const obj = JSON.parse(fs.readFileSync(OUTPUTPATH, "utf8"));
  expect(typeof obj.version).toBe("string");
  const d = new Date(obj.version);
  expect(d.toString()).not.toBe("Invalid Date");
});

test("convert fails when INPUT is missing", async () => {
  const env = {
    ...process.env,
    INPUT: "imaginary_file.xlsx",
  };
  const { stderr } = await execAsync("npm run convert-data", { env });
  expect(stderr);
});
