'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Definindo as associações
      Users.belongsTo(models.Situations, {foreignKey: 'situationId'});
    }
  }
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    situationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};