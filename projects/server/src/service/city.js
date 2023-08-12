const db = require("../models");

module.exports = {
  getOneCity: async (filter) => {
    const options = {
      where: filter,
    };

    try {
      const result = await db.City.findOne(options);
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

  getAllCities: async (filter = {}, page = 1, pageSize = 10) => {
    const options = {
      where: filter,
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };

    try {
      const results = await db.City.findAll(options);
      const totalItems = await db.City.count({ where: filter });

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

  getCitiesWarehouse: async (filter = {}, page = 1, pageSize = 10) => {
    const options = {
      where: {
        ...filter,
        id: {
          [db.Sequelize.Op.in]: db.sequelize.select(
            db.sequelize.col("city_id"),
            {
              from: "Warehouses",
            }
          ),
        },
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      distinct: true,
    };

    try {
      const results = await db.City.findAll(options);
      const totalItems = await db.City.count({ where: filter });

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
