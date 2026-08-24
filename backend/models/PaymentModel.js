// DB is lazy-loaded only when USE_POSTGRES=true to prevent startup errors
// when PostgreSQL is not configured
const getDb = () => require('../config/db');

// In-memory fallback repository for transaction logs

// In-memory fallback repository for transaction logs and sample accounts
const transactionsDb = new Map();

const SAMPLE_ACCOUNTS = new Map([
  ['0911223344', { provider: 'Telebirr', accountNumber: '0911223344', accountName: 'Tewodros Zewudu', balance: 1500.00, pin: '1234' }],
  ['0912345678', { provider: 'Telebirr', accountNumber: '0912345678', accountName: 'Amanuel Bekele', balance: 850.00, pin: '1234' }],
  ['0911000001', { provider: 'Telebirr', accountNumber: '0911000001', accountName: 'Meron Tadesse (Low Bal)', balance: 35.00, pin: '1234' }],
  ['100088997766', { provider: 'CBE Birr', accountNumber: '100088997766', accountName: 'Tewodros Zewudu', balance: 3200.00, pin: '1234' }],
  ['100012345678', { provider: 'CBE Birr', accountNumber: '100012345678', accountName: 'Kebede Alemu', balance: 120.00, pin: '1234' }],
  ['0918000000', { provider: 'Chapa', accountNumber: '0918000000', accountName: 'AMEN Registered Rider', balance: 2500.00, pin: '1234' }]
]);

class PaymentModel {
  static getSampleAccounts() {
    return Array.from(SAMPLE_ACCOUNTS.values());
  }

  static async verifyAndDeductAccount({ accountNumber, provider, distanceKm, ratePerKm = 25, baseFare = 40, tripId }) {
    const cleanAccount = (accountNumber || '').trim();
    if (!cleanAccount) {
      return { success: false, error: 'Please enter or link a valid account number.' };
    }

    const dist = parseFloat(distanceKm || 4.2);
    const rate = parseFloat(ratePerKm || 25);
    const base = parseFloat(baseFare || 40);
    const calculatedFare = Math.round((base + dist * rate) * 100) / 100;

    let account = SAMPLE_ACCOUNTS.get(cleanAccount);
    if (!account) {
      // Auto-register custom account with 1000 ETB starting balance for instant testing
      account = {
        provider: provider || 'Telebirr',
        accountNumber: cleanAccount,
        accountName: 'AMEN Registered Rider',
        balance: 1000.00,
        pin: '1234'
      };
      SAMPLE_ACCOUNTS.set(cleanAccount, account);
    }

    if (account.balance < calculatedFare) {
      return {
        success: false,
        error: `❌ Insufficient Funds! Account (${cleanAccount}) balance is ${account.balance.toFixed(2)} ETB, but trip fare is ${calculatedFare.toFixed(2)} ETB (${dist} km × ${rate} ETB/km + ${base} ETB base).`,
        accountName: account.accountName,
        currentBalance: account.balance,
        requiredFare: calculatedFare
      };
    }

    // DEDUCT FARE MONEY DIRECTLY FROM ACCOUNT BALANCE
    account.balance = Math.round((account.balance - calculatedFare) * 100) / 100;
    SAMPLE_ACCOUNTS.set(cleanAccount, account);

    const txnId = `TXN-DEDUCT-${Date.now()}`;
    const record = {
      id: txnId,
      tripId: tripId || `TRIP-${Date.now()}`,
      accountNumber: cleanAccount,
      accountName: account.accountName,
      provider: account.provider || provider,
      distanceKm: dist,
      ratePerKm: rate,
      baseFare: base,
      deductedAmount: calculatedFare,
      remainingBalance: account.balance,
      status: 'PAID_DEDUCTED',
      timestamp: new Date().toISOString()
    };

    transactionsDb.set(txnId, record);

    return {
      success: true,
      message: `🎉 BOOM! Payment Verified & Deducted! ${calculatedFare.toFixed(2)} ETB deducted from ${account.accountName}'s ${account.provider} account (${cleanAccount}).`,
      proof: {
        transactionId: txnId,
        accountName: account.accountName,
        accountNumber: cleanAccount,
        provider: account.provider,
        distanceKm: dist,
        ratePerKm: rate,
        baseFare: base,
        deductedETB: calculatedFare,
        remainingBalanceETB: account.balance,
        status: 'SUCCESSFULLY_DEDUCTED ✅',
        deductedAt: record.timestamp
      }
    };
  }

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

