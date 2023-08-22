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
    return queryInterface.bulkInsert("History_stocks", [
      {
        id: 1,
        warehouse_stock_id: 1,
        warehouse_id: 1,
        admin_id: 1,
        stock_before_transfer: 30,
        stock_after_transfer: 40,
        increment_decrement: "Increment",
        quantity: 10,
        journal: "add stock",
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        warehouse_stock_id: 5,
        warehouse_id: 2,
        admin_id: 3,
        stock_before_transfer: 20,
        stock_after_transfer: 15,
        increment_decrement: "Decrement",
        quantity: 5,
        journal: "move stock",
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        warehouse_stock_id: 7,
        warehouse_id: 2,
        admin_id: 3,
        stock_before_transfer: 32,
        stock_after_transfer: 30,
        increment_decrement: "Decrement",
        quantity: 2,
        journal: "transaction",
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        warehouse_stock_id: 2,
        warehouse_id: 1,
        admin_id: 2,
        stock_before_transfer: 10,
        stock_after_transfer: 20,
        increment_decrement: "Increment",
        quantity: 10,
        journal: "add stock",
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        warehouse_stock_id: 3,
        warehouse_id: 1,
        admin_id: 2,
        stock_before_transfer: 40,
        stock_after_transfer: 30,
        increment_decrement: "Decrement",
        quantity: 10,
        journal: "move stock",
        timestamp: new Date(),
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
    return queryInterface.bulkDelete("History_stocks", null, {});
  }
};
