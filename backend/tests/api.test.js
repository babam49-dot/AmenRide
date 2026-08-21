const assert = require('assert');
const PaymentModel = require('../models/PaymentModel');
const RatingModel = require('../models/RatingModel');
const DriverModel = require('../models/DriverModel');
const { BAHIR_DAR_LOCATIONS, findLocationByName } = require('../config/bahirDarLocations');

const PromoModel = require('../models/PromoModel');
const PayoutModel = require('../models/PayoutModel');
const ScheduledTripModel = require('../models/ScheduledTripModel');
const SurgeZoneModel = require('../models/SurgeZoneModel');
const EmergencyModel = require('../models/EmergencyModel');
const SavedPlaceModel = require('../models/SavedPlaceModel');

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

  // Test 7: PromoModel
  const promoRes = await PromoModel.validatePromoCode('AMENBAHIR', 200);
  assert.strictEqual(promoRes.valid, true, 'AMENBAHIR promo should be valid');
  assert.strictEqual(promoRes.discountAmountETB, 40, 'Discount amount for 200 ETB at 20% should be 40 ETB');
  console.log('  ✅ [PASS] PromoModel validates promo codes and calculates discounts');

  // Test 8: PayoutModel
  const payout = await PayoutModel.requestPayout({ driverId: 1, amountETB: 500, paymentMethod: 'Telebirr', accountNumber: '0911000001' });
  assert.ok(payout, 'Payout request should be created');
  assert.strictEqual(payout.amount_etb, 500, 'Payout amount should match');
  console.log('  ✅ [PASS] PayoutModel processes driver payout requests');

  // Test 9: ScheduledTripModel
  const schedule = await ScheduledTripModel.createSchedule({ userId: 1, pickupName: 'Airport', dropoffName: 'Hotel', scheduledTime: '2026-09-01T08:00:00Z', fareEstimate: 250 });
  assert.strictEqual(schedule.status, 'SCHEDULED', 'Schedule status should be SCHEDULED');
  console.log('  ✅ [PASS] ScheduledTripModel reserves future trips');

  // Test 10: SurgeZoneModel & EmergencyModel & SavedPlaceModel
  const zones = await SurgeZoneModel.getAllZones();
  assert.ok(zones.length > 0, 'Surge zones should be retrieved');

  const alert = await EmergencyModel.logAlert({ userId: 1, lat: 11.6, lng: 37.3, contactPhone: '991' });
  assert.strictEqual(alert.status, 'DISPATCHED', 'Emergency alert should be DISPATCHED');

  const places = await SavedPlaceModel.getPlaces(1);
  assert.ok(places.length > 0, 'Saved places should be retrieved');
  console.log('  ✅ [PASS] Surge, Emergency, and SavedPlace models function properly');

  console.log('\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!\n');
}

runBackendTests().catch((err) => {
  console.error('❌ [TEST FAILED]:', err.message);
  process.exit(1);
});

