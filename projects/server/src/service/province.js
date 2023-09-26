const db = require("../models");
module.exports = {
  getOneProvince: async (filter) => {
    const options = {
      where: filter,
    };

    try {
      const result = await db.Province.findOne(options);
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

  getAllProvinces: async (filter = {}, page = 1, pageSize = 5) => {
    const options = {
      where: filter,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };

    try {
      const results = await db.Province.findAll(options);
      const totalItems = await db.Province.count({ where: filter });

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
