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
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      type: {
        type: Sequelize.ENUM('BUY', 'SELL'), // Correct ENUM for Order Type
        allowNull: false
      },
      base_currency_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Currencies',
          key: 'id'
        }
      },
      quote_currency_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Currencies',
          key: 'id'
        }
      },
      price: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false
      },
      remaining_amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false
      },
      status: {
        // Correct ENUM for Order Status
        type: Sequelize.ENUM('OPEN', 'PARTIALLY_FILLED', 'FILLED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'OPEN'
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
    // Drop the enum types before dropping the table
    await queryInterface.dropTable('Orders');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Orders_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Orders_status";');
  }
};