'use strict';
const excelToJson = require('convert-excel-to-json');

const fs = require('fs');

const result = excelToJson({
  sourceFile: './excel/exported/inventories.xlsx',
  columnToKey: {
    A: 'INVENTORY_ITEM_ID',
    B: 'DESCRIPTION',
    C: 'SEGMENT1',
    D: 'WEIGHT_UOM_CODE',
    E: 'PRIMARY_UOM_CODE',
    F: 'ORGANIZATION_ID'
	}
});
// console.log(result);

let data = JSON.stringify(result.inventories);
fs.writeFileSync('json/convert_inventories.json', data);