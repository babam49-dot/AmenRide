const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ── GET /api/ride-options ─────────────────────────────────────────────────────
// Returns all active ride options for the booking screen, sorted by price
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, icon, eta_minutes, base_price, description, color, is_active
       FROM ride_options
       WHERE is_active = TRUE
       ORDER BY base_price ASC`
    );
    res.json({ success: true, rideOptions: result.rows, count: result.rows.length });
  } catch (err) {
    console.error('GET /api/ride-options error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/ride-options/:id — Get a specific ride option ───────────────────
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      `SELECT id, name, icon, eta_minutes, base_price, description, color
       FROM ride_options WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, error: 'Ride option not found' });
    res.json({ success: true, rideOption: result.rows[0] });
  } catch (err) {
    console.error(`GET /api/ride-options/${id} error:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
