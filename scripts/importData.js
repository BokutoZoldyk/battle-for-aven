// scripts/importData.js
const fs   = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function sheetToJson(filePath, sheetName) {
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets[sheetName || wb.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet, { defval: null });
}

const settlementsXlsx = path.resolve(__dirname, '../data/Settelments Stats (1).xlsx');
const unitsXlsx       = path.resolve(__dirname, '../data/Unit Stats (1).xlsx');

const settlements = sheetToJson(settlementsXlsx);
const units       = sheetToJson(unitsXlsx);

const outDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, 'settlements.json'),
  JSON.stringify(settlements, null, 2));
fs.writeFileSync(path.join(outDir, 'units.json'),
  JSON.stringify(units, null, 2));

console.log('✅ Generated src/data/settlements.json and src/data/units.json');
