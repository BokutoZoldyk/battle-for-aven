// scripts/convert-stats.js
// Usage: npm install xlsx && node scripts/convert-stats.js
import XLSX from 'xlsx';
import fs from 'fs';
const sheets = [
  { name: 'buildings',    file: 'Building Stats.xlsx' },
  { name: 'settlements',  file: 'Settlements Stats.xlsx' },
  { name: 'units',        file: 'Unit Stats.xlsx' },
  { name: 'calamities',   file: 'Calamity Stats.xlsx' },  // ← newly added
];

for (let {name, file} of sheets) {
  const wb   = XLSX.readFile(`./data/${file}`);
  const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  fs.writeFileSync(`./src/data/${name}.json`, JSON.stringify(json, null, 2));
  console.log(`Wrote src/data/${name}.json`);
}
