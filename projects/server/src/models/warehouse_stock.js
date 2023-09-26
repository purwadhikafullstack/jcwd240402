"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Warehouse_stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Warehouse_stock.belongsTo(models.Product, { foreignKey: "product_id" });
      Warehouse_stock.belongsTo(models.Warehouse, {
        foreignKey: "warehouse_id",
        as: "Warehouse",
      });
      Warehouse_stock.hasMany(models.Inventory_transfer, {
        foreignKey: "warehouse_stock_id",
      });
      Warehouse_stock.hasMany(models.Order_detail, {
        foreignKey: "warehouse_stock_id",
      });
      Warehouse_stock.hasMany(models.Cart, {
        foreignKey: "warehouse_stock_id",
      });
      Warehouse_stock.hasMany(models.Wishlist, {
        foreignKey: "warehouse_stock_id",
      });
      Warehouse_stock.hasMany(models.History_stock, {
        foreignKey: "warehouse_stock_id",
      });
      Warehouse_stock.hasMany(models.Reserved_stock, {
        foreignKey: "warehouse_stock_id",
        as: "Reservations",
      });
    }
  }
  Warehouse_stock.init(
    {
      warehouse_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      product_stock: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Warehouse_stock",
      paranoid: true,
    }
  );
  return Warehouse_stock;
};
