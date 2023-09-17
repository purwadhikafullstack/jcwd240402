const db = require("../models");

module.exports = {

  getAllUserOrder: async (options = {}, options2 = {}, options3 = {}, page = 1, pageSize = 10) => {
    const filter = options.where || {};
    const filter2 = options2 || {};
    const filter3 = options3 || {};

    const queryOptions = {
      where: filter,
      where: filter2,
      where: { order_status_id: 3 },
      include: [
        {
          model: db.Order_status,
        },
        {
            model: db.Order_detail,
            include: {
                model: db.Warehouse_stock,
                include: [
                  {
                      where: filter3,
                      model: db.Product,
                      include: [
                          {
                              model: db.Category,
                              as: "category"
                          },
                        ],
                  },
                ],
             },
        },
        {
          model: db.User,
        },
        {
          model: db.Address_user,
          attributes: { exclude: ["address_user_id"] },
        },
        {
          model: db.Warehouse,
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

  getAllUserOrderDetails: async (options = {}, options2 = {}, options3 = {}, page = 1, pageSize = 10) => {
    const filter = options.where || {};
    const filter2 = options2 || {};
    const filter3 = options3 || {};

    const queryOptions = {
      include: [
        {
            model: db.Order,
            where: { order_status_id: 3 },
            where: filter,
            where: filter2,
        },
        {
          model: db.Warehouse_stock,
          include: [
            {
                where: filter3,
                model: db.Product,
                include: [
                    {
                        model: db.Category,
                        as: "category"
                    },
                  ],
            },
          ],
        },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [["updatedAt", "DESC"]],
    };

    try {
      const results = await db.Order_detail.findAll(queryOptions);
      const totalOrders = await db.Order_detail.count({ where: filter });

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
