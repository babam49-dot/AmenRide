/**
 * Model: SurgeZoneModel
 * Manages geographic demand surge multipliers in Bahir Dar.
 */

const pool = require('../config/db');

const SURGE_ZONES_STORE = new Map([
  [1, { id: 1, zone_name: 'Felege Hiwot Hospital Area', lat: 11.6080, lng: 37.3699, radius_km: 2.0, surge_multiplier: 1.25 }],
  [2, { id: 2, zone_name: 'Bahir Dar Airport Zone', lat: 11.6041, lng: 37.3724, radius_km: 3.0, surge_multiplier: 1.40 }],
  [3, { id: 3, zone_name: 'BDU Peda Campus Hub', lat: 11.5880, lng: 37.3812, radius_km: 1.5, surge_multiplier: 1.15 }],
  [4, { id: 4, zone_name: 'Lake Tana Resort Strip', lat: 11.5936, lng: 37.3950, radius_km: 2.5, surge_multiplier: 1.30 }]
]);

class SurgeZoneModel {
  static async getAllZones() {
    try {
      const res = await pool.query(`SELECT * FROM surge_zones ORDER BY id ASC`);
      if (res.rows.length > 0) return res.rows;
    } catch (e) {}
    return Array.from(SURGE_ZONES_STORE.values());
  }

  static async updateZoneMultiplier(zoneId, multiplier) {
    const mult = parseFloat(multiplier || 1.0);
    try {
      const res = await pool.query(
        `UPDATE surge_zones SET surge_multiplier = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [mult, zoneId]
      );
      if (res.rows.length > 0) return res.rows[0];
    } catch (e) {}

    const zone = SURGE_ZONES_STORE.get(parseInt(zoneId));
    if (zone) {
      zone.surge_multiplier = mult;
      zone.updated_at = new Date().toISOString();
    }
    return zone || { id: zoneId, surge_multiplier: mult };
  }
}

module.exports = SurgeZoneModel;
