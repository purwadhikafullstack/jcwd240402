'use strict';
const bcrypt = require('bcrypt');

const makePassword = async (pass) => {
  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(pass, salt);
  return hashed;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
    return queryInterface.bulkInsert("Users", [

      {
        username: "kevin09",
        email: "kevin@gmail.com",
        role_id: 3,
        password: password,
        verify_token: null,
        reset_password_token: null,
        is_verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "adrian1998",
        email: "adrianj@gmail.com",
        role_id: 3,
        password: password,
        verify_token: null,
        reset_password_token: null,
        is_verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "johnw",
        email: "johnw@gmail.com",
        role_id: 3,
        password: password,
        verify_token: null,
        reset_password_token: null,
        is_verify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "madamc14",
        email: "cynthia@gmail.com",
        role_id: 3,
        password: password,
        verify_token: null,
        reset_password_token: null,
        is_verify: true,
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
    return queryInterface.bulkDelete("Users", null, {});
  }
};
