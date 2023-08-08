'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Admin.hasOne(models.Warehouse, { foreignKey: "warehouse_id"});
      Admin.belongsTo(models.Role, { foreignKey: "role_id"});
      Admin.hasMany(models.History_stock, { foreignKey: "admin_id" });
    }
  }
  Admin.init({
    firstName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};