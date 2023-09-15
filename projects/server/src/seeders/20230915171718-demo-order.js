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
    return queryInterface.bulkInsert("Orders", [
      {
        id: 1,
        user_id: 1,
        order_status_id: 1,
        total_price: 50000,
        delivery_price: 2000,
        delivery_courier: "pos",
        delivery_time: null,
        tracking_code: null,
        no_invoice: null,
        address_user_id: 1,
        warehouse_id: 1,
        img_payment: "/payment-proof/paymentproofdefault.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        user_id: 1,
        order_status_id: 2,
        total_price: 30000,
        delivery_price: 2000,
        delivery_courier: "pos",
        delivery_time: null,
        tracking_code: null,
        no_invoice: null,
        address_user_id: 1,
        warehouse_id: 1,
        img_payment: "/payment-proof/paymentproofdefault.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        user_id: 1,
        order_status_id: 3,
        total_price: 40000,
        delivery_price: 4000,
        delivery_courier: "pos",
        delivery_time: null,
        tracking_code: null,
        no_invoice: null,
        address_user_id: 1,
        warehouse_id: 1,
        img_payment: "/payment-proof/paymentproofdefault.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        user_id: 1,
        order_status_id: 4,
        total_price: 60000,
        delivery_price: 4000,
        delivery_courier: "pos",
        delivery_time: null,
        tracking_code: null,
        no_invoice: null,
        address_user_id: 1,
        warehouse_id: 1,
        img_payment: "/payment-proof/paymentproofdefault.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        user_id: 1,
        order_status_id: 5,
        total_price: 60000,
        delivery_price: 4000,
        delivery_courier: "pos",
        delivery_time: null,
        tracking_code: null,
        no_invoice: null,
        address_user_id: 1,
        warehouse_id: 1,
        img_payment: "/payment-proof/paymentproofdefault.jpg",
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
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
