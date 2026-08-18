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

// POST /api/trips/estimate — Calculate trip fare estimation
router.post('/estimate', (req, res) => {
  const { distanceKm = 3.5, vehicleType = 'bajaj' } = req.body || {};
  const base = vehicleType === 'car' ? 60 : 15;
  const rate = vehicleType === 'car' ? 15 : 4;
  const fare = Math.round(base + (distanceKm * rate));
  res.json({ success: true, fareETB: fare, distanceKm, currency: 'ETB' });
});
// GET /api/trips/active — List active non-completed trips
router.get('/active', tripController.listActiveTrips);

// GET /api/trips/:id — Retrieve trip details by ID
router.get('/:id', tripController.getTripById);

// PUT /api/trips/:id/status — Update trip status (e.g. ACCEPTED, COMPLETED)
router.put('/:id/status', verifyAuthToken, tripController.updateTripStatus);

module.exports = router;
