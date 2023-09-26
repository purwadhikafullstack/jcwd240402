"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image_product.belongsTo(models.Product, { foreignKey: "product_id" });
    }
  }
  Image_product.init(
    {
      product_id: DataTypes.INTEGER,
      img_product: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Image_product",
      paranoid: true,
    }
  );
  return Image_product;
};
