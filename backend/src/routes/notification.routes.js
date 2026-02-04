const express = require('express');
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Get user notifications
router.get('/user', authMiddleware.authUserMiddleware, notificationController.getUserNotifications);

// Get food partner notifications
router.get('/food-partner', authMiddleware.authFoodPartnerMiddleware, notificationController.getFoodPartnerNotifications);

// Mark as read
router.patch('/:notificationId/read', authMiddleware.authUserMiddleware, notificationController.markAsRead);

// Mark all as read
router.patch('/read-all', authMiddleware.authUserMiddleware, notificationController.markAllAsRead);

// Delete notification
router.delete('/:notificationId', authMiddleware.authUserMiddleware, notificationController.deleteNotification);

module.exports = router;
