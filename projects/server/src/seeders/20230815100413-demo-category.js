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
    return queryInterface.bulkInsert("Categories", [
      {
        id: 1,
        name: "table",
        category_img: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "chair",
        category_img: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "sofa",
        category_img: "",
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
    return queryInterface.bulkDelete("Categories", null, {});
  }
};
