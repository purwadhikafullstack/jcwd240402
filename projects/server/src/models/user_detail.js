'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_detail.belongsTo(models.User, { foreignKey: "user_id"});
    }
  }
  User_detail.init({
    first_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User_detail',
  });
  return User_detail;
};