const assert = require('assert');
const PaymentModel = require('../models/PaymentModel');
const RatingModel = require('../models/RatingModel');

async function runBackendTests() {
  console.log('🧪 Running Backend Payment & Rating Test Suite...');

  // Test 1: PaymentModel
  const txn = await PaymentModel.createTransaction({
    tripId: 'TRIP-101',
    amount: 250,
    paymentMethod: 'telebirr',
    phoneNumber: '0918000000',
  });

  assert.ok(txn.id, 'Transaction ID should be defined');
  assert.strictEqual(txn.amount, 250, 'Transaction amount should match 250');
  assert.strictEqual(txn.paymentMethod, 'telebirr', 'Payment method should be telebirr');
  assert.strictEqual(txn.status, 'COMPLETED', 'Transaction status should be COMPLETED');
  console.log('  ✅ [PASS] PaymentModel creates transaction with unique ID and COMPLETED status');

  // Test 2: RatingModel
  const driverId = 'DRV-TEST-99';
  await RatingModel.create({ tripId: 'TRIP-1', driverId, rating: 5, comment: 'Excellent' });
  await RatingModel.create({ tripId: 'TRIP-2', driverId, rating: 4, comment: 'Good' });

  const stats = await RatingModel.getDriverStats(driverId);
  assert.strictEqual(stats.totalRatings, 2, 'Total ratings count should be 2');
  assert.strictEqual(stats.averageRating, 4.5, 'Average rating should be 4.5');
  console.log('  ✅ [PASS] RatingModel computes average driver rating correctly');

  console.log('\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!\n');
}

runBackendTests().catch((err) => {
  console.error('❌ [TEST FAILED]:', err.message);
  process.exit(1);
});
