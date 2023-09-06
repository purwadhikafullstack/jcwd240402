"use strict";
const bcrypt = require("bcrypt");

const makePassword = async (pass) => {
  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(pass, salt);
  return hashed;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await makePassword("Password123!");
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Admins", [
      {
        username: "andret",
        role_id: 1,
        first_name: "Andre",
        last_name: "Taulany",
        password: password,
        warehouse_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "esule",
        role_id: 2,
        first_name: "Eddy",
        last_name: "Sutisna",
        password: password,
        warehouse_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "danielk",
        role_id: 2,
        first_name: "Daniel",
        last_name: "Kevin",
        password: password,
        warehouse_id: 2,
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
    return queryInterface.bulkDelete("Admins", null, {});
  },
};
