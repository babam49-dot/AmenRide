/**
 * Controller: PayoutController
 * Handles driver payout creation, queries, and dispatcher status updates.
 */

const PayoutModel = require('../models/PayoutModel');

exports.requestPayout = async (req, res) => {
  try {
    const { driverId, amountETB, paymentMethod, accountNumber } = req.body;
    if (!amountETB || amountETB <= 0) {
      return res.status(400).json({ error: 'Payout amount must be greater than 0 ETB' });
    }
    const payout = await PayoutModel.requestPayout({ driverId, amountETB, paymentMethod, accountNumber });
    return res.status(201).json({ message: 'Payout request submitted successfully', payout });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to request payout', message: error.message });
  }
};

exports.getDriverPayouts = async (req, res) => {
  try {
    const { driverId } = req.params;
    const payouts = await PayoutModel.getDriverPayouts(driverId);
    return res.status(200).json({ payouts });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch driver payouts', message: error.message });
  }
};

exports.getAllPayouts = async (req, res) => {
  try {
    const payouts = await PayoutModel.getAllPayouts();
    return res.status(200).json({ payouts });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch payouts', message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const payout = await PayoutModel.updatePayoutStatus(id, status);
    return res.status(200).json({ message: `Payout status updated to ${status}`, payout });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update payout status', message: error.message });
  }
};
