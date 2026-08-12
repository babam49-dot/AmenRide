/**
 * Model: DriverModel
 * Data access layer for drivers table in PostgreSQL.
 */
const pool = require('../config/db');

class DriverModel {
  /**
   * Find nearby online drivers within radius (km)
   */
  static async findNearby(lat, lng, radiusKm = 5) {
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
  }

  /**
   * Update driver location and online status
   */
  static async updateLocation(driverId, lat, lng, isOnline = true) {
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
  }

  /**
   * Get driver stats (total trips & average rating)
   */
  static async getStats(driverId) {
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
  }
}

module.exports = DriverModel;
