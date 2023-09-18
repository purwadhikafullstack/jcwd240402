const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  addWishlist: async (req, res) => {
    const userData = req.user;
    const { product } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      const isUserVerify = await db.User.findOne({
        where: { id: userData.id },
      });

      if (!isUserVerify.is_verify) {
        await transaction.rollback();
        return res.status(401).json({
          ok: false,
          message: "you have to verify your account",
        });
      }

      const isProductExist = await db.Warehouse_stock.findOne({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [
          {
            model: db.Product,
            where: { name: product, is_active: true },
            attributes: { exclude: ["updatedAt", "createdAt"] },
          },
        ],
      });

      if (!isProductExist) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }

      const isListed = await db.Wishlist.findOne({
        where: { warehouse_stock_id: isProductExist.id },
      });

      if (isListed) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "this product already in wishlist",
        });
      }

      const result = await db.Wishlist.create(
        {
          user_id: userData.id,
          warehouse_stock_id: isProductExist.id,
        },
        { transaction }
      );

      await transaction.commit();
      return res.json({
        ok: true,
        message: "add wishlist successful",
        result,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  cancelWishlist: async (req, res) => {
    const userData = req.user;
    const { product } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      const isUserVerify = await db.User.findOne({
        where: { id: userData.id },
      });

      if (!isUserVerify.is_verify) {
        await transaction.rollback();
        return res.status(401).json({
          ok: false,
          message: "you have to verify your account",
        });
      }

      const isWarehouseStockExist = await db.Warehouse_stock.findOne({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [
          {
            model: db.Product,
            where: { name: product, is_active: true },
            attributes: { exclude: ["updatedAt", "createdAt"] },
          },
        ],
      });

      if (!isWarehouseStockExist) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }

      const isProductInWishlistExist = await db.Wishlist.findOne({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [
          {
            model: db.Warehouse_stock,
            where: { id: isWarehouseStockExist.id },
            attributes: { exclude: ["updatedAt", "createdAt"] },
          },
        ],
      });

      if (!isProductInWishlistExist) {
        await transaction.rollback();
        return res.status(401).json({
          ok: false,
          message: "wishlist not found",
        });
      }
      await db.Wishlist.destroy({
        where: {
          user_id: userData.id,
          warehouse_stock_id: isWarehouseStockExist.id,
        },
        transaction,
      });

      await transaction.commit();
      return res.json({
        ok: true,
        result: isProductInWishlistExist,
        message: "delete wishlist successful",
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  getAllWishlist: async (req, res) => {
    const userData = req.user;

    try {
      const userWishlist = await db.Wishlist.findAll({
        where: { user_id: userData.id },
        attributes: {
          exclude: ["updatedAt", "createdAt", "user_id", "warehouse_stock_id"],
        },
        include: [
          {
            model: db.Warehouse_stock,
            attributes: {
              exclude: ["updatedAt", "createdAt", "warehouse_id", "product_id"],
            },
            include: [
              {
                model: db.Product,
                attributes: { exclude: ["updatedAt", "createdAt"] },
                include: [
                  {
                    model: db.Category,
                    as: "category",
                    attributes: {
                      exclude: ["updatedAt", "createdAt", "deletedAt"],
                    },
                  },
                  {
                    model: db.Image_product,
                    attributes: {
                      exclude: ["updatedAt", "createdAt", "id", "product_id"],
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

      res.status(200).json({
        ok: true,
        result: userWishlist,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  getAllWishlistInfiniteScroll: async (req, res) => {
    const userData = req.user;
    const last_id = Number(req.query.lastId) || 0;
    const limit = Number(req.query.limit) || 3;

    try {
      let result = [];
      if (last_id < 1) {
        const results = await db.Wishlist.findAll({
          where: { user_id: userData.id },
          attributes: {
            exclude: ["updatedAt", "user_id", "warehouse_stock_id"],
          },
          include: [
            {
              model: db.Warehouse_stock,
              attributes: {
                exclude: [
                  "updatedAt",
                  "createdAt",
                  "warehouse_id",
                  "product_id",
                ],
              },
              include: [
                {
                  model: db.Product,
                  attributes: { exclude: ["updatedAt", "createdAt"] },
                  include: [
                    {
                      model: db.Category,
                      as: "category",
                      attributes: {
                        exclude: ["updatedAt", "createdAt", "deletedAt"],
                      },
                    },
                    {
                      model: db.Image_product,
                      attributes: {
                        exclude: ["updatedAt", "createdAt", "id", "product_id"],
                      },
                    },
                  ],
                },
              ],
            },
          ],
          limit: limit,
          order: [["id", "DESC"]],
        });
        result = results;
      } else {
        const results = await db.Wishlist.findAll({
          where: { id: { [Op.lt]: last_id }, user_id: userData.id },
          attributes: {
            exclude: ["updatedAt", "user_id", "warehouse_stock_id"],
          },
          include: [
            {
              model: db.Warehouse_stock,
              attributes: {
                exclude: [
                  "updatedAt",
                  "createdAt",
                  "warehouse_id",
                  "product_id",
                ],
              },
              include: [
                {
                  model: db.Product,
                  attributes: { exclude: ["updatedAt", "createdAt"] },
                  include: [
                    {
                      model: db.Category,
                      as: "category",
                      attributes: {
                        exclude: ["updatedAt", "createdAt", "deletedAt"],
                      },
                    },
                    {
                      model: db.Image_product,
                      attributes: {
                        exclude: ["updatedAt", "createdAt", "id", "product_id"],
                      },
                    },
                  ],
                },
              ],
            },
          ],
          limit: limit,
          order: [["id", "DESC"]],
        });
        result = results;
      }

      res.status(200).json({
        ok: true,
        result: result,
        lastId: result.length ? result[result.length - 1].id : 0,
        hasMore: result.length >= limit ? true : false,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  getUserWishlistSpecificProduct: async (req, res) => {
    const userData = req.user;
    const { product } = req.params;

    try {
      const warehouseStockId = await db.Warehouse_stock.findOne({
        include: [{ model: db.Product, where: { name: product } }],
      });

      if (!warehouseStockId) {
        return res.status(404).json({
          ok: false,
          message: "this product not found",
        });
      }

      const userWishlist = await db.Wishlist.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          user_id: userData.id,
          warehouse_stock_id: warehouseStockId.id,
        },
      });

      return res.status(200).json({
        ok: true,
        result: userWishlist,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },
};
