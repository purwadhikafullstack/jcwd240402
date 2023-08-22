const db = require("../../models");
const { Sequelize } = require("sequelize");
const { getAllWarehouses, newStockHistory, getAllStockHistory } = require("../../service/warehouse");

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
    const warehouseId = req.params.id;
  
    const {
      warehouse_name,
      city_id,
      warehouse_contact,
      address_warehouse,
    } = req.body;
  
    try {
      const warehouse = await db.Warehouse.findByPk(warehouseId);
      if (!warehouse) {
        return res.status(404).send({
          message: "Warehouse not found",
        });
      }
  
      if (warehouse_name) warehouse.warehouse_name = warehouse_name;
      if (city_id) warehouse.city_id = city_id;
      if (warehouse_contact) warehouse.warehouse_contact = warehouse_contact;
      if (address_warehouse) {
        warehouse.address_warehouse = address_warehouse;
        warehouse.latitude = req.body.latitude;
        warehouse.longitude = req.body.longitude;
      }
  
      await warehouse.save();
  
      return res.status(200).send({
        message: "Warehouse updated successfully",
        data: warehouse,
      });
    } catch (error) {
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

  async testAddStockHistoryStock(req, res) {
  
    const {
      warehouse_id,
      product_id,
      amount,
    } = req.body;
  
    try {
      const warehouseStockData = await db.Warehouse_stock.findOne({
        where: {
          warehouse_id: warehouse_id,
          product_id: product_id
        },
      });

      const beforeStock = warehouseStockData.product_stock

      warehouseStockData.product_stock = beforeStock + amount;

      await warehouseStockData.save();

      await newStockHistory(
        warehouseStockData.id, warehouse_id, 1, 
        beforeStock, warehouseStockData.product_stock, amount,"add stock")
  
      return res.status(200).send({
        message: "Stock Added successfully",
        data: warehouseStockData,
      });
    } catch (error) {
      res.status(500).send({
        message: "Fatal error on server",
        errors: error.message,
      });
    }
  },

  async getStockHistoryList(req, res) {

    const d = new Date();

    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.size) || 10;
    const loggedAdmin = req.query.loggedAdmin;
    const warehouseId = req.query.warehouseId;
    const year = req.query.year
    const month = req.query.month

    let options = {
      where: {},
    };

    if (loggedAdmin) {
      options.where.admin_id = loggedAdmin;
    }

    if (warehouseId) {
      options.where.warehouse_id = warehouseId;
    }

    if (year) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('timestamp')), year),
      ];
    }

    if (month) {
      options.where[db.Sequelize.Op.and] = [
        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('timestamp')), month),
      ];
    }

    try {
      const response = await getAllStockHistory(options, page, perPage);

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

};
