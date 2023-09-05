const db = require("../models");

module.exports = {
  getOneInventoryTransfer: async (filter) => {
    const options = {
      where: filter,
      include: [
        {
          model: db.Warehouse_stock,
          include: [{ model: db.Product }, { model: db.Warehouse }],
        },
        { model: db.Warehouse, as: "FromWarehouse" },
        { model: db.Warehouse, as: "ToWarehouse" },
      ],
    };

    try {
      const result = await db.Inventory_transfer.findOne(options);
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

  getAllInventoryTransfers: async (options = {}, page = 1, pageSize = 10) => {
    const filter = options.where || {};
  
    const queryOptions = {
      where: filter,
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
      include: [
        {
          model: db.Warehouse_stock,
          attributes: ["id"],
          include: [
            {
              model: db.Product, 
              attributes: ["name"],
            },
          ],
    
        },
        {
          model: db.Warehouse,
          as: "FromWarehouse",
          required: true,
          attributes: [["warehouse_name", "fromWarehouseName"]]
        },
        {
          model: db.Warehouse,
          as: "ToWarehouse",
          required: true,
          attributes: [["warehouse_name", "toWarehouseName"]]
        },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };
  
    try {
      const results = await db.Inventory_transfer.findAll(queryOptions);
      const totalItems = await db.Inventory_transfer.count({ where: filter });
  
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
        error: error.message
      };
    }
  },
  
};
