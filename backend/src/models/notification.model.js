const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['like', 'comment', 'follow', 'new_video', 'reply'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    // Recipient can be user or food partner
    recipientUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    recipientFoodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    },
    // Who triggered the notification
    senderUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    senderFoodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    },
    // Related entities
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food"
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipientUser: 1, createdAt: -1 });
notificationSchema.index({ recipientFoodPartner: 1, createdAt: -1 });

const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = notificationModel;
