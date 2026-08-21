/**
 * Model: SavedPlaceModel
 * Stores favorite places (Home, Work, Campus) for quick booking.
 */

const pool = require('../config/db');

const SAVED_PLACES_STORE = new Map([
  [1, { id: 1, user_id: 1, label: 'Home', name: 'Kebele 11 Residence', address: 'Near BDU Poly Campus, Bahir Dar', lat: 11.5880, lng: 37.3812 }],
  [2, { id: 2, user_id: 1, label: 'Work', name: 'Commercial Bank Building', address: 'Kebele 03 Main St, Bahir Dar', lat: 11.5936, lng: 37.3908 }]
]);

class SavedPlaceModel {
  static async getPlaces(userId = 1) {
    try {
      const res = await pool.query(
        `SELECT * FROM saved_places WHERE user_id = $1 ORDER BY id DESC`,
        [userId]
      );
      if (res.rows.length > 0) return res.rows;
    } catch (e) {}

    return Array.from(SAVED_PLACES_STORE.values()).filter(p => p.user_id == userId);
  }

  static async addPlace({ userId, label, name, address, lat, lng }) {
    const id = Date.now();
    try {
      const res = await pool.query(
        `INSERT INTO saved_places (user_id, label, name, address, lat, lng)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userId || 1, label || 'Favorites', name || 'Bahir Dar Landmark', address || 'Bahir Dar', lat || 11.5936, lng || 37.3908]
      );
      return res.rows[0];
    } catch (e) {
      const place = { id, user_id: userId || 1, label: label || 'Favorites', name, address, lat, lng };
      SAVED_PLACES_STORE.set(id, place);
      return place;
    }
  }

  static async deletePlace(id) {
    try {
      await pool.query(`DELETE FROM saved_places WHERE id = $1`, [id]);
    } catch (e) {}
    SAVED_PLACES_STORE.delete(parseInt(id));
    return { success: true, id };
  }
}

module.exports = SavedPlaceModel;
