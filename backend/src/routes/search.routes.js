const express = require('express');
const searchController = require('../controllers/search.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Search food items
router.get('/food', authMiddleware.authUserMiddleware, searchController.searchFood);

// Search food partners
router.get('/food-partners', authMiddleware.authUserMiddleware, searchController.searchFoodPartners);

// Get trending
router.get('/trending', authMiddleware.authUserMiddleware, searchController.getTrending);

// Get categories
router.get('/categories', authMiddleware.authUserMiddleware, searchController.getCategories);

// Get explore page data
router.get('/explore', authMiddleware.authUserMiddleware, searchController.getExplore);

module.exports = router;
