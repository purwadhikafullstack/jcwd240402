'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert("Warehouses", [
      {
        id: 1,
        address_warehouse: "Sampora, Cisauk, Tangerang Regency, Banten 15345",
        warehouse_name: "Furnifor BSD",
        city_id: 455,
        latitude: "-6.308524",
        longitude: "106.655045",
        warehouse_contact: "0215074256",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        address_warehouse: "Surabaya, Balongsari, Tandes, Surabaya, East Java 60186",
        warehouse_name: "Furnifor Surabaya",
        city_id: 444,
        latitude: "-7.251686",
        longitude: "112.679671",
        warehouse_contact: "0215074256",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Warehouses", null, {});
  }
};
