'use strict';
const excelToJson = require('convert-excel-to-json');

const fs = require('fs');

const result = excelToJson({
  sourceFile: './excel/SJA2.xls',
  columnToKey: {
    A: 'id',
    B: 'license_plat',
    C: 'arrival_date',
    D: 'po_number',
    E: 'nama_bahan',
    F: 'inventory_id',
    G: 'lot_oracle',
    H: 'supplier_name',
    I: 'supplier_address',
    J: 'surat_jalan',
    K: 'water_content',
    L: 'cargo_type',
    M: 'note',
    N: 'pallet_number',
    O: 'amount',
    P: 'berat_pallet',
    Q: 'brutto',
    R: 'amount_left',
    S: 'status',
	}
});
console.log(result);

let i = 1;
for (const item of result.tbl_penerimaan || []) {
  item['expected_id'] = i;
  i++;
}
let data = JSON.stringify(result.MIGRASI);
fs.writeFileSync('json/convert_excel.json', data);