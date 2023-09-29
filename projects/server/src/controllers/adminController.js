const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const Generate = require("../utils");
const { getAllAdmins, getOneAdmin } = require("../service/admin");
const { getAllCities } = require("../service/city");
const { getAllProvinces } = require("../service/province");
const { getAllCategories } = require("../service/category");
const { Sequelize } = require("sequelize");
const { getAllUsers } = require("../service/user");
const { autoStockTransfer } = require("../utils/index");
const { getAllUserOrder, getAllUserOrderDetails } = require("../service/order");
const { newStockHistory } = require("../service/warehouse_stock");
const { Op } = require("sequelize");
const Mailer = require("../utils/mailer");

const generateAccessToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      role_id: user.role_id,
      warehouse_id: user.warehouse_id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  return token;
};

const generateRefreshToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "24h" }
  );
  return token;
};

module.exports = {
  async loginAdmin(req, res) {
    try {
      const { username, password } = req.body;

      const user = await db.Admin.findOne({
        where: {
          username: username,
        },
      });

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          const accessToken = generateAccessToken(user);
          const refreshToken = generateRefreshToken(user);
          res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
          });
        } else {
          res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async adminInformation(req, res) {
    const adminData = req.user;

    try {
      const admin = await db.Admin.findOne({
        where: { id: adminData.id },
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: db.Warehouse,
            as: "warehouse",
            attributes: ["warehouse_name"],
          },
        ],
      });

      if (!admin) {
        return res.status(401).json({
          ok: false,
          message: "admin not found",
        });
      }
      return res.json({ ok: true, result: admin });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  async registerAdmin(req, res) {
    const { username, first_name, last_name, password, warehouse_id } =
      req.body;

    const t = await db.sequelize.transaction();

    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = await db.Admin.create(
        {
          username,
          role_id: 2,
          first_name,
          last_name,
          password: hashPassword,
          warehouse_id,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(201).send({
        message: "Registration Admin successful",
        data: {
          username: newUser.username,
          role_id: newUser.role_id,
        },
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async changeAdminPassword(req, res) {
    try {
      const { newPassword } = req.body;
      const { id } = req.params;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      await db.Admin.update({ password: hashPassword }, { where: { id } });

      res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Fatal error on server", errors: error.message });
    }
  },

  async assignWarehouse(req, res) {
    try {
      const id = req.params.id;
      const warehouseId = req.body.warehouse_id;

      await db.Admin.update(
        { warehouse_id: warehouseId },
        { where: { id: id } }
      );

      res
        .status(200)
        .send({ message: "Admin assigned to warehouse successfully" });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Fatal error on server", errors: error.message });
    }
  },

  async getAdminProfile(req, res) {
    try {
      const id = Number(req.query.id);

      const response = await getOneAdmin({
        where: { id: id },
        include: [
          {
            model: db.Warehouse,
            as: "warehouse",
          },
        ],
      });

      if (!response.success || !response.data) {
        res.status(404).send({
          message: "Admin not found",
        });
        return;
      }

      res.status(200).send({
        message: "Admin profile fetched successfully",
        admin: response.data,
      });
    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getAdminList(req, res) {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.size) || 10;
    const searchName = req.query.searchName;
    const warehouseId = req.query.warehouseId;

    const options = {
      where: {},
      include: [
        {
          model: db.Warehouse,
          as: "warehouse",
        },
      ],
    };

    if (searchName) {
      options.where[db.Sequelize.Op.or] = [
        { first_name: { [db.Sequelize.Op.like]: `%${searchName}%` } },
        { last_name: { [db.Sequelize.Op.like]: `%${searchName}%` } },
      ];
    }

    if (warehouseId) {
      options.where.warehouse_id = warehouseId;
    }

    try {
      const response = await getAllAdmins(options, page, perPage);

      if (response.success) {
        res.status(200).send({
          message: "Admin list retrieved successfully",
          admins: response.data,
          pagination: response.pagination,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getCitiesList(req, res) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.size) || 10;
    const provinceId = req.query.provinceId;
    const searchName = req.query.searchName;

    const filter = {};

    if (provinceId) {
      filter.province_id = provinceId;
    }

    if (searchName) {
      filter.name = { [db.Sequelize.Op.like]: `%${searchName}%` };
    }

    try {
      const response = await getAllCities(filter, page, pageSize);

      if (response.success) {
        res.status(200).send({
          message: "City list retrieved successfully",
          cities: response.data,
          pagination: response.pagination,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getProvincesList(req, res) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.size) || 5;
    const provinceId = req.query.provinceId;
    const searchName = req.query.searchName;

    const filter = {};

    if (provinceId) {
      filter.id = provinceId;
    }

    if (searchName) {
      filter.name = { [db.Sequelize.Op.like]: `%${searchName}%` };
    }

    try {
      const response = await getAllProvinces(filter, page, pageSize);

      if (response.success) {
        res.status(200).send({
          message: "Province list retrieved successfully",
          provinces: response.data,
          pagination: response.pagination,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getCategories(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 9) || 9;
    const name = req.query.name;

    const query = name ? { where: { name: name } } : {};

    try {
      const result = await getAllCategories(query, page, pageSize);
      if (result.success) {
        res.status(200).send(result);
      } else {
        res.status(500).send({
          success: false,
          message: "Error fetching categories.",
          errors: result.error,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "Fatal error on server.",
        errors: error.message,
      });
    }
  },

  async keepLogin(req, res) {
    const adminData = req.user;
    try {
      const isRefreshTokenExist = await db.Admin.findOne({
        where: { id: adminData.id },
      });

      if (!isRefreshTokenExist) {
        return res.status(401).json({
          ok: false,
          message: "token unauthorized",
        });
      }
      const accessToken = Generate.token(
        {
          id: isRefreshTokenExist.id,
          role_id: isRefreshTokenExist.role_id,
          warehouse_id: isRefreshTokenExist.warehouse_id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        "1h"
      );
      res.json({
        ok: true,
        message: "Access Token refreshed",
        accessToken,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  async deleteAdmin(req, res) {
    try {
      const adminId = req.params.adminId;

      const admin = await db.Admin.findOne({
        where: { id: adminId },
      });

      if (!admin) {
        return res.status(404).send({
          message: "Admin not found",
        });
      }

      if (admin.role_id === 1) {
        return res.status(403).send({
          message: "Cannot delete Super Admin",
        });
      }

      await admin.destroy();

      res.status(200).send({
        message: "Admin deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "An error occurred while deleting admin",
        error: error.message,
      });
    }
  },

  /* 

  STATUS PAYMENT ID 
1 = payment pending
2 = awaiting payment confirmation
3 = completed   
4 = In Process
5 = cancelled
6 = shipped
7 = rejected
*/

  async acceptPayment(req, res) {
    const orderId = req.params.id;
    const adminData = req.user;

    const t = await db.sequelize.transaction();

    try {
      const isAllowed = await db.Order.findOne({
        where: { id: orderId },
        transaction: t,
      });

      if (isAllowed.order_status_id === 4) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "you cannot accept the order twice",
        });
      }

      if (isAllowed.order_status_id === 1 || isAllowed.order_status_id === 7) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "user have to upload payment proof first",
        });
      }

      if (
        isAllowed.order_status_id === 3 ||
        isAllowed.order_status_id === 5 ||
        isAllowed.order_status_id === 6
      ) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "you cannot accept payment in this stage",
        });
      }

      const updatedOrder = await db.Order.update(
        { order_status_id: 4 },
        { where: { id: orderId }, transaction: t }
      );

      if (updatedOrder[0] === 0) {
        throw new Error("Order not found");
      }

      const reservedStocks = await db.Reserved_stock.findAll({
        where: { order_id: orderId },
        include: [
          {
            model: db.Warehouse_stock,
            as: "WarehouseProductReservation",
          },
        ],
        transaction: t,
      });

      if (!reservedStocks || reservedStocks.length === 0) {
        throw new Error("Reserved stocks not found");
      }

      for (let reservedStock of reservedStocks) {
        const warehouseStock = await db.Warehouse_stock.findOne({
          where: {
            warehouse_id:
              reservedStock.WarehouseProductReservation.warehouse_id,
            product_id: reservedStock.WarehouseProductReservation.product_id,
          },
          transaction: t,
        });
        if (!warehouseStock) {
          throw new Error(
            "Warehouse stock not found for product: " + reservedStock.product_id
          );
        }

        if (warehouseStock.product_stock < reservedStock.reserve_quantity) {
          const stockTransferResult = await autoStockTransfer(
            reservedStock.WarehouseProductReservation.warehouse_id,
            reservedStock.WarehouseProductReservation.product_id,
            reservedStock.reserve_quantity,
            reservedStock.order_id,
            adminData
          );

          if (stockTransferResult.status === "error") {
            throw new Error(
              "Failed to transfer stock for product " +
                reservedStock.product_id +
                ": " +
                stockTransferResult.message
            );
          }

          await warehouseStock.reload();
        }
        await warehouseStock.save({ transaction: t });
      }

      await t.commit();

      const user = await db.User.findOne({
        where: { id: isAllowed.user_id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const user_email = user.email;

      const notificationMessage = `
        Your payment has been successfully accepted. 
        Invoice Number: ${isAllowed.no_invoice}
        Thank you for your order!
      `;

      const mailData = {
        recipient_email: user_email,
        subject: "Payment Accepted",
        receiver: user.username,
        message: notificationMessage,
        redirect: false,
      };

      Mailer.sendEmail(mailData)
        .then(() => {
          res.status(200).json({
            ok: true,
            message: "Payment accepted, order is in process",
          });
        })
        .catch((emailError) => {
          throw new Error(emailError.message);
        });
    } catch (error) {
      if (t && !t.finished) {
        await t.rollback();
      }
      console.error(error);
      res.status(500).json({
        ok: false,
        message: error.message,
        error: error.message,
      });
    }
  },

  async rejectPayment(req, res) {
    const orderId = req.params.id;

    const t = await db.sequelize.transaction();

    try {
      const isAllowed = await db.Order.findOne({
        where: { id: orderId },
      });

      if (isAllowed.order_status_id === 7) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "you cannot reject the order twice",
        });
      }

      if (isAllowed.order_status_id === 1) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "The user has not uploaded the payment proof yet",
        });
      }

      if (isAllowed.order_status_id === 5) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message:
            "The order has been canceled, you cannot cancel the rejected order",
        });
      }

      if (
        isAllowed.order_status_id === 3 ||
        isAllowed.order_status_id === 4 ||
        isAllowed.order_status_id === 6
      ) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "you cannot reject the order in this stage",
        });
      }

      const updatedOrder = await db.Order.update(
        { order_status_id: 7 },
        { where: { id: orderId } }
      );

      if (updatedOrder[0] === 0) {
        throw new Error("Order not found");
      }
      await t.commit();
      const user = await db.User.findOne({
        where: { id: isAllowed.user_id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const user_email = user.email;

      const notificationMessage = `
        Your payment has been rejected. 
        Invoice Number: ${isAllowed.no_invoice}
        Please contact customer service for more details.
        `;

      const mailData = {
        recipient_email: user_email,
        subject: "Payment Rejected",
        receiver: user.username,
        message: notificationMessage,
        redirect: false,
      };

      Mailer.sendEmail(mailData)
        .then(() => {
          res.status(200).json({ ok: true, message: "Payment rejected" });
        })
        .catch((emailError) => {
          throw new Error(emailError.message);
        });
    } catch (error) {
      if (t && !t.finished) {
        await t.rollback();
      }
      console.error(error);
      res.status(500).json({
        ok: false,
        message: "An error occurred while rejecting payment",
        error: error.message,
      });
    }
  },

  async sendUserOrder(req, res) {
    const orderId = req.params.id;
    const adminData = req.user;

    const t = await db.sequelize.transaction();

    try {
      const isAllowed = await db.Order.findOne({
        where: { id: orderId },
      });

      if (!isAllowed) {
        await t.rollback();
        return res.status(404).json({
          ok: false,
          message: "Order not found",
        });
      }

      if (isAllowed.order_status_id === 6) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "you cannot ship the order twice",
        });
      }

      if (isAllowed.order_status_id === 3) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "this order already completed",
        });
      }

      if (isAllowed.order_status_id === 1 || isAllowed.order_status_id === 2) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "you have to approve the payment first",
        });
      }

      if (isAllowed.order_status_id === 5 || isAllowed.order_status_id === 7) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message:
            "the order has been canceled or rejected, you cannot ship the orderx",
        });
      }

      const reservedStocks = await db.Reserved_stock.findAll({
        where: { order_id: orderId },
        include: [
          {
            model: db.Order,
            include: [
              {
                model: db.Warehouse,
                include: [
                  {
                    model: db.Admin,
                  },
                ],
              },
            ],
          },
          {
            model: db.Warehouse_stock,
            as: "WarehouseProductReservation",
          },
        ],
      });

      for (let reservedStock of reservedStocks) {
        if (
          reservedStock.WarehouseProductReservation.product_stock -
            reservedStock.reserve_quantity <
          0
        ) {
          await t.rollback();
          return res.status(400).json({
            ok: false,
            message: "cannot send order because there is not enough stock",
          });
        }

        const warehouseStockUpdate = await db.Warehouse_stock.update(
          {
            product_stock:
              reservedStock.WarehouseProductReservation.product_stock -
              reservedStock.reserve_quantity,
          },
          {
            where: { id: reservedStock.WarehouseProductReservation.id },
            transaction: t,
          }
        );

        const stockHistory = newStockHistory(
          reservedStock.WarehouseProductReservation.id,
          reservedStock.WarehouseProductReservation.warehouse_id,
          adminData.id,
          reservedStock.WarehouseProductReservation.product_stock,
          reservedStock.WarehouseProductReservation.product_stock -
            reservedStock.reserve_quantity,
          reservedStock.reserve_quantity,
          "Transaction"
        );

        const reservedStockDestroy = await db.Reserved_stock.destroy({
          where: {
            order_id: orderId,
            warehouse_stock_id: reservedStock.WarehouseProductReservation.id,
          },
          include: [
            {
              model: db.Warehouse_stock,
              as: "WarehouseProductReservation",
            },
          ],
          transaction: t,
        });
      }

      const updatedOrder = await db.Order.update(
        {
          order_status_id: 6,
          tracking_code: Math.floor(Math.random() * 1000000000000000),
          delivery_time: new Date(),
        },
        { where: { id: orderId }, transaction: t }
      );

      if (updatedOrder[0] === 0) {
        throw new Error("Order not found");
      }

      await t.commit();

      const user = await db.User.findOne({
        where: { id: isAllowed.user_id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const user_email = user.email;

      const notificationMessage = `
        Your order has been shipped. 
        Invoice Number: ${isAllowed.no_invoice}
        Thank you for your order!
      `;

      const mailData = {
        recipient_email: user_email,
        subject: "Order Shipped",
        receiver: user.username,
        message: notificationMessage,
        redirect: false,
      };

      Mailer.sendEmail(mailData)
        .then(() => {
          res.status(200).json({
            ok: true,
            message: "order has been shipped",
            test: reservedStocks,
          });
        })
        .catch((emailError) => {
          throw new Error(emailError.message);
        });
    } catch (error) {
      if (t && !t.finished) {
        await t.rollback();
      }
      console.error(error);
      res.status(500).json({
        ok: false,
        message: "An error occurred while shipping order",
        error: error.message,
      });
    }
  },

  async CancelUserOrder(req, res) {
    const orderId = req.params.id;

    const t = await db.sequelize.transaction();

    try {
      const isAllowed = await db.Order.findOne({
        where: { id: orderId },
      });

      /* selama fase reject dari admin, kan nunggu pembayaran user, itu admin boleh cancel ga? */

      if (isAllowed.order_status_id === 5) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "you cannot cancel twice",
        });
      }

      if (
        isAllowed.order_status_id === 3 ||
        isAllowed.order_status_id === 4 ||
        isAllowed.order_status_id === 5 ||
        isAllowed.order_status_id === 6 ||
        isAllowed.order_status_id === 7
      ) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: "you cannot cancel the order",
        });
      }

      const updatedOrder = await db.Order.update(
        { order_status_id: 5, transaction: t },
        { where: { id: orderId } }
      );

      if (updatedOrder[0] === 0) {
        throw new Error("Order not found");
      }

      await db.Reserved_stock.destroy({
        where: { order_id: orderId },
        include: [
          {
            model: db.Warehouse_stock,
            as: "WarehouseProductReservation",
          },
        ],
        transaction: t,
      });

      await t.commit();
      const user = await db.User.findOne({
        where: { id: isAllowed.user_id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const user_email = user.email;

      const notificationMessage = `
        Your payment has been rejected. 
        Invoice Number: ${isAllowed.no_invoice}
        Please contact customer service for more details.
        `;

      const mailData = {
        recipient_email: user_email,
        subject: "Payment Cancelled",
        receiver: user.username,
        message: notificationMessage,
        redirect: false,
      };

      Mailer.sendEmail(mailData)
        .then(() => {
          res.status(200).json({ ok: true, message: "Payment Cancelled" });
        })
        .catch((emailError) => {
          throw new Error(emailError.message);
        });
    } catch (error) {
      if (t && !t.finished) {
        await t.rollback();
      }
      console.error(error);
      res.status(500).json({
        ok: false,
        message: "An error occurred while canceling order",
        error: error.message,
      });
    }
  },

  async getUserOrder(req, res) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.size) || 10;
    const order_status_id = req.query.orderStatusId;
    const warehouse_id = req.query.warehouseId;
    const searchName = req.query.searchName;
    const year = req.query.year;
    const month = req.query.month;

    const options = {
      where: {},
    };

    const filter3 = {};

    if (order_status_id) {
      options.where.order_status_id = order_status_id;
    }

    if (warehouse_id) {
      options.where.warehouse_id = warehouse_id;
    }

    if (searchName) {
      options.where.name = { [db.Sequelize.Op.like]: `%${searchName}%` };
    }

    if (month && year) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(
          Sequelize.fn("MONTH", Sequelize.col("createdAt")),
          month
        ),
        Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("createdAt")), year),
      ];
    } else if (year) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(Sequelize.fn("YEAR", Sequelize.col("createdAt")), year),
      ];
    } else if (month) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(
          Sequelize.fn("MONTH", Sequelize.col("createdAt")),
          month
        ),
      ];
    }

    try {
      const response = await getAllUserOrder(options, filter3, page, pageSize);

      if (response.success) {
        res.status(200).send({
          message: "Order list retrieved successfully",
          orders: response.data,
          pagination: response.pagination,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getUsersList(req, res) {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.size) || 10;
    const searchName = req.query.searchName;

    const options = {
      where: {},
    };

    if (searchName) {
      options.where[db.Sequelize.Op.or] = [
        {
          username: { [db.Sequelize.Op.like]: `%${searchName}%` },
        },
      ];
    }

    try {
      const response = await getAllUsers(options, page, perPage);

      if (response.success) {
        res.status(200).send({
          message: "User list retrieved successfully",
          users: response.data,
          pagination: response.pagination,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getUserOrderDetails(req, res) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.size) || 10;
    const warehouse_id = req.query.warehouseId;
    const category_id = req.query.categoryId;
    const product_id = req.query.productId;
    const searchName = req.query.searchName;

    const filter = {};
    const filter2 = {};
    const filter3 = {};

    if (product_id) {
      filter3.id = product_id;
    }

    if (category_id) {
      filter3.category_id = category_id;
    }

    if (warehouse_id) {
      filter2.warehouse_id = warehouse_id;
    }

    if (searchName) {
      filter.name = { [db.Sequelize.Op.like]: `%${searchName}%` };
    }

    try {
      const response = await getAllUserOrderDetails(
        filter,
        filter2,
        filter3,
        page,
        pageSize
      );

      if (response.success) {
        res.status(200).send({
          message: "Order list retrieved successfully",
          orders: response.data,
          pagination: response.pagination,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async salesReport(req, res) {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.size) || 10;
    const warehouse_id = req.query.warehouseId;
    const category_id = req.query.categoryId;
    const product_id = req.query.productId;
    const year = req.query.year;
    const month = req.query.month;

    let options = {
      where: {},
    };

    const filter3 = {};

    options.where.order_status_id = 3;

    if (product_id) {
      filter3.id = product_id;
    }

    if (category_id) {
      filter3.category_id = category_id;
    }

    if (warehouse_id) {
      options.where.warehouse_id = warehouse_id;
    }

    if (month && year) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(
          Sequelize.fn("MONTH", Sequelize.col("delivery_time")),
          month
        ),
        Sequelize.where(
          Sequelize.fn("YEAR", Sequelize.col("delivery_time")),
          year
        ),
      ];
    } else if (year) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(
          Sequelize.fn("YEAR", Sequelize.col("delivery_time")),
          year
        ),
      ];
    } else if (month) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(
          Sequelize.fn("MONTH", Sequelize.col("delivery_time")),
          month
        ),
      ];
    }

    try {
      const response = await getAllUserOrderDetails(
        options,
        filter3,
        page,
        perPage
      );

      const responseAll = await getAllUserOrderDetails(
        options,
        filter3,
        null,
        null
      );

      const userOrder = response.data;
      const userOrderAll = responseAll.data;

      const totalOnly = [];
      const availableWarehouseStock = [];

      const notNull = userOrder.map((m) => {
        if (m.Warehouse_stock) {
          availableWarehouseStock.push(m);
        }
      });

      const orderMap = userOrderAll.map((m) => {
        if (m.Warehouse_stock) {
          totalOnly.push(m.Warehouse_stock.Product.price * m.quantity);
        }
      });

      const totalPrice = totalOnly.reduce((total, n) => total + n, 0);

      res.status(201).send({
        message: "successfully get sales report",
        sales_report: totalPrice,
        order_details: availableWarehouseStock,
        pagination: response.pagination,
      });
    } catch (error) {
      res.status(500).send({
        message: "fatal error on server",
        error: error.message,
      });
    }
  },

  async getAvailableYear(req, res) {
    const dbChoice = req.query.db || "";
    const timeColumn = req.query.timeColumn || "";

    try {
      if (dbChoice == "order" && timeColumn == "created") {
        const response = await db.Order.findAll({});

        const availableYear = response.map((year) => {
          if (year.createdAt) {
            return year.createdAt.getFullYear();
          }
        });

        const uniqueYear = [...new Set(availableYear)];

        res.json({
          ok: true,
          year: uniqueYear.sort(function (a, b) {
            return b - a;
          }),
        });
      } else if (dbChoice == "history") {
        const response = await db.History_stock.findAll({});

        const availableYear = response.map((year) => {
          if (year.timestamp) {
            return year.timestamp.getFullYear();
          }
        });

        const uniqueYear = [...new Set(availableYear)];

        res.json({
          ok: true,
          year: uniqueYear.sort(function (a, b) {
            return b - a;
          }),
        });
      } else {
        const response = await db.Order.findAll({
          where: {
            delivery_time: { [Op.not]: null },
          },
        });

        const availableYear = response.map((year) => {
          if (year.delivery_time) {
            return year.delivery_time.getFullYear();
          }
        });

        const uniqueYear = [...new Set(availableYear)];

        res.json({
          ok: true,
          year: uniqueYear.sort(function (a, b) {
            return b - a;
          }),
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },
};
