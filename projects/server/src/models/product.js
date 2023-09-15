'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
      Product.hasMany(models.Image_product, { foreignKey: "product_id" });
      Product.hasMany(models.Warehouse_stock, { foreignKey: "product_id" });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Product',
    paranoid: true, 
  });
  return Product;
};