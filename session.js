const sequelize = require('./sequelize');
const { DataTypes, Model } = require('sequelize');

class Session extends Model {}

Session.init({
  sid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'Session',
  timestamps: true
});

module.exports = Session;
