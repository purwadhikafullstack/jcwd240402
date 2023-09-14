"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wishlist.belongsTo(models.User, { foreignKey: "user_id" });
      Wishlist.belongsTo(models.Warehouse_stock, {
        foreignKey: "warehouse_stock_id",
      });
    }
  }
  Wishlist.init(
    {
      user_id: DataTypes.INTEGER,
      warehouse_stock_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Wishlist",
    }
  );
  return Wishlist;
};
