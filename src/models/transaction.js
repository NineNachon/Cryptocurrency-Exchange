'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Transaction.belongsTo(models.Wallet, { foreignKey: 'wallet_id', as: 'wallet' });
    }
  }
  Transaction.init({
    user_id: DataTypes.INTEGER,
    wallet_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    external_address: DataTypes.STRING,
    transaction_hash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};