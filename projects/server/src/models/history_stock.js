'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History_stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History_stock.belongsTo(models.Warehouse_stock, { foreignKey: "warehouse_stock_id" });
      History_stock.belongsTo(models.Warehouse, { foreignKey: "warehouse_id" });
      History_stock.belongsTo(models.Admin, { foreignKey: "admin_id" });
    }
  }
  History_stock.init({
    warehouse_stock_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER,
    admin_id: DataTypes.INTEGER,
    stock_before_transfer: DataTypes.INTEGER,
    stock_after_transfer: DataTypes.INTEGER,
    increment_decrement: {
      type: DataTypes.ENUM('Increment', 'Decrement'),
    },
    quantity: DataTypes.INTEGER,
    journal: DataTypes.STRING,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'History_stock',
  });
  return History_stock;
};