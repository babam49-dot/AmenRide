/**
 * Controller: EmergencyController
 * Dispatches SOS emergency alerts to police and logs incident records.
 */

const EmergencyModel = require('../models/EmergencyModel');

exports.triggerAlert = async (req, res) => {
  try {
    const { userId, lat, lng, contactPhone, dispatchTarget } = req.body;
    const alert = await EmergencyModel.logAlert({ userId, lat, lng, contactPhone, dispatchTarget });
    return res.status(201).json({
      success: true,
      message: '🚨 SOS Emergency Alert Dispatched to Bahir Dar Police Station',
      alert
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to dispatch SOS alert', message: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await EmergencyModel.getLogs();
    return res.status(200).json({ logs });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch emergency logs', message: error.message });
  }
};
