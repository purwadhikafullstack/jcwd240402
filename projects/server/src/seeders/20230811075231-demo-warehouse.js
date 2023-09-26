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
    return queryInterface.bulkInsert("Warehouses", [
      {
        id: 1,
        address_warehouse: "Sampora, Cisauk, Tangerang Regency, Banten 15345",
        warehouse_name: "Furnifor BSD",
        city_id: 455,
        province_id: 3,
        latitude: "-6.308524",
        longitude: "106.655045",
        warehouse_contact: "0215074256",
        warehouse_img: "/photo-warehouse/imgwarehousedefault.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        address_warehouse:
          "Surabaya, Balongsari, Tandes, Surabaya, East Java 60186",
        warehouse_name: "Furnifor Surabaya",
        city_id: 444,
        province_id: 11,
        latitude: "-7.251686",
        longitude: "112.679671",
        warehouse_contact: "0215074256",
        warehouse_img: "/photo-warehouse/imgwarehousedefault.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        address_warehouse:
          "Jl. TB Simatupang No.30, RT.9/RW.2, Gedong, Kec. Ps. Rebo, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13760",
        warehouse_name: "ForniFor Jakarta Timur",
        city_id: 154,
        province_id: 6,

        latitude: "-6.3036",
        longitude: "106.8621",
        warehouse_contact: "088976786543",
        warehouse_img: "/photo-warehouse/imgwarehousedefault.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        address_warehouse:
          "Jl. Rajasa No.27, Bumiayu, Kec. Kedungkandang, Kota Malang, Jawa Timur 65116",
        warehouse_name: "ForniFor Malang",

        city_id: 256,
        province_id: 11,
        latitude: "-8.0265",
        longitude: "112.6393",
        warehouse_contact: "08897671535",
        warehouse_img: "/photo-warehouse/imgwarehousedefault.png",
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
    return queryInterface.bulkDelete("Warehouses", null, {});
  },
};
