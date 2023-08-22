const db = require("../models");

module.exports = {
  getOneProduct: async (filter) => {
    const options = {
      where: filter,
    };

    try {
      const result = await db.Product.findOne(options);
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

  async getAllProducts(options = {}, page = 1, pageSize = 10) {
    const filter = options.where || {};

    const queryOptions = {
      where: filter,
      include: [
        {
          model: db.Image_product,
          as: "Image_products",
          attributes: ["img_product"],
        },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };

    try {
      const results = await db.Product.findAll(queryOptions);
      const totalItems = await db.Product.count({ where: filter });

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
