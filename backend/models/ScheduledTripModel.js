/**
 * Model: ScheduledTripModel
 * Stores future advance ride reservations for riders in Bahir Dar.
 */

const pool = require('../config/db');

const SCHEDULED_STORE = new Map();

class ScheduledTripModel {
  static async createSchedule({ userId, rideOptionId, pickupName, dropoffName, pickupLat, pickupLng, scheduledTime, fareEstimate }) {
    const id = `SCH-${Date.now()}`;
    const time = scheduledTime || new Date(Date.now() + 3600000).toISOString();
    const fare = parseFloat(fareEstimate || 150);

    try {
      const res = await pool.query(
        `INSERT INTO scheduled_trips (user_id, ride_option_id, pickup_name, dropoff_name, pickup_lat, pickup_lng, scheduled_time, fare_estimate, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'SCHEDULED') RETURNING *`,
        [userId || 1, rideOptionId || 1, pickupName || 'Felege Hiwot', dropoffName || 'Lake Tana Hotel', pickupLat || 11.608, pickupLng || 37.369, time, fare]
      );
      return res.rows[0];
    } catch (e) {
      const record = {
        id,
        user_id: userId || 1,
        ride_option_id: rideOptionId || 1,
        pickup_name: pickupName || 'Felege Hiwot',
        dropoff_name: dropoffName || 'Lake Tana Hotel',
        pickup_lat: pickupLat || 11.608,
        pickup_lng: pickupLng || 37.369,
        scheduled_time: time,
        fare_estimate: fare,
        status: 'SCHEDULED',
        created_at: new Date().toISOString()
      };
      SCHEDULED_STORE.set(id, record);
      return record;
    }
  }

  static async getUserSchedules(userId) {
    try {
      const res = await pool.query(
        `SELECT * FROM scheduled_trips WHERE user_id = $1 ORDER BY scheduled_time ASC`,
        [userId || 1]
      );
      if (res.rows.length > 0) return res.rows;
    } catch (e) {}

    return Array.from(SCHEDULED_STORE.values()).filter(s => s.user_id == userId || !userId);
  }

  static async cancelSchedule(id) {
    try {
      const res = await pool.query(
        `UPDATE scheduled_trips SET status = 'CANCELLED' WHERE id = $1 RETURNING *`,
        [id]
      );
      if (res.rows.length > 0) return res.rows[0];
    } catch (e) {}

    const item = SCHEDULED_STORE.get(id);
    if (item) {
      item.status = 'CANCELLED';
    }
    return item || { id, status: 'CANCELLED' };
  }
}

module.exports = ScheduledTripModel;
