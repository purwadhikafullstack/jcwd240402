const db = require("../models");
const dayjs = require("dayjs");
const isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);

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

  async getAllInventoryTransfers(options = {}, page = 1, pageSize = 10) {
    const filter = options.where || {};

    if (options.warehouseId) {
      filter[db.Sequelize.Op.or] = [
        { from_warehouse_id: options.warehouseId },
        { to_warehouse_id: options.warehouseId },
      ];
    }

    if (options.status) {
      filter.status = options.status;
    }

    if (options.month && options.year) {
      const startOfMonth = new Date(options.year, options.month - 1, 1);
      const endOfMonth = new Date(options.year, options.month, 0); 
      filter.createdAt = {
          [db.Sequelize.Op.between]: [startOfMonth, endOfMonth]
      };
  }

    const queryOptions = {
      where: filter,
      attributes: [
        "id",
        "warehouse_stock_id",
        "from_warehouse_id",
        "to_warehouse_id",
        "quantity",
        "createdAt",
        "updatedAt",
        "status",
      ],
      include: [
        {
          model: db.Warehouse_stock,
          required: true,
          attributes: ["id"],
          include: [
            {
              model: db.Product,
              attributes: ["name"],
              where: options.productName
                ? {
                    name: {
                      [db.Sequelize.Op.like]: `%${options.productName}%`,
                    },
                  }
                : undefined,
              required: true,
            },
          ],
        },
        {
          model: db.Warehouse,
          as: "FromWarehouse",
          required: true,
          attributes: [["warehouse_name", "fromWarehouseName"]],
        },
        {
          model: db.Warehouse,
          as: "ToWarehouse",
          required: true,
          attributes: [["warehouse_name", "toWarehouseName"]],
        },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: options.order || [["createdAt", "DESC"]],
    };

    try {
       const { count: totalItems, rows: results } = await db.Inventory_transfer.findAndCountAll(queryOptions);

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
