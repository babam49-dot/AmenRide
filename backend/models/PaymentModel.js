// DB is lazy-loaded only when USE_POSTGRES=true to prevent startup errors
// when PostgreSQL is not configured
const getDb = () => require('../config/db');

// In-memory fallback repository for transaction logs

const transactionsDb = new Map();

class PaymentModel {
  static async createTransaction({ tripId, amount, paymentMethod, phoneNumber }) {
    const id = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record = {
      id,
      tripId,
      amount,
      paymentMethod,
      phoneNumber,
      status: 'COMPLETED',
      createdAt: new Date().toISOString(),
    };

    if (process.env.USE_POSTGRES === 'true') {
      try {
        const query = `
          INSERT INTO payments (id, trip_id, amount, payment_method, phone_number, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        const res = await getDb().query(query, [id, tripId, amount, paymentMethod, phoneNumber, 'COMPLETED']);
        return res.rows[0];
      } catch (err) {
        console.warn('PostgreSQL payment insert fallback:', err.message);
      }
    }

    transactionsDb.set(id, record);
    return record;
  }

  static async findById(id) {
    if (process.env.USE_POSTGRES === 'true') {
      try {
        const res = await getDb().query('SELECT * FROM payments WHERE id = $1', [id]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.warn('PostgreSQL payment query fallback:', err.message);
      }
    }
    return transactionsDb.get(id) || null;
  }

  static async updateStatus(id, status) {
    const record = transactionsDb.get(id);
    if (record) {
      record.status = status;
      transactionsDb.set(id, record);
    }
    return record || { id, status };
  }
}

module.exports = PaymentModel;
