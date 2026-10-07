const sequelize = require('../config/db');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Appointment = require('./Appointment');
const Consultation = require('./Consultation');

Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
Appointment.hasOne(Consultation, { foreignKey: 'appointmentId' });
Consultation.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Patient.hasMany(Consultation, { foreignKey: 'patientId' });
Consultation.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = { sequelize, Patient, Doctor, Appointment, Consultation };
