const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../models");
const moment = require('moment');
const dayjs = require("dayjs");
const user = require("../service/user");

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
    const adminData = req.user;
    const warehouse_id = req.query.warehouseId || "";

    const endDate = moment();

    const startDate =  moment().subtract(12, "month").toDate();

    const filter = {
      delivery_time: {
        [db.Sequelize.Op.between] : [startDate, endDate]
      },
      order_status_id : 3,
    }

    const filter2 = {
      order_status_id : 3,
    }

    if(warehouse_id){
      filter.warehouse_id = warehouse_id;
      filter2.warehouse_id = warehouse_id;
    }

    try {

      const totalPerMonth = [];
      const responsePerMonth = [];
      const twelveMonthsBefore = [];

      const response = await db.Order.findAll({
            where: filter,  
            include: [
              {
                model: db.User,
              },
              {
                model: db.Address_user,
                attributes: { exclude: ["address_user_id"] },
              },
              {
                model: db.Warehouse,
              },
            ]
          },
          {
            model: db.Warehouse_stock,
            include: [
              {
                model: db.Product,
                include: [
                  {
                    model: db.Category,
                    as: "category",
                  },
                ],
              },
            ],

        order: [["delivery_time", "DESC"]],
      });

      for(let i = 0; i < 12; i++){

        const startDate2 =  moment().subtract(12 - i, "month").toDate();

        const endDate2 = moment().subtract(12 - (i + 1), "month").toDate();

        twelveMonthsBefore.push(dayjs(endDate2).format('MMMM YYYY'))

        filter2.delivery_time = {
          [db.Sequelize.Op.between] : [startDate2, endDate2]
        }
        
        const responseMonth = await db.Order.findAll({
          where: filter2,  
        order: [["delivery_time", "DESC"]],
      });

      responsePerMonth.push(responseMonth);

      const totalOnly2 = [];

        for(let j = 0; j < responsePerMonth[i].length; j++){
            totalOnly2.push(responsePerMonth[i][j]?.total_price);
        }

       totalPerMonth.push(totalOnly2.reduce((total, n) => total + n, 0));
      
    }

      const totalOnly = [];

      const priceOnly = response.map((m) => {
        if (m) {
          totalOnly.push(m.total_price);
        }
      });

      const totalPrice = totalOnly.reduce((total, n) => total + n, 0);

      res.json({
        ok: true,
        info: "income graph",
        total: totalPrice,
        total_per_month: totalPerMonth,
        monthyear: twelveMonthsBefore,
      });
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
