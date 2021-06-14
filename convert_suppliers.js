'use strict';
const excelToJson = require('convert-excel-to-json');

const fs = require('fs');

const result = excelToJson({
  sourceFile: './excel/exported/suppliers.xlsx',
  columnToKey: {
    A: 'id',
    B: 'supplier_name',
    C: 'supplier_address',
	}
});
// console.log(result);

let data = JSON.stringify(result.suppliers);
fs.writeFileSync('json/convert_suppliers.json', data);