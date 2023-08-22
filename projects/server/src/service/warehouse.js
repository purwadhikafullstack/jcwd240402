const db = require("../models")
module.exports = {
    getOneWarehouse: async (filter) => {
      const options = {
        where: filter
      };
  
      try {
        const result = await db.Warehouse.findOne(options);
        return {
          success: true,
          data: result
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: error.message
        };
      }
    },
  
    getAllWarehouses: async (options = {}, page = 1, pageSize = 10) => {
      const filter = options.where || {};
      const include = options.include || [];
    
      const queryOptions = {
        where: filter,
        include: include,
        offset: (page - 1) * pageSize,
        limit: pageSize,
      };
    
      try {
        const results = await db.Warehouse.findAll(queryOptions);
        const totalItems = await db.Warehouse.count({ where: filter });
    
        return {
          success: true,
          data: results,
          pagination: {
            page: page,
            pageSize: pageSize,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
          },
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: error.message,
        };
      }
    },

    newStockHistory: async (warehouseStockId, warehouseId, adminId, stockBefore, stockAfter, quan, desc) => {

      const incdec = stockBefore - stockAfter > 0 ? "Decrement" : "Increment"
    
      try {
        const newHistory = await db.History_stock.create({
        warehouse_stock_id : warehouseStockId,
        warehouse_id : warehouseId,
        admin_id : adminId,
        stock_before_transfer : stockBefore,
        stock_after_transfer : stockAfter,
        increment_decrement : incdec,
        quantity: quan,
        journal : desc,
        timestamp : new Date(),
        });
    
        return {
          success: true,
          data: newHistory,
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: error.message,
        };
      }
    },

    getAllStockHistory: async (options = {}, page = 1, pageSize = 10) => {
      const filter = options.where || {};
      const include = options.include || [];
    
      const queryOptions = {
        where: filter,
        include: include,
        offset: (page - 1) * pageSize,
        limit: pageSize,
        order: [
          ['timestamp', 'DESC'],
        ]
      };
    
      try {
        const results = await db.History_stock.findAll(queryOptions);
        const totalItems = await db.History_stock.count({ where: filter });
    
        return {
          success: true,
          data: results,
          pagination: {
            page: page,
            pageSize: pageSize,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / pageSize),
          },
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: error.message,
        };
      }
    },

  };