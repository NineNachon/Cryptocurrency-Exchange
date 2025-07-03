// seeders/...-initial-data.js
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Currencies (ปล่อยให้ DB สร้าง ID เอง)
    await queryInterface.bulkInsert('Currencies', [
      { symbol: 'THB', name: 'Thai Baht', type: 'FIAT', createdAt: new Date(), updatedAt: new Date() },
      { symbol: 'BTC', name: 'Bitcoin', type: 'CRYPTO', createdAt: new Date(), updatedAt: new Date() },
      { symbol: 'ETH', name: 'Ethereum', type: 'CRYPTO', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // 2. Users (ปล่อยให้ DB สร้าง ID เอง)
    const hashedPasswordA = await bcrypt.hash('password123', 10);
    const hashedPasswordB = await bcrypt.hash('password456', 10);
    await queryInterface.bulkInsert('Users', [
      { username: 'user_a', email: 'user_a@example.com', password: hashedPasswordA, createdAt: new Date(), updatedAt: new Date() },
      { username: 'user_b', email: 'user_b@example.com', password: hashedPasswordB, createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // 3. Wallets (ตอนนี้เราต้องไปดึง id ของ user และ currency ที่เพิ่งสร้างมา)
    const users = await queryInterface.sequelize.query(
      `SELECT id from "Users";`
    );
    const currencies = await queryInterface.sequelize.query(
      `SELECT id from "Currencies";`
    );
    
    const userRows = users[0];
    const currencyRows = currencies[0];
    
    // user_a คือ userRows[0].id, user_b คือ userRows[1].id
    // THB คือ currencyRows[0].id, BTC คือ currencyRows[1].id, ETH คือ currencyRows[2].id

    await queryInterface.bulkInsert('Wallets', [
      // User A (id: 1) มี 100,000 THB และ 0.5 BTC
      { user_id: userRows[0].id, currency_id: currencyRows[0].id, balance: 100000.00, createdAt: new Date(), updatedAt: new Date() },
      { user_id: userRows[0].id, currency_id: currencyRows[1].id, balance: 0.50000000, createdAt: new Date(), updatedAt: new Date() },
      // User B (id: 2) มี 50,000 THB และ 2 ETH
      { user_id: userRows[1].id, currency_id: currencyRows[0].id, balance: 50000.00, createdAt: new Date(), updatedAt: new Date() },
      { user_id: userRows[1].id, currency_id: currencyRows[2].id, balance: 2.00000000, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    // ...
  }
};