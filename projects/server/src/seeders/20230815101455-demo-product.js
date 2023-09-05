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
        name: "Green Dining Chair",
        price: 100000,
        weight: 9000,
        category_id: 2,
        description: "green coloured single chair, usually for dining",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Green Dining Table",
        price: 700000,
        weight: 80000,
        category_id: 1,
        description: "big green coloured dining table, can fit 4 single chair, usually for dining",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Black Office Chair",
        price: 950000,
        weight: 12000,
        category_id: 2,
        description: "black comfy office chair, good for your back, perfect for prolonged sitting",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Blue Wide Sofa",
        price: 1500000,
        weight: 100000,
        category_id: 3,
        description: "Blue coloured three-seater sofa",
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Brown Coffee table",
        price: 500000,
        weight: 35000,
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
