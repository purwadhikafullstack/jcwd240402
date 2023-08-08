"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Address_users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      city_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        // references: {
        //   model: "Cities",
        //   key: "id",
        // },
      },
      subdistrict_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        // references: {
        //   model: "Subdistricts",
        //   key: "id",
        // },
      },
      province_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        // references: {
        //   model: "Provinces",
        //   key: "id",
        // },
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        // status: {
        //   type: Sequelize.ENUM('absent', 'half-day', 'full-day'),
        //   defaultValue: null,
        // },
      },
      address_details: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      longitude: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      latitude: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      postal_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address_title: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Address_users");
  },
};
