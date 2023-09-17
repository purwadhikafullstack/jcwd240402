const db = require("../models");

module.exports = {

  getAllUserOrder: async (options = {}, page = 1, pageSize = 10) => {
    const filter = options || {};

    const queryOptions = {
      where: filter,
      include: [
        {
          model: db.Order_status,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: db.User,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
            model: db.Address_user,
            attributes: { exclude: ["createdAt", "updatedAt", "address_user_id"] },
        },
        {
          model: db.Warehouse,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [["updatedAt", "DESC"]],
    };

    try {
      const results = await db.Order.findAll(queryOptions);
      const totalOrders = await db.Order.count({ where: filter });

      return {
        success: true,
        data: results,
        pagination: {
          page: page,
          pageSize: pageSize,
          totalOrders: totalOrders,
          totalPages: Math.ceil(totalOrders / pageSize),
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
