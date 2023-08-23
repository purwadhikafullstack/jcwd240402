"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Warehouses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      address_warehouse: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      warehouse_name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Cities",
          key: "id",
        },
      },
      latitude: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      warehouse_contact: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Warehouses");
  },
};