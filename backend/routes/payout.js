const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payoutController');

router.post('/request', payoutController.requestPayout);
router.get('/driver/:driverId', payoutController.getDriverPayouts);
router.get('/all', payoutController.getAllPayouts);
router.put('/:id/status', payoutController.updateStatus);

module.exports = router;
