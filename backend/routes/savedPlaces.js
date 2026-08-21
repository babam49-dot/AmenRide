const express = require('express');
const router = express.Router();
const savedPlacesController = require('../controllers/savedPlacesController');

router.get('/', savedPlacesController.getPlaces);
router.get('/user/:userId', savedPlacesController.getPlaces);
router.post('/', savedPlacesController.addPlace);
router.delete('/:id', savedPlacesController.deletePlace);

module.exports = router;
