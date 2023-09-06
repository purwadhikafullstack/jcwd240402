'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory_transfer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Inventory_transfer.belongsTo(models.Warehouse_stock, { foreignKey: "warehouse_stock_id" });
      Inventory_transfer.belongsTo(models.Warehouse, { as: "FromWarehouse", foreignKey: "from_warehouse_id" });
      Inventory_transfer.belongsTo(models.Warehouse, { as: "ToWarehouse", foreignKey: "to_warehouse_id" });
    }
  }
  Inventory_transfer.init({
    warehouse_stock_id: DataTypes.INTEGER,
    from_warehouse_id: DataTypes.INTEGER,
    to_warehouse_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    transaction_code: DataTypes.STRING,
    timestamp: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Pending', 'Approve','Reject'),
    },
  }, {
    sequelize,
    modelName: 'Inventory_transfer',
  });
  return Inventory_transfer;
};