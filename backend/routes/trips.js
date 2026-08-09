const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/trips?userId=1
// Returns recent trips for a given user, ordered newest first
router.get('/', async (req, res) => {
  const userId = parseInt(req.query.userId) || 1;
  try {
    const result = await pool.query(
      `SELECT
         t.id,
         t.pickup_name,
         t.pickup_addr,
         t.dropoff_name,
         t.dropoff_addr,
         t.fare,
         t.status,
         t.distance_km,
         t.duration_min,
         t.created_at,
         ro.name        AS ride_type,
         ro.icon        AS ride_icon,
         ro.color       AS ride_color
       FROM trips t
       JOIN ride_options ro ON ro.id = t.ride_option_id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC
       LIMIT 10`,
      [userId]
    );
    res.json({ success: true, trips: result.rows });
  } catch (err) {
    console.error('GET /api/trips error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
