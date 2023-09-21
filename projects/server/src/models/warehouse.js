"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Warehouse.hasMany(models.Admin, { foreignKey: "warehouse_id" });
      Warehouse.belongsTo(models.City, { foreignKey: "city_id" });
      Warehouse.belongsTo(models.Province, { foreignKey: "province_id" });
      Warehouse.hasMany(models.Order, { foreignKey: "warehouse_id" });
      Warehouse.hasMany(models.Inventory_transfer, {
        foreignKey: "warehouse_id",
      });
      Warehouse.hasMany(models.History_stock, { foreignKey: "warehouse_id" });
      Warehouse.hasMany(models.Warehouse_stock, { foreignKey: "warehouse_id" });
    }
  }
  Warehouse.init(
    {
      address_warehouse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      warehouse_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      latitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      warehouse_contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      warehouse_img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Warehouse",
      paranoid: true,
    }
  );
  return Warehouse;
};
