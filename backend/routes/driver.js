const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/driver/:id
// Returns driver profile, stats (today's earnings, trips, rating, etc.)
router.get('/:id', async (req, res) => {
  const driverId = parseInt(req.params.id) || 1;
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         email,
         rating,
         acceptance_rate,
         cancellation_rate,
         total_trips,
         today_earnings,
         today_trips,
         vehicle_type,
         vehicle_plate,
         is_online,
         created_at
       FROM drivers
       WHERE id = $1`,
      [driverId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }
    res.json({ success: true, driver: result.rows[0] });
  } catch (err) {
    console.error(`GET /api/driver/${driverId} error:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/driver/:id/status  — toggle online/offline
router.patch('/:id/status', async (req, res) => {
  const driverId = parseInt(req.params.id) || 1;
  const { is_online } = req.body;
  try {
    const result = await pool.query(
      `UPDATE drivers SET is_online = $1 WHERE id = $2 RETURNING id, name, is_online`,
      [is_online, driverId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }
    res.json({ success: true, driver: result.rows[0] });
  } catch (err) {
    console.error(`PATCH /api/driver/${driverId}/status error:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
