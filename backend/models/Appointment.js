const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  appointmentDateTime: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('SCHEDULED', 'COMPLETED'), allowNull: false, defaultValue: 'SCHEDULED' },
}, { timestamps: true });

module.exports = Appointment;
