/**
 * Model: EmergencyModel
 * Logs and tracks SOS emergency dispatches for rider & driver safety.
 */

const pool = require('../config/db');

const EMERGENCY_STORE = new Map([
  [1, { id: 1, user_id: 1, lat: 11.6080, lng: 37.3699, contact_phone: '+251912345678', dispatch_target: 'Felege Hiwot Police Station', status: 'RESOLVED', created_at: new Date().toISOString() }]
]);

class EmergencyModel {
  static async logAlert({ userId, lat, lng, contactPhone, dispatchTarget }) {
    const id = Date.now();
    try {
      const res = await pool.query(
        `INSERT INTO emergency_logs (user_id, lat, lng, contact_phone, dispatch_target, status)
         VALUES ($1, $2, $3, $4, $5, 'DISPATCHED') RETURNING *`,
        [userId || 1, lat || 11.5936, lng || 37.3908, contactPhone || '+251911000000', dispatchTarget || 'Bahir Dar Central Police Line (991)']
      );
      return res.rows[0];
    } catch (e) {
      const log = {
        id,
        user_id: userId || 1,
        lat: lat || 11.5936,
        lng: lng || 37.3908,
        contact_phone: contactPhone || '+251911000000',
        dispatch_target: dispatchTarget || 'Bahir Dar Central Police Line (991)',
        status: 'DISPATCHED',
        created_at: new Date().toISOString()
      };
      EMERGENCY_STORE.set(id, log);
      return log;
    }
  }

  static async getLogs() {
    try {
      const res = await pool.query(`SELECT * FROM emergency_logs ORDER BY created_at DESC`);
      if (res.rows.length > 0) return res.rows;
    } catch (e) {}

    return Array.from(EMERGENCY_STORE.values());
  }
}

module.exports = EmergencyModel;
