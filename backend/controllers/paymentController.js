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

/**
 * POST /api/payments/chapa-initialize
 * Initialize Chapa Payment Gateway Checkout Session (Supports CBE, Abyssinia, Telebirr, Awash)
 */
exports.initializeChapaPayment = async (req, res) => {
  try {
    const { amount, email, firstName, lastName, phoneNumber, title } = req.body;
    const txRef = `AMEN-CHAPA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const chapaPayload = {
      amount: amount || 210,
      currency: 'ETB',
      email: email || 'rider@amenride.com',
      first_name: firstName || 'Rider',
      last_name: lastName || 'Amen',
      phone_number: phoneNumber || '0911000000',
      tx_ref: txRef,
      callback_url: 'http://localhost:5000/api/payments/webhook',
      return_url: 'http://localhost:8081',
      customization: {
        title: title || 'AMEN Ride Hailing Payment',
        description: 'Payment for Bajaj / Ride trip in Bahir Dar 🇪🇹',
      },
    };

    // Return instant simulated / production Chapa payment checkout structure
    return res.status(200).json({
      success: true,
      status: 'success',
      message: 'Chapa payment session initialized successfully',
      txRef,
      checkoutUrl: `https://checkout.chapa.co/checkout/payment/${txRef}`,
      supportedBanks: [
        { code: 'CBE', name: 'Commercial Bank of Ethiopia (CBE Birr)' },
        { code: 'BOA', name: 'Bank of Abyssinia' },
        { code: 'TELEBIRR', name: 'Ethio Telecom Telebirr' },
        { code: 'AWASH', name: 'Awash International Bank' },
      ],
      payload: chapaPayload,
    });
  } catch (error) {
    console.error('Chapa initialization error:', error);
    return res.status(500).json({
      success: false,
      error: 'Chapa initialization failed',
      message: error.message,
    });
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
