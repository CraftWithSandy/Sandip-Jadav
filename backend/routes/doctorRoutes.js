const router = require('express').Router();
const controller = require('../controllers/doctorController');

router.get('/', controller.getDoctors);

module.exports = router;
