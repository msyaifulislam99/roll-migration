'use strict';

const _ = require('lodash');
const data = require('./json/convert_excel.json');
const fs = require('fs');

const file = fs.createWriteStream(`queries/migration.txt`);
let plat_nomor = '';
let surat_jalan = '';
for (const item of data || []) {
  if(item.license_plat !== plat_nomor && item.surat_jalan !== surat_jalan) {
    // i++;
    // item['expected_header_id'] = i;
    console.log(item);
    file.write(
      `insert into arrivals (license_plate,arrival_at,lot_number,ingredient_id,supplier_id,user_id,water_content,no_surat_jalan) values ('${item.license_plat}','${item.arrival_at}','${item.lot_oracle}','id_bahan','id_supplier','1',${item.water_content},'${item.surat_jalan}'); \n`
    );
    plat_nomor = item.license_plat;
    surat_jalan = item.surat_jalan;
  }
  // console.log(item);
  file.write(
    `insert into detail_arrivals (arrival_id,pallet_id,pallet_number,bag_amount,leave_amount,pallet_weight,brutto,netto,status) values (${item.expected_header_id},'id_pallet','${item.pallet_number}',${item.amount},0,${item.berat_pallet},${item.brutto},${(item.brutto - item.berat_pallet)},'enter'); \n`
  );
}