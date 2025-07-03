// src/models/user.js
'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs'); // <-- import bcrypt

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // ความสัมพันธ์จะมาเพิ่มตรงนี้
      User.hasMany(models.Wallet, { foreignKey: 'user_id', as: 'wallets' });
      User.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
      User.hasMany(models.Order, { foreignKey: 'user_id', as: 'transactions' });
      User.hasMany(models.Order, { foreignKey: 'user_id', as: 'buyTrades' });
      User.hasMany(models.Order, { foreignKey: 'user_id', as: 'sellTrades' });
    }
    // Method สำหรับเช็ครหัสผ่าน
    async validatePassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }
  User.init({
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      // Hook ที่จะทำงานก่อนสร้าง User ใหม่เสมอ
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  });
  return User;
};