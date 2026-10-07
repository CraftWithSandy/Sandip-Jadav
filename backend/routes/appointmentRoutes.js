const router = require('express').Router();
const controller = require('../controllers/appointmentController');
const consultationController = require('../controllers/consultationController');

router.post('/', controller.createAppointment);
router.get('/today', controller.getTodayAppointments);
router.get('/:id', controller.getAppointment);
router.post('/:id/consultation', consultationController.createConsultation);

module.exports = router;
