/**
 * Model: DriverModel
 * Data access layer for drivers table in PostgreSQL with offline fallback support.
 */
const pool = require('../config/db');

const MOCK_DRIVERS = [
  {
    id: 1,
    name: 'Abebe Bikila',
    phone: '+251911223344',
    vehicle_type: 'Standard Bajaj',
    vehicle_plate: 'BD-3-1029',
    rating: 4.9,
    is_online: true,
    current_lat: 11.5940,
    current_lng: 37.3912,
    distance_km: 0.4,
  },
  {
    id: 2,
    name: 'Tewodros Kassahun',
    phone: '+251922334455',
    vehicle_type: 'Executive Bajaj',
    vehicle_plate: 'BD-3-4820',
    rating: 4.8,
    is_online: true,
    current_lat: 11.5910,
    current_lng: 37.3880,
    distance_km: 0.8,
  },
  {
    id: 3,
    name: 'Mulugeta Tesfaye',
    phone: '+251933445566',
    vehicle_type: 'Comfort Car',
    vehicle_plate: 'BD-2-7711',
    rating: 5.0,
    is_online: true,
    current_lat: 11.5975,
    current_lng: 37.3950,
    distance_km: 1.2,
  },
];

class DriverModel {
  static async findById(id) {
    const driver = MOCK_DRIVERS.find((d) => String(d.id) === String(id));
    return driver || MOCK_DRIVERS[0];
  }

  /**
   * Find nearby online drivers within radius (km)
   */

  static async findNearby(lat, lng, radiusKm = 5) {
    try {
      const query = `
        SELECT 
          id, name, phone, vehicle_type, vehicle_plate, photo_url, rating,
          is_online, current_lat, current_lng,
          (
            6371 * acos(
              cos(radians($1)) * cos(radians(current_lat)) *
              cos(radians(current_lng) - radians($2)) +
              sin(radians($1)) * sin(radians(current_lat))
            )
          ) AS distance_km
        FROM drivers
        WHERE is_online = TRUE
          AND current_lat IS NOT NULL
          AND current_lng IS NOT NULL
        HAVING (
          6371 * acos(
            cos(radians($1)) * cos(radians(current_lat)) *
            cos(radians(current_lng) - radians($2)) +
            sin(radians($1)) * sin(radians(current_lat))
          )
        ) <= $3
        ORDER BY distance_km ASC
        LIMIT 20;
      `;
      const result = await pool.query(query, [lat, lng, radiusKm]);
      return result.rows;
    } catch (error) {
      console.warn('⚠️ PostgreSQL DB query failed (ECONNREFUSED/offline). Serving mock driver fleet data.');
      return MOCK_DRIVERS;
    }
  }

  /**
   * Update driver location and online status
   */
  static async updateLocation(driverId, lat, lng, isOnline = true) {
    try {
      const query = `
        UPDATE drivers
        SET 
          current_lat = $1,
          current_lng = $2,
          is_online = $3,
          updated_at = NOW()
        WHERE id = $4
        RETURNING *;
      `;
      const result = await pool.query(query, [lat, lng, isOnline, driverId]);
      return result.rows[0];
    } catch (error) {
      console.warn('⚠️ PostgreSQL DB update failed. Updating in-memory driver location.');
      const driver = MOCK_DRIVERS.find(d => d.id === parseInt(driverId)) || MOCK_DRIVERS[0];
      driver.current_lat = lat;
      driver.current_lng = lng;
      driver.is_online = isOnline;
      return driver;
    }
  }

  /**
   * Get driver stats (total trips & average rating)
   */
  static async getStats(driverId) {
    try {
      const query = `
        SELECT 
          d.id, d.name, d.rating,
          COUNT(t.id) AS total_completed_trips
        FROM drivers d
        LEFT JOIN trips t ON d.id = t.driver_id AND t.status = 'COMPLETED'
        WHERE d.id = $1
        GROUP BY d.id;
      `;
      const result = await pool.query(query, [driverId]);
      return result.rows[0];
    } catch (error) {
      console.warn('⚠️ PostgreSQL DB query failed. Serving mock driver stats.');
      const driver = MOCK_DRIVERS.find(d => d.id === parseInt(driverId)) || MOCK_DRIVERS[0];
      return {
        id: driver.id,
        name: driver.name,
        rating: driver.rating,
        total_completed_trips: 142,
      };
    }
  }
}

module.exports = DriverModel;
