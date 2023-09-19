const jwt = require("jsonwebtoken");
const db = require("../models")

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
  
  autoStockTransfer: async (warehouse_id, product_id, requiredStock,orderId) => {
    console.log(warehouse_id,product_id,requiredStock,orderId)
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
            order_id: { [db.Sequelize.Op.ne]: orderId } 
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
  
        console.log("Warehouses before filtering:", warehousesWithStock);
  
        const sortedWarehouses = warehousesWithStock
        .filter((warehouse) => {
          const totalReserved = warehouse.Reservations.reduce(
            (acc, curr) => acc + curr.reserve_quantity,
            0
          );
          
          const availableStock = warehouse.product_stock - totalReserved;
          console.log(`Warehouse ID: ${warehouse.id}, Total Stock: ${warehouse.product_stock}, Total Reserved: ${totalReserved}`);
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
          console.log("Warehouses with stock:", warehousesWithStock);
          console.log("Sorted warehouses:", sortedWarehouses);
          console.log("Remaining deficit:", remainingDeficit);
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
  
        sourceWarehouseStock.product_stock -= stockToTransfer;
        currentWarehouseStock.product_stock += stockToTransfer;
        remainingDeficit -= stockToTransfer;
  
        // "inventory transferlist catat",
        //
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
      return {
        status: "error",
        message: "An error occurred during stock transfer.",
        detail: error.message,
      };
    }
  }
};
