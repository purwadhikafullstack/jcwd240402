const db = require("../models");
const { getAllWarehouses, getOneWarehouse } = require("../service/warehouse");
const fs = require("fs");
const path = require("path");

module.exports = {
  async registerWarehouse(req, res) {
    const {
      address_warehouse,
      warehouse_name,
      city_id,
      province_id,
      latitude,
      longitude,
      warehouse_contact,
    } = req.body;

    const image = req.file?.filename;
    const warehouse_img = image
      ? `/photo-warehouse/${image}`
      : "/photo-warehouse/imgwarehousedefault.png";

    const transaction = await db.sequelize.transaction();

    try {
      const newWarehouse = await db.Warehouse.create(
        {
          address_warehouse,
          warehouse_name,
          city_id,
          province_id,
          latitude,
          longitude,
          warehouse_contact,
          warehouse_img,
        },
        { transaction }
      );

      await transaction.commit();
      return res.status(201).send({
        message: "Warehouse registration successful",
        data: newWarehouse,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async updateWarehouse(req, res) {
    const { id } = req.params;
    const editableFields = [
      "warehouse_name",
      "city_id",
      "warehouse_contact",
      "address_warehouse",
      "province_id",
      "latitude",
      "longitude",
    ];

    const t = await db.sequelize.transaction();

    try {
      const warehouse = await db.Warehouse.findByPk(id, { transaction: t });

      if (!warehouse) {
        await t.rollback();
        return res.status(404).send({ message: "Warehouse not found" });
      }

      editableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          warehouse[field] = req.body[field];
        }
      });

      await warehouse.save({ transaction: t });
      await t.commit();

      return res.status(200).send({
        message: "Warehouse updated successfully",
        data: warehouse,
      });
    } catch (error) {
      await t.rollback();
      console.error("Error:", error);
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  updateWarehouseImage: async (req, res) => {
    const { warehouse_name } = req.params;
    const image = req.file?.filename;
    const transaction = await db.sequelize.transaction();
    try {
      const warehouseData = await db.Warehouse.findOne({
        where: { warehouse_name },
      });
      if (!warehouseData) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "warehouse not found`",
        });
      }
      if (image) {
        const warehouseData = await db.Warehouse.findOne({
          where: { warehouse_name },
        });

        if (!warehouseData) {
          res.status(401).json({
            ok: false,
            message: "user data not found",
          });
        }
        const previousImageName = warehouseData
          .getDataValue("warehouse_img")
          ?.split("/")[2];

        if (!previousImageName) {
          await db.Warehouse.update(
            {
              warehouse_img: `/photo-warehouse/imgwarehousedefault.png`,
            },
            {
              where: { id: warehouseData.id },
            },
            transaction
          );
        }

        if (previousImageName) {
          if (previousImageName === "imgwarehousedefault.png") {
            await db.Warehouse.update(
              {
                warehouse_img: `/photo-warehouse/${image}`,
              },
              {
                where: { id: warehouseData.id },
              },
              transaction
            );
          }
          const imagePath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "server",
            "src",
            "public",
            "imgWarehouse",
            previousImageName
          );
          if (previousImageName !== "imgwarehousedefault.png") {
            fs.unlinkSync(imagePath);
            await db.Warehouse.update(
              {
                warehouse_img: `/photo-warehouse/${image}`,
              },
              {
                where: { id: warehouseData.id },
              },
              transaction
            );
          }
          await db.Warehouse.update(
            {
              warehouse_img: `/photo-warehouse/${image}`,
            },
            {
              where: { id: warehouseData.id },
            },
            transaction
          );
        }
      }
      const warehouseNewData = await db.Warehouse.findOne({
        where: { warehouse_name },
      });
      await transaction.commit();
      return res.json({
        ok: true,
        warehouse_name,
        warehouseNewData,
        message: "update image successful",
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).send({
        ok: false,
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getWarehouseByName(req, res) {
    const warehouseName = req.params.name;

    try {
      const response = await getOneWarehouse({ warehouse_name: warehouseName });

      if (response.success && response.data) {
        res.status(200).send({
          message: "Warehouse details retrieved successfully",
          warehouse: response.data,
        });
      } else if (response.success && !response.data) {
        res.status(404).send({
          message: "Warehouse not found",
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

  async getWarehouseList(req, res) {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.size) || 10;
    const searchName = req.query.searchName;
    const cityId = req.query.cityId;

    let options = {
      where: {},
      include: [
        {
          model: db.City,
          attributes: ["name"],
          include: [
            {
              model: db.Province,
              attributes: ["name"],
              
            },
          ],
        },
      ],
    };

    if (searchName) {
      options.where[db.Sequelize.Op.or] = [
        { warehouse_name: { [db.Sequelize.Op.like]: `%${searchName}%` } },
      ];
    }

    if (cityId) {
      options.where.city_id = cityId;
    }

    try {
      const response = await getAllWarehouses(options, page, perPage);

      if (response.success) {
        res.status(200).send({
          message: "Warehouse list retrieved successfully",
          warehouses: response.data,
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

  getAllWarehousesForUser: async (req, res) => {
    try {
      const result = await db.Warehouse.findAll({
        include: [{ model: db.City, include: [{ model: db.Province }] }],
        attributes: { exclude: ["updatedAt", "createdAt"] },
      });
      res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        ok: false,
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async deleteWarehouse(req, res) {
    try {
      const warehouseId = req.params.warehouseId;

      const warehouse = await db.Warehouse.findOne({
        where: { id: warehouseId },
      });

      if (!warehouse) {
        return res.status(404).json({ message: "Warehouse not found" });
      }

      await warehouse.destroy();

      res.status(200).json({ message: "Warehouse deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while deleting warehouse",
        error: error.message,
      });
    }
  },
};
