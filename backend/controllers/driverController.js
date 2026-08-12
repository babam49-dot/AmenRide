/**
 * Controller: driverController
 * Handles request handling and responses for driver domain operations.
 */
const DriverModel = require('../models/DriverModel');

// Default fallback coordinates: Bahir Dar City Center
const BAHIR_DAR_LAT = 11.5936;
const BAHIR_DAR_LNG = 37.3908;

async function getNearbyDrivers(req, res) {
  try {
    const lat = parseFloat(req.query.lat) || BAHIR_DAR_LAT;
    const lng = parseFloat(req.query.lng) || BAHIR_DAR_LNG;
    const radius = parseFloat(req.query.radius) || 5;

    const drivers = await DriverModel.findNearby(lat, lng, radius);

    return res.status(200).json({
      success: true,
      count: drivers.length,
      search_center: { lat, lng, radius_km: radius },
      drivers,
    });
  } catch (error) {
    console.error('Error fetching nearby drivers:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve nearby drivers',
      details: error.message,
    });
  }
}

async function updateDriverLocation(req, res) {
  try {
    const { driverId, lat, lng, isOnline } = req.body;

    if (!driverId || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: driverId, lat, lng',
      });
    }

    const updatedDriver = await DriverModel.updateLocation(
      driverId,
      parseFloat(lat),
      parseFloat(lng),
      isOnline !== undefined ? Boolean(isOnline) : true
    );

    return res.status(200).json({
      success: true,
      driver: updatedDriver,
    });
  } catch (error) {
    console.error('Error updating driver location:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update location',
      details: error.message,
    });
  }
}

async function getDriverStats(req, res) {
  try {
    const { id } = req.params;
    const stats = await DriverModel.getStats(id);

    if (!stats) {
      return res.status(404).json({
        success: false,
        error: 'Driver not found',
      });
    }

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching driver stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch driver stats',
      details: error.message,
    });
  }
}

module.exports = {
  getNearbyDrivers,
  updateDriverLocation,
  getDriverStats,
};
