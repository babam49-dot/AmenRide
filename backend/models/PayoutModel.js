/**
 * Model: PayoutModel
 * Handles driver earnings payout requests via Telebirr or CBE Birr.
 */

const pool = require('../config/db');

const PAYOUTS_STORE = new Map();

class PayoutModel {
  static async requestPayout({ driverId, amountETB, paymentMethod, accountNumber }) {
    const id = `POUT-${Date.now()}`;
    const amount = parseFloat(amountETB || 0);
    const method = paymentMethod || 'Telebirr';

    try {
      const res = await pool.query(
        `INSERT INTO payouts (driver_id, amount_etb, payment_method, account_number, status)
         VALUES ($1, $2, $3, $4, 'PENDING') RETURNING *`,
        [driverId || 1, amount, method, accountNumber || '0911000000']
      );
      return res.rows[0];
    } catch (e) {
      const record = {
        id,
        driver_id: driverId || 1,
        amount_etb: amount,
        payment_method: method,
        account_number: accountNumber || '0911000000',
        status: 'PENDING',
        requested_at: new Date().toISOString()
      };
      PAYOUTS_STORE.set(id, record);
      return record;
    }
  }

  static async getDriverPayouts(driverId) {
    try {
      const res = await pool.query(
        `SELECT * FROM payouts WHERE driver_id = $1 ORDER BY requested_at DESC`,
        [driverId || 1]
      );
      if (res.rows.length > 0) return res.rows;
    } catch (e) {}

    return Array.from(PAYOUTS_STORE.values()).filter(p => p.driver_id == driverId);
  }

  static async getAllPayouts() {
    try {
      const res = await pool.query(`SELECT * FROM payouts ORDER BY requested_at DESC`);
      if (res.rows.length > 0) return res.rows;
    } catch (e) {}

    return Array.from(PAYOUTS_STORE.values());
  }

  static async updatePayoutStatus(payoutId, status) {
    try {
      const res = await pool.query(
        `UPDATE payouts SET status = $1, processed_at = NOW() WHERE id = $2 RETURNING *`,
        [status, payoutId]
      );
      if (res.rows.length > 0) return res.rows[0];
    } catch (e) {}

    const item = PAYOUTS_STORE.get(payoutId);
    if (item) {
      item.status = status;
      item.processed_at = new Date().toISOString();
    }
    return item || { id: payoutId, status };
  }
}

module.exports = PayoutModel;
