const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

router.post('/alert', emergencyController.triggerAlert);
router.get('/logs', emergencyController.getLogs);

module.exports = router;
