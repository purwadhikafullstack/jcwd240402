'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subdistrict extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subdistrict.hasOne(models.Warehouse, { foreignKey: "subdistrict_id"});
      Subdistrict.hasMany(models.User_address, { foreignKey: "subdistrict_id"});
      Subdistrict.belongsTo(models.City, { foreignKey: "city_id"});
    }
  }
  Subdistrict.init({
    city_id: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subdistrict',
  });
  return Subdistrict;
};