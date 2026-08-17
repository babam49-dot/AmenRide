const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Vehicle options definition with base rates and multiplier calculations
const RIDE_TYPES = [
  {
    id: '1',
    name: 'AMEN Bajaj Classic',
    title: 'AMEN Bajaj Classic',
    description: 'Quick, affordable 3-wheeler for Bahir Dar city trips',
    basePriceETB: 35,
    base_price: 35,
    perKmETB: 18,
    capacity: 3,
    icon: '🛺',
    is_available: true,
  },
  {
    id: '2',
    name: 'AMEN EV Electric',
    title: 'AMEN EV Electric',
    description: 'Eco-friendly, quiet electric Bajaj with USB charger',
    basePriceETB: 45,
    base_price: 45,
    perKmETB: 20,
    capacity: 3,
    icon: '🛺⚡',
  },
  {
    id: '3',
    name: 'AMEN Comfort Sedan',
    title: 'AMEN Comfort Sedan',
    description: 'AC Toyota Camry / Corolla for smooth longer rides',
    basePriceETB: 90,
    base_price: 90,
    perKmETB: 35,
    capacity: 4,
    icon: '🚗',
  },
  {
    id: '4',
    name: 'AMEN Executive SUV',
    title: 'AMEN Executive SUV',
    description: 'Spacious VIP SUV for families & airport luggage',
    basePriceETB: 150,
    base_price: 150,
    perKmETB: 50,
    capacity: 6,
    icon: '🚘',
  },
];

/**
 * GET /api/ride-options
 * Calculate real-time estimated fare with peak hour surge pricing multiplier
 */
router.get('/', async (req, res) => {
  try {
    const distanceKm = parseFloat(req.query.distanceKm) || 3.5; // Default 3.5km in Bahir Dar

    // Calculate dynamic surge factor (1.0x to 1.5x) based on peak hours
    const currentHour = new Date().getHours();
    let surgeMultiplier = 1.0;

    // Morning peak (7am - 9am) or evening rush (5pm - 8pm)
    if ((currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 20)) {
      surgeMultiplier = 1.25;
    }

    const calculatedOptions = RIDE_TYPES.map((option) => {
      const estimatedPrice = Math.round(
        (option.basePriceETB + distanceKm * option.perKmETB) * surgeMultiplier
      );
      const estimatedMinutes = Math.max(3, Math.round(distanceKm * 3));

      return {
        ...option,
        estimatedPriceETB: estimatedPrice,
        currency: 'ETB',
        etaMinutes: estimatedMinutes,
        surgeMultiplier,
      };
    });

    return res.status(200).json({
      success: true,
      distanceKm,
      surgeMultiplier,
      options: calculatedOptions,
    });
  } catch (error) {
    console.error('Error fetching ride options:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate ride options',
      details: error.message,
    });
  }
});

module.exports = router;
