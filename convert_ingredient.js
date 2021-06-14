'use strict';
const excelToJson = require('convert-excel-to-json');

const fs = require('fs');

const result = excelToJson({
  sourceFile: './excel/exported/ingredients.xlsx',
  columnToKey: {
    A: 'id',
    B: 'code',
    C: 'name',
    D: 'description',
    E: 'status'
	}
});
// console.log(result);

let data = JSON.stringify(result.ingredients);
fs.writeFileSync('json/convert_ingredients.json', data);