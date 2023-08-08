"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Address_user.belongsTo(models.user, { foreignKey: "address_user_id" });
      Address_user.belongsTo(models.City, { foreignKey: "city_id" });
      Address_user.belongsTo(models.Subdistrict, { foreignKey: "subdistrict_id" });
      Address_user.belongsTo(models.Province, { foreignKey: "province_id" });
      Address_user.hasOne(models.Order, { foreignKey: "address_user_id" });
    }
  }
  Address_user.init(
    {
      city_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      address_details: DataTypes.STRING,
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      address_title: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address_user",
    }
  );
  return Address_user;
};
