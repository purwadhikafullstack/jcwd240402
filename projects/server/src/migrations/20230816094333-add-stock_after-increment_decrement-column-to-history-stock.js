'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('History_stocks', 'stock_after_transfer', {
      type: Sequelize.INTEGER,
      after: "stock_before_transfer",
    });
    await queryInterface.addColumn('History_stocks', 'increment_decrement', {
      type: Sequelize.ENUM('Increment', 'Decrement'),
      after: "stock_after_transfer",
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('History_stocks', 'stock_after_transfer', {
    });
    await queryInterface.removeColumn('History_stocks', 'increment_decrement', {
    });
  }
};
