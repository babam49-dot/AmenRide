const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { verifyAuthToken, rateLimiter } = require('../middleware/auth');

// Apply rate limiter to trip routes
router.use(rateLimiter);

// GET /api/trips — Retrieve user trip history (supports ?status=COMPLETED&limit=10)
router.get('/', tripController.getUserTrips);

// POST /api/trips — Create a new trip request
router.post('/', tripController.createTrip);


// GET /api/trips/active — List active non-completed trips
router.get('/active', tripController.listActiveTrips);

// GET /api/trips/:id — Retrieve trip details by ID
router.get('/:id', tripController.getTripById);

// PUT /api/trips/:id/status — Update trip status (e.g. ACCEPTED, COMPLETED)
router.put('/:id/status', verifyAuthToken, tripController.updateTripStatus);

module.exports = router;
