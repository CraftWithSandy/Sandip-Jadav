const { Appointment, Consultation } = require('../models');
const sequelize = require('../config/db');

// Save a consultation and complete its appointment atomically.
exports.createConsultation = async (req, res, next) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const appointment = await Appointment.findByPk(req.params.id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!appointment) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.status === 'COMPLETED') {
      await transaction.rollback();
      return res.status(409).json({ message: 'Appointment is already completed' });
    }

    const { temperature, bloodPressure, notes } = req.body;
    const consultation = await Consultation.create({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      temperature,
      bloodPressure,
      notes,
      completedAt: new Date(),
    }, { transaction });
    appointment.status = 'COMPLETED';
    await appointment.save({ transaction });
    await transaction.commit();
    return res.status(201).json(consultation);
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback();
    return next(error);
  }
};
