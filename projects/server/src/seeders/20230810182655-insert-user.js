"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("1234-Purwadhika", 10);
    return queryInterface.bulkInsert("Users", [
      {
        username: "usaidaka",
        email: "usaidaka@gmail.com",
        role_id: 3,
        password: hashedPassword,
        verify_token: "",
        reset_password_token: "",
        is_verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
