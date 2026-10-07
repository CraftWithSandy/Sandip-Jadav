const router = require('express').Router();
const controller = require('../controllers/patientController');

router.post('/', controller.createPatient);
router.get('/', controller.getPatients);
router.get('/:id/consultations', controller.getPatientConsultations);

module.exports = router;
