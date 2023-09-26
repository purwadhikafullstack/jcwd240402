"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("User_details", [
      {
        user_id: 1,
        first_name: "Kevin",
        last_name: "Smith",
        phone: "081116347887",
        address_user_id: 1,
        img_profile: "/photo-profile/imgprofiledefault.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        first_name: "Adrian",
        last_name: "Adams",
        phone: "0813114590",
        address_user_id: 2,
        img_profile: "/photo-profile/imgprofiledefault.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 3,
        first_name: "John",
        last_name: "Wibowo",
        phone: "0812293309",
        address_user_id: 3,
        img_profile: "/photo-profile/imgprofiledefault.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 4,
        first_name: "Cynthia",
        last_name: "Shirona",
        phone: "0822365788",
        address_user_id: 4,
        img_profile: "/photo-profile/imgprofiledefault.png",
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
    return queryInterface.bulkDelete("User_details", null, {});
  },
};
