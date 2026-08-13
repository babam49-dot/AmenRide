const PaymentModel = require('../models/PaymentModel');
const RatingModel = require('../models/RatingModel');

describe('Backend Payment & Rating Models Test Suite', () => {
  test('PaymentModel creates transaction with unique ID and COMPLETED status', async () => {
    const txn = await PaymentModel.createTransaction({
      tripId: 'TRIP-101',
      amount: 250,
      paymentMethod: 'telebirr',
      phoneNumber: '0918000000',
    });

    expect(txn.id).toBeDefined();
    expect(txn.amount).toBe(250);
    expect(txn.paymentMethod).toBe('telebirr');
    expect(txn.status).toBe('COMPLETED');
  });

  test('RatingModel computes average driver rating correctly', async () => {
    const driverId = 'DRV-TEST-99';
    await RatingModel.create({ tripId: 'TRIP-1', driverId, rating: 5, comment: 'Excellent' });
    await RatingModel.create({ tripId: 'TRIP-2', driverId, rating: 4, comment: 'Good' });

    const stats = await RatingModel.getDriverStats(driverId);
    expect(stats.totalRatings).toBe(2);
    expect(stats.averageRating).toBe(4.5);
  });
});
