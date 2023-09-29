const db = require("../models")
module.exports = {
  getOneWarehouse: async (filter) => {
    const options = {
      where: filter,
      include: [
        {
          model: db.City,
          attributes: ['name'],
          include: [
            {
              model: db.Province,
              attributes: ['name'],
            },
          ],
        },
      ],
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

  };