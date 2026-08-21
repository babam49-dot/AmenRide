-- AMEN Ride PostgreSQL Schema + Seed Data
-- Run this script once to set up the database:
--   psql -U postgres -d amen_ride -f backend/db/schema.sql

-- ─── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  phone       VARCHAR(20),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(100) NOT NULL,
  email             VARCHAR(150) UNIQUE NOT NULL,
  phone             VARCHAR(20),
  rating            NUMERIC(3, 2) DEFAULT 5.00,
  acceptance_rate   NUMERIC(5, 2) DEFAULT 100.00,
  cancellation_rate NUMERIC(5, 2) DEFAULT 0.00,
  total_trips       INTEGER DEFAULT 0,
  today_earnings    NUMERIC(10, 2) DEFAULT 0.00,
  today_trips       INTEGER DEFAULT 0,
  vehicle_type      VARCHAR(50) DEFAULT 'Sedan',
  vehicle_plate     VARCHAR(20),
  vehicle_color     VARCHAR(30) DEFAULT 'White',
  is_online         BOOLEAN DEFAULT FALSE,
  -- GPS Location Fields
  lat               DOUBLE PRECISION,
  lng               DOUBLE PRECISION,
  last_location_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW()
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
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER REFERENCES users(id),
  driver_id      INTEGER REFERENCES drivers(id),
  ride_option_id INTEGER REFERENCES ride_options(id),
  pickup_name    VARCHAR(200) NOT NULL,
  pickup_lat     DOUBLE PRECISION,
  pickup_lng     DOUBLE PRECISION,
  pickup_addr    VARCHAR(300),
  dropoff_name   VARCHAR(200) NOT NULL,
  dropoff_lat    DOUBLE PRECISION,
  dropoff_lng    DOUBLE PRECISION,
  dropoff_addr   VARCHAR(300),
  fare           NUMERIC(10, 2) NOT NULL,
  status         VARCHAR(30) DEFAULT 'completed',
  distance_km    NUMERIC(6, 2),
  duration_min   INTEGER,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Seed Data ────────────────────────────────────────────────────────────────

INSERT INTO users (name, email, phone) VALUES
  ('Tewodros Zewudu', 'tewanayzewudu49@gmail.com', '+251912345678')
ON CONFLICT (email) DO NOTHING;

-- Demo drivers with real Bahir Dar GPS coordinates
-- Bahir Dar city center: 11.5936 N, 37.3908 E
INSERT INTO drivers (name, email, phone, rating, acceptance_rate, cancellation_rate,
                     total_trips, today_earnings, today_trips, vehicle_type, vehicle_plate,
                     vehicle_color, is_online, lat, lng, last_location_at)
VALUES
  ('Amanuel Bekele',   'amanuel.b@amenride.com',   '+251911000001', 4.92, 96.00, 2.00,  847, 1450.00,  8, 'Toyota Corolla',  'BD-1234-AA', 'White',  TRUE,  11.6041, 37.3724, NOW()),
  ('Tewodros Kassaye', 'tewodros.k@amenride.com',  '+251911000002', 4.88, 93.00, 3.00,  620,  950.00,  6, 'Hyundai Elantra', 'BD-5678-BB', 'Silver', TRUE,  11.5880, 37.3812, NOW()),
  ('Meron Tadesse',    'meron.t@amenride.com',     '+251911000003', 4.95, 98.00, 1.00, 1140, 2100.00, 11, 'Toyota Vitz',     'BD-9101-CC', 'Blue',   TRUE,  11.5936, 37.3950, NOW()),
  ('Yonas Gebre',      'yonas.g@amenride.com',     '+251911000004', 4.79, 89.00, 5.00,  310,  680.00,  4, 'Suzuki Swift',    'BD-3412-DD', 'Red',    FALSE, 11.5810, 37.3870, NOW())
ON CONFLICT (email) DO NOTHING;

-- Migration safety: add columns if table already exists
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS lat              DOUBLE PRECISION;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS lng              DOUBLE PRECISION;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS last_location_at TIMESTAMPTZ;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS vehicle_color    VARCHAR(30) DEFAULT 'White';
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS phone           VARCHAR(20);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_number   VARCHAR(50);
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_expiry   TIMESTAMPTZ;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30) DEFAULT 'VERIFIED';
ALTER TABLE trips   ADD COLUMN IF NOT EXISTS pickup_lat      DOUBLE PRECISION;
ALTER TABLE trips   ADD COLUMN IF NOT EXISTS pickup_lng      DOUBLE PRECISION;
ALTER TABLE trips   ADD COLUMN IF NOT EXISTS dropoff_lat     DOUBLE PRECISION;
ALTER TABLE trips   ADD COLUMN IF NOT EXISTS dropoff_lng     DOUBLE PRECISION;


-- Ride options
INSERT INTO ride_options (name, icon, eta_minutes, base_price, description, color) VALUES
  ('AMEN Standard', '🚗',  3,  80.00, 'Comfortable everyday ride',          '#FF9500'),
  ('AMEN Comfort',  '🚙',  5, 120.00, 'Premium spacious vehicle',            '#A855F7'),
  ('AMEN Boda',     '🏍️',  2,  45.00, 'Fast motorcycle for short distances', '#06B6D4'),
  ('AMEN Intercity','🚌', 15, 350.00, 'Long-distance intercity transport',   '#10B981')
ON CONFLICT DO NOTHING;

-- Promo Codes
CREATE TABLE IF NOT EXISTS promo_codes (
  id                   SERIAL PRIMARY KEY,
  code                 VARCHAR(50) UNIQUE NOT NULL,
  discount_percent     NUMERIC(5, 2) DEFAULT 0.00,
  max_discount_etb     NUMERIC(10, 2) DEFAULT 50.00,
  is_active            BOOLEAN DEFAULT TRUE,
  expires_at           TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO promo_codes (code, discount_percent, max_discount_etb, is_active) VALUES
  ('AMENBAHIR', 20.00, 50.00, TRUE),
  ('TANA50',    50.00, 100.00, TRUE),
  ('WELCOME10', 10.00, 30.00, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Driver Payouts
CREATE TABLE IF NOT EXISTS payouts (
  id             SERIAL PRIMARY KEY,
  driver_id      INTEGER REFERENCES drivers(id),
  amount_etb     NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Telebirr',
  account_number VARCHAR(50) NOT NULL,
  status         VARCHAR(30) DEFAULT 'PENDING',
  requested_at   TIMESTAMPTZ DEFAULT NOW(),
  processed_at   TIMESTAMPTZ
);

-- Scheduled Trips
CREATE TABLE IF NOT EXISTS scheduled_trips (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER REFERENCES users(id),
  ride_option_id INTEGER REFERENCES ride_options(id),
  pickup_name    VARCHAR(200) NOT NULL,
  dropoff_name   VARCHAR(200) NOT NULL,
  pickup_lat     DOUBLE PRECISION,
  pickup_lng     DOUBLE PRECISION,
  scheduled_time TIMESTAMPTZ NOT NULL,
  fare_estimate  NUMERIC(10, 2) NOT NULL,
  status         VARCHAR(30) DEFAULT 'SCHEDULED',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Surge Zones
CREATE TABLE IF NOT EXISTS surge_zones (
  id               SERIAL PRIMARY KEY,
  zone_name        VARCHAR(100) UNIQUE NOT NULL,
  lat              DOUBLE PRECISION NOT NULL,
  lng              DOUBLE PRECISION NOT NULL,
  radius_km        NUMERIC(4, 2) DEFAULT 2.50,
  surge_multiplier NUMERIC(3, 2) DEFAULT 1.00,
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO surge_zones (zone_name, lat, lng, radius_km, surge_multiplier) VALUES
  ('Felege Hiwot Hospital Area', 11.6080, 37.3699, 2.0, 1.25),
  ('Bahir Dar Airport Zone',     11.6041, 37.3724, 3.0, 1.40),
  ('BDU Peda Campus Hub',        11.5880, 37.3812, 1.5, 1.15),
  ('Lake Tana Resort Strip',     11.5936, 37.3950, 2.5, 1.30)
ON CONFLICT (zone_name) DO NOTHING;

-- Saved Places
CREATE TABLE IF NOT EXISTS saved_places (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  label       VARCHAR(50) NOT NULL, -- Home, Work, University, Gym
  name        VARCHAR(200) NOT NULL,
  address     VARCHAR(300),
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO saved_places (user_id, label, name, address, lat, lng) VALUES
  (1, 'Home', 'Kebele 11 Residence', 'Near BDU Poly Campus, Bahir Dar', 11.5880, 37.3812),
  (1, 'Work', 'Commercial Bank Building', 'Kebele 03 Main St, Bahir Dar', 11.5936, 37.3908)
ON CONFLICT DO NOTHING;

-- Driver Reviews
CREATE TABLE IF NOT EXISTS driver_reviews (
  id          SERIAL PRIMARY KEY,
  trip_id     VARCHAR(100),
  driver_id   INTEGER REFERENCES drivers(id),
  rating      NUMERIC(3, 2) NOT NULL,
  comment     TEXT,
  tags        TEXT[],
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO driver_reviews (trip_id, driver_id, rating, comment, tags) VALUES
  ('TRIP-101', 1, 5.0, 'Safe driver and clean Bajaj vehicle!', ARRAY['ጥሩ ማሽከርከር (Safe Driving)', 'ንጹህ መኪና (Clean Vehicle)']),
  ('TRIP-102', 1, 4.8, 'Very polite and punctual arrival', ARRAY['በሰዓቱ መድረስ (Punctual Arrival)'])
ON CONFLICT DO NOTHING;

-- Emergency SOS Logs
CREATE TABLE IF NOT EXISTS emergency_logs (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER REFERENCES users(id),
  lat            DOUBLE PRECISION NOT NULL,
  lng            DOUBLE PRECISION NOT NULL,
  contact_phone  VARCHAR(30) DEFAULT '+251911000000',
  dispatch_target VARCHAR(100) DEFAULT 'Bahir Dar Central Police Line (991)',
  status         VARCHAR(30) DEFAULT 'DISPATCHED',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO emergency_logs (user_id, lat, lng, contact_phone, dispatch_target, status) VALUES
  (1, 11.6080, 37.3699, '+251912345678', 'Felege Hiwot Police Station', 'RESOLVED')
ON CONFLICT DO NOTHING;







-- Demo trips
INSERT INTO trips (user_id, driver_id, ride_option_id,
                   pickup_name, pickup_lat, pickup_lng, pickup_addr,
                   dropoff_name, dropoff_lat, dropoff_lng, dropoff_addr,
                   fare, status, distance_km, duration_min, created_at)
VALUES
  (1,1,1,'Bahir Dar Airport',     11.6041,37.3724,'Felege Hiwot, Bahir Dar', 'Grand Resort Hotel',   11.5936,37.3950,'Kebele 03, Bahir Dar',  210.00,'completed',4.2,12, NOW()-INTERVAL '1 hour'),
  (1,1,1,'Bahir Dar University',  11.5880,37.3812,'Kebele 11, Bahir Dar',    'Lake Tana Hotel',      11.5936,37.3950,'Kebele 03, Bahir Dar',  120.00,'completed',2.8, 9, NOW()-INTERVAL '3 hours'),
  (1,1,3,'Poly-Technic College',  11.5900,37.3830,'Kebele 08, Bahir Dar',    'Ghion Hotel',          11.5950,37.3900,'Kebele 05, Bahir Dar',   45.00,'completed',1.5, 7, NOW()-INTERVAL '1 day'),
  (1,1,1,'Bahir Dar Bus Terminal',11.5810,37.3870,'Kebele 01, Bahir Dar',    'Bahir Dar University', 11.5880,37.3812,'Kebele 11, Bahir Dar',   85.00,'completed',3.1,11, NOW()-INTERVAL '2 days'),
  (1,1,2,'Lake Tana Hotel',       11.5936,37.3950,'Kebele 03, Bahir Dar',    'Bahir Dar Airport',    11.6041,37.3724,'Felege Hiwot, Bahir Dar',280.00,'completed',5.6,18, NOW()-INTERVAL '3 days')
ON CONFLICT DO NOTHING;

