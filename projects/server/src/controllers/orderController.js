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

module.exports = {
  /* ORDER */

  getOrderList: async (req, res) => {
    const userId = req.user.id;
    try {
      const orderList = await db.Order.findAll({
        where: { user_id: userId },
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

    const data = {
      origin: origin,
      destination: destination,
      weight: weight,
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
      order_status_id,
      total_price,
      delivery_price,
      delivery_courier,
      delivery_time,
      tracking_code,
      no_invoice,
      address_user_id,
      warehouse_id,
    } = req.body;

    try {
      const newOrder = await db.Order.create({
        user_id,
        order_status_id,
        total_price,
        delivery_price,
        delivery_courier,
        delivery_time,
        tracking_code,
        no_invoice,
        address_user_id,
        warehouse_id,
      });

      res.status(200).json({
        ok: true,
        order: newOrder,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  findClosestWarehouse: async (req, res) => {
    const userData = req.user;
    const address_title = req.body.address_title || "ehehe";

    try {
      const userAddressData = await db.Address_user.findOne({
        where: { user_id: userData.id, address_title },
        include: { model: db.City },
        attributes: {
          exclude: ["address_user_id", "createdAt", "updatedAt", "user_id"],
        },
      });

      const allWarehouseData = await getAllWarehouses();

      const distanceKm = (lat1, lon1, lat2, lon2) => {
        const r = 6371; // km
        const p = Math.PI / 180;
        console.log(lat1);
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
            userAddressData.latitude,
            userAddressData.longitude
          ) <=
          distanceKm(
            closestWarehouse.latitude,
            closestWarehouse.longitude,
            userAddressData.latitude,
            userAddressData.longitude
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
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  findClosestWarehouseByAddressId: async (req, res) => {
    const userData = req.user;
    console.log(userData);
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
        console.log(lat1);
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
};
