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

// ─── Audit & Request Logging ─────────────────────────────────────────────────
const auditLogger = require('./middleware/auditLogger');
app.use(auditLogger);


// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/trips',        require('./routes/trips'));
app.use('/api/driver',       require('./routes/driver'));
app.use('/api/ride-options', require('./routes/rideOptions'));
app.use('/api/payments',     require('./routes/payment'));
app.use('/api/ratings',      require('./routes/rating'));
app.use('/api/promos',          require('./routes/promo'));
app.use('/api/payouts',         require('./routes/payout'));
app.use('/api/scheduled-trips', require('./routes/scheduledTrips'));
app.use('/api/surge-zones',     require('./routes/surge'));





// ─── Health Check ─────────────────────────────────────────────────────────────
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

// ─── 404 & Global Error Middleware ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.originalUrl} does not exist on AMEN Ride API.`,
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
});

// ─── Start Server & Graceful Shutdown ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚗 AMEN Ride server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`🗺️  Nearby: http://localhost:${PORT}/api/driver/nearby?lat=11.5936&lng=37.3908`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    pool.end(() => {
      console.log('Database pool closed.');
      process.exit(0);
    });
  });
});
