const db = require("../models");
const fs = require("fs");

module.exports = {
  async registerWarehouse(req, res) {
    const {address_warehouse,warehouse_name,city_id,subdistrict_id,province_id,latitude,longitude,warehouse_contact,} = req.body;

    try {
      const newWarehouse = await db.Warehouse.create({
        address_warehouse,
        warehouse_name,
        city_id,
        subdistrict_id,
        province_id,
        latitude,
        longitude,
        warehouse_contact,
      });

      return res.status(201).send({
        message: "Warehouse registration successful",
        data: newWarehouse,
      });
    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },
};
