'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      City.hasMany(models.Warehouse, { foreignKey: "city_id"});
      City.hasMany(models.Address_user, { foreignKey: "city_id" });
      City.belongsTo(models.Province, { foreignKey: "province_id"});
    }
  }
  City.init({
    name: DataTypes.STRING,
    province_id: DataTypes.STRING,
    postal_code: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    modelName: 'City',
  });
  return City;
};