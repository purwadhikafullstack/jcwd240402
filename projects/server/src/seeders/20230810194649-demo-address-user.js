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
    return queryInterface.bulkInsert("Address_users", [
      {
        id: 1,
        province_id: 9,
        city_id: 23,
        user_id: 1,
        address_details:
          "Gg. Aki Nari, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161",
        longitude: "107.598530",
        latitude: "-6.888000",
        postal_code: "40161",
        address_title: "Home",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        province_id: 9,
        city_id: 78,
        user_id: 2,
        address_details:
          "Jl. Pesona Amerika I, Nagrak, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16967",
        longitude: "106.952908",
        latitude: "-6.379858",
        postal_code: "16967",
        address_title: "Home",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        province_id: 6,
        city_id: 153,
        user_id: 3,
        address_details:
          "Jl. Setia Budi III 3-27, RT.2/RW.3, Kuningan, Setia Budi, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12910",
        longitude: "106.825590",
        latitude: "-6.207482",
        postal_code: "12910",
        address_title: "Home",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        province_id: 31,
        city_id: 267,
        user_id: 4,
        address_details: "Buha, Mapanget, Manado City, North Sulawesi",
        longitude: "124.887343",
        latitude: "1.521397",
        postal_code: "95247",
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
    return queryInterface.bulkDelete("Address_users", null, {});
  },
};
