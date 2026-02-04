const express = require('express');
const followController = require('../controllers/follow.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Toggle follow
router.post('/toggle', authMiddleware.authUserMiddleware, followController.toggleFollow);

// Check follow status
router.get('/check/:foodPartnerId', authMiddleware.authUserMiddleware, followController.checkFollow);

// Get user's following list
router.get('/following', authMiddleware.authUserMiddleware, followController.getFollowing);

// Get food partner's followers
router.get('/followers/:foodPartnerId', followController.getFollowers);

module.exports = router;
