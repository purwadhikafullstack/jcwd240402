const db = require("../models");
const { getAllWarehouseStocks } = require("../service/warehouse_stock");

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
