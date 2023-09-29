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
    return queryInterface.bulkInsert("Categories", [
      {
        id: 1,
        name: "Baby Room",
        category_img: "/src/public/imgCategory/1693195529028-baby-room.jpeg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Bed Room",
        category_img: "/src/public/imgCategory/1692863579524-bed-room.jpeg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Kitchen Room",
        category_img: "/src/public/imgCategory/1692863598551-kitchen-room.jpeg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Lamp & Electronic",
        category_img: "/src/public/imgCategory/1692863642227-lamp.jpeg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "Living Room",
        category_img: "/src/public/imgCategory/1692863659195-living-room.jpeg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: "Outdoor Space",
        category_img:
          "/src/public/imgCategory/1692863682568-outdoor-space.jpeg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        name: "Toilet Room",
        category_img: "/src/public/imgCategory/1692863701342-toilet-room.jpeg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: "Working Room",
        category_img: "/src/public/imgCategory/1692863711429-working-room.jpeg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        name: "Uncategorized",
        category_img: "/src/public/imgCategory/imguncategorizeddefault.png",
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
    return queryInterface.bulkDelete("Categories", null, {});
  },
};
