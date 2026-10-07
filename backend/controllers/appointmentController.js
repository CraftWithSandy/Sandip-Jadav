const { Op } = require('sequelize');
const { Appointment, Patient, Doctor } = require('../models');

// Create an appointment after checking its patient, doctor, and date.
exports.createAppointment = async (req, res, next) => {
  try {
    const { patientId, doctorId, appointmentDateTime } = req.body;
    if (!patientId || !doctorId || !appointmentDateTime) {
      return res.status(400).json({ message: 'patientId, doctorId, and appointmentDateTime are required' });
    }
    const parsedDate = new Date(appointmentDateTime);
    if (Number.isNaN(parsedDate.getTime())) return res.status(400).json({ message: 'appointmentDateTime must be a valid date' });
    const [patient, doctor] = await Promise.all([Patient.findByPk(patientId), Doctor.findByPk(doctorId)]);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const appointment = await Appointment.create({ patientId, doctorId, appointmentDateTime: parsedDate });
    return res.status(201).json(appointment);
  } catch (error) {
    return next(error);
  }
};

// List today's appointments using the server's local calendar date.
exports.getTodayAppointments = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const appointments = await Appointment.findAll({
      where: { appointmentDateTime: { [Op.gte]: start, [Op.lt]: end } },
      include: [{ model: Patient }, { model: Doctor }],
      order: [['appointmentDateTime', 'ASC']],
    });
    return res.status(200).json(appointments);
  } catch (error) {
    return next(error);
  }
};

// Return one appointment with the patient and doctor for consultation entry.
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, { include: [{ model: Patient }, { model: Doctor }] });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    return res.status(200).json(appointment);
  } catch (error) {
    return next(error);
  }
};
