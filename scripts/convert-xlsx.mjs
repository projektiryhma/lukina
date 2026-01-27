/*
 * convert-xlsx.js
 * Utility to convert an Excel workbook (.xlsx) into a JSON file.
 * Each sheet becomes an array of row objects, keyed by sheet name in the output JSON.
 * CLI usage: node scripts/convert-xlsx.mjs
 * Should be ran once when program is set up to generate initial data.json file.
 *
 * Github Copilot GPT-5 mini was used to check and suggest code in this file.
 */

import fs from "fs";
import path from "path";
import XLSX from "xlsx";
import { fileURLToPath } from "url";

const INPUT = "public/data/data.xlsx";
const OUTPUT = "public/data/data.json";

/**
 * Parse an Excel workbook into a plain object.
 * @param {string} filePath - Path to the .xlsx file to read.
 * @returns {Object} Mapping of sheet name -> array of row objects.
 */
function parseWorkbook(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const result = {};
  workbook.SheetNames.forEach((name) => {
    const sheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: null });
    result[name] = data;
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
