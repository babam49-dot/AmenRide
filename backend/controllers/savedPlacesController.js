/**
 * Controller: SavedPlacesController
 * CRUD operations for rider saved places.
 */

const SavedPlaceModel = require('../models/SavedPlaceModel');

exports.getPlaces = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId || 1;
    const places = await SavedPlaceModel.getPlaces(userId);
    return res.status(200).json({ places });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch saved places', message: error.message });
  }
};

exports.addPlace = async (req, res) => {
  try {
    const { userId, label, name, address, lat, lng } = req.body;
    if (!name || !label) {
      return res.status(400).json({ error: 'Name and label are required' });
    }
    const place = await SavedPlaceModel.addPlace({ userId, label, name, address, lat, lng });
    return res.status(201).json({ message: 'Saved place added successfully', place });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add saved place', message: error.message });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    await SavedPlaceModel.deletePlace(id);
    return res.status(200).json({ message: 'Saved place deleted', id });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete saved place', message: error.message });
  }
};
