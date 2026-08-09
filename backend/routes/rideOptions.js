const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/ride-options
// Returns all active ride options for booking screen
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, icon, eta_minutes, base_price, description, color
       FROM ride_options
       WHERE is_active = TRUE
       ORDER BY base_price ASC`
    );
    res.json({ success: true, rideOptions: result.rows });
  } catch (err) {
    console.error('GET /api/ride-options error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
