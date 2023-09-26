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
  /* PROFILING USER ADDRESS */
  userAddress: async (req, res) => {
    const userData = req.user;
    try {
      const userAddressData = await db.Address_user.findAll({
        where: { user_id: userData.id },
        include: { model: db.City },
        attributes: {
          exclude: ["address_user_id", "createdAt", "updatedAt", "user_id"],
        },
      });

      res.status(200).json({
        ok: true,
        result: userAddressData,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  registerAddress: async (req, res) => {
    const userData = req.user;
    const {
      province_id,
      city_id,
      user_id = userData.id,
      longitude,
      latitude,
      address_details,
      postal_code,
      address_title,
    } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const newAddress = await db.Address_user.create(
        {
          province_id,
          city_id,
          user_id,
          longitude,
          latitude,
          address_details,
          postal_code,
          address_title,
        },
        { transaction }
      );

      if (!newAddress) {
        await transaction.rollback();
        return res.status(401).json({
          ok: false,
          message: "register address failed",
        });
      }
      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "register address successful",
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

  changeAddress: async (req, res) => {
    const userData = req.user;
    const { address_id } = req.params;
    const {
      province_id,
      city_id,
      longitude,
      latitude,
      address_details,
      postal_code,
      address_title,
    } = req.body;

    const transaction = await db.sequelize.transaction();

    try {
      const isAddressExist = await db.Address_user.findOne({
        where: { id: address_id },
        attributes: { exclude: ["address_user_id"] },
      });

      if (!isAddressExist) {
        await transaction.rollback();
        return res.status(401).json({
          ok: false,
          message: "address not found",
        });
      }

      if (city_id) {
        await db.Address_user.update(
          {
            province_id,
            city_id,
          },
          { where: { user_id: userData.id, id: address_id }, transaction }
        );
      }

      if (address_details) {
        await db.Address_user.update(
          {
            address_details,
            longitude: longitude,
            latitude: latitude,
          },
          { where: { user_id: userData.id, id: address_id }, transaction }
        );
      }

      if (postal_code) {
        await db.Address_user.update(
          {
            postal_code,
          },
          { where: { user_id: userData.id, id: address_id }, transaction }
        );
      }

      if (address_title) {
        await db.Address_user.update(
          {
            address_title,
          },
          { where: { user_id: userData.id, id: address_id }, transaction }
        );
      }

      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "change address successful",
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

  changePrimaryAddress: async (req, res) => {
    const userData = req.user;
    const { address_id } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      const isPrimary = await db.User_detail.findOne({
        where: { address_user_id: address_id },
      });

      if (isPrimary) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "this address already primary",
        });
      }

      const isAddressExist = await db.Address_user.findOne({
        where: { id: address_id, user_id: userData.id },
        attributes: {
          exclude: ["address_user_id", "createdAt", "updatedAt", "user_id"],
        },
      });
      if (!isAddressExist) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "address not found",
        });
      }

      await db.User_detail.update(
        { address_user_id: address_id },
        {
          where: { user_id: userData.id },
          transaction,
        }
      );

      await transaction.commit();
      return res.status(201).json({
        ok: true,
        message: "set primary address successful",
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

  deleteAddress: async (req, res) => {
    const userData = req.user;
    const { address_id } = req.params;
    const transaction = await db.sequelize.transaction();

    try {
      const address = await db.Address_user.findOne({
        where: { id: address_id, user_id: userData.id },
        attributes: {
          exclude: ["address_user_id", "createdAt", "updatedAt", "user_id"],
        },
      });

      if (!address) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "Address not found",
        });
      }

      const isPrimaryAddress = await db.User_detail.findOne({
        where: { user_id: userData.id, address_user_id: address_id },
      });

      if (isPrimaryAddress) {
        await db.User_detail.update(
          { address_user_id: null },
          {
            where: { user_id: userData.id, address_user_id: address_id },
            transaction,
          }
        );
      }

      await db.Address_user.destroy({
        where: { id: address_id, user_id: userData.id },
        transaction,
      });

      await transaction.commit();

      res.status(200).json({
        ok: true,
        message: "Delete address successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  getAddressById: async (req, res) => {
    const userData = req.user;
    const { address_id } = req.params;

    try {
      const userAddressData = await db.Address_user.findOne({
        where: { user_id: userData.id, id: address_id },
        include: { model: db.City },
        attributes: {
          exclude: ["address_user_id", "createdAt", "updatedAt", "user_id"],
        },
      });

      if (!userAddressData) {
        return res.status(404).json({
          ok: false,
          message: "address not found",
        });
      }

      res.status(200).json({
        ok: true,
        result: userAddressData,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  regionUserForProvince: async (req, res) => {
    try {
      const result = await db.Province.findAll();

      res.json({
        ok: true,
        result: result,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  regionUserForCity: async (req, res) => {
    const { province_id } = req.query;

    try {
      let result;

      if (province_id) {
        const cityListInProvince = await db.City.findAll({
          where: { province_id },
        });
        result = cityListInProvince;
      } else {
        const allProvince = await db.Province.findAll();
        result = allProvince;
      }

      res.json({
        ok: true,
        result: result,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },
};
