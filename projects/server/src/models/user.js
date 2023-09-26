"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.User_detail, { foreignKey: "user_id" });
      User.hasMany(models.Order, { foreignKey: "user_id" });
      User.belongsTo(models.Role, { foreignKey: "role_id" });
      User.hasMany(models.Address_user, { foreignKey: "user_id" });
      User.hasMany(models.Cart, { foreignKey: "user_id" });
      User.hasMany(models.Wishlist, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
      password: DataTypes.STRING,
      verify_token: DataTypes.STRING,
      reset_password_token: DataTypes.STRING,
      is_verify: DataTypes.STRING,
      by_form: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
