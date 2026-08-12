/**
 * Database Seed Script for AMEN Ride
 * Populates sample drivers around Bahir Dar, Ethiopia
 */
const pool = require('../config/db');

const INITIAL_DRIVERS = [
  {
    name: 'Abebe Bikila',
    phone: '+251911223344',
    vehicle_type: 'bajaj',
    vehicle_plate: 'BD-3-1029',
    rating: 4.9,
    is_online: true,
    current_lat: 11.5940,
    current_lng: 37.3912,
  },
  {
    name: 'Tewodros Kassahun',
    phone: '+251922334455',
    vehicle_type: 'bajaj',
    vehicle_plate: 'BD-3-4820',
    rating: 4.8,
    is_online: true,
    current_lat: 11.5910,
    current_lng: 37.3880,
  },
  {
    name: 'Mulugeta Tesfaye',
    phone: '+251933445566',
    vehicle_type: 'car',
    vehicle_plate: 'BD-2-7711',
    rating: 5.0,
    is_online: true,
    current_lat: 11.5975,
    current_lng: 37.3950,
  },
  {
    name: 'Aster Aweke',
    phone: '+251944556677',
    vehicle_type: 'bajaj',
    vehicle_plate: 'BD-3-9934',
    rating: 4.7,
    is_online: false,
    current_lat: 11.5890,
    current_lng: 37.3820,
  },
];

async function seedDatabase() {
  console.log('🌱 Starting AMEN Ride database seed...');

  try {
    // Clear existing test data
    await pool.query('TRUNCATE TABLE drivers RESTART IDENTITY CASCADE;');

    for (const driver of INITIAL_DRIVERS) {
      await pool.query(
        `INSERT INTO drivers (name, phone, vehicle_type, vehicle_plate, rating, is_online, current_lat, current_lng)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          driver.name,
          driver.phone,
          driver.vehicle_type,
          driver.vehicle_plate,
          driver.rating,
          driver.is_online,
          driver.current_lat,
          driver.current_lng,
        ]
      );
    }

    console.log(`✅ Successfully seeded ${INITIAL_DRIVERS.length} drivers for Bahir Dar fleet.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
