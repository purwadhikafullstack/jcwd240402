const db = require("../models");

module.exports = {
  addToCart: async (req, res) => {
    const userData = req.user;
    const { product_name, qty } = req.body;
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

      const productIdByName = await db.Product.findOne({
        where: { name: product_name },
      });

      if (!productIdByName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }

      const reservedStock = await db.Reserved_stock.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: db.Warehouse_stock,
          as: "WarehouseProductReservation",
          where: { product_id: productIdByName.id },
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      });

      const getReservedStockValue = reservedStock.map((item) => {
        return item.reserve_quantity;
      });
      let reservedStockTotal = 0;
      if (getReservedStockValue.length !== 0) {
        reservedStockTotal = getReservedStockValue.reduce((acc, cv) => {
          return acc + cv;
        });
      }

      const countTotalStock = await db.Warehouse_stock.findAll({
        attributes: { exclude: ["updatedAt", "createdAt"] },
        include: [
          {
            model: db.Product,
            as: "Product",
            attributes: { exclude: ["updatedAt"] },
            where: { name: product_name, is_active: true },
          },
        ],
      });

      const getTotalStockValue = countTotalStock.map((item) => {
        return item.product_stock;
      });
      let totalStockValue = 0;
      if (getTotalStockValue.length !== 0) {
        totalStockValue = getTotalStockValue.reduce((acc, cv) => {
          return acc + cv;
        });
      }

      const remainingStock = totalStockValue - reservedStockTotal;

      if (qty > remainingStock) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "Stock limited! Please refresh page.",
        });
      }

      const getWarehouseStockIdByProductName = await db.Warehouse_stock.findOne(
        {
          where: { product_id: productIdByName.id },
        }
      );

      if (!getWarehouseStockIdByProductName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "the product stock is not available ",
        });
      }

      const isCartExist = await db.Cart.findOne({
        where: {
          user_id: userData.id,
          warehouse_stock_id: getWarehouseStockIdByProductName.id,
        },
      });

      if (isCartExist) {
        await db.Cart.update(
          {
            quantity: isCartExist.quantity + Number(qty),
          },
          {
            where: {
              user_id: userData.id,
              warehouse_stock_id: getWarehouseStockIdByProductName.id,
            },
            transaction,
          }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "cart updated",
        });
      }

      const limitMaxFive = await db.Cart.findAll({
        where: { user_id: userData.id },
      });

      if (limitMaxFive.length >= 5) {
        await transaction.rollback();
        return res.status(401).json({
          ok: false,
          message: "you only can add 5 item to your cart",
        });
      }
      await db.Cart.create(
        {
          user_id: userData.id,
          warehouse_stock_id: getWarehouseStockIdByProductName.id,
          quantity: Number(qty),
        },
        { transaction }
      );
      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "add to cart successful",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  getUserCart: async (req, res) => {
    const userData = req.user;

    try {
      const result = await db.Cart.findAll({
        where: { user_id: userData.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.Warehouse_stock,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: db.Product,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                  {
                    model: db.Category,
                    as: "category",
                    attributes: {
                      exclude: ["createdAt", "updatedAt", "deletedAt"],
                    },
                  },
                  {
                    model: db.Image_product,
                    attributes: { exclude: ["updatedAt", "createdAt"] },
                  },
                ],
              },
              {
                model: db.Warehouse,
                as: "Warehouse",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
        ],
      });

      let total = 0;
      let totalweight = 0;
      for (const item of result) {
        total +=
          Number(item.Warehouse_stock.Product.price) * Number(item.quantity);
      }

      for (const item of result) {
        totalweight +=
          Number(item.Warehouse_stock.Product.weight) * Number(item.quantity);
      }

      res.json({
        ok: true,
        result,
        total: total,
        total_weight: totalweight,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  cancelCart: async (req, res) => {
    const userData = req.user;
    const { productName } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      const productIdByName = await db.Product.findOne({
        where: { name: productName },
      });

      if (!productIdByName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }
      const getWarehouseStockIdByProductName = await db.Warehouse_stock.findOne(
        {
          where: { product_id: productIdByName.id },
        }
      );

      if (!getWarehouseStockIdByProductName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "the product stock is not available ",
        });
      }
      const isCartExist = await db.Cart.findOne({
        where: {
          user_id: userData.id,
          warehouse_stock_id: getWarehouseStockIdByProductName.id,
        },
      });

      if (!isCartExist) {
        await transaction.rollback();
        return res.status(404).json({
          ok: true,
          message: "cart is empty",
        });
      }

      await db.Cart.destroy({
        where: {
          user_id: userData.id,
          warehouse_stock_id: getWarehouseStockIdByProductName.id,
        },
        transaction,
      });
      await transaction.commit();
      res.status(200).json({
        ok: true,
        message: "cart deleted",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  updateCart: async (req, res) => {
    const userData = req.user;
    const { product_name, qty } = req.body;
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

      const productIdByName = await db.Product.findOne({
        where: { name: product_name },
      });

      if (!productIdByName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }
      const getWarehouseStockIdByProductName = await db.Warehouse_stock.findOne(
        {
          where: { product_id: productIdByName.id },
        }
      );

      if (!getWarehouseStockIdByProductName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "the product stock is not available ",
        });
      }

      const isCartExist = await db.Cart.findOne({
        where: {
          user_id: userData.id,
          warehouse_stock_id: getWarehouseStockIdByProductName.id,
        },
      });
      if (!isCartExist) {
        await db.Cart.create(
          {
            user_id: userData.id,
            warehouse_stock_id: getWarehouseStockIdByProductName.id,
            quantity: Number(qty),
          },
          { transaction }
        );
        await transaction.commit();
        res.status(201).json({
          ok: true,
          message: "add to cart successful",
        });
      }
      await db.Cart.update(
        {
          quantity: Number(qty),
        },
        {
          where: {
            user_id: userData.id,
            warehouse_stock_id: getWarehouseStockIdByProductName.id,
          },
          transaction,
        }
      );
      await transaction.commit();
      return res.status(201).json({
        ok: true,
        message: "cart updated",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  cancelCartListWhenOrder: async (req, res) => {
    const userData = req.user;
    const { cart_data } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const result = cart_data.map((item) => {
        return item.Warehouse_stock?.id;
      });

      for (let i = 0; i < result.length; i++) {
        await db.Cart.destroy(
          {
            where: { warehouse_stock_id: result[i], user_id: userData.id },
          },
          transaction
        );
      }

      await transaction.commit();
      return res.status(201).json({
        ok: true,
        message: "delete cart successful",
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
};
