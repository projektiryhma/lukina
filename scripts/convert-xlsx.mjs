/*
 * convert-xlsx.mjs
 * Utility to convert an Excel workbook (.xlsx) into a JSON file.
 * Each sheet becomes an array of row objects, keyed by 0-based index in the output JSON.
 * CLI usage: node scripts/convert-xlsx.mjs
 * Should be ran once when program is set up to generate initial data.json file.
 *
 * Github Copilot GPT-5 mini was used to check and suggest code in this file.
 */

// TODO: Think some way to store globals like INPUT and OUTPUT paths in a config file. Also some way to share them with tests.

import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const INPUT = process.env.INPUT;
const OUTPUT = process.env.OUTPUT;

/**
 * Parse an Excel workbook into a plain object.
 * @param {string} filePath - Path to the .xlsx file to read.
 * @returns {Object} Mapping of sheet name -> array of row objects.
 */
function parseWorkbook(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const result = {};

  // Iterate over each sheet in the workbook and produce a mapping of id -> row
  workbook.SheetNames.forEach((name, sheetIndex) => {
    const sheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: null });
    // Build an object keyed by id
    const mapping = [];
    for (let i = 0; i < data.length; i++) {
      const row = { ...data[i] };
      const id = row.id != null ? row.id : i;
      mapping.push(row);
    }
    result[String(sheetIndex)] = mapping;
  });
  return result;
}

/**
 * Write an object to disk as pretty JSON, creating directories as needed.
 * @param {string} outputPath - File path to write (e.g. public/data/data.json).
 * @param {Object} obj - The object to serialize.
 */
function writeJson(outputPath, obj) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(obj, null, 2), "utf8");
}

/**
 * Convert an Excel file to JSON and write it out.
 * @param {string} inputPath - Path to the input .xlsx file (relative or absolute).
 * @param {string} outputPath - Path to the output .json file (relative or absolute).
 * @returns {{input: string, output: string, sheets: number}} metadata about the conversion.
 */
function convert(inputPath, outputPath) {
  const absInput = path.resolve(process.cwd(), inputPath);
  const absOutput = path.resolve(process.cwd(), outputPath);
  if (!fs.existsSync(absInput))
    throw new Error(`Input file not found: ${absInput}`);
  const parsed = parseWorkbook(absInput);
  // add a top-level version so clients can do a version check
  parsed.version = new Date().toISOString();
  writeJson(absOutput, parsed);
  return {
    input: absInput,
    output: absOutput,
    sheets: Object.keys(parsed).length,
  };
}

// If this file is executed directly with `node`
// `process.argv[1]` is the path of the script Node was asked to run.
const scriptPath = fileURLToPath(import.meta.url);
const invokedScript = process.argv[1] || "";
if (path.resolve(invokedScript) === path.resolve(scriptPath)) {
  try {
    const info = convert(INPUT, OUTPUT);
    console.log(
      `Converted ${info.input} -> ${info.output} (${info.sheets} sheets)`,
    );
  } catch (err) {
    console.error(err.message || err);
  }
}
