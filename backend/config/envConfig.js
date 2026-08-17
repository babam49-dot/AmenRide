/**
 * Environment & System Configuration Schema
 */

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  USE_POSTGRES: process.env.USE_POSTGRES === 'true',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/amen_ride',
  CHAPA_SECRET_KEY: process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-SIMULATED-KEY',
  CITY: 'Bahir Dar, Ethiopia 🇪🇹',
  DEFAULT_LAT: 11.5936,
  DEFAULT_LNG: 37.3908,
};

function validateConfig() {
  if (env.PORT < 1024 || env.PORT > 65535) {
    console.warn(`[CONFIG WARNING] Port ${env.PORT} is non-standard. Recommended range 3000-9000.`);
  }
  return env;
}

module.exports = { env, validateConfig };
