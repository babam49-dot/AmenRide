const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { rateLimiter } = require('../middleware/auth');

router.use(rateLimiter);

// ─── Full E2E Chapa Payment Flow ───────────────────────────────────────────
// Step 1+2: App initiates payment → backend calls Chapa → returns checkout URL
router.post('/pay', paymentController.initiateChapaCheckout);

// Step 4: Chapa POSTs here when payment is authorized by user
router.post('/webhook', paymentController.handleWebhook);

// Step 5: App polls this to get payment confirmation status
router.get('/status/:txRef', paymentController.getPaymentStatus);

// Step 5b: Fetch full digital receipt for a completed transaction
router.get('/receipt/:txRef', paymentController.getReceipt);

// ─── Bank Transfer & Cash Verification ─────────────────────────────────────
router.post('/verify-transfer', paymentController.verifyBankTransfer);
router.post('/confirm-cash', paymentController.confirmCashPayment);

// ─── Legacy routes ─────────────────────────────────────────────────────────
router.post('/initiate', paymentController.initiatePayment);
router.post('/chapa-initialize', paymentController.initializeChapaPayment);

// ─── Real Account Verification & Per-KM Deduction Engine ───────────────────
router.post('/verify-and-deduct', paymentController.verifyAndDeductAccount);
router.get('/sample-accounts', paymentController.getSampleAccounts);

module.exports = router;

