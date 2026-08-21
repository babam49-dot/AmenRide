const express = require('express');
const router = express.Router();
const surgeController = require('../controllers/surgeController');

router.get('/', surgeController.getAllZones);
router.put('/:id/multiplier', surgeController.updateMultiplier);

module.exports = router;
