const PaymentModel = require('../models/PaymentModel');

exports.initiatePayment = async (req, res) => {
  try {
    const { tripId, amount, paymentMethod, phoneNumber } = req.body;
    if (!tripId || !amount || !paymentMethod) {
      return res.status(400).json({ success: false, error: 'Missing required payment details' });
    }

    const transaction = await PaymentModel.createTransaction({
      tripId,
      amount,
      paymentMethod,
      phoneNumber: phoneNumber || '0900000000',
    });

    res.status(201).json({
      success: true,
      transactionId: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await PaymentModel.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    const updated = await PaymentModel.updateStatus(transactionId, status || 'COMPLETED');
    res.json({ success: true, transaction: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
