'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.User_detail, { foreignKey: "user_id"});
      User.hasMany(models.Order, { foreignKey: "user_id" });
      User.belongsTo(models.Role, { foreignKey: "role_id" });
      User.hasMany(models.Address_user, { foreignKey: "address_user_id"});
      User.hasMany(models.Cart, { foreignKey: "user_id" });
    }
  }
  User.init({
    firstName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};