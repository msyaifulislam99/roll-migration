'use strict';
const excelToJson = require('convert-excel-to-json');

const fs = require('fs');

const result = excelToJson({
  sourceFile: './excel/exported/pallets.xlsx',
  columnToKey: {
    A: 'id',
    B: 'pallet_number',
    C: 'pallet_weight',
    D: 'status',
	}
});
// console.log(result);

let data = JSON.stringify(result.pallets);
fs.writeFileSync('json/convert_pallet.json', data);