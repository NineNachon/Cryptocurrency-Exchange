'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wallet.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
      Wallet.belongsTo(models.Currency, { foreignKey: 'currency_id', as: 'currency' }); 
      Wallet.hasMany(models.Transaction, { foreignKey: 'wallet_id', as: 'transactions' });    
      // define association here
    }
  }
  Wallet.init({
    user_id: DataTypes.INTEGER,
    currency_id: DataTypes.INTEGER,
    balance: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  return Wallet;
};