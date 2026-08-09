-- AMEN Ride PostgreSQL Schema + Seed Data
-- Run this script once to set up the database:
--   psql -U postgres -d amen_ride -f backend/db/schema.sql

-- ─── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(150) UNIQUE NOT NULL,
  rating          NUMERIC(3, 2) DEFAULT 5.00,
  acceptance_rate NUMERIC(5, 2) DEFAULT 100.00,
  cancellation_rate NUMERIC(5, 2) DEFAULT 0.00,
  total_trips     INTEGER DEFAULT 0,
  today_earnings  NUMERIC(10, 2) DEFAULT 0.00,
  today_trips     INTEGER DEFAULT 0,
  vehicle_type    VARCHAR(50) DEFAULT 'Sedan',
  vehicle_plate   VARCHAR(20),
  is_online       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ride_options (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  icon        VARCHAR(10) NOT NULL,
  eta_minutes INTEGER NOT NULL,
  base_price  NUMERIC(10, 2) NOT NULL,
  description VARCHAR(200),
  color       VARCHAR(20) DEFAULT '#FF9500',
  is_active   BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS trips (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id),
  driver_id     INTEGER REFERENCES drivers(id),
  ride_option_id INTEGER REFERENCES ride_options(id),
  pickup_name   VARCHAR(200) NOT NULL,
  pickup_addr   VARCHAR(300),
  dropoff_name  VARCHAR(200) NOT NULL,
  dropoff_addr  VARCHAR(300),
  fare          NUMERIC(10, 2) NOT NULL,
  status        VARCHAR(30) DEFAULT 'completed',
  distance_km   NUMERIC(6, 2),
  duration_min  INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Seed Data ────────────────────────────────────────────────────────────────

-- Demo user
INSERT INTO users (name, email) VALUES
  ('John Doe', 'john.doe@amenride.com')
ON CONFLICT (email) DO NOTHING;

-- Demo driver
INSERT INTO drivers (name, email, rating, acceptance_rate, cancellation_rate, total_trips, today_earnings, today_trips, vehicle_type, vehicle_plate, is_online)
VALUES
  ('Amanuel Bekele', 'amanuel.b@amenride.com', 4.92, 96.00, 2.00, 847, 1450.00, 8, 'Toyota Corolla', 'BD-1234-AA', FALSE)
ON CONFLICT (email) DO NOTHING;

-- Ride options
INSERT INTO ride_options (name, icon, eta_minutes, base_price, description, color) VALUES
  ('AMEN Standard', '🚗', 3, 80.00,  'Comfortable everyday ride',            '#FF9500'),
  ('AMEN Comfort',  '🚙', 5, 120.00, 'Premium spacious vehicle',              '#A855F7'),
  ('AMEN Boda',     '🏍️', 2, 45.00,  'Fast motorcycle for short distances',   '#06B6D4'),
  ('AMEN Intercity','🚌', 15, 350.00,'Long-distance intercity transport',      '#10B981')
ON CONFLICT DO NOTHING;

-- Demo trips for user 1
INSERT INTO trips (user_id, driver_id, ride_option_id, pickup_name, pickup_addr, dropoff_name, dropoff_addr, fare, status, distance_km, duration_min, created_at)
VALUES
  (1, 1, 1, 'Bahir Dar Airport',      'Felege Hiwot, Bahir Dar', 'Grand Resort Hotel',       'Kebele 03, Bahir Dar', 210.00, 'completed', 4.2, 12, NOW() - INTERVAL '1 hour'),
  (1, 1, 1, 'Bahir Dar University',   'Kebele 11, Bahir Dar',    'Lake Tana Hotel',          'Kebele 03, Bahir Dar', 120.00, 'completed', 2.8,  9, NOW() - INTERVAL '3 hours'),
  (1, 1, 3, 'Poly-Technic College',   'Kebele 08, Bahir Dar',    'Ghion Hotel',              'Kebele 05, Bahir Dar',  45.00, 'completed', 1.5,  7, NOW() - INTERVAL '1 day'),
  (1, 1, 1, 'Bahir Dar Bus Terminal', 'Kebele 01, Bahir Dar',    'Bahir Dar University',     'Kebele 11, Bahir Dar',  85.00, 'completed', 3.1, 11, NOW() - INTERVAL '2 days'),
  (1, 1, 2, 'Lake Tana Hotel',        'Kebele 03, Bahir Dar',    'Bahir Dar Airport',        'Felege Hiwot, Bahir Dar', 280.00, 'completed', 5.6, 18, NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;
