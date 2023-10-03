const db = require("../models");

const {
  getAllWarehouseStocks,
  getAllStockHistory,
} = require("../service/warehouse_stock");
const { Sequelize } = require("sequelize");
const { newStockHistory } = require("../service/warehouse_stock");

module.exports = {
  async createStockForWarehouse(req, res) {
    const { warehouseId, productId, productStock } = req.body;

    if (req.user.role_id === 2) {
      if (req.user.warehouse_id !== warehouseId) {
        return res.status(403).send({
          message:
            "You are not authorized to update stock from this warehouse.",
        });
      }
    }
    const t = await db.sequelize.transaction();

    try {
      const existingStock = await db.Warehouse_stock.findOne({
        where: { warehouse_id: warehouseId, product_id: productId },
        transaction: t,
      });

      if (existingStock) {
        await t.rollback();
        return res.status(400).send({
          message:
            "Stock already exists for the selected product in this warehouse.",
        });
      }

      const newStock = await db.Warehouse_stock.create(
        {
          warehouse_id: warehouseId,
          product_id: productId,
          product_stock: productStock,
        },
        { transaction: t }
      );

      const stockHistoryFrom = newStockHistory(
        newStock.id,
        warehouseId,
        req.user.id,
        0,
        0 + productStock,
        productStock,
        "Stock Create"
      );

      await t.commit();

      res.status(201).send({
        message: "Stock created successfully.",
        stock: newStock,
      });
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).send({
        message: "An error occurred while creating stock.",
        error: error.message,
      });
    }
  },

 async updateStockForWarehouse(req, res) {
    const warehouseId = parseInt(req.params.warehouseId);
    const productId = parseInt(req.params.productId);
    const { productStock, operation } = req.body;
    const adminData = req.user;

    if (req.user.role_id === 2) {
      if (req.user.warehouse_id !== warehouseId) {
        return res.status(403).send({
          message:
            "You are not authorized to update stock from this warehouse.",
        });
      }
    }

    const t = await db.sequelize.transaction();

    try {
      const existingStock = await db.Warehouse_stock.findOne({
        where: { warehouse_id: warehouseId, product_id: productId },
        transaction: t,
      });

      if (!existingStock) {
        await t.rollback();
        return res.status(404).send({
          message:
            "Stock does not exist for the selected product in this warehouse.",
        });
      }

      switch (operation) {
        case "increase":
          existingStock.product_stock += parseInt(productStock, 10);

          if (existingStock.product_stock < 0) {
            await t.rollback();
            return res.status(400).send({
              message: "Unable to reduce stock to negative value",
            });
          }

          const stockHistoryFrom = newStockHistory(
            existingStock.id,
            warehouseId,
            adminData.id,
            existingStock.product_stock,
            existingStock.product_stock + parseInt(productStock, 10),
            parseInt(productStock, 10),
            "Stock Update"
            
          );


          break;
        case "decrease":
          existingStock.product_stock -= parseInt(productStock, 10);

          if (existingStock.product_stock < 0) {
            await t.rollback();
            return res.status(400).send({
              message: "Unable to reduce stock to negative value",
            });
          }
          
          const stockHistoryFrom2 = newStockHistory(
            existingStock.id,
            warehouseId,
            adminData.id,
            existingStock.product_stock,
            existingStock.product_stock - parseInt(productStock, 10),
            parseInt(productStock, 10),
            "Stock Update"
          );

    
      }

      await existingStock.save({ transaction: t });

      await t.commit();

      res.status(200).send({
        message: "Stock updated successfully.",
        stock: existingStock,
      });
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).send({
        message: "An error occurred while updating stock.",
        error: error.message,
      });
    }
  },

  async getWarehouseStocks(req, res) {
    try {
      const options = {
        page: Number(req.query.page) || 1,
        pageSize: 10,
        categoryId: req.query.categoryId,
        productName: req.query.productName,
      };

      if (req.user.role_id == 2) {
        options.warehouseId = req.user.warehouse_id;
      } else {
        options.warehouseId = req.query.warehouseId;
      }

      const stockResponse = await getAllWarehouseStocks(options);

      if (!stockResponse.success) {
        throw new Error(stockResponse.error);
      }

      res.status(200).send({
        message: "Warehouse stocks fetched successfully",
        stocks: stockResponse.data,
        pagination: stockResponse.pagination,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "An error occurred while fetching warehouse stocks",
        error: error.message,
      });
    }
  },

  getAllWarehouseStock: async (req, res) => {
    try {
      const result = await db.Warehouse_stock.findAll({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [
          {
            model: db.Product,
            as: "Product",
            attributes: { exclude: ["updatedAt", "createdAt"] },
            include: [
              {
                model: db.Category,
                as: "category",
                attributes: {
                  exclude: ["updatedAt", "createdAt", "deletedAt"],
                },
              },
              {
                model: db.Image_product,
                attributes: {
                  exclude: ["updatedAt", "createdAt"],
                },
              },
            ],
          },
          {
            model: db.Warehouse,
            as: "Warehouse",
            attributes: ["id", "warehouse_name"],
          },
        ],
      });
      res.json({
        ok: true,
        result: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "An error occurred while fetching warehouse stocks",
        error: error.message,
      });
    }
  },

  getAllWarehouseStockFilter: async (req, res) => {
    try {
      const findMaxWeight = await db.Product.findOne({
        attributes: [Sequelize.fn("MAX", Sequelize.col("weight"))],
        raw: true,
      });
      let maxWeight = 0;
      for (const item in findMaxWeight) {
        maxWeight = findMaxWeight[item];
      }

      const findMaxPrice = await db.Product.findOne({
        attributes: [Sequelize.fn("MAX", Sequelize.col("price"))],
        raw: true,
      });
      let maxPrice = 0;
      for (const item in findMaxPrice) {
        maxPrice = findMaxPrice[item];
      }

      const pagination = {
        page: Number(req.query.page) || 1,
        perPage: Number(req.query.perPage) || 9,
        searchWarehouseName: req.query.warehouseName,

        searchCategory: req.query.category || undefined,
        searchProduct: req.query.product || undefined,
        rangeWeightMin: Number(req.query.weightMin) || 0,
        rangeWeightMax: Number(req.query.weightMax) || maxWeight,
        rangePriceMin: Number(req.query.priceMin) || 0,
        rangePriceMax: Number(req.query.priceMax) || maxPrice,
      };

      const result = await db.Product.findAll({
        attributes: { exclude: ["updatedAt", "createdAt", "deletedAt"] },
        where: pagination.searchProduct
          ? {
              name: {
                [db.Sequelize.Op.like]: `%${pagination.searchProduct}%`,
              },
              is_active: true,
            }
          : {
              is_active: true,
              weight: {
                [db.Sequelize.Op.between]: [
                  pagination.rangeWeightMin,
                  pagination.rangeWeightMax,
                ],
              },
              price: {
                [db.Sequelize.Op.between]: [
                  pagination.rangePriceMin,
                  pagination.rangePriceMax,
                ],
              },
            },
        include: [
          {
            model: db.Category,
            as: "category",
            attributes: { exclude: ["updatedAt", "createdAt", "deletedAt"] },
            where: pagination.searchCategory
              ? {
                  name: {
                    [db.Sequelize.Op.like]: `%${pagination.searchCategory}%`,
                  },
                }
              : {},
          },
          {
            model: db.Image_product,
            attributes: { exclude: ["updatedAt", "createdAt"] },
          },
        ],
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage,
      });

      const totalCount = await db.Product.count({
        attributes: { exclude: ["updatedAt", "createdAt", "deletedAt"] },
        where: pagination.searchProduct
          ? {
              name: {
                [db.Sequelize.Op.like]: `%${pagination.searchProduct}%`,
              },
              is_active: true,
            }
          : {
              is_active: true,
              weight: {
                [db.Sequelize.Op.between]: [
                  pagination.rangeWeightMin,
                  pagination.rangeWeightMax,
                ],
              },
              price: {
                [db.Sequelize.Op.between]: [
                  pagination.rangePriceMin,
                  pagination.rangePriceMax,
                ],
              },
            },
        include: [
          {
            model: db.Category,
            as: "category",

            where: pagination.searchCategory
              ? {
                  name: {
                    [db.Sequelize.Op.like]: `%${pagination.searchCategory}%`,
                  },
                }
              : {},
          },
        ],
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage,
      });

      if (totalCount === 0) {
        return res.json({
          ok: true,
          data: result,
        });
      }

      const totalPage = Math.ceil(totalCount / pagination.perPage);
      if (pagination.page > totalPage) {
        return res.status(400).send({
          ok: false,
          message: "Page number exceeds total pages",
        });
      }

      res.json({
        ok: true,
        message: "Success get products",
        pagination: {
          ...pagination,
          totalPages: totalPage,
          limitPriceMax: maxPrice,
          limitWeightMax: maxWeight,
        },

        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching product stocks",
        error: error.message,
      });
    }
  },

  getProductStockByProductName: async (req, res) => {
    const { name } = req.params;
    try {
      const productData = await db.Product.findOne({
        where: { name },
        attributes: ["id"],
      });

      if (!productData) {
        return res
          .status(404)
          .json({ ok: false, message: "Product not found" });
      }

      const reservedStock = await db.Reserved_stock.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: db.Warehouse_stock,
          as: "WarehouseProductReservation",
          where: { product_id: productData.id },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      });

      const getReservedStockValue = reservedStock.map((item) => {
        return item.reserve_quantity;
      });
      let reservedStockTotal = 0;
      if (getReservedStockValue.length !== 0) {
        reservedStockTotal = getReservedStockValue.reduce((acc, cv) => {
          return acc + cv;
        });
      }

      const result = await db.Product.findOne({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        where: { name, is_active: true },
        include: [
          {
            model: db.Category,
            as: "category",
            attributes: {
              exclude: ["updatedAt", "deletedAt", "createdAt"],
            },
          },
          {
            model: db.Image_product,
            attributes: { exclude: ["updatedAt", "createdAt"] },
          },
        ],
      });

      const countTotalStock = await db.Warehouse_stock.findAll({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [
          {
            model: db.Product,
            as: "Product",
            attributes: { exclude: ["updatedAt"] },
            where: { name, is_active: true },
          },
        ],
      });

      const getTotalStockValue = countTotalStock.map((item) => {
        return item.product_stock;
      });
      let totalStockValue = 0;
      if (getTotalStockValue.length !== 0) {
        totalStockValue = getTotalStockValue.reduce((acc, cv) => {
          return acc + cv;
        });
      }

      if (!result) {
        return res
          .status(404)
          .json({ ok: false, message: "Product not found" });
      }

      res.json({
        ok: true,
        result,
        countTotalStock,
        totalStockValue,
        remainingStock: totalStockValue - reservedStockTotal,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching product stocks",
        error: error.message,
      });
    }
  },

  async deleteStockForWarehouse(req, res) {
    const warehouseId = parseInt(req.params.warehouseId, 10);
    const productId = parseInt(req.params.productId, 10);
    const adminData = req.user;

    if (req.user.role_id === 2) {
      if (req.user.warehouse_id !== warehouseId) {
        return res.status(403).send({
          message:
            "You are not authorized to delete stock from this warehouse.",
        });
      }
    }

    const t = await db.sequelize.transaction();
    try {
      const existingStock = await db.Warehouse_stock.findOne({
        where: { warehouse_id: warehouseId, product_id: productId },
        transaction: t,
      });

      if (!existingStock) {
        await t.rollback();
        return res.status(404).send({
          message:
            "Stock does not exist for the selected product in this warehouse.",
        });
      }

      await db.Warehouse_stock.destroy({
        where: { warehouse_id: warehouseId, product_id: productId },
        transaction: t,
      });

      const stockHistoryFrom = newStockHistory(
        existingStock.id,
        warehouseId,
        adminData.id,
        existingStock.product_stock,
        existingStock.product_stock - existingStock.product_stock,
        existingStock.product_stock,
        "Stock Destroy"
      );

      await t.commit();
      res.status(200).send({
        message: "Stock deleted successfully.",
      });
    } catch (error) {
      await t.rollback();
      console.error(error);
      res.status(500).send({
        message: "An error occurred while deleting stock.",

        error: error.message,
      });
    }
  },

  async getStockHistoryList(req, res) {
    const adminWarehouseId = req.user.warehouse;
    const adminRoleId = req.user.role;

    const d = new Date();

    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.size) || 10;
    const loggedAdmin = req.query.loggedAdmin;
    const warehouseId = req.query.warehouseId;
    const year = req.query.year;
    const month = req.query.month;

    let options = {
      where: {},
    };

    if (loggedAdmin) {
      options.where.admin_id = loggedAdmin;
    }

    if (adminWarehouseId) {
      if (adminRoleId != 1) {
        options.where.warehouse_id = adminWarehouseId;
      }
    }

    if (warehouseId) {
      options.where.warehouse_id = warehouseId;
    }

    if (month && year) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(
          Sequelize.fn("MONTH", Sequelize.col("timestamp")),
          month
        ),
        Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("timestamp")), year),
      ];
    } else if (year) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("timestamp")), year),
      ];
    } else if (month) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(
          Sequelize.fn("MONTH", Sequelize.col("timestamp")),
          month
        ),
      ];
    }

    try {
      const response = await getAllStockHistory(options, page, perPage);

      const stockHistory = response.data;

      const amountIncrement = stockHistory.reduce((amountIncrement, stock) => {
        if (stock.increment_decrement === "Increment") {
          amountIncrement.push(stock.quantity);
        }
        return amountIncrement;
      }, []);

      const amountDecrement = stockHistory.reduce((amountDecrement, stock) => {
        if (stock.increment_decrement === "Decrement") {
          amountDecrement.push(stock.quantity);
        }
        return amountDecrement;
      }, []);

      const totalIncrement = amountIncrement.reduce((total, n) => total + n, 0);
      const totalDecrement = amountDecrement.reduce((total, n) => total + n, 0);

      const lastStock = stockHistory.map((item) => {
        const container = {};
        container.warehouse_stock_id = item.warehouse_stock_id;
        container.stock_after_transfer = item.stock_after_transfer;

        return container;
      });

      lastStock.reverse();

      function removeDuplicates(array, property) {
        return array.filter((item, index, self) => {
          const value = item[property];
          return index === self.findIndex((obj) => obj[property] === value);
        });
      }

      const lastStockUnique = removeDuplicates(lastStock, "warehouse_stock_id");

      const totalLastStock = lastStockUnique.reduce(
        (total, n) => total + n.stock_after_transfer,
        0
      );

      if (response.success) {
        res.status(200).send({
          message: "Stock history retrieved successfully",
          history: stockHistory,
          total_last_stock: totalLastStock,
          total_increment: totalIncrement,
          total_decrement: totalDecrement,
          pagination: response.pagination,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },
};
