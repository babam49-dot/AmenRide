const assert = require('assert');
const PaymentModel = require('../models/PaymentModel');
const RatingModel = require('../models/RatingModel');
const DriverModel = require('../models/DriverModel');
const { BAHIR_DAR_LOCATIONS, findLocationByName } = require('../config/bahirDarLocations');

async function runBackendTests() {
  console.log('🧪 Running Comprehensive Backend Test Suite...');

  // Test 1: PaymentModel create
  const txn = await PaymentModel.createTransaction({
    tripId: 'TRIP-101',
    amount: 250,
    paymentMethod: 'telebirr',
    phoneNumber: '0918000000',
  });

  assert.ok(txn.id, 'Transaction ID should be defined');
  assert.strictEqual(txn.amount, 250, 'Transaction amount should match 250');
  assert.strictEqual(txn.paymentMethod, 'telebirr', 'Payment method should be telebirr');
  console.log('  ✅ [PASS] PaymentModel creates transaction with unique ID');

  // Test 2: Bank Transfer Verification (Telebirr / CBE Birr)
  const validTransfer = await PaymentModel.verifyBankTransfer({
    tripId: 'TRIP-202',
    referenceCode: 'TLB-99882233',
    provider: 'telebirr',
    amount: 320,
  });
  assert.strictEqual(validTransfer.verified, true, 'Valid bank transfer should verify');
  assert.strictEqual(validTransfer.record.status, 'VERIFIED_TRANSFER', 'Status should be VERIFIED_TRANSFER');
  console.log('  ✅ [PASS] PaymentModel verifies valid Telebirr/CBE transfer reference');

  const invalidTransfer = await PaymentModel.verifyBankTransfer({
    tripId: 'TRIP-202',
    referenceCode: '123',
    provider: 'telebirr',
    amount: 320,
  });
  assert.strictEqual(invalidTransfer.verified, false, 'Short or invalid reference should be rejected');
  console.log('  ✅ [PASS] PaymentModel rejects invalid transfer reference');

  // Test 3: Cash Payment Collection
  const cashCollection = await PaymentModel.confirmCashCollection({
    tripId: 'TRIP-303',
    driverId: 'DRV-01',
    amount: 180,
  });
  assert.strictEqual(cashCollection.success, true, 'Cash collection should succeed');
  assert.strictEqual(cashCollection.record.status, 'COLLECTED_CASH', 'Status should be COLLECTED_CASH');
  console.log('  ✅ [PASS] PaymentModel records in-car cash collection by driver');

  // Test 4: Real Bahir Dar Location Dataset & Geocoding
  assert.ok(BAHIR_DAR_LOCATIONS.length >= 12, 'Locations dataset should contain at least 12 real Bahir Dar locations');
  const felege = findLocationByName('Felege Hiwot Hospital');
  assert.strictEqual(felege.name, 'Felege Hiwot Referral Hospital');
  assert.strictEqual(felege.lat, 11.6080);
  assert.strictEqual(felege.lng, 37.3699);
  console.log('  ✅ [PASS] Real Bahir Dar city location geocoding resolves coordinates accurately');

  // Test 5: Driver Model & Heartbeat Updates
  const updatedDriver = await DriverModel.updateLocation(1, 11.6080, 37.3699, true);
  assert.strictEqual(updatedDriver.is_online, true, 'Driver online status should be updated');
  console.log('  ✅ [PASS] DriverModel updates GPS location and connection heartbeat status');

  // Test 6: RatingModel
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
