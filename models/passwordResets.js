const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const PasswordReset = sequelize.define('PasswordReset', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    expires: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    // Add any additional fields like order details if needed.
  });
  