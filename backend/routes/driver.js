const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ── Haversine formula: distance in km between two GPS points ─────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: /nearby MUST be registered BEFORE /:id
// otherwise Express will match "nearby" as the :id parameter
// ─────────────────────────────────────────────────────────────────────────────

// ── GET /api/driver/nearby?lat=X&lng=Y&radius=10 ─────────────────────────────
// Returns online drivers within radius km, sorted nearest-first
// Driver pins update in real time as drivers broadcast their GPS
router.get('/nearby', async (req, res) => {
  const customerLat = parseFloat(req.query.lat) || 11.5936;
  const customerLng = parseFloat(req.query.lng) || 37.3908;
  const radiusKm    = parseFloat(req.query.radius) || 10;

  try {
    const result = await pool.query(
      `SELECT
         id, name, phone, rating, vehicle_type, vehicle_plate, vehicle_color,
         is_online, lat, lng, last_location_at,
         (6371 * acos(
           LEAST(1.0,
             cos(radians($1)) * cos(radians(lat))
             * cos(radians(lng) - radians($2))
             + sin(radians($1)) * sin(radians(lat))
           )
         )) AS distance_km
       FROM drivers
       WHERE is_online = TRUE
         AND lat IS NOT NULL
         AND lng IS NOT NULL
         AND lat  BETWEEN ($1 - $3 / 111.0) AND ($1 + $3 / 111.0)
         AND lng  BETWEEN ($2 - $3 / 111.0) AND ($2 + $3 / 111.0)
       ORDER BY distance_km ASC
       LIMIT 20`,
      [customerLat, customerLng, radiusKm]
    );

    // Attach ETA (assume 25 km/h average Bahir Dar city speed)
    const drivers = result.rows
      .filter((d) => parseFloat(d.distance_km) <= radiusKm)
      .map((d) => ({
        ...d,
        distance_km: parseFloat(d.distance_km || 0).toFixed(2),
        eta_minutes: Math.max(1, Math.round((parseFloat(d.distance_km) / 25) * 60)),
      }));

    res.json({ success: true, drivers, count: drivers.length });
  } catch (err) {
    console.error('GET /api/driver/nearby error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/driver/:id ───────────────────────────────────────────────────────
// Full driver profile including current GPS
router.get('/:id', async (req, res) => {
  const driverId = parseInt(req.params.id) || 1;
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, rating, acceptance_rate, cancellation_rate,
              total_trips, today_earnings, today_trips,
              vehicle_type, vehicle_plate, vehicle_color,
              is_online, lat, lng, last_location_at, created_at
       FROM drivers WHERE id = $1`,
      [driverId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, error: 'Driver not found' });
    res.json({ success: true, driver: result.rows[0] });
  } catch (err) {
    console.error(`GET /api/driver/${driverId} error:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── POST /api/driver/:id/location ─────────────────────────────────────────────
// Driver's phone sends GPS coords every 5 seconds
// Body: { lat: number, lng: number }
router.post('/:id/location', async (req, res) => {
  const driverId = parseInt(req.params.id) || 1;
  const { lat, lng } = req.body;

  if (lat == null || lng == null)
    return res.status(400).json({ success: false, error: 'lat and lng are required' });

  try {
    const result = await pool.query(
      `UPDATE drivers
       SET lat = $1, lng = $2, last_location_at = NOW(), is_online = TRUE
       WHERE id = $3
       RETURNING id, name, lat, lng, last_location_at, is_online`,
      [lat, lng, driverId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, error: 'Driver not found' });
    res.json({ success: true, driver: result.rows[0] });
  } catch (err) {
    console.error(`POST /api/driver/${driverId}/location error:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATCH /api/driver/:id/status — toggle online/offline ─────────────────────
router.patch('/:id/status', async (req, res) => {
  const driverId = parseInt(req.params.id) || 1;
  const { is_online } = req.body;
  try {
    const result = await pool.query(
      `UPDATE drivers SET is_online = $1 WHERE id = $2 RETURNING id, name, is_online`,
      [is_online, driverId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, error: 'Driver not found' });
    res.json({ success: true, driver: result.rows[0] });
  } catch (err) {
    console.error(`PATCH /api/driver/${driverId}/status error:`, err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
