const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.post('/', ratingController.createRating);
router.get('/driver/:id', ratingController.getDriverRatings);
router.get('/summary', ratingController.getOverallSummary);

module.exports = router;
