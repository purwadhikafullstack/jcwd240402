const db = require("../models");
const { getAllWarehouseStocks, newStockHistory, getAllStockHistory } = require("../service/warehouse_stock");

module.exports = {
  async createStock(req, res) {
    const { warehouse_id, product_id, product_stock } = req.body;
    const t = await db.sequelize.transaction();

    try {
      const existingStock = await warehouseStockService.getOneWarehouseStock({
        warehouse_id,
        product_id,
      });

      if (existingStock.success) {
        await t.rollback();
        return res
          .status(400)
          .send({
            message: "Stock already exists for this warehouse and product.",
          });
      }

      const newStock = {
        warehouse_id,
        product_id,
        product_stock,
        status: product_stock > 0 ? "In Stock" : "Empty",
      };

      const createResult = await db.Warehouse_stocks.create(newStock, {
        transaction: t,
      });
      await t.commit();

      return res.status(201).send({
        message: "Stock created successfully",
        data: createResult,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async editStock(req, res) {
    const stockId = req.params.id;
    const { warehouse_id, product_id, product_stock, status } = req.body;
    const t = await db.sequelize.transaction();

    try {
      const stock = await warehouseStockService.getOneWarehouseStock({
        id: stockId,
      });

      if (!stock.success) {
        await t.rollback();
        return res.status(404).send({ message: "Stock not found" });
      }

      stock.warehouse_id = warehouse_id || stock.warehouse_id;
      stock.product_id = product_id || stock.product_id;
      stock.product_stock = product_stock || stock.product_stock;
      stock.status = status || stock.status;

      await stock.save({ transaction: t });
      await t.commit();

      return res.status(200).send({
        message: "Stock updated successfully",
        data: stock,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async updateStockQuantity(req, res) {
    const stockId = req.params.id;
    const { quantity } = req.body;

    const t = await db.sequelize.transaction();

    try {
      const stockResponse = await warehouseStockService.getOneWarehouseStock({
        id: stockId,
      });

      if (!stockResponse.success || !stockResponse.data) {
        await t.rollback();
        return res.status(404).send({ message: "Stock not found" });
      }

      const stock = stockResponse.data;

      stock.product_stock = Math.max(quantity, 0); // Ensure stock is not less than 0
      stock.status = stock.product_stock > 0 ? "In Stock" : "Empty";

      await stock.save({ transaction: t });
      await t.commit();

      return res.status(200).send({
        message: `Stock quantity updated successfully`,
        data: stock,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getStockListByWarehouse(req, res) {
    const { page = 1, pageSize = 10 } = req.query;

    try {
      const stockResponse = await getAllWarehouseStocks({}, page, pageSize);

      if (!stockResponse.success) {
        throw new Error(stockResponse.error);
      }
      const stocks = stockResponse.data;
      const groupedStocks = stocks.reduce((acc, stock) => {
        if (!acc[stock.warehouse_id]) {
          acc[stock.warehouse_id] = [];
        }
        acc[stock.warehouse_id].push(stock);
        return acc;
      }, {});

      return res.status(200).send({
        message: "Fetched stock list successfully",
        data: groupedStocks,
        pagination: stockResponse.pagination,
      });
    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async testAddStockHistoryStock(req, res) {
  
    const {
      warehouse_id,
      product_id,
      amount,
    } = req.body;
  
    try {
      const warehouseStockData = await db.Warehouse_stock.findOne({
        where: {
          warehouse_id: warehouse_id,
          product_id: product_id
        },
      });

      const beforeStock = warehouseStockData.product_stock

      warehouseStockData.product_stock = beforeStock + amount;

      await warehouseStockData.save();

      await newStockHistory(
        warehouseStockData.id, warehouse_id, 1, 
        beforeStock, warehouseStockData.product_stock, amount,"add stock")
  
      return res.status(200).send({
        message: "Stock Added successfully",
        data: warehouseStockData,
      });
    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getStockHistoryList(req, res) {

    const d = new Date();

    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.size) || 10;
    const loggedAdmin = req.query.loggedAdmin;
    const warehouseId = req.query.warehouseId;
    const year = req.query.year
    const month = req.query.month

    let options = {
      where: {},
    };

    if (loggedAdmin) {
      options.where.admin_id = loggedAdmin;
    }

    if (warehouseId) {
      options.where.warehouse_id = warehouseId;
    }

    if (year) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('timestamp')), year),
      ];
    }

    if (month) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('timestamp')), month),
      ];
    }

    try {
      const response = await getAllStockHistory(options, page, perPage);

      if (response.success) {
        res.status(200).send({
          message: "stock history retrieved successfully",
          history: response.data,
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
