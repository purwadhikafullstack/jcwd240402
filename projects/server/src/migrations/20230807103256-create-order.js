"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      order_status_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Order_statuses",
          key: "id",
        },
      },
      total_price: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      delivery_price: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      delivery_courier: {
        allowNull: false,
        type: Sequelize.ENUM('jne','pos','tiki'),
      },
      delivery_time: {
        type: Sequelize.DATE,
      },
      tracking_code: {
        type: Sequelize.STRING,
      },
      no_invoice: {
        type: Sequelize.STRING,
      },
      address_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Address_users",
          key: "id",
        },
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Warehouses",
          key: "id",
        },
      },
      img_payment: {
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
    await queryInterface.dropTable("Orders");
  },
};
