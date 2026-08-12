const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Vehicle options definition with base rates and multiplier calculations
const RIDE_TYPES = [
  {
    id: 'bajaj',
    title: 'Standard Bajaj',
    description: 'Quick, affordable 3-wheeler for city trips',
    basePriceETB: 30,
    perKmETB: 15,
    capacity: 3,
    icon: 'car-sport-outline',
  },
  {
    id: 'bajaj_vip',
    title: 'Executive Bajaj',
    description: 'Spacious 3-wheeler with extra comfort',
    basePriceETB: 45,
    perKmETB: 20,
    capacity: 3,
    icon: 'sparkles-outline',
  },
  {
    id: 'car',
    title: 'Comfort Car',
    description: 'AC Sedan for weather protection & longer rides',
    basePriceETB: 100,
    perKmETB: 40,
    capacity: 4,
    icon: 'car-outline',
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
