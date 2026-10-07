const { Op } = require('sequelize');
const { Patient } = require('../models');

// Create a patient after validating their basic registration details.
exports.createPatient = async (req, res, next) => {
  try {
    const { name, gender, age, phone } = req.body;
    if (!name || phone === undefined || phone === '') {
      return res.status(400).json({ message: 'Name and phone are required' });
    }
    if (gender !== undefined && !['MALE', 'FEMALE', 'OTHER'].includes(gender)) {
      return res.status(400).json({ message: 'Gender must be MALE, FEMALE, or OTHER' });
    }
    if (age !== undefined && age !== null && (!Number.isInteger(age) || age < 0 || age > 120)) {
      return res.status(400).json({ message: 'Age must be an integer between 0 and 120' });
    }
    if (!/^\d{10}$/.test(String(phone))) {
      return res.status(400).json({ message: 'Phone must contain exactly 10 digits' });
    }

    const patient = await Patient.create({ name, gender, age, phone: String(phone) });
    return res.status(201).json(patient);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'A patient with this phone already exists' });
    }
    return next(error);
  }
};

// List patients, optionally matching their name or phone.
exports.getPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = search ? { [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { phone: { [Op.like]: `%${search}%` } }] } : {};
    const patients = await Patient.findAll({ where, order: [['name', 'ASC']] });
    return res.status(200).json(patients);
  } catch (error) {
    return next(error);
  }
};

// Return completed consultations for one patient, newest first.
exports.getPatientConsultations = async (req, res, next) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    const { Consultation, Appointment, Doctor } = require('../models');
    const consultations = await Consultation.findAll({
      where: { patientId: req.params.id },
      include: [{ model: Appointment, where: { status: 'COMPLETED' }, include: [{ model: Doctor, attributes: ['name'] }] }],
      order: [['completedAt', 'DESC']],
    });
    return res.status(200).json(consultations);
  } catch (error) {
    return next(error);
  }
};
