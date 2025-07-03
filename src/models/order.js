'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // 1 Order เป็นของ 1 User
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      
      // --- ความสัมพันธ์กับ Trade ---
      // 1 Order สามารถมีได้หลาย Trade (ในกรณีที่ถูกซื้อไปทีละส่วน)
      Order.hasMany(models.Trade, { foreignKey: 'order_id' }); // <-- ตรวจสอบว่าตรงนี้ถูกต้อง

      // ความสัมพันธ์กับ Currency (สำหรับ base และ quote)
      Order.belongsTo(models.Currency, { as: 'baseCurrency', foreignKey: 'base_currency_id' });
      Order.belongsTo(models.Currency, { as: 'quoteCurrency', foreignKey: 'quote_currency_id' });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    type: DataTypes.ENUM('BUY', 'SELL'),
    base_currency_id: DataTypes.INTEGER,
    quote_currency_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    amount: DataTypes.DECIMAL,
    remaining_amount: DataTypes.DECIMAL,
    status: DataTypes.ENUM('OPEN', 'PARTIALLY_FILLED', 'FILLED', 'CANCELLED')
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};