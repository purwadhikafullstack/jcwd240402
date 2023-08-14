"use strict";
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const AdminPassword = await bcrypt.hash('Password12!', 10);
    return queryInterface.bulkInsert("Admins", [
      {
        username: "Admin",
        role_id: 1,
        first_name: "Admin",
        last_name: "User",
        password: AdminPassword,
        warehouse_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Admins", null, {});
  },
};
