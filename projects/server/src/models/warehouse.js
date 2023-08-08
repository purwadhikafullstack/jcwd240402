'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Warehouse.belongsTo(models.Admin, { foreignKey: "warehouse_id"});
      Warehouse.belongsTo(models.City, { foreignKey: "city_id"});
      Warehouse.belongsTo(models.Subdistrict, { foreignKey: "subdistrict_id"});
      Warehouse.belongsTo(models.Province, { foreignKey: "province_id"});
      Warehouse.hasMany(models.Order, { foreignKey: "warehouse_id" });
      Warehouse.hasMany(models.Inventory_transfer, { foreignKey: "warehouse_id" });
      Warehouse.hasMany(models.History_stock, { foreignKey: "warehouse_id" });
    }
  }
  Warehouse.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Warehouse',
  });
  return Warehouse;
};