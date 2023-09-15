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
    return queryInterface.bulkInsert("Products", [
      {
        id: 1,
        name: "Green Dining Chair",
        price: 100000,
        weight: 900,
        category_id: 2,
        description: "green coloured single chair, usually for dining",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Green Dining Table",
        price: 700000,
        weight: 8000,
        category_id: 1,
        description: "big green coloured dining table, can fit 4 single chair, usually for dining",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Black Office Chair",
        price: 950000,
        weight: 1200,
        category_id: 2,
        description: "black comfy office chair, good for your back, perfect for prolonged sitting",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Blue Wide Sofa",
        price: 1500000,
        weight: 1000,
        category_id: 3,
        description: "Blue coloured three-seater sofa",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "Brown Coffee table",
        price: 500000,
        weight: 2500,
        category_id: 1,
        description: "brown coloured coffee table",
        is_active: true,
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
    return queryInterface.bulkDelete("Products", null, {});
  }
};
