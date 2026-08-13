const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { rateLimiter } = require('../middleware/auth');

// Apply rate limiting
router.use(rateLimiter);

// GET /api/driver/nearby — Search nearby drivers within specified radius
router.get('/nearby', driverController.getNearbyDrivers);

// POST /api/driver/location — Broadcast dynamic driver GPS coordinates
router.post('/location', driverController.updateDriverLocation);

// GET /api/driver/:id — Retrieve driver profile by ID
router.get('/:id', driverController.getDriverById);

// GET /api/driver/:id/stats — Get driver aggregate metrics and completed trips
router.get('/:id/stats', driverController.getDriverStats);

module.exports = router;

