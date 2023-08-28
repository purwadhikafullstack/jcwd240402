"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("User_details", [
      {
        city_id: 1,
        user_id: 1,
        address_details:
          "Jl. TB Simatupang No.30, RT.9/RW.2, Gedong, Kec. Ps. Rebo, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13760",
        longitude: "106.8621",
        latitude: "6.3036",
        postal_code: "13760",
        address_title: "Home",
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
    await queryInterface.bulkDelete("User_details", null, {});
  },
};
