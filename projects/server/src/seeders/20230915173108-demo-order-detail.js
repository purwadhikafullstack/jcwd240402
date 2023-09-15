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
    return queryInterface.bulkInsert("Order-details", [
      {
        id: 1,
        order_id: 1,
        warehouse_stock_id: 1,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        order_id: 2,
        warehouse_stock_id: 2,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        order_id: 3,
        warehouse_stock_id: 3,
        quantity: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        order_id: 4,
        warehouse_stock_id: 4,
        quantity: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        order_id: 5,
        warehouse_stock_id: 5,
        quantity: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
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
    await queryInterface.bulkDelete("Order_details", null, {});
  },
};
