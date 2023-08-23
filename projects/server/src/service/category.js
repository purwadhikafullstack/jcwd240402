const db = require("../models");

module.exports = {
  getOneCategory: async (filter) => {
    const options = {
      where: filter,
    };

    try {
      const result = await db.Category.findOne(options);
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

  getAllCategories: async (options = {}, page = 1, pageSize = 9) => {
    const filter = options.where || {};
    const include = options.include || [];
    
    if (filter.name) {
      filter.name = {
          [db.Sequelize.Op.like]: `%${filter.name}%`
      };
  }

    const queryOptions = {
      where: filter,
      include: include,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };

    try {
      const results = await db.Category.findAll(queryOptions);
      const totalItems = await db.Category.count({ where: filter });

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
