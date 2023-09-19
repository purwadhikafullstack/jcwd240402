const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../models");
const crypto = require("crypto");
const Generate = require("../utils");
const Mailer = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { default: axios } = require("axios");
const { getAllWarehouses } = require("../service/warehouse");
const qs = require("qs");
const { autoStockTransfer } = require("../utils/index");

module.exports = {
  /* ORDER */

  getOrderList: async (req, res) => {
    const userId = req.user.id;
    try {
      const orderList = await db.Order.findAll({
        where: { user_id: userId },
        include: [
          {
            model: db.Order_status,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: db.Order_detail,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: {
              model: db.Warehouse_stock,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              include: {
                model: db.Product,
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
                include: [
                  {
                    model: db.Image_product,
                    attributes: {
                      exclude: ["createdAt", "updatedAt"],
                    },
                  },
                  {
                    model: db.Category,
                    as: "category",
                    attributes: {
                      exclude: ["createdAt", "updatedAt", "deletedAt"],
                    },
                  },
                ],
              },
            },
          },
        ],
      });

      res.json({
        ok: true,
        order: orderList,
      });
    } catch (error) {
      res.status(500).send({
        message: "An error occurred while fetching order list",
        error: error.message,
      });
    }
  },

  getOrderListInfiniteScroll: async (req, res) => {
    const userId = req.user.id;
    const last_id = Number(req.query.lastId) || 0;
    const limit = Number(req.query.limit) || 3;
    const search = req.query.search || "";

    try {
      let result = [];
      if (last_id < 1) {
        const orderList = await db.Order.findAll({
          where: {
            no_invoice: {
              [Op.like]: `%${search}%`,
            },
            user_id: userId,
          },
          include: [
            {
              model: db.Order_status,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: db.Order_detail,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              include: {
                model: db.Warehouse_stock,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: {
                  model: db.Product,
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                  include: [
                    {
                      model: db.Image_product,
                      attributes: {
                        exclude: ["createdAt", "updatedAt"],
                      },
                    },
                    {
                      model: db.Category,
                      as: "category",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                  ],
                },
              },
            },
          ],
          limit: limit,
          order: [["id", "DESC"]],
        });
        result = orderList;
      } else {
        const orderList = await db.Order.findAll({
          where: {
            id: { [Op.lt]: last_id },
            no_invoice: {
              [Op.like]: `%${search}%`,
            },
            user_id: userId,
          },
          include: [
            {
              model: db.Order_status,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            {
              model: db.Order_detail,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              include: {
                model: db.Warehouse_stock,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: {
                  model: db.Product,
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                  include: [
                    {
                      model: db.Image_product,
                      attributes: {
                        exclude: ["createdAt", "updatedAt"],
                      },
                    },
                    {
                      model: db.Category,
                      as: "category",
                      attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                    },
                  ],
                },
              },
            },
          ],
          limit: limit,
          order: [["id", "DESC"]],
        });
        result = orderList;
      }

      res.json({
        ok: true,
        order: result,
        lastId: result.length ? result[result.length - 1].id : 0,
        hasMore: result.length >= limit ? true : false,
      });
    } catch (error) {
      res.status(500).send({
        message: "An error occurred while fetching order list",
        error: error.message,
      });
    }
  },

  getCity: async (req, res) => {
    const cityId = req.query.id;
    const provinceId = req.query.province;

    try {
      const response = await axios.get(
        `https://api.rajaongkir.com/starter/city?id=${cityId}&province=${provinceId}`,
        {
          headers: { key: `${process.env.KEY_RAJAONGKIR}` },
        }
      );
      res.json({ ok: true, result: response.data });
    } catch (error) {
      res.status(500).json({ ok: false, message: error.message });
    }
  },

  getCost: async (req, res) => {
    const { origin, destination, weight, courier } = req.body;

    const weightlimit = (weight) => {
      if (weight > 30000) {
        return 30000;
      } else {
        return weight;
      }
    };

    const data = {
      origin: origin,
      destination: destination,
      weight: weightlimit(weight),
      courier: courier,
    };

    try {
      const response = await axios({
        method: "post",
        url: "https://api.rajaongkir.com/starter/cost",
        headers: {
          key: `${process.env.KEY_RAJAONGKIR}`,
          "content-type": "application/x-www-form-urlencoded",
        },
        data: qs.stringify(data),
      });
      res.json({ ok: true, result: response.data });
    } catch (error) {
      res.status(500).json({ ok: false, message: error });
    }
  },

  createNewOrder: async (req, res) => {
    const {
      user_id,
      total_price,
      delivery_price,
      delivery_courier,
      address_user_id,
      warehouse_id,
    } = req.body;
    const transaction = await db.sequelize.transaction();

    try {
      const newOrder = await db.Order.create(
        {
          user_id,
          order_status_id: 1,
          total_price,
          delivery_price,
          delivery_courier,
          no_invoice:
            `FF${new Date().toLocaleString().replace(/\W/g, "")}` +
            `${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
          address_user_id,
          warehouse_id,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(200).json({
        ok: true,
        order: newOrder,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  createNewOrderDetails: async (req, res) => {
    const { order_id, warehouse_id, ...cart_data } = req.body;

    const newOrderDetails = [];
    const newReservedStock = [];
    const newAutoStockTransfer = [];

    try {
      for (const i in cart_data.cart_data) {

        newAutoStockTransfer.push(
          await autoStockTransfer(
            warehouse_id,
            cart_data.cart_data[i]?.Warehouse_stock?.product_id,
            cart_data.cart_data[i]?.quantity
          )
        );

        let transferedWarehouseStock = await db.Warehouse_stock.findOne({
          where: {warehouse_id: warehouse_id, product_id: cart_data.cart_data[i]?.Warehouse_stock?.product_id}
        })

        newOrderDetails.push(
          await db.Order_detail.create({
            order_id,
            warehouse_stock_id: transferedWarehouseStock.id,
            quantity: cart_data.cart_data[i]?.quantity,
          })
        );

        newReservedStock.push(
          await db.Reserved_stock.create({
            order_id,
            warehouse_stock_id: transferedWarehouseStock.id,
            reserve_quantity: cart_data.cart_data[i]?.quantity,
          })
        );

      }

      res.status(200).json({
        ok: true,
        order: newOrderDetails,
        reserved_stock: newReservedStock,
        transfered_stock: newAutoStockTransfer,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened 1",
        error: error.message,
      });
    }
  },

  findClosestWarehouseByAddressId: async (req, res) => {
    const userData = req.user;

    const primary_address = req.body.primary_address_id || "ehehe";

    try {
      const userAddressData = await db.User_detail.findOne({
        where: { user_id: userData.id, address_user_id: primary_address },
        include: {
          model: db.Address_user,
          attributes: { exclude: ["address_user_id"] },
          include: { model: db.City, include: { model: db.Province } },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (!userAddressData) {
        return res.status(404).json({
          ok: false,
          message: "User address not found",
        });
      }

      const allWarehouseData = await getAllWarehouses({
        include: { model: db.City, include: { model: db.Province } },
      });

      const distanceKm = (lat1, lon1, lat2, lon2) => {
        const r = 6371; // km
        const p = Math.PI / 180;

        const a =
          0.5 -
          Math.cos((lat2 - lat1) * p) / 2 +
          (Math.cos(lat1 * p) *
            Math.cos(lat2 * p) *
            (1 - Math.cos((lon2 - lon1) * p))) /
            2;

        return 2 * r * Math.asin(Math.sqrt(a));
      };

      let closestWarehouse = {
        latitude: allWarehouseData.data[0].latitude,
        longitude: allWarehouseData.data[0].longitude,
      };

      for (let i = 0; i < allWarehouseData.data.length; i++) {
        if (
          distanceKm(
            allWarehouseData.data[i].latitude,
            allWarehouseData.data[i].longitude,
            userAddressData.Address_user.latitude,
            userAddressData.Address_user.longitude
          ) <=
          distanceKm(
            closestWarehouse.latitude,
            closestWarehouse.longitude,
            userAddressData.Address_user.latitude,
            userAddressData.Address_user.longitude
          )
        ) {
          closestWarehouse = allWarehouseData.data[i];
        }
      }

      res.status(200).json({
        ok: true,
        address: userAddressData,
        warehouse: allWarehouseData,
        closest_warehouse: closestWarehouse,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  uploadPaymentProof: async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    const paymentImage = req.file?.filename;
    const transaction = await db.sequelize.transaction();
    try {
      const orderData = await db.Order.findOne({
        where: {
          user_id: userId,
          order_status_id: 1,
          no_invoice: { [Op.endsWith]: id },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "user_id"],
        },
      });
      if (!orderData) {
        return res.status(404).json({
          ok: false,
          message: "order not found",
        });
      }

      if (!paymentImage) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "payment image required",
        });
      }

      const orderDataWithPaymentProof = await db.Order.update(
        {
          img_payment: `/payment-proof/${paymentImage}`,
          order_status_id: 2,
        },
        {
          where: {
            user_id: userId,
            order_status_id: 1,
            no_invoice: { [Op.endsWith]: id },
          },
        },
        transaction
      );

      await transaction.commit();
      res.status(200).json({
        ok: true,
        message: "payment image uploaded",
        order: orderDataWithPaymentProof,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  getCurrentOrderList: async (req, res) => {
    const invoiceId = req.params.invoiceId;
    const userId = req.user.id;

    try {
      const orderList = await db.Order.findOne({
        where: { user_id: userId, no_invoice: { [Op.endsWith]: invoiceId } },
        include: [
          {
            model: db.Order_status,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: db.Order_detail,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: {
              model: db.Warehouse_stock,
              attributes: { exclude: ["createdAt", "updatedAt"] },
              include: {
                model: db.Product,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
                include: [
                  {
                    model: db.Image_product,
                    attributes: {
                      exclude: ["createdAt", "updatedAt"],
                    },
                  },
                  {
                    model: db.Category,
                    as: "category",
                    attributes: {
                      exclude: ["createdAt", "updatedAt", "deletedAt"],
                    },
                  },
                ],
              },
            },
          },
        ],
      });

      res.json({
        ok: true,
        order: orderList,
      });
    } catch (error) {
      res.status(500).send({
        message: "An error occurred while fetching order list",
        error: error.message,
      });
    }
  },

  changeOrderStatus: async (req, res) => {
    const { id, statusId } = req.body;

    try {
      const orderStatusChanged = await db.Order.update(
        {
          order_status_id: statusId,
        },
        { where: { id } }
      );

      res.status(200).json({
        ok: true,
        order: orderStatusChanged,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  cancelOrderToDeleteReservedStock: async (req, res) => {
    const userData = req.user;
    const { orderId } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      const isUserOrdered = await db.Order.findOne({
        where: { id: orderId, user_id: userData.id },
      });

      if (!isUserOrdered) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "user have not ordered this product yet",
        });
      }

      const isReserveAvailable = await db.Reserved_stock.findOne({
        where: { order_id: isUserOrdered.id },
      });

      if (!isReserveAvailable) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "reserved stock not found",
        });
      }

      await db.Reserved_stock.destroy({
        where: { order_id: isUserOrdered.id },
      });

      await transaction.commit();
      res.status(201).json({
        ok: true,
        isUserOrdered,
        isReserveAvailable,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },
};
