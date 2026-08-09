const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

// Connect to PostgreSQL (fires pool.on('connect') / pool.on('error'))
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
app.get('/health', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'disconnected';
  }
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    services: { database: `postgresql — ${dbStatus}` },
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 AMEN Ride server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
