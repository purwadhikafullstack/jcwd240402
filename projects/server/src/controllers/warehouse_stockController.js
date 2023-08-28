const db = require("../models");
const {
  getAllWarehouseStocks,
  getAllWarehouseStocksFilter,
} = require("../service/warehouse_stock");
const { Op } = require("sequelize");

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
    const pagination = {
      page: Number(req.query.page) || 1,
      perPage: 9,
      searchWarehouseName: req.query.warehouseName,
      searchCategory: req.query.category || undefined,
      searchProduct: req.query.product || undefined,
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
                }
              : {},
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
        include: [
          {
            model: db.Product,
            as: "Product",
            where: pagination.searchProduct
              ? {
                  name: {
                    [db.Sequelize.Op.like]: `%${pagination.searchProduct}%`,
                  },
                }
              : {},
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
      console.log(totalCount);
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
};
