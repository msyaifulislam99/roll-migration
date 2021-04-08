'use strict';
const excelToJson = require('convert-excel-to-json');

const fs = require('fs');

const result = excelToJson({
  sourceFile: 'tbl_pallet.xlsx'
});

let data = JSON.stringify(result.tbl_pallet);
fs.writeFileSync('pallets.json', data);