/**
 * Controller: ScheduledTripController
 * Operations for reserving rides in advance and cancelling reservations.
 */

const ScheduledTripModel = require('../models/ScheduledTripModel');

exports.createSchedule = async (req, res) => {
  try {
    const { userId, rideOptionId, pickupName, dropoffName, pickupLat, pickupLng, scheduledTime, fareEstimate } = req.body;
    if (!pickupName || !dropoffName || !scheduledTime) {
      return res.status(400).json({ error: 'Pickup location, dropoff location, and scheduled time are required' });
    }
    const schedule = await ScheduledTripModel.createSchedule({ userId, rideOptionId, pickupName, dropoffName, pickupLat, pickupLng, scheduledTime, fareEstimate });
    return res.status(201).json({ message: 'Ride scheduled successfully', schedule });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to schedule ride', message: error.message });
  }
};

exports.getUserSchedules = async (req, res) => {
  try {
    const { userId } = req.params;
    const schedules = await ScheduledTripModel.getUserSchedules(userId);
    return res.status(200).json({ schedules });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch scheduled rides', message: error.message });
  }
};

exports.cancelSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await ScheduledTripModel.cancelSchedule(id);
    return res.status(200).json({ message: 'Scheduled ride cancelled', schedule });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to cancel scheduled ride', message: error.message });
  }
};
