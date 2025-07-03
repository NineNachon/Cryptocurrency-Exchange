'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Order.belongsTo(models.Currency, { foreignKey: 'base_currency_id', as: 'baseCurrency' });
      Order.belongsTo(models.Currency, { foreignKey: 'quote_currency_id', as: 'quoteCurrency' });
      Order.belongsTo(models.Trade, { foreignKey: 'order_id', as: 'trades' });
      // define association here
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    base_currency_id: DataTypes.INTEGER,
    quote_currency_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    amount: DataTypes.DECIMAL,
    remaining_amount: DataTypes.DECIMAL,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};