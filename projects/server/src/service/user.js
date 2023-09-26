const db = require("../models");

module.exports = {
  getOneUser: async (filter) => {
    const options = {
      where: filter,
    };

    try {
      const result = await db.User.findOne(options);
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

  getAllUsers: async (options = {}, page = 1, pageSize = 10) => {
    const filter = options.where || {};
    const include = options.include || [
      {
        model: db.User_detail,
      },
      {
        model: db.Address_user,
      }
    ];
  
    const queryOptions = {
      where: filter,
      include: include,
      offset: (page - 1) * pageSize,
      attributes: { exclude: ["password", "verify_token", "reset_password_token"] },
      limit: pageSize,
    };
  
    try {
      const results = await db.User.findAll(queryOptions); 
      const totalItems = await db.User.count({ 
        where: filter, 
        include: include 
      }); 
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
