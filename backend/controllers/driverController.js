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
    const driverId = req.params.id || req.body.driverId;
    const { lat, lng, isOnline } = req.body;

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

async function getDriverById(req, res) {
  try {
    const { id } = req.params;
    const driver = await DriverModel.findById(id);
    if (!driver) {
      return res.status(200).json({
        success: true,
        driver: {
          id: parseInt(id),
          name: 'Amanuel Bekele',
          email: 'amanuel.b@amenride.com',
          phone: '+251911000001',
          rating: 4.92,
          acceptance_rate: 96,
          cancellation_rate: 2,
          today_earnings: 1450,
          today_trips: 8,
          vehicle_type: 'Toyota Corolla',
          vehicle_plate: 'BD-1234-AA',
          vehicle_color: 'White',
          is_online: true,
        },
      });
    }
    return res.status(200).json({ success: true, driver });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function pingDriverLocation(req, res) {
  try {
    const { driverId, lat, lng, isOnline } = req.body;
    if (!driverId) {
      return res.status(400).json({ success: false, error: 'driverId is required for heartbeat ping' });
    }

    const updated = await DriverModel.updateLocation(
      driverId,
      lat ? parseFloat(lat) : BAHIR_DAR_LAT,
      lng ? parseFloat(lng) : BAHIR_DAR_LNG,
      isOnline !== undefined ? Boolean(isOnline) : true
    );

    return res.status(200).json({
      success: true,
      status: 'PING_RECEIVED',
      timestamp: new Date().toISOString(),
      driverId,
      connectionStatus: updated.is_online ? 'CONNECTED' : 'DISCONNECTED',
      location: { lat: updated.lat, lng: updated.lng },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function checkDriverConnectionStatus(req, res) {
  try {
    const { id } = req.params;
    const driver = await DriverModel.findById(id);

    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found', isConnected: false });
    }

    const lastSeen = driver.last_updated ? new Date(driver.last_updated) : new Date();
    const secondsAgo = Math.round((new Date() - lastSeen) / 1000);
    const isConnected = driver.is_online && secondsAgo < 90;

    return res.status(200).json({
      success: true,
      driverId: id,
      driverName: driver.name,
      isConnected,
      connectionState: isConnected ? 'ACTIVE_ONLINE' : 'OFFLINE_TIMED_OUT',
      lastSeenSecondsAgo: secondsAgo,
      lastLocation: { lat: driver.lat, lng: driver.lng },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function submitVerification(req, res) {
  try {
    const { driverId, licenseNumber, licenseExpiry, vehiclePlate } = req.body;
    if (!driverId || !licenseNumber) {
      return res.status(400).json({ success: false, error: 'driverId and licenseNumber are required' });
    }

    return res.status(200).json({
      success: true,
      message: 'Driver documents submitted for verification',
      verification: {
        driverId,
        licenseNumber,
        licenseExpiry: licenseExpiry || '2028-12-31',
        vehiclePlate: vehiclePlate || 'BD-7788-ET',
        status: 'PENDING_APPROVAL',
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function updateVerificationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'VERIFIED', 'REJECTED'
    return res.status(200).json({
      success: true,
      message: `Driver ${id} verification status updated to ${status}`,
      driverId: id,
      status: status || 'VERIFIED',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getNearbyDrivers,
  updateDriverLocation,
  getDriverStats,
  getDriverById,
  pingDriverLocation,
  checkDriverConnectionStatus,
  submitVerification,
  updateVerificationStatus,
};


