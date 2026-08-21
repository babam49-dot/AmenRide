const express = require('express');
const router = express.Router();
const promoController = require('../controllers/promoController');

router.post('/validate', promoController.validatePromo);
router.get('/', promoController.getPromos);
router.post('/', promoController.createPromo);

module.exports = router;
