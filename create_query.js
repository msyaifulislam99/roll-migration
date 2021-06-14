'use strict';

const _ = require('lodash');
const data = require('./json/convert_excel.json');
const data_pallet = require('./json/convert_pallet.json');
const data_supplier = require('./json/convert_suppliers.json');
const data_bahan = require('./json/convert_ingredients.json');
const fs = require('fs');

const file = fs.createWriteStream(`queries/migration.txt`);
let plat_nomor = '';
let surat_jalan = '';
let last_id_pallets = _.max(data_pallet, 'id');
let last_id_supplier = _.max(data_supplier, 'id');
let last_id_bahan = _.max(data_bahan, 'id');
for (const item of data || []) {
  file.write(
    `insert into pallets (number,weight,status) values ('${item.pallet_number}','${item.berat_pallet}','being_used'); \n`
  );
  last_id_pallets++;
  if(item.license_plat !== plat_nomor && item.surat_jalan !== surat_jalan) {
    // i++;
    // item['expected_header_id'] = i;
    console.log(item);
    let id_supplier = 0;
    let id_ingredient = 0;
    const supplier = _.find(data_supplier, { 'supplier_name': item.supplier_name, 'supplier_address': item.supplier_address });
    const ingredient = _.find(data_bahan, { 'name': item.nama_bahan });

    if (ingredient) {
      id_ingredient = ingredient.id;
    } else {
      id_ingredient = last_id_bahan + 1;
      last_id_bahan++
      file.write(
        `insert into ingredients (name,status) values ('${item.code}','active'); \n`
      );
    }

    if (supplier) {
      id_supplier = supplier.id;
    } else {
      id_supplier = last_id_supplier + 1;
      last_id_supplier++
      file.write(
        `insert into suppliers (name,address) values ('${item.supplier_name}','${item.supplier_address}'); \n`
      );
    }
    file.write(
      `insert into arrivals (license_plate,arrival_at,lot_number,ingredient_id,supplier_id,user_id,water_content,no_surat_jalan) values ('${item.license_plat}','${item.arrival_at}','${item.lot_oracle}',${id_ingredient},${id_supplier},'1',${item.water_content},'${item.surat_jalan}'); \n`
    );
    plat_nomor = item.license_plat;
    surat_jalan = item.surat_jalan;
  }
  // console.log(item);
  file.write(
    `insert into detail_arrivals (arrival_id,pallet_id,pallet_number,bag_amount,leave_amount,pallet_weight,brutto,netto,status) values (${item.expected_header_id},${last_id_pallets},'${item.pallet_number}',${item.amount},0,${item.berat_pallet},${item.brutto},${(item.brutto - item.berat_pallet)},'enter'); \n`
  );
}