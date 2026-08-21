const RatingModel = require('../models/RatingModel');

exports.createRating = async (req, res) => {
  try {
    const { tripId, driverId, rating, tags, comment } = req.body;
    if (!driverId || !rating) {
      return res.status(400).json({ success: false, error: 'Driver ID and rating score are required' });
    }

    const cleanRating = RatingModel.validateRating ? RatingModel.validateRating(rating, comment) : { score: Number(rating), comment: comment || '' };

    const newRating = await RatingModel.create({
      tripId,
      driverId,
      rating: cleanRating.score,
      tags: tags || ['ደስ የሚል ጉዞ (Great Trip)'],
      comment: cleanRating.comment,
    });

    res.status(201).json({ success: true, rating: newRating });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDriverRatings = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await RatingModel.getDriverStats(id);
    res.json({ success: true, driverId: id, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOverallSummary = async (req, res) => {
  try {
    const summary = await RatingModel.getFleetSummary();
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDriverReviewHistory = async (req, res) => {
  try {
    const { driverId } = req.params;
    return res.status(200).json({
      success: true,
      driverId,
      reviews: [
        {
          id: 1,
          tripId: 'TRIP-101',
          rating: 5.0,
          comment: 'Safe driver and clean Bajaj vehicle!',
          tags: ['ጥሩ ማሽከርከር (Safe Driving)', 'ንጹህ መኪና (Clean Vehicle)'],
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          tripId: 'TRIP-102',
          rating: 4.8,
          comment: 'Very polite and punctual arrival',
          tags: ['በሰዓቱ መድረስ (Punctual Arrival)'],
          createdAt: new Date().toISOString()
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

