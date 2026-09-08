/**
 * Controller: tripController
 * Handles passenger trip creation, status transitions, and trip detail retrieval.
 */
const TripModel = require('../models/TripModel');

function calculateSurgeMultiplier(hour = new Date().getHours()) {
  // Peak Bahir Dar commuting hours (7-9 AM & 5-8 PM)
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20)) {
    return 1.25;
  }
  return 1.0;
}

async function createTrip(req, res) {
  try {
    const { pickupAddress, pickupLat, pickupLng, dropoffAddress, dropoffLat, dropoffLng } = req.body;

    if (!pickupAddress || pickupLat === undefined || pickupLng === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Pickup location (address, lat, lng) is required.',
      });
    }

    if (!dropoffAddress || dropoffLat === undefined || dropoffLng === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Dropoff location (address, lat, lng) is required.',
      });
    }

    const trip = await TripModel.createTrip(req.body);

    return res.status(201).json({
      success: true,
      message: 'Trip requested successfully',
      trip,
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create trip request',
      details: error.message,
    });
  }
}

async function getTripById(req, res) {
  try {
    const { id } = req.params;
    const trip = await TripModel.findById(id);

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: `Trip with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      trip,
    });
  } catch (error) {
    console.error('Error retrieving trip:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve trip details',
      details: error.message,
    });
  }
}

async function updateTripStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, driverId } = req.body;

    const validStatuses = ['REQUESTED', 'ACCEPTED', 'DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updatedTrip = await TripModel.updateStatus(id, status.toUpperCase(), driverId);

    if (!updatedTrip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found or status not changed',
      });
    }

    return res.status(200).json({
      success: true,
      trip: updatedTrip,
    });
  } catch (error) {
    console.error('Error updating trip status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update trip status',
      details: error.message,
    });
  }
}

async function listActiveTrips(req, res) {
  try {
    const activeTrips = await TripModel.getActiveTrips();
    return res.status(200).json({
      success: true,
      count: activeTrips.length,
      trips: activeTrips,
    });
  } catch (error) {
    console.error('Error listing active trips:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch active trips',
      details: error.message,
    });
  }
}

async function getUserTrips(req, res) {
  try {
    const userId = req.query.userId || 1;
    const activeTrips = await TripModel.getActiveTrips();
    const fallbackTrips = [
      { id: 1, pickup_name: 'Bahir Dar Airport',      pickup_addr: 'Felege Hiwot, Bahir Dar',  dropoff_name: 'Grand Resort Hotel',   dropoff_addr: 'Kebele 03, Bahir Dar',  fare: 210, status: 'completed', ride_icon: '🚗' },
      { id: 2, pickup_name: 'Bahir Dar University',   pickup_addr: 'Kebele 11, Bahir Dar',     dropoff_name: 'Lake Tana Hotel',      dropoff_addr: 'Kebele 03, Bahir Dar',  fare: 120, status: 'completed', ride_icon: '🚗' },
      { id: 3, pickup_name: 'Poly-Technic College',   pickup_addr: 'Kebele 08, Bahir Dar',     dropoff_name: 'Ghion Hotel',          dropoff_addr: 'Kebele 05, Bahir Dar',  fare: 45,  status: 'completed', ride_icon: '🏍️' },
      { id: 4, pickup_name: 'Bahir Dar Bus Terminal', pickup_addr: 'Kebele 01, Bahir Dar',     dropoff_name: 'Bahir Dar University', dropoff_addr: 'Kebele 11, Bahir Dar',  fare: 85,  status: 'completed', ride_icon: '🚗' },
    ];
    return res.status(200).json({
      success: true,
      trips: activeTrips.length > 0 ? activeTrips : fallbackTrips,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function estimateFareAndEta(req, res) {
  try {
    const { pickupLat = 11.594, pickupLng = 37.388, dropoffLat = 11.600, dropoffLng = 37.395, rideType = 'standard' } = req.body;
    
    // Haversine distance formula approximation
    const dLat = (dropoffLat - pickupLat) * 111.1; // km per degree lat
    const dLng = (dropoffLng - pickupLng) * 111.1 * Math.cos(pickupLat * (Math.PI / 180));
    const distanceKm = Math.max(1.2, parseFloat(Math.sqrt(dLat * dLat + dLng * dLng).toFixed(2)));

    const hour = new Date().getHours();
    const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
    const surgeMultiplier = isPeakHour ? 1.3 : 1.0;

    const baseFares = {
      standard: { base: 30, perKm: 15 },
      comfort: { base: 60, perKm: 25 },
      express: { base: 20, perKm: 10 },
      corporate: { base: 80, perKm: 35 },
    };

    const rate = baseFares[rideType] || baseFares.standard;
    const estimatedFareETB = Math.round((rate.base + distanceKm * rate.perKm) * surgeMultiplier);
    const estimatedEtaMinutes = Math.max(3, Math.round(distanceKm * 2.5));

    return res.status(200).json({
      success: true,
      distanceKm,
      estimatedEtaMinutes,
      estimatedFareETB,
      surgeMultiplier,
      currency: 'ETB',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate fare estimate',
      details: error.message,
    });
  }
}

module.exports = {
  createTrip,
  getTripById,
  updateTripStatus,
  listActiveTrips,
  getUserTrips,
  estimateFareAndEta,
};


