'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order_detail.belongsTo(models.Order, { foreignKey: "order_id" });
      Order_detail.belongsTo(models.Warehouse_stock, { foreignKey: "warehouse_stock_id" });
    }
  }
  Order_detail.init({
    order_id: DataTypes.INTEGER,
    warehouse_stock_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order_detail',
  });
  return Order_detail;
};