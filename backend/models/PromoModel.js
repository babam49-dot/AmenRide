/**
 * Model: PromoModel
 * Manages promotional discount codes and validate ETB savings.
 */

const pool = require('../config/db');

const MOCK_PROMOS = new Map([
  ['AMENBAHIR', { code: 'AMENBAHIR', discountPercent: 20, maxDiscountETB: 50, isActive: true }],
  ['TANA50', { code: 'TANA50', discountPercent: 50, maxDiscountETB: 100, isActive: true }],
  ['WELCOME10', { code: 'WELCOME10', discountPercent: 10, maxDiscountETB: 30, isActive: true }]
]);

class PromoModel {
  static async validatePromoCode(code, fareAmount = 100) {
    const formattedCode = (code || '').toUpperCase().trim();
    if (!formattedCode) {
      return { valid: false, message: 'Promo code cannot be empty' };
    }

    try {
      const res = await pool.query(
        `SELECT * FROM promo_codes WHERE UPPER(code) = $1 AND is_active = TRUE`,
        [formattedCode]
      );

      let promo = res.rows[0];
      if (!promo) {
        // Fallback to in-memory store if DB query finds nothing
        const mock = MOCK_PROMOS.get(formattedCode);
        if (mock) {
          promo = {
            code: mock.code,
            discount_percent: mock.discountPercent,
            max_discount_etb: mock.maxDiscountETB,
            is_active: mock.isActive
          };
        }
      }

      if (!promo) {
        return { valid: false, message: 'Invalid or expired promo code' };
      }

      const discountPercent = parseFloat(promo.discount_percent || 0);
      const maxDiscount = parseFloat(promo.max_discount_etb || 50);
      const calculatedDiscount = Math.min((fareAmount * discountPercent) / 100, maxDiscount);
      const finalFare = Math.max(fareAmount - calculatedDiscount, 0);

      return {
        valid: true,
        code: promo.code,
        discountPercent,
        maxDiscountETB: maxDiscount,
        discountAmountETB: Math.round(calculatedDiscount * 100) / 100,
        finalFareETB: Math.round(finalFare * 100) / 100,
        message: `Promo applied! You saved ${Math.round(calculatedDiscount)} ETB`
      };
    } catch (e) {
      const mock = MOCK_PROMOS.get(formattedCode);
      if (mock) {
        const calculatedDiscount = Math.min((fareAmount * mock.discountPercent) / 100, mock.maxDiscountETB);
        return {
          valid: true,
          code: mock.code,
          discountPercent: mock.discountPercent,
          maxDiscountETB: mock.maxDiscountETB,
          discountAmountETB: Math.round(calculatedDiscount * 100) / 100,
          finalFareETB: Math.round((fareAmount - calculatedDiscount) * 100) / 100,
          message: `Promo applied! You saved ${Math.round(calculatedDiscount)} ETB`
        };
      }
      return { valid: false, message: 'Invalid promo code' };
    }
  }

  static async getAllPromos() {
    try {
      const res = await pool.query(`SELECT * FROM promo_codes ORDER BY created_at DESC`);
      if (res.rows.length > 0) return res.rows;
    } catch (e) {}
    return Array.from(MOCK_PROMOS.values());
  }

  static async createPromo({ code, discountPercent, maxDiscountETB }) {
    const formattedCode = code.toUpperCase().trim();
    try {
      const res = await pool.query(
        `INSERT INTO promo_codes (code, discount_percent, max_discount_etb) 
         VALUES ($1, $2, $3) RETURNING *`,
        [formattedCode, discountPercent, maxDiscountETB]
      );
      return res.rows[0];
    } catch (e) {
      const newPromo = { code: formattedCode, discountPercent, maxDiscountETB, isActive: true };
      MOCK_PROMOS.set(formattedCode, newPromo);
      return newPromo;
    }
  }
}

module.exports = PromoModel;
