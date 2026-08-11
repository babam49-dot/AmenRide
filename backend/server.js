const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

// Connect to PostgreSQL
const pool = require('./config/db');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/trips',        require('./routes/trips'));
app.use('/api/driver',       require('./routes/driver'));
app.use('/api/ride-options', require('./routes/rideOptions'));

// ─── Health Check ─────────────────────────────────────────────────────────────
// GET /health — returns server status, DB connection, and fleet stats
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let onlineDrivers = 0;
  let totalTrips = 0;

  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';

    const driverRes = await pool.query(
      `SELECT COUNT(*) AS count FROM drivers WHERE is_online = TRUE`
    );
    onlineDrivers = parseInt(driverRes.rows[0]?.count || 0);

    const tripsRes = await pool.query(`SELECT COUNT(*) AS count FROM trips`);
    totalTrips = parseInt(tripsRes.rows[0]?.count || 0);
  } catch (e) {
    dbStatus = 'disconnected — ' + e.message;
  }

  res.status(200).json({
    status: 'UP',
    app: 'AMEN Ride — Bahir Dar, Ethiopia 🇪🇹',
    timestamp: new Date().toISOString(),
    services: {
      database: `postgresql — ${dbStatus}`,
    },
    fleet: {
      online_drivers: onlineDrivers,
      total_trips: totalTrips,
    },
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚗 AMEN Ride server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`🗺️  Nearby: http://localhost:${PORT}/api/driver/nearby?lat=11.5936&lng=37.3908`);
});
