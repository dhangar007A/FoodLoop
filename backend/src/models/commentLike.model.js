const mongoose = require('mongoose');

const commentLikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
        required: true
    }
}, {
    timestamps: true
});

// One like per user per comment
commentLikeSchema.index({ user: 1, comment: 1 }, { unique: true });

const commentLikeModel = mongoose.model("commentlike", commentLikeSchema);

module.exports = commentLikeModel;
