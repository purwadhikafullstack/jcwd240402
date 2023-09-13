"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookmark extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookmark.belongsTo(models.User, { foreignKey: "user_id" });
      Bookmark.belongsTo(models.Warehouse_stock, {
        foreignKey: "warehouse_stock_id",
      });
    }
  }
  Bookmark.init(
    {
      user_id: DataTypes.INTEGER,
      warehouse_stock_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Bookmark",
    }
  );
  return Bookmark;
};
