const db = require("../models");

const {
  getAllWarehouseStocks,
  newStockHistory,
  getAllStockHistory,
} = require("../service/warehouse_stock");
const { Sequelize } = require("sequelize");

module.exports = {
  async createStockForWarehouse(req, res) {
    const { warehouseId, productId, productStock } = req.body;

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
    const warehouseId = parseInt(req.params.warehouseId, 10);
    const productId = parseInt(req.params.productId, 10);
    const { productStock, operation } = req.body;

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
          break;
        case "decrease":
          existingStock.product_stock -= parseInt(productStock, 10);
          if (existingStock.product_stock < 0) {
            await t.rollback();
            return res.status(400).send({
              message: "Operation would result in negative stock.",
            });
          }
          break;
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
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const searchWarehouseName = req.query.warehouseName;

    const options = {
      where: {},
      include: [
        {
          model: db.Product,
          as: "Product",
          attributes: ["name", "description"],
        },
        {
          model: db.Warehouse,
          as: "Warehouse",
          attributes: ["id", "warehouse_name"],
          ...(searchWarehouseName && {
            where: {
              warehouse_name: {
                [db.Sequelize.Op.like]: `%${searchWarehouseName}%`,
              },
            },
          }),
        },
      ],
    };

    try {
      const stockResponse = await getAllWarehouseStocks(
        options,
        page,
        pageSize
      );
      const stocks = stockResponse.data;

      if (!stockResponse.success) {
        throw new Error(stockResponse.error);
      }

      const groupedStocks = stocks.reduce((acc, stock) => {
        const warehouseName = stock.Warehouse.warehouse_name;
        const warehouseId = stock.Warehouse.id;
        if (!acc[warehouseName]) {
          acc[warehouseName] = [];
        }
        acc[warehouseName].push({
          warehouse_id: warehouseId,
          product_stock: stock.product_stock,
          createdAt: stock.createdAt,
          updatedAt: stock.updatedAt,
          Product: stock.Product,
        });
        return acc;
      }, {});

      res.status(200).send({
        message: "Warehouse stocks fetched successfully",
        stocks: groupedStocks,
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

  async initiateStockTransfer(req, res) {
    const t = await db.sequelize.transaction();

    try {
      const { fromWarehouseId, toWarehouseId, productId, quantity } = req.body;

      if (!fromWarehouseId || !toWarehouseId || !productId || !quantity) {
        return res.status(400).json({
          success: false,
          message: "Required fields missing",
        });
      }

      const fromStock = await db.Warehouse_stocks.findOne({
        where: {
          warehouse_id: fromWarehouseId,
          product_id: productId,
        },
        transaction: t,
      });

      if (!fromStock || fromStock.product_stock < quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Not enough stock in source warehouse",
        });
      }

      const transfer = await db.Inventory_transfers.create(
        {
          warehouse_stock_id: fromStock.id,
          from_warehouse_id: fromWarehouseId,
          to_warehouse_id: toWarehouseId,
          product_id: productId,
          quantity: quantity,
          journal: "Transfer initiated",
          approval: false,
          transaction_code: "TRX" + Date.now(),
          timestamp: new Date().toISOString(),
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Transfer initiated successfully",
        transfer: transfer,
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  },

  async approveStockTransfer(req, res) {
    const t = await db.sequelize.transaction();

    try {
      const { transferId } = req.params;

      const transfer = await db.Inventory_transfers.findByPk(transferId, {
        transaction: t,
      });

      if (!transfer || transfer.approval) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Transfer either not found or already approved",
        });
      }

      const fromStock = await db.Warehouse_stocks.findOne({
        where: {
          warehouse_id: transfer.from_warehouse_id,
          product_id: transfer.product_id,
        },
        transaction: t,
      });

      if (fromStock.product_stock < transfer.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Not enough stock in source warehouse",
        });
      }

      await db.Warehouse_stocks.decrement("product_stock", {
        by: transfer.quantity,
        where: {
          id: fromStock.id,
        },
        transaction: t,
      });

      const toStock = await db.Warehouse_stocks.findOrCreate({
        where: {
          warehouse_id: transfer.to_warehouse_id,
          product_id: transfer.product_id,
        },
        defaults: {
          product_stock: 0,
        },
        transaction: t,
      });

      await db.Warehouse_stocks.increment("product_stock", {
        by: transfer.quantity,
        where: {
          id: toStock[0].id,
        },
        transaction: t,
      });

      transfer.approval = true;
      await transfer.save({ transaction: t });

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Stock transfer approved and stock updated",
        transfer: transfer,
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        success: false,
        message: "Server Error",
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

    const findMaxStock = await db.Warehouse_stock.findOne({
      attributes: [Sequelize.fn("MAX", Sequelize.col("product_stock"))],
      raw: true,
    });
    let maxStock = 0;
    for (const item in findMaxStock) {
      maxStock = findMaxStock[item];
    }
    console.log(maxStock);

    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: 9,
      searchWarehouseName: req.query.warehouseName || undefined,
      searchCategory: req.query.category || undefined,
      searchProduct: req.query.product || undefined,
      rangeWeightMin: req.query.weightMin || 0,
      rangeWeightMax: req.query.weightMax || maxWeight,
      rangePriceMin: req.query.priceMin || 0,
      rangePriceMax: req.query.priceMax || maxPrice,
      // rangeStockMin: req.query.stockMin || 0,
      // rangeStockMax: req.query.stockMax || maxStock,
    };

    try {
      const result = await db.Warehouse_stock.findAll({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [
          {
            model: db.Product,
            as: "Product",
            attributes: { exclude: ["updatedAt"] },
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
                attributes: {
                  exclude: ["updatedAt", "deletedAt", "createdAt"],
                },
                where: pagination.searchCategory
                  ? {
                      name: {
                        [db.Sequelize.Op
                          .like]: `%${pagination.searchCategory}%`,
                      },
                    }
                  : {},
              },
              {
                model: db.Image_product,
                attributes: { exclude: ["updatedAt", "createdAt"] },
              },
            ],
          },
          {
            model: db.Warehouse,
            as: "Warehouse",
            attributes: ["warehouse_name"],
            where: pagination.searchWarehouseName
              ? {
                  warehouse_name: {
                    [db.Sequelize.Op
                      .like]: `%${pagination.searchWarehouseName}%`,
                  },
                }
              : {},
          },
        ],
        limit: pagination.perPage,
        offset: (pagination.page - 1) * pagination.perPage,
      });

      const totalCount = await db.Warehouse_stock.count({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [
          {
            model: db.Product,
            as: "Product",
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
                        [db.Sequelize.Op
                          .like]: `%${pagination.searchCategory}%`,
                      },
                    }
                  : {},
              },
            ],
          },
          {
            model: db.Warehouse,
            as: "Warehouse",
            where: pagination.searchWarehouseName
              ? {
                  warehouse_name: {
                    [db.Sequelize.Op
                      .like]: `%${pagination.searchWarehouseName}%`,
                  },
                }
              : {},
          },
        ],
      });

      const totalPages = Math.ceil(totalCount / pagination.perPage);

      if (pagination.page > totalPages) {
        return res.status(400).send({
          message: "Page number exceeds total pages",
        });
      }

      res.status(200).send({
        message: "success get products",
        pagination: {
          ...pagination,
          totalPages: totalPages,
        },
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "An error occurred while fetching warehouse stocks",
        error: error.message,
      });
    }
  },

  getProductStockByProductName: async (req, res) => {
    const { name } = req.params;
    try {
      const result = await db.Warehouse_stock.findOne({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [
          {
            model: db.Product,
            as: "Product",
            attributes: { exclude: ["updatedAt"] },
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
          },
        ],
      });
      res.json({
        ok: true,
        result,
      });
    } catch (error) {
      res.status(500).send({
        message: "An error occurred while fetching product stocks",
        error: error.message,
      });
    }
  },

  async deleteStockForWarehouse(req, res) {
    const warehouseId = parseInt(req.params.warehouseId, 10);
    const productId = parseInt(req.params.productId, 10);
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
          message: "stock history retrieved successfully",
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
