const commentModel = require('../models/comment.model');
const commentLikeModel = require('../models/commentLike.model');
const foodModel = require('../models/food.model');
const notificationModel = require('../models/notification.model');

// Add a comment to a food item
async function addComment(req, res) {
    try {
        const { foodId, text, parentCommentId } = req.body;
        const user = req.user;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const food = await foodModel.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: "Food item not found" });
        }

        const comment = await commentModel.create({
            text: text.trim(),
            user: user._id,
            food: foodId,
            parentComment: parentCommentId || null
        });

        // Populate user info for response
        await comment.populate('user', 'fullName email');

        // Update comment count on food
        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { commentsCount: 1 }
        });

        // Create notification for food partner
        if (food.foodPartner) {
            await notificationModel.create({
                type: parentCommentId ? 'reply' : 'comment',
                message: `${user.fullName} commented on your food video`,
                recipientFoodPartner: food.foodPartner,
                senderUser: user._id,
                food: foodId,
                comment: comment._id
            });
        }

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
}

// Get comments for a food item
async function getComments(req, res) {
    try {
        const { foodId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const comments = await commentModel.find({ 
            food: foodId,
            parentComment: null // Only get top-level comments
        })
        .populate('user', 'fullName email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

        // Get replies for each comment
        const commentsWithReplies = await Promise.all(
            comments.map(async (comment) => {
                const replies = await commentModel.find({ parentComment: comment._id })
                    .populate('user', 'fullName email')
                    .sort({ createdAt: 1 })
                    .limit(3);
                
                const totalReplies = await commentModel.countDocuments({ parentComment: comment._id });
                
                return {
                    ...comment.toObject(),
                    replies,
                    totalReplies
                };
            })
        );

        const total = await commentModel.countDocuments({ food: foodId, parentComment: null });

        res.status(200).json({
            message: "Comments fetched successfully",
            comments: commentsWithReplies,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
}

// Get replies for a comment
async function getReplies(req, res) {
    try {
        const { commentId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const replies = await commentModel.find({ parentComment: commentId })
            .populate('user', 'fullName email')
            .sort({ createdAt: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await commentModel.countDocuments({ parentComment: commentId });

        res.status(200).json({
            message: "Replies fetched successfully",
            replies,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching replies", error: error.message });
    }
}

// Like/unlike a comment
async function likeComment(req, res) {
    try {
        const { commentId } = req.body;
        const user = req.user;

        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const existingLike = await commentLikeModel.findOne({
            user: user._id,
            comment: commentId
        });

        if (existingLike) {
            await commentLikeModel.deleteOne({ _id: existingLike._id });
            await commentModel.findByIdAndUpdate(commentId, {
                $inc: { likeCount: -1 }
            });

            return res.status(200).json({
                message: "Comment unliked successfully",
                liked: false
            });
        }

        await commentLikeModel.create({
            user: user._id,
            comment: commentId
        });

        await commentModel.findByIdAndUpdate(commentId, {
            $inc: { likeCount: 1 }
        });

        res.status(201).json({
            message: "Comment liked successfully",
            liked: true
        });
    } catch (error) {
        res.status(500).json({ message: "Error liking comment", error: error.message });
    }
}

// Delete a comment
async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;
        const user = req.user;

        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        // Delete all replies
        await commentModel.deleteMany({ parentComment: commentId });
        
        // Delete the comment
        await commentModel.findByIdAndDelete(commentId);

        // Update comment count
        const deletedCount = await commentModel.countDocuments({ parentComment: commentId }) + 1;
        await foodModel.findByIdAndUpdate(comment.food, {
            $inc: { commentsCount: -deletedCount }
        });

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
}

module.exports = {
    addComment,
    getComments,
    getReplies,
    likeComment,
    deleteComment
};
