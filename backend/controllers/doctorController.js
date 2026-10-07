const { Doctor } = require('../models');

// List all doctors for appointment booking.
exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json(doctors);
  } catch (error) {
    return next(error);
  }
};
