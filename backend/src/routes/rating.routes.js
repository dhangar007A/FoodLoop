const express = require('express');
const ratingController = require('../controllers/rating.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Add or update rating
router.post('/', authMiddleware.authUserMiddleware, ratingController.addRating);

// Get ratings for food partner
router.get('/food-partner/:foodPartnerId', ratingController.getRatings);

// Get user's rating for food partner
router.get('/user/:foodPartnerId', authMiddleware.authUserMiddleware, ratingController.getUserRating);

// Delete rating
router.delete('/:foodPartnerId', authMiddleware.authUserMiddleware, ratingController.deleteRating);

module.exports = router;
