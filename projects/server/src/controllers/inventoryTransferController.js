const db = require("../models");
const { getAllInventoryTransfers } = require("../service/inventoryTransfer");

module.exports = {
  async stockTransfer(req, res) {
    const t = await db.sequelize.transaction();

    try {
      const { fromWarehouseId, toWarehouseId, productId, quantity } = req.body;

      if (!fromWarehouseId || !toWarehouseId || !productId || !quantity) {
        return res.status(400).json({
          success: false,
          message: "Required fields missing",
        });
      }

      if (fromWarehouseId === toWarehouseId) {
        return res.status(400).json({
          success: false,
          message: "Source and destination warehouses cannot be the same.",
        });
      }

      const fromStock = await db.Warehouse_stock.findOne({
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

      const transfer = await db.Inventory_transfer.create(
        {
          warehouse_stock_id: fromStock.id,
          from_warehouse_id: fromWarehouseId,
          to_warehouse_id: toWarehouseId,
          product_id: productId,
          quantity: quantity,
          status: "Pending",
          transaction_code: "TRX" + Date.now(),
          timestamp: db.Sequelize.fn("NOW"),
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
      const { transferid } = req.params;

      const transfer = await db.Inventory_transfer.findByPk(transferid, {
        attributes: [
          "id",
          "warehouse_stock_id",
          "from_warehouse_id",
          "to_warehouse_id",
          "quantity",
          "transaction_code",
          "timestamp",
          "status",
        ],
        transaction: t,
      });

      if (!transfer || transfer.status !== "Pending") {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Transfer either not found or already approved",
        });
      }

      const fromStock = await db.Warehouse_stock.findByPk(
        transfer.warehouse_stock_id,
        {
          transaction: t,
        }
      );

      if (fromStock.product_stock < transfer.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Not enough stock in source warehouse",
        });
      }

      await db.Warehouse_stock.decrement("product_stock", {
        by: transfer.quantity,
        where: {
          id: fromStock.id,
        },
        transaction: t,
      });

      if (fromStock.product_stock - transfer.quantity === 0) {
        fromStock.status = "Empty";
        await fromStock.save({ transaction: t });
      }

      const toStock = await db.Warehouse_stock.findOrCreate({
        where: {
          warehouse_id: transfer.to_warehouse_id,
          product_id: fromStock.product_id,
        },
        defaults: {
          product_stock: 0,
        },
        transaction: t,
      });

      await db.Warehouse_stock.increment("product_stock", {
        by: transfer.quantity,
        where: {
          id: toStock[0].id,
        },
        transaction: t,
      });

      transfer.status = "Approve";
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

  async rejectStockTransfer(req, res) {
    const t = await db.sequelize.transaction();

    try {
      const { transferid } = req.params;

      const transfer = await db.Inventory_transfer.findByPk(transferid, {
        attributes: [
          "id",
          "warehouse_stock_id",
          "from_warehouse_id",
          "to_warehouse_id",
          "quantity",
          "transaction_code",
          "timestamp",
          "status",
        ],
        transaction: t,
      });

      if (!transfer || transfer.status !== "Pending") {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "Transfer either not found or already approved",
        });
      }

      transfer.status = "Reject";
      transfer.journal = "Transfer rejected";
      await transfer.save({ transaction: t });

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Stock transfer rejected",
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

  async getInventoryTransferList(req, res) {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.size) || 10;
    const productName = req.query.productName;
    const to_warehouse_id = req.query.warehouseId;
    const sortOrder = req.query.sortOrder === "asc" ? "ASC" : "DESC";
    const status = req.query.status; 

    let options = {
      order: [["createdAt", sortOrder]],
      productName: productName,
      warehouseId: to_warehouse_id,
      status: status
    };

    try {
      const response = await getAllInventoryTransfers(options, page, perPage);

      if (response.success) {
        res.status(200).send({
          message: "Inventory transfer list retrieved successfully",
          transfers: response.data,
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
}

};
