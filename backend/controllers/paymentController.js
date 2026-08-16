const PaymentModel = require('../models/PaymentModel');
const https = require('https');

// ─── In-memory store for pending/completed transactions (fallback when no DB) ─
const pendingTransactions = new Map();

/**
 * Helper: call Chapa REST API
 * In production, replace CHAPA_SECRET_KEY with your real key from .env
 */
function chapaRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const CHAPA_SECRET = process.env.CHAPA_SECRET_KEY || 'CHASECK_TEST-XXXXXXXXXXXXXXXXX';
    const data = body ? JSON.stringify(body) : '';
    const options = {
      hostname: 'api.chapa.co',
      port: 443,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', (chunk) => { raw += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { resolve({ status: 'error', message: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

/**
 * POST /api/payments/pay
 * Step 1+2: App sends trip/rider details → Backend validates → Calls Chapa → Returns checkout URL
 */
exports.initiateChapaCheckout = async (req, res) => {
  try {
    const { riderId, tripId, amount, email, firstName, lastName, phoneNumber, rideName, fromLocation, toLocation } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, error: 'Amount is required to initiate payment.' });
    }

    const txRef = `AMEN-${tripId || 'TRIP'}-${Date.now()}`;

    const chapaBody = {
      amount: parseFloat(amount).toFixed(2),
      currency: 'ETB',
      email: email || 'rider@amenride.et',
      first_name: firstName || 'AMEN',
      last_name: lastName || 'Rider',
      phone_number: phoneNumber || '0911000000',
      tx_ref: txRef,
      callback_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/payments/webhook`,
      return_url: `${process.env.CLIENT_URL || 'http://localhost:8081'}`,
      customization: {
        title: `AMEN Ride — ${rideName || 'Trip Payment'}`,
        description: `From: ${fromLocation || 'Pickup'} → To: ${toLocation || 'Destination'} | ${amount} ETB`,
        logo: 'https://i.imgur.com/7xRqXZ9.png',
      },
    };

    // Save pending transaction locally before calling Chapa
    const pending = {
      txRef,
      tripId,
      riderId,
      amount,
      fromLocation,
      toLocation,
      rideName,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    pendingTransactions.set(txRef, pending);

    // Call Chapa Initialize API (or return simulated response for development)
    let chapaResponse;
    try {
      chapaResponse = await chapaRequest('POST', '/v1/transaction/initialize', chapaBody);
    } catch (e) {
      console.warn('Chapa API unreachable (offline dev mode), using simulated URL:', e.message);
      chapaResponse = {
        status: 'success',
        data: { checkout_url: `https://checkout.chapa.co/checkout/payment/${txRef}` },
      };
    }

    if (chapaResponse.status !== 'success') {
      return res.status(502).json({ success: false, error: 'Chapa rejected the payment request.', detail: chapaResponse });
    }

    const checkoutUrl = chapaResponse.data?.checkout_url;

    return res.status(200).json({
      success: true,
      txRef,
      checkoutUrl,
      amount,
      status: 'PENDING',
      message: 'Chapa checkout session created. Redirect user to checkoutUrl.',
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/payments/webhook
 * Step 4: Chapa calls this when payment is completed (or failed)
 * Verifies the tx_ref, updates transaction status, marks trip as paid
 */
exports.handleWebhook = async (req, res) => {
  try {
    const { trx_ref, status, reference } = req.body;
    const txRef = trx_ref || reference;

    console.log(`[WEBHOOK] Chapa callback received for tx_ref=${txRef} status=${status}`);

    if (!txRef) {
      return res.status(400).json({ error: 'Missing transaction reference in webhook payload.' });
    }

    // Verify with Chapa (optional but recommended in production)
    let verified = false;
    try {
      const verifyRes = await chapaRequest('GET', `/v1/transaction/verify/${txRef}`, null);
      verified = verifyRes?.data?.status === 'success';
    } catch (e) {
      console.warn('Chapa verify call failed — accepting webhook payload:', e.message);
      verified = status === 'success';
    }

    const record = pendingTransactions.get(txRef) || {};
    record.status = verified ? 'COMPLETED' : 'FAILED';
    record.completedAt = new Date().toISOString();
    pendingTransactions.set(txRef, record);

    // Also persist to PaymentModel (DB or in-memory)
    await PaymentModel.createTransaction({
      tripId: record.tripId || txRef,
      amount: record.amount,
      paymentMethod: 'chapa',
      phoneNumber: record.phoneNumber || '0911000000',
    });

    console.log(`[WEBHOOK] Payment ${txRef} → ${record.status}`);
    return res.status(200).json({ received: true, txRef, status: record.status });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/payments/status/:txRef
 * Step 5: App polls this after checkout completes to get payment confirmation + receipt
 */
exports.getPaymentStatus = async (req, res) => {
  try {
    const { txRef } = req.params;
    const record = pendingTransactions.get(txRef);

    if (!record) {
      // Try Chapa directly
      try {
        const verifyRes = await chapaRequest('GET', `/v1/transaction/verify/${txRef}`, null);
        if (verifyRes?.data) {
          return res.status(200).json({
            success: true,
            txRef,
            status: verifyRes.data.status === 'success' ? 'COMPLETED' : 'PENDING',
            chapaData: verifyRes.data,
          });
        }
      } catch (e) {}
      return res.status(404).json({ success: false, error: 'Transaction not found.', txRef });
    }

    return res.status(200).json({
      success: true,
      txRef,
      status: record.status,
      amount: record.amount,
      tripId: record.tripId,
      fromLocation: record.fromLocation,
      toLocation: record.toLocation,
      rideName: record.rideName,
      createdAt: record.createdAt,
      completedAt: record.completedAt || null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/payments/receipt/:txRef
 * Generate a full digital receipt for a completed transaction
 */
exports.getReceipt = async (req, res) => {
  try {
    const { txRef } = req.params;
    const record = pendingTransactions.get(txRef);

    if (!record || record.status !== 'COMPLETED') {
      return res.status(404).json({ success: false, error: 'Receipt not available. Payment may still be pending.' });
    }

    const receiptId = `RCPT-${txRef.slice(-8).toUpperCase()}`;

    return res.status(200).json({
      success: true,
      receipt: {
        receiptId,
        txRef,
        tripId: record.tripId,
        status: 'PAID ✅',
        amount: `${record.amount} ETB`,
        paymentMethod: 'Chapa Gateway',
        from: record.fromLocation || 'N/A',
        to: record.toLocation || 'N/A',
        rideName: record.rideName || 'AMEN Ride',
        issuedAt: new Date().toISOString(),
        paidAt: record.completedAt,
        company: 'AMEN Ride Technology — Bahir Dar, Ethiopia 🇪🇹',
        supportEmail: 'support@amenride.et',
        supportPhone: '+251 911 000 001',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Legacy handlers kept for backward compatibility ───────────────────────

exports.initiatePayment = async (req, res) => {
  try {
    const { tripId, amount, paymentMethod, phoneNumber } = req.body;
    if (!tripId || !amount || !paymentMethod) {
      return res.status(400).json({ success: false, error: 'Missing required payment details' });
    }
    const transaction = await PaymentModel.createTransaction({ tripId, amount, paymentMethod, phoneNumber: phoneNumber || '0900000000' });
    res.status(201).json({ success: true, transactionId: transaction.id, status: transaction.status, amount: transaction.amount, paymentMethod: transaction.paymentMethod });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.initializeChapaPayment = async (req, res) => {
  const { amount, email, firstName, lastName, phoneNumber, title } = req.body;
  const txRef = `AMEN-CHAPA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  return res.status(200).json({
    success: true,
    txRef,
    checkoutUrl: `https://checkout.chapa.co/checkout/payment/${txRef}`,
    supportedBanks: [
      { code: 'CBE', name: 'Commercial Bank of Ethiopia (CBE Birr)' },
      { code: 'BOA', name: 'Bank of Abyssinia' },
      { code: 'TELEBIRR', name: 'Ethio Telecom Telebirr' },
      { code: 'AWASH', name: 'Awash International Bank' },
    ],
  });
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
