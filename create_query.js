'use strict';

const _ = require('lodash');
const data = require('./json/convert_excel.json');
const data_pallet = require('./json/convert_pallet.json');
const data_supplier = require('./json/convert_suppliers.json');
const data_bahan = require('./json/convert_ingredients.json');
const data_inventory = require('./json/convert_inventories.json');
const fs = require('fs');

const file = fs.createWriteStream(`queries/migration.txt`);
let plat_nomor = '';
let surat_jalan = '';
let obj_last_pallets = _.maxBy(data_pallet, 'id');
let obj_last_supplier = _.maxBy(data_supplier, 'id');
let obj_last_bahan = _.maxBy(data_bahan, 'id');
let last_id_pallets = obj_last_pallets.id || 0;
let last_id_supplier = obj_last_supplier.id || 0;
let last_id_bahan = obj_last_bahan.id || 0;
console.log(last_id_pallets, last_id_supplier, last_id_bahan, 'apa ini');
for (const item of data || []) {
  const pallet = _.find(data_pallet, function(o) { return o.pallet_number.toString() === item.pallet_number.toString() })
  let date_ob = new Date();

  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours
  let hours = date_ob.getHours();

  // current minutes
  let minutes = date_ob.getMinutes();

  // current seconds
  let seconds = date_ob.getSeconds();
  const date_now = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

  let id_pallet = undefined;
  if (pallet && pallet.status === 'being_used') {
    file.write(
      `insert into pallets (number,weight,status,created_at,updated_at) values ('${item.pallet_number}z','${item.berat_pallet}','being_used','${date_now}','${date_now}'); \n`
    );
    last_id_pallets++;
    id_pallet = last_id_pallets;
  } else if (pallet && pallet.status === 'ready') {
    file.write(
      `update pallets set status='being_used' where id=${pallet.id}; \n`
    );
    id_pallet = pallet.id;
  } else {
    file.write(
      `insert into pallets (number,weight,status,created_at,updated_at) values ('${item.pallet_number}','${item.berat_pallet}','being_used','${date_now}','${date_now}'); \n`
    );
    last_id_pallets++;
    id_pallet = last_id_pallets;
  }
  if(item.license_plat !== plat_nomor) {
    let id_supplier = 0;
    let id_ingredient = 0;
    const supplier = _.find(data_supplier, { 'supplier_name': item.supplier_name, 'supplier_address': item.supplier_address });
    const ingredient = _.find(data_bahan, { 'name': item.nama_bahan });
    const invetory = _.find(data_inventory, { 'INVENTORY_ITEM_ID': item.inventory_id });

    if (ingredient) {
      id_ingredient = ingredient.id;
    } else {
      id_ingredient = last_id_bahan + 1;
      last_id_bahan++
      file.write(
        `insert into ingredients (name,status,created_at,updated_at) values ('${item.nama_bahan}','active','${date_now}','${date_now}'); \n`
      );
    }

    if (supplier) {
      id_supplier = supplier.id;
    } else {
      id_supplier = last_id_supplier + 1;
      last_id_supplier++
      file.write(
        `insert into suppliers (name,address,created_at,updated_at) values ('${item.supplier_name}','${item.supplier_address}','${date_now}','${date_now}'); \n`
      );
    }

    const inventory_id = invetory ? invetory.INVENTORY_ITEM_ID : item.inventory_id;
    if (invetory) {
      console.log('ada', invetory.INVENTORY_ITEM_ID);
    } else {
      console.log('gaada', item.inventory_id);
    }
    const oracle_lot_number = item.lot_oracle ? `'${item.lot_oracle}'` : null;
    file.write(
      `insert into arrivals (license_plate,arrival_at,lot_number,ingredient_id,supplier_id,user_id,water_content,no_surat_jalan,inventory_id,oracle_lot_number,created_at,updated_at) values ('${item.license_plat}','${item.arrival_at}','${item.po_number}',${id_ingredient},${id_supplier},'1',${item.water_content},'${item.surat_jalan}',${inventory_id},${oracle_lot_number},'${date_now}','${date_now}'); \n`
    );
    plat_nomor = item.license_plat;
    surat_jalan = item.surat_jalan;
  }
  // console.log(item);
  file.write(
    `insert into detail_arrivals (arrival_id,pallet_id,pallet_number,bag_amount,leave_amount,pallet_weight,brutto,netto,status,created_at,updated_at) values (${item.expected_header_id},${id_pallet},'${item.pallet_number}',${item.amount},0,${parseFloat(item.berat_pallet) || 0},${parseFloat(item.brutto) || 0},${(parseFloat(item.brutto) || 0 - parseFloat(item.berat_pallet) || 0)},'enter','${date_now}','${date_now}'); \n`
  );
}