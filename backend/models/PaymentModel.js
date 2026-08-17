// DB is lazy-loaded only when USE_POSTGRES=true to prevent startup errors
// when PostgreSQL is not configured
const getDb = () => require('../config/db');

// In-memory fallback repository for transaction logs

const transactionsDb = new Map();

class PaymentModel {
  static async createTransaction({ tripId, amount, paymentMethod, phoneNumber, referenceCode, status }) {
    const id = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record = {
      id,
      tripId,
      amount: parseFloat(amount),
      paymentMethod,
      phoneNumber,
      referenceCode: referenceCode || null,
      status: status || (paymentMethod === 'cash' ? 'PENDING_CASH' : 'PENDING'),
      createdAt: new Date().toISOString(),
    };

    if (process.env.USE_POSTGRES === 'true') {
      try {
        const query = `
          INSERT INTO payments (id, trip_id, amount, payment_method, phone_number, status)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *;
        `;
        const res = await getDb().query(query, [id, tripId, amount, paymentMethod, phoneNumber, record.status]);
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

  static async verifyBankTransfer({ tripId, referenceCode, provider, amount }) {
    const cleanRef = (referenceCode || '').trim();
    if (!cleanRef || cleanRef.length < 5) {
      return { verified: false, error: 'Invalid or missing bank transfer reference code. Must be at least 5 characters.' };
    }

    const txnId = `TXN-BANK-${Date.now()}`;
    const record = {
      id: txnId,
      tripId,
      amount: parseFloat(amount || 0),
      paymentMethod: provider || 'bank_transfer',
      referenceCode: cleanRef,
      status: 'VERIFIED_TRANSFER',
      verifiedAt: new Date().toISOString(),
    };

    transactionsDb.set(txnId, record);
    return { verified: true, record };
  }

  static async confirmCashCollection({ tripId, driverId, amount }) {
    const txnId = `TXN-CASH-${Date.now()}`;
    const record = {
      id: txnId,
      tripId,
      driverId,
      amount: parseFloat(amount || 0),
      paymentMethod: 'cash',
      status: 'COLLECTED_CASH',
      collectedAt: new Date().toISOString(),
    };

    transactionsDb.set(txnId, record);
    return { success: true, record };
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
