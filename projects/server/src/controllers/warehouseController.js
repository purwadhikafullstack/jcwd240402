const db = require("../models");
const { getAllWarehouses,getOneWarehouse } = require("../service/warehouse");

module.exports = {
  async registerWarehouse(req, res) {
    const {
      address_warehouse,
      warehouse_name,
      city_id,
      latitude,
      longitude,
      warehouse_contact,
    } = req.body;

    try {
      const newWarehouse = await db.Warehouse.create({
        address_warehouse,
        warehouse_name,
        city_id,
        latitude,
        longitude,
        warehouse_contact,
      });

      return res.status(201).send({
        message: "Warehouse registration successful",
        data: newWarehouse,
      });
    } catch (error) {
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
      "latitude",
      "longitude"
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
  
  async getWarehouseByName(req, res) {
    const warehouseName = req.params.name;
  
    try {
      const response = await getOneWarehouse({ warehouse_name: warehouseName });
  
      if (response.success && response.data) {
        res.status(200).send({
          message: "Warehouse details retrieved successfully",
          warehouse: response.data
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
        errors: error.message
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

  async deleteWarehouse(req, res) {
    try {
      const warehouseId = req.params.warehouseId;

      const warehouse = await db.Warehouse.findOne({
        where: { id: warehouseId },
      });

      if (!warehouse) {
        return res.status(404).json({ message: 'Warehouse not found' });
      }

      await warehouse.destroy();

      res.status(200).json({ message: 'Warehouse deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while deleting warehouse', error: error.message });
    }
  },
};
