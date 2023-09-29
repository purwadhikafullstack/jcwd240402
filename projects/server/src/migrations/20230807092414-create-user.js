"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      role_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      verify_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reset_password_token: {
        type: Sequelize.STRING,
      },
      is_verify: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      by_form: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("Users");
  },
};
