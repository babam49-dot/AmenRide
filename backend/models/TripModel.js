/**
 * Model: TripModel
 * Data access layer for trips table in PostgreSQL with offline fallback support.
 */
const pool = require('../config/db');

const MOCK_TRIPS = [
  {
    id: 1,
    passenger_name: 'Sara Worku',
    passenger_phone: '+251911998877',
    pickup_address: 'Felege Hiwot Hospital, Bahir Dar',
    pickup_lat: 11.5980,
    pickup_lng: 37.3820,
    dropoff_address: 'Grand Resort Hotel, Lake Tana',
    dropoff_lat: 11.5936,
    dropoff_lng: 37.3950,
    vehicle_type: 'Standard Bajaj',
    estimated_fare: 120,
    status: 'COMPLETED',
    driver_id: 1,
    driver_name: 'Abebe Bikila',
    driver_phone: '+251911223344',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    passenger_name: 'Dawit Mulatu',
    passenger_phone: '+251922887766',
    pickup_address: 'Blue Nile Bridge, Bahir Dar',
    pickup_lat: 11.5972,
    pickup_lng: 37.3855,
    dropoff_address: 'Kebele 04 Market',
    dropoff_lat: 11.5948,
    dropoff_lng: 37.3915,
    vehicle_type: 'Executive Bajaj',
    estimated_fare: 150,
    status: 'IN_PROGRESS',
    driver_id: 2,
    driver_name: 'Tewodros Kassahun',
    driver_phone: '+251922334455',
    created_at: new Date().toISOString(),
  },
];

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

    try {
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
    } catch (error) {
      console.warn('⚠️ PostgreSQL trip insertion failed. Creating in-memory trip.');
      const newTrip = {
        id: MOCK_TRIPS.length + 1,
        passenger_name: passengerName || 'Anonymous Rider',
        passenger_phone: passengerPhone || '+251900000000',
        pickup_address: pickupAddress,
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        dropoff_address: dropoffAddress,
        dropoff_lat: dropoffLat,
        dropoff_lng: dropoffLng,
        vehicle_type: vehicleType || 'Standard Bajaj',
        estimated_fare: estimatedFare || 120,
        status: 'REQUESTED',
        created_at: new Date().toISOString(),
      };
      MOCK_TRIPS.unshift(newTrip);
      return newTrip;
    }
  }

  /**
   * Find trip by ID with joined driver details
   */
  static async findById(tripId) {
    try {
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
    } catch (error) {
      console.warn('⚠️ PostgreSQL findById query failed. Serving mock trip details.');
      return MOCK_TRIPS.find(t => t.id === parseInt(tripId)) || MOCK_TRIPS[0];
    }
  }

  /**
   * Update trip status
   */
  static async updateStatus(tripId, status, driverId = null) {
    try {
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
    } catch (error) {
      console.warn('⚠️ PostgreSQL updateStatus failed. Updating in-memory trip.');
      const trip = MOCK_TRIPS.find(t => t.id === parseInt(tripId)) || MOCK_TRIPS[0];
      trip.status = status;
      if (driverId) trip.driver_id = driverId;
      return trip;
    }
  }

  /**
   * List active trips
   */
  static async getActiveTrips() {
    try {
      const query = `
        SELECT t.*, d.name AS driver_name, d.phone AS driver_phone
        FROM trips t
        LEFT JOIN drivers d ON t.driver_id = d.id
        WHERE t.status IN ('REQUESTED', 'ACCEPTED', 'DRIVER_ARRIVED', 'IN_PROGRESS')
        ORDER BY t.created_at DESC;
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.warn('⚠️ PostgreSQL getActiveTrips query failed. Serving mock active trips.');
      return MOCK_TRIPS.filter(t => t.status !== 'COMPLETED');
    }
  }
}

module.exports = TripModel;
