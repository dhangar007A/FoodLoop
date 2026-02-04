const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

// Get profile
router.get('/profile', authMiddleware.authUserMiddleware, userController.getProfile);

// Update profile
router.patch('/profile', authMiddleware.authUserMiddleware, upload.single('profilePicture'), userController.updateProfile);

// Change password
router.post('/change-password', authMiddleware.authUserMiddleware, userController.changePassword);

// Get liked videos
router.get('/liked', authMiddleware.authUserMiddleware, userController.getLikedVideos);

// Get following feed
router.get('/following-feed', authMiddleware.authUserMiddleware, userController.getFollowingFeed);

module.exports = router;
