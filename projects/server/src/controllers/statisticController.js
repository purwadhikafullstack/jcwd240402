const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../models");

module.exports = {
  userStatistic: async (req, res) => {
    try {
      const totalUser = await db.User.count();
      const totalProduct = await db.Product.count();
      const totalWarehouse = await db.Warehouse.count();
      const totalCategory = await db.Category.count();

      if (!totalUser) {
        return res.status(404).json({
          ok: false,
          message: "user data not found",
        });
      }
      if (!totalProduct) {
        return res.status(404).json({
          ok: false,
          message: "product data not found",
        });
      }
      if (!totalWarehouse) {
        return res.status(404).json({
          ok: false,
          message: "warehouse data not found",
        });
      }
      if (!totalCategory) {
        return res.status(404).json({
          ok: false,
          message: "category data not found",
        });
      }

      res.json({
        ok: true,
        totalUser,
        totalProduct,
        totalWarehouse,
        totalCategory,
      });
    } catch (error) {
      res.status(500).json({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  pieChart: async (req, res) => {
    try {
      const userByProvince = await db.Address_user.findAll({
        attributes: [
          "province_id",
          [db.sequelize.fn("COUNT", db.sequelize.col("*")), "user_count"],
        ],
        include: { model: db.Province },
        group: "province_id",
      });

      if (!userByProvince || userByProvince.length === 0) {
        return res.status(404).json({
          ok: false,
          message: "User data not found for any province",
        });
      }

      const labels = userByProvince.map((item) => item.Province.name);
      const data = userByProvince.map((item) => item.dataValues.user_count);

      res.json({
        ok: true,
        labels,
        data,
        userByProvince,
      });
    } catch (error) {
      res.status(500).json({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  topTenProduct: async (req, res) => {
    try {
      res.json("top ten product");
    } catch (error) {
      res.status(500).json({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  incomeGraph: async (req, res) => {
    try {
      res.json("income graph");
    } catch (error) {
      res.status(500).json({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },
};
