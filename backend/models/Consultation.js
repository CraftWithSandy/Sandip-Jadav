const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Consultation = sequelize.define('Consultation', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  appointmentId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  temperature: { type: DataTypes.STRING, allowNull: true },
  bloodPressure: { type: DataTypes.STRING, allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  completedAt: { type: DataTypes.DATE, allowNull: false },
}, { timestamps: true });

module.exports = Consultation;
