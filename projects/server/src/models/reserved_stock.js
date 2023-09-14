"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reserved_stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reserved_stock.belongsTo(models.Warehouse_stock, { foreignKey: "warehouse_stock_id", as: 'WarehouseProductReservation' });
      Reserved_stock.belongsTo(models.Order, { foreignKey: "order_id" });
    }
  }
  Reserved_stock.init(
    {
      warehouse_stock_id: DataTypes.INTEGER,
      order_id: DataTypes.INTEGER,
      reserve_quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Reserved_stock",
    }
  );
  return Reserved_stock;
};
