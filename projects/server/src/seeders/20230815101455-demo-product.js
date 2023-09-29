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
    return queryInterface.bulkInsert("Products", [
      {
        id: 1,
        name: "ANTILOP",
        price: 249000,
        weight: 5000,
        category_id: 1,
        description:
          "Kursi tinggi ANTILOP mudah untuk dibongkar dan dibawa sehingga Anak dapat duduk dengan aman dan tenang apakah itu Anda sedang di rumah, di tempat teman atau di restoran. Nikmati hidangan Anda!",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "BUSUNGE",
        price: 4499000,
        weight: 10000,
        category_id: 1,
        description:
          "Desain menyenangkan dari material kuat dengan permukaan yang tahan lama dan sudut bulat yang lembut yang juga ikut tumbuh bersama anak Anda. Tempat tidur yang dibuat untuk anak nakal, atau BUSUNGE seperti yang mereka sebutkan di Swedia.",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "FLISAT",
        price: 299000,
        weight: 12000,
        category_id: 1,
        description:
          "Display buku yang rendah ini memudahkan anak Anda menjangkau buku mereka. Mudah memilih buku favoritnya karena semua sampul buku dapat terlihat jelas. Jika pilihannya terlalu sulit, Anda bisa membawa bukunya ke sudut membaca.",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "INGOLF",
        price: 999000,
        weight: 700,
        category_id: 1,
        description:
          "Terlalu besar untuk kursi tinggi, tapi terlalu pendek untuk kursi biasa? Maka kursi anak sangat cocok - cukup tinggi untuk meja makan, dan dengan penyangga yang nyaman untuk kaki. Dibuat untuk makan malam dan kegiatan kerajinan yang menyenangkan.",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "LATTJO",
        price: 279000,
        weight: 500,
        category_id: 1,
        description:
          "Selamat datang di kebun ajaib. Sarung duvet ini ditenun dari bahan katun yang berkelanjutan - bahan halus dan alami yang memiliki sirkulasi udara yang baik serta menyerap lembap sehingga anak tidur lelap sepanjang malam.",
        is_active: true,
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
    return queryInterface.bulkDelete("Products", null, {});
  },
};
