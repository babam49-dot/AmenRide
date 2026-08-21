const express = require('express');
const router = express.Router();
const scheduledTripController = require('../controllers/scheduledTripController');

router.post('/schedule', scheduledTripController.createSchedule);
router.get('/user/:userId', scheduledTripController.getUserSchedules);
router.put('/:id/cancel', scheduledTripController.cancelSchedule);

module.exports = router;
