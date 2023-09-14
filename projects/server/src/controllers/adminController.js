const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const Generate = require("../utils");
const { getAllAdmins, getOneAdmin } = require("../service/admin");
const { getAllCities } = require("../service/city");
const { getAllProvinces } = require("../service/province");
const { getAllCategories } = require("../service/category");
// const { generateAccessToken, generateRefreshToken } = require("../utils/index")

// move to utility later
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
        include:[
          {
            model:db.Warehouse,
            as: 'warehouse',
            attributes: ["warehouse_name"]
          }
        ]
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
    const pageSize = Number(req.query.size) || 10;
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


};
