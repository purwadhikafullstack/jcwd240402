"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Province.hasMany(models.City, { foreignKey: "province_id" });
      Province.hasMany(models.Address_user, { foreignKey: "province_id" });
      Province.hasMany(models.Warehouse, { foreignKey: "province_id" });
    }
  }
  Province.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Province",
    }
  );
  return Province;
};
