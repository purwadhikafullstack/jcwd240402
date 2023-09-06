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
    return queryInterface.bulkInsert("Warehouse_stocks", [
      {
        warehouse_id: 1,
        product_id: 1,
        product_stock: 70,
        status: "In Stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouse_id: 1,
        product_id: 2,
        product_stock: 30,
        status: "In Stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouse_id: 1,
        product_id: 4,
        product_stock: 30,
        status: "In Stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouse_id: 1,
        product_id: 3,
        product_stock: 10,
        status: "In Stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouse_id: 2,
        product_id: 4,
        product_stock: 15,
        status: "In Stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouse_id: 2,
        product_id: 5,
        product_stock: 15,
        status: "In Stock",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        warehouse_id: 2,
        product_id: 3,
        product_stock: 30,
        status: "In Stock",
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
    return queryInterface.bulkDelete("Warehouse_stocks", null, {});
  }
};
