const jwt = require("jsonwebtoken");
const db = require("../models");
const { newStockHistory } = require("../service/warehouse_stock");

const distanceKm = (lat1, lon1, lat2, lon2) => {
  const r = 6371;
  const p = Math.PI / 180;
  const a =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    (Math.cos(lat1 * p) *
      Math.cos(lat2 * p) *
      (1 - Math.cos((lon2 - lon1) * p))) /
      2;
  return 2 * r * Math.asin(Math.sqrt(a));
};

module.exports = {
  generateAccessToken: (dataAccessToken) => {
    const token = jwt.sign(dataAccessToken, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    return token;
  },

  generateRefreshToken: (dataRefreshToken) => {
    const token = jwt.sign(dataRefreshToken, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "24h",
    });
    return token;
  },

  token: (dataToken, secretToken, exp) => {
    const token = jwt.sign(dataToken, secretToken, {
      expiresIn: `${exp}`,
    });
    return token;
  },

  autoStockTransfer: async (
    warehouse_id,
    product_id,
    requiredStock,
    orderId,
    adminData
  ) => {
    const t = await db.sequelize.transaction();

    try {
      let currentWarehouseStock = await db.Warehouse_stock.findOne({
        where: { warehouse_id, product_id },
        transaction: t,
      });

      if (!currentWarehouseStock) {
        currentWarehouseStock = await db.Warehouse_stock.create({
          warehouse_id,
          product_id,
          product_stock: 0,
          transaction: t,
        });
      }

      const totalReservedInCurrentWarehouse = await db.Reserved_stock.sum(
        "reserve_quantity",
        {
          where: {
            warehouse_stock_id: currentWarehouseStock.id,
            order_id: { [db.Sequelize.Op.ne]: orderId },
          },
          transaction: t,
        }
      );

      const availableStockInCurrentWarehouse =
        currentWarehouseStock.product_stock - totalReservedInCurrentWarehouse;

      if (availableStockInCurrentWarehouse >= requiredStock) {
        await t.commit();
        return {
          status: "success",
          message: "No transfer necessary. Stock is sufficient.",
          stock: currentWarehouseStock,
        };
      }
      let remainingDeficit = requiredStock - availableStockInCurrentWarehouse;

      const currentWarehouse = await db.Warehouse.findOne({
        where: { id: warehouse_id },
        transaction: t,
      });

      while (remainingDeficit > 0) {
        const warehousesWithStock = await db.Warehouse_stock.findAll({
          where: {
            product_id: currentWarehouseStock.product_id,
            product_stock: { [db.Sequelize.Op.gt]: 0 },
            warehouse_id: { [db.Sequelize.Op.ne]: warehouse_id },
          },
          include: [
            {
              model: db.Warehouse,
              as: "Warehouse",
              attributes: ["id", "latitude", "longitude"],
            },
            {
              model: db.Reserved_stock,
              as: "Reservations",
              attributes: ["reserve_quantity"],
            },
          ],
          transaction: t,
        });

        const sortedWarehouses = warehousesWithStock
          .filter((warehouse) => {
            const totalReserved = warehouse.Reservations.reduce(
              (acc, curr) => acc + curr.reserve_quantity,
              0
            );

            const availableStock = warehouse.product_stock - totalReserved;

            return availableStock > 0;
          })
          .sort((a, b) => {
            const distanceA = distanceKm(
              currentWarehouse.latitude,
              currentWarehouse.longitude,
              a.Warehouse.latitude,
              a.Warehouse.longitude
            );
            const distanceB = distanceKm(
              currentWarehouse.latitude,
              currentWarehouse.longitude,
              b.Warehouse.latitude,
              b.Warehouse.longitude
            );
            return distanceA - distanceB;
          });

        if (sortedWarehouses.length === 0) {
          await t.rollback();

          throw new Error("No available stocks in other warehouses.");
        }

        const sourceWarehouseStock = sortedWarehouses[0];
        const totalReservedSource = sourceWarehouseStock.Reservations.reduce(
          (acc, curr) => acc + curr.reserve_quantity,
          0
        );
        const transferableStock =
          sourceWarehouseStock.product_stock - totalReservedSource;
        const stockToTransfer = Math.min(transferableStock, remainingDeficit);

        const newInventoryTransfer = await db.Inventory_transfer.create(
          {
            warehouse_stock_id: sourceWarehouseStock.id,
            from_warehouse_id: sourceWarehouseStock.warehouse_id,
            to_warehouse_id: currentWarehouseStock.warehouse_id,
            product_id: product_id,
            quantity: stockToTransfer,
            status: "Approve",
            transaction_code: "TRX" + Date.now(),
            timestamp: db.Sequelize.fn("NOW"),
          },
          { transaction: t }
        );

        const stockHistoryFrom = newStockHistory(
          sourceWarehouseStock.id,
          sourceWarehouseStock.warehouse_id,
          adminData.id,
          sourceWarehouseStock.product_stock,
          sourceWarehouseStock.product_stock - stockToTransfer,
          stockToTransfer,
          "Stock Transfer"
        );

        const stockHistoryTo = newStockHistory(
          currentWarehouseStock.id,
          currentWarehouseStock.warehouse_id,
          adminData.id,
          currentWarehouseStock.product_stock,
          currentWarehouseStock.product_stock + stockToTransfer,
          stockToTransfer,
          "Stock Transfer"
        );

        sourceWarehouseStock.product_stock -= stockToTransfer;
        currentWarehouseStock.product_stock += stockToTransfer;
        remainingDeficit -= stockToTransfer;

        await sourceWarehouseStock.save({ transaction: t });
      }

      await currentWarehouseStock.save({ transaction: t });
      await t.commit();
      return {
        status: "success",
        message: "Stock transferred successfully.",
        stock: currentWarehouseStock,
      };
    } catch (error) {
      if (t && !t.finished) {
        await t.rollback();
      }
      console.error(error);
      throw new Error(error.message);
    }
  },
};
