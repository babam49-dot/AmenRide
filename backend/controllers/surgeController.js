/**
 * Controller: SurgeController
 * Managing surge zones and multiplier adjustments.
 */

const SurgeZoneModel = require('../models/SurgeZoneModel');

exports.getAllZones = async (req, res) => {
  try {
    const zones = await SurgeZoneModel.getAllZones();
    return res.status(200).json({ zones });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch surge zones', message: error.message });
  }
};

exports.updateMultiplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { multiplier } = req.body;
    const zone = await SurgeZoneModel.updateZoneMultiplier(id, multiplier);
    return res.status(200).json({ message: 'Surge multiplier updated', zone });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update surge zone multiplier', message: error.message });
  }
};
