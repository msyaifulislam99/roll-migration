'use strict';
const excelToJson = require('convert-excel-to-json');

const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');
const data_pallets = require('./json/convert_pallet.json');

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

// cek pallet are exist or not
let qc_pallet = false;
let jumlah_redundant = 0;
for (const item of result.New || []) {
  // check goes here
  // console.log(item);
  const checker = _.find(data_pallets, function(o) { return o.pallet_number.toString() === item.pallet_number.toString() })
  // console.log(checker);
  if (checker) {
    qc_pallet = true;
    console.log('pallet number ' + item.pallet_number + ' already exist - ' + checker.status);
    jumlah_redundant++;
    // return false;
  }
}
console.log('jumlah redundan = ', jumlah_redundant,'/' , result.New.length);
// enc check pallets
if (qc_pallet) {
  // return false;
}

let i = 4747; // dev only
let plat_nomor = '';
for (const item of result.New || []) {
  if(item.license_plat !== plat_nomor) {
    i++;
    item['expected_header_id'] = i;
    plat_nomor = item.license_plat;
  } else {
    item['expected_header_id'] = i;
  }
  const local_date = moment(item.arrival_date).format('yyyy-MM-DD');
  const string_date = local_date.toString() + ' 08:00:00';
  item['arrival_at'] = string_date;
}

let data = JSON.stringify(result.New);
fs.writeFileSync('json/convert_excel.json', data);