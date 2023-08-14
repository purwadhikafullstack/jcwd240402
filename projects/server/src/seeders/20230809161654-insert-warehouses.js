"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Warehouses", [
      {
        address_warehouse: "main street",
        warehouse_name: "Main Warehouse",
        city_id: 1,
        latitude: "40.7128",
        longitude: "74.0060",
        warehouse_contact: "123-456-7890",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Warehouses", null, {});
  },
};
