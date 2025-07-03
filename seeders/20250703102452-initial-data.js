// ...-initial-data.js
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Currencies
    await queryInterface.bulkInsert('Currencies', [
      { id: 1, symbol: 'THB', name: 'Thai Baht', type: 'FIAT', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, symbol: 'BTC', name: 'Bitcoin', type: 'CRYPTO', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, symbol: 'ETH', name: 'Ethereum', type: 'CRYPTO', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // 2. Users
    const hashedPasswordA = await bcrypt.hash('password123', 10);
    const hashedPasswordB = await bcrypt.hash('password456', 10);
    await queryInterface.bulkInsert('Users', [
      { id: 1, username: 'user_a', email: 'user_a@example.com', password: hashedPasswordA, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, username: 'user_b', email: 'user_b@example.com', password: hashedPasswordB, createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // 3. Wallets
    await queryInterface.bulkInsert('Wallets', [
      // User A (id 1) มี 100,000 THB และ 0.5 BTC
      { user_id: 1, currency_id: 1, balance: 100000.00, createdAt: new Date(), updatedAt: new Date() },
      { user_id: 1, currency_id: 2, balance: 0.50000000, createdAt: new Date(), updatedAt: new Date() },
      // User B (id 2) มี 50,000 THB และ 2 ETH
      { user_id: 2, currency_id: 1, balance: 50000.00, createdAt: new Date(), updatedAt: new Date() },
      { user_id: 2, currency_id: 3, balance: 2.00000000, createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },
  down: async (queryInterface, Sequelize) => { /* ... */ }
};