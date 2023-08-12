const db = require("../models")
module.exports = {
  getOneAdmin: async (filter) => {
    const options = {
      where: filter
    };

    try {
      const result = await db.Admin.findOne(options);
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

  getAllAdmins: async (options = {}, page = 1, pageSize = 10) => {
    const filter = options.where || {};
    const include = options.include || [];
  
    const queryOptions = {
      where: filter,
      include: include,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };
  
    try {
      const results = await db.Admin.findAll(queryOptions);
      const totalItems = await db.Admin.count({ where: filter });
  
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
  }

};
