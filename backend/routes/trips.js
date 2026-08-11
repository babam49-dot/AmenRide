const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ── GET /api/trips?userId=1&limit=10 ─────────────────────────────────────────
// Returns recent trips for a given user, ordered newest first
router.get('/', async (req, res) => {
  const userId = parseInt(req.query.userId) || 1;
  const limit  = Math.min(parseInt(req.query.limit) || 10, 50);
  try {
    const result = await pool.query(
      `SELECT
         t.id,
         t.pickup_name,  t.pickup_lat,  t.pickup_lng,  t.pickup_addr,
         t.dropoff_name, t.dropoff_lat, t.dropoff_lng, t.dropoff_addr,
         t.fare,  t.status, t.distance_km, t.duration_min, t.created_at,
         ro.name  AS ride_type,
         ro.icon  AS ride_icon,
         ro.color AS ride_color,
         d.name        AS driver_name,
         d.rating      AS driver_rating,
         d.vehicle_type AS driver_vehicle,
         d.vehicle_plate AS driver_plate
       FROM trips t
       JOIN ride_options ro ON ro.id = t.ride_option_id
       LEFT JOIN drivers d  ON d.id = t.driver_id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    res.json({ success: true, trips: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('GET /api/trips error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/trips — Create a new trip ──────────────────────────────────────
router.post('/', async (req, res) => {
  const {
    user_id = 1, driver_id = 1, ride_option_id = 1,
    pickup_name, pickup_lat, pickup_lng, pickup_addr,
    dropoff_name, dropoff_lat, dropoff_lng, dropoff_addr,
    fare, distance_km, duration_min,
  } = req.body;

  if (!pickup_name || !dropoff_name || !fare) {
    return res.status(400).json({ success: false, error: 'pickup_name, dropoff_name, and fare are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO trips
         (user_id, driver_id, ride_option_id,
          pickup_name, pickup_lat, pickup_lng, pickup_addr,
          dropoff_name, dropoff_lat, dropoff_lng, dropoff_addr,
          fare, status, distance_km, duration_min)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'completed',$13,$14)
       RETURNING *`,
      [user_id, driver_id, ride_option_id,
       pickup_name, pickup_lat, pickup_lng, pickup_addr,
       dropoff_name, dropoff_lat, dropoff_lng, dropoff_addr,
       fare, distance_km, duration_min]
    );
    res.status(201).json({ success: true, trip: result.rows[0] });
  } catch (err) {
    console.error('POST /api/trips error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
