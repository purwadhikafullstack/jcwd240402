const db = require("../models");

module.exports = {
  getOneWarehouseStock: async (filter) => {
    const options = {
      where: filter,
      include: [
        {
          model: db.Product,
          as: 'Product',
          attributes: ['id', 'name', 'description'],
        },
        {
          model: db.Warehouse,
          as: 'Warehouse',
          attributes: ['id', 'name', 'location'],
        }
      ],
    };

    try {
      const result = await db.Warehouse_stock.findOne(options);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  getAllWarehouseStocks: async (options = {}, page = 1, pageSize = 10) => {
    const filter = options.where || {};

    const defaultInclude = [
      {
        model: db.Product,
        as: 'Product',
        attributes: ['id', 'name', 'description'],
      },
      {
        model: db.Warehouse,
        as: 'Warehouse',
        attributes: ['id', 'name', 'location'],
      }
    ];

    const includeOptions = options.include ? [...defaultInclude, ...options.include] : defaultInclude;

    const queryOptions = {
      where: filter,
      include: includeOptions,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };

    try {
      const results = await db.Warehouse_stock.findAll(queryOptions);
      const totalItems = await db.Warehouse_stock.count({ where: filter });

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
  
    const queryOptions = {
      where: filter,
      include:[
        {model: db.Admin, attributes: ['username'], as: "Admin"},
        {model: db.Warehouse_stock, attributes: ['product_stock'], as: "Warehouse_stock", 
        include:[
          {model: db.Product, attributes: ['name'], as: "Product"}
        ]}
      ],
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
