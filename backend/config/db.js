const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/amen_ride',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err.message);
  console.warn('⚠️  Server continues. Set DATABASE_URL in .env to connect to a valid database.');
});

pool.checkHealth = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    return { status: 'HEALTHY', dbTime: res.rows[0].now };
  } catch (err) {
    return { status: 'DISCONNECTED', error: err.message };
  }
};

module.exports = pool;
