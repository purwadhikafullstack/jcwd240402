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
    return queryInterface.bulkInsert("Reserved_stocks", [
      {
        id: 1,
        warehouse_stock_id: 1,
        order_id: 1,
        reserve_quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        warehouse_stock_id: 2,
        order_id: 2,
        reserve_quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        warehouse_stock_id: 3,
        order_id: 3,
        reserve_quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        warehouse_stock_id: 4,
        order_id: 4,
        reserve_quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        warehouse_stock_id: 5,
        order_id: 5,
        reserve_quantity: 10,
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
    await queryInterface.bulkDelete("Reserved_stocks", null, {});
  },
};
