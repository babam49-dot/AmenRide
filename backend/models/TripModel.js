/**
 * Model: TripModel
 * Data access layer for trips table in PostgreSQL.
 */
const pool = require('../config/db');

class TripModel {
  /**
   * Create a new trip request
   */
  static async createTrip(data) {
    const {
      passengerName,
      passengerPhone,
      pickupAddress,
      pickupLat,
      pickupLng,
      dropoffAddress,
      dropoffLat,
      dropoffLng,
      vehicleType,
      estimatedFare,
    } = data;

    const query = `
      INSERT INTO trips (
        passenger_name, passenger_phone,
        pickup_address, pickup_lat, pickup_lng,
        dropoff_address, dropoff_lat, dropoff_lng,
        vehicle_type, estimated_fare, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'REQUESTED')
      RETURNING *;
    `;

    const values = [
      passengerName || 'Anonymous Rider',
      passengerPhone || '+251900000000',
      pickupAddress,
      pickupLat,
      pickupLng,
      dropoffAddress,
      dropoffLat,
      dropoffLng,
      vehicleType || 'bajaj',
      estimatedFare || 50,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find trip by ID with joined driver details
   */
  static async findById(tripId) {
    const query = `
      SELECT 
        t.*,
        d.name AS driver_name,
        d.phone AS driver_phone,
        d.vehicle_plate,
        d.rating AS driver_rating
      FROM trips t
      LEFT JOIN drivers d ON t.driver_id = d.id
      WHERE t.id = $1;
    `;
    const result = await pool.query(query, [tripId]);
    return result.rows[0];
  }

  /**
   * Update trip status (e.g. ACCEPTED, DRIVER_ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED)
   */
  static async updateStatus(tripId, status, driverId = null) {
    let query;
    let values;

    if (driverId) {
      query = `
        UPDATE trips
        SET status = $1, driver_id = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *;
      `;
      values = [status, driverId, tripId];
    } else {
      query = `
        UPDATE trips
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *;
      `;
      values = [status, tripId];
    }

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * List active trips
   */
  static async getActiveTrips() {
    const query = `
      SELECT t.*, d.name AS driver_name, d.phone AS driver_phone
      FROM trips t
      LEFT JOIN drivers d ON t.driver_id = d.id
      WHERE t.status IN ('REQUESTED', 'ACCEPTED', 'DRIVER_ARRIVED', 'IN_PROGRESS')
      ORDER BY t.created_at DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = TripModel;
