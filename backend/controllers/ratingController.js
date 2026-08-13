const RatingModel = require('../models/RatingModel');

exports.createRating = async (req, res) => {
  try {
    const { tripId, driverId, rating, tags, comment } = req.body;
    if (!driverId || !rating) {
      return res.status(400).json({ success: false, error: 'Driver ID and rating score are required' });
    }

    const newRating = await RatingModel.create({
      tripId,
      driverId,
      rating: Number(rating),
      tags: tags || [],
      comment: comment || '',
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
