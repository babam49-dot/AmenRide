/**
 * Request body and parameter sanitizer middleware
 */
module.exports = {
  validateTripRequest: (req, res, next) => {
    const { pickupLocation, dropoffLocation } = req.body;
    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({
        success: false,
        error: 'Validation Failed: Both pickupLocation and dropoffLocation are required.',
      });
    }
    next();
  },

  validateRatingPayload: (req, res, next) => {
    const { rating } = req.body;
    if (rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Validation Failed: Rating must be an integer between 1 and 5.',
      });
    }
    next();
  },
};
