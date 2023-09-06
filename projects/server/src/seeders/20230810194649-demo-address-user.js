'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
        city_id: 23,
        user_id: 1,
        address_details: "Gg. Aki Nari, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161",
        longitude: "-6.888000",
        latitude: "107.598530",
        postal_code: "40161",
        address_title: "Home",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        city_id: 78,
        user_id: 2,
        address_details: "Jl. Pesona Amerika I, Nagrak, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16967",
        longitude: "-6.379858",
        latitude: "106.952908",
        postal_code: "16967",
        address_title: "Home",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        city_id: 153,
        user_id: 3,
        address_details: "Jl. Setia Budi III 3-27, RT.2/RW.3, Kuningan, Setia Budi, Kecamatan Setiabudi, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12910",
        longitude: "-6.207482",
        latitude: "106.825590",
        postal_code: "12910",
        address_title: "Home",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        city_id: 267,
        user_id: 4,
        address_details: "Buha, Mapanget, Manado City, North Sulawesi",
        longitude: "1.521397",
        latitude: "124.887343",
        postal_code: "95247",
        address_title: "Home",
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
    return queryInterface.bulkDelete("Address_users", null, {});
  }
};
