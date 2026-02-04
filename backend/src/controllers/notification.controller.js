const notificationModel = require('../models/notification.model');

// Get notifications for user
async function getUserNotifications(req, res) {
    try {
        const user = req.user;
        const { page = 1, limit = 20 } = req.query;

        const notifications = await notificationModel.find({ recipientUser: user._id })
            .populate('senderUser', 'fullName')
            .populate('senderFoodPartner', 'name')
            .populate('food', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await notificationModel.countDocuments({ recipientUser: user._id });
        const unreadCount = await notificationModel.countDocuments({ 
            recipientUser: user._id, 
            isRead: false 
        });

        res.status(200).json({
            message: "Notifications fetched successfully",
            notifications,
            unreadCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
}

// Get notifications for food partner
async function getFoodPartnerNotifications(req, res) {
    try {
        const foodPartner = req.foodPartner;
        const { page = 1, limit = 20 } = req.query;

        const notifications = await notificationModel.find({ recipientFoodPartner: foodPartner._id })
            .populate('senderUser', 'fullName')
            .populate('food', 'name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await notificationModel.countDocuments({ recipientFoodPartner: foodPartner._id });
        const unreadCount = await notificationModel.countDocuments({ 
            recipientFoodPartner: foodPartner._id, 
            isRead: false 
        });

        res.status(200).json({
            message: "Notifications fetched successfully",
            notifications,
            unreadCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error: error.message });
    }
}

// Mark notification as read
async function markAsRead(req, res) {
    try {
        const { notificationId } = req.params;

        await notificationModel.findByIdAndUpdate(notificationId, { isRead: true });

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error marking notification as read", error: error.message });
    }
}

// Mark all notifications as read
async function markAllAsRead(req, res) {
    try {
        const user = req.user;

        await notificationModel.updateMany(
            { recipientUser: user._id, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error marking notifications as read", error: error.message });
    }
}

// Delete notification
async function deleteNotification(req, res) {
    try {
        const { notificationId } = req.params;

        await notificationModel.findByIdAndDelete(notificationId);

        res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification", error: error.message });
    }
}

module.exports = {
    getUserNotifications,
    getFoodPartnerNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
