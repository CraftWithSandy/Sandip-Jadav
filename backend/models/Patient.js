const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'), allowNull: true },
  age: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0, max: 120 } },
  phone: { type: DataTypes.STRING(10), allowNull: false, unique: true },
}, { timestamps: true, updatedAt: false });

module.exports = Patient;
