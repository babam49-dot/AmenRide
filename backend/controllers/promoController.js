/**
 * Controller: PromoController
 * Endpoints for checking promo validity and listing promo campaigns.
 */

const PromoModel = require('../models/PromoModel');

exports.validatePromo = async (req, res) => {
  try {
    const { code, fare } = req.body;
    const result = await PromoModel.validatePromoCode(code, parseFloat(fare || 100));
    return res.status(result.valid ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to validate promo code', message: error.message });
  }
};

exports.getPromos = async (req, res) => {
  try {
    const promos = await PromoModel.getAllPromos();
    return res.status(200).json({ promos });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch promo codes', message: error.message });
  }
};

exports.createPromo = async (req, res) => {
  try {
    const { code, discountPercent, maxDiscountETB } = req.body;
    if (!code || !discountPercent) {
      return res.status(400).json({ error: 'Code and discount percent are required' });
    }
    const promo = await PromoModel.createPromo({ code, discountPercent, maxDiscountETB });
    return res.status(201).json({ message: 'Promo code created successfully', promo });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create promo code', message: error.message });
  }
};
