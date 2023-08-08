'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: "user_id" });
      Order.hasMany(models.Order_detail, { foreignKey: "order_id" });
      Order.belongsTo(models.Order_status, { foreignKey: "order_status_id" });
      Order.hasOne(models.Address_user, { foreignKey: "address_user_id" });
      Order.belongsTo(models.Warehouse, { foreignKey: "warehouse_id" });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    order_status_id: DataTypes.INTEGER,
    total_price: DataTypes.INTEGER,
    delivery_price: DataTypes.INTEGER,
    delivery_method: DataTypes.ENUM,
    delivery_time: DataTypes.STRING,
    tracking_code: DataTypes.STRING,
    no_invoice: DataTypes.STRING,
    user_address_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER,
    img_payment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};