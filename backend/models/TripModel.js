/**
 * Model: TripModel
 * Workflow helper for trip status transitions and active trip queries.
 */

const TRIPS_STORE = new Map();

class TripModel {
  static createTrip({ riderId, driverId, startLocation, endLocation, fare, vehicleType }) {
    const id = `TRIP-${Date.now()}`;
    const trip = {
      id,
      riderId: riderId || 'RIDER-01',
      driverId: driverId || 'DRV-01',
      startLocation,
      endLocation,
      fare: parseFloat(fare || 150),
      vehicleType: vehicleType || 'Standard Bajaj',
      status: 'SEARCHING',
      createdAt: new Date().toISOString(),
    };
    TRIPS_STORE.set(id, trip);
    return trip;
  }

  static updateStatus(tripId, status) {
    const trip = TRIPS_STORE.get(tripId);
    if (trip) {
      trip.status = status;
      trip.updatedAt = new Date().toISOString();
      TRIPS_STORE.set(tripId, trip);
    }
    return trip || { tripId, status };
  }

  static getTrip(tripId) {
    return TRIPS_STORE.get(tripId) || null;
  }
}

module.exports = TripModel;
