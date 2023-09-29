"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Warehouse_stocks", [
      {
        id: 1,
        warehouse_id: 1,
        product_id: 1,
        product_stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        warehouse_id: 1,
        product_id: 2,
        product_stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 3,
        warehouse_id: 1,
        product_id: 3,
        product_stock: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 4,
        warehouse_id: 1,
        product_id: 4,
        product_stock: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 5,
        warehouse_id: 1,
        product_id: 5,
        product_stock: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Warehouse_stocks", null, {});
  },
};
