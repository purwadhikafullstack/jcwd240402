const db = require("../models");

module.exports = {
  getOneWarehouseStock: async (filter) => {
    const options = {
      where: filter,
      include: [
        {
          model: db.Product,
          as: "Product",
          attributes: ["id", "name", "description"],
        },
        {
          model: db.Warehouse,
          as: "Warehouse",
          attributes: ["id", "warehouse_name"],
        },
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

  getAllWarehouseStocks: async (options = {}, page = 1, pageSize = 20) => {
    const filter = options.where || {};

    const defaultInclude = [
      {
        model: db.Product,
        as: "Product",
        attributes: ["id", "name", "description"],
      },
      {
        model: db.Warehouse,
        as: "Warehouse",
        attributes: ["id", "warehouse_name"],
      },
    ];

    const includeOptions = options.include
      ? [...defaultInclude, ...options.include]
      : defaultInclude;

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
};
