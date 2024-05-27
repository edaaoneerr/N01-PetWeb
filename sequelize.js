const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('petWebApp', 'root', '536050', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
