const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 500
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        default: null
    },
    likeCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient queries
commentSchema.index({ food: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

const commentModel = mongoose.model("comment", commentSchema);

module.exports = commentModel;
