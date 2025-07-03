'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trade extends Model {
    static associate(models) {
      // 1 Trade เป็นส่วนหนึ่งของ 1 Order
      Trade.belongsTo(models.Order, { foreignKey: 'order_id' }); // <-- ตรวจสอบว่าตรงนี้ถูกต้อง

      // 1 Trade มีผู้ซื้อ 1 คน
      Trade.belongsTo(models.User, { as: 'buyer', foreignKey: 'buyer_id' });

      // 1 Trade มีผู้ขาย 1 คน
      Trade.belongsTo(models.User, { as: 'seller', foreignKey: 'seller_id' });
    }
  }
  Trade.init({
    order_id: DataTypes.INTEGER,
    buyer_id: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Trade',
  });
  return Trade;
};