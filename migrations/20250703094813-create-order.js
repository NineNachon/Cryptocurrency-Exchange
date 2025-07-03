'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('DEPOSIT', 'WITHDRAWAL', 'INTERNAL_TRANSFER')
      },
      base_currency_id: {
        type: Sequelize.INTEGER
      },
      quote_currency_id: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      remaining_amount: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'COMPLETED', 'FAILED')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};