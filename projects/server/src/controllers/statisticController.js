const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../models");
const moment = require('moment');

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
    const currentDate = moment();
    const startOfMonth = currentDate.clone().startOf('month').format('YYYY-MM-DD HH:mm:ss');
    const endOfMonth = currentDate.clone().endOf('month').format('YYYY-MM-DD HH:mm:ss');
  
    try {
      const topProducts = await db.Order_detail.findAll({
        attributes: [
          [
            db.Sequelize.fn("SUM", db.Sequelize.col("quantity")),
            "total_quantity",
          ],
          [db.Sequelize.col("Warehouse_stock.Product.name"), "name"],
          [db.Sequelize.col("Warehouse_stock.Product.id"), "product_id"],
        ],
        include: [
          {
            model: db.Warehouse_stock,
            attributes: [],
            include: [
              {
                model: db.Product,
                attributes: [],
                paranoid: false,
              },
            ],
            paranoid: false,
          },
          {
            model: db.Order, 
            attributes: [],
            where: {
              order_status_id: 3,
              createdAt: {
                [db.Sequelize.Op.between]: [startOfMonth, endOfMonth],
              },
            },
            paranoid: false,
          },
        ],
        group: ["Warehouse_stock.Product.id", "Warehouse_stock.product_id"],
        order: [[db.Sequelize.fn("SUM", db.Sequelize.col("quantity")), "DESC"]],
        limit: 10,
        paranoid: false,
      });

      const totalSold = topProducts.reduce((total, product) => total + parseInt(product.dataValues.total_quantity, 10), 0);
  
      const formattedData = topProducts.map((product) => ({
        name: product.dataValues.name,
        product_id: product.dataValues.product_id,
        total_quantity: product.dataValues.total_quantity,
      }));
  
      res.status(200).json({
        totalSold,
        products: formattedData,
      });
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

  getTopProducts: async (req, res) => {
    try {
      const topProducts = await db.Order_detail.findAll({
        attributes: [
          [
            db.Sequelize.fn("SUM", db.Sequelize.col("quantity")),
            "total_quantity",
          ],
        ],
        include: [
          {
            model: db.Warehouse_stock,
            attributes: [],
            include: [
              {
                model: db.Product,
                attributes: ["name"],
              },
            ],
          },
        ],
        group: ["Warehouse_stock.Product.id", "Warehouse_stock.product_id"],
        order: [[db.Sequelize.fn("SUM", db.Sequelize.col("quantity")), "DESC"]],
        limit: 10,
      });

      const formattedData = topProducts.map((product) => ({
        name: product.Warehouse_stock.Product.name,
        total_quantity: product.dataValues.total_quantity,
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
