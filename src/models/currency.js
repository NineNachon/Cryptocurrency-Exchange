'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Currency.hasMany(models.Wallet, {
        foreignKey: 'currency_id',
        as: 'wallets'
      });
      Currency.hasMany(models.Order, {
        foreignKey: 'base_currency_id',
        as: 'baseOrders'
      });
      Currency.hasMany(models.Order, {
        foreignKey: 'quote_currency_id',
        as: 'quoteOrders'
      });
      // define association here
    }
  }
  Currency.init({
    symbol: DataTypes.STRING,
    name: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Currency',
  });
  return Currency;
};