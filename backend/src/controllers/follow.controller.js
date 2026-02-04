const followModel = require('../models/follow.model');
const foodPartnerModel = require('../models/foodpartner.model');
const notificationModel = require('../models/notification.model');

// Follow/unfollow a food partner
async function toggleFollow(req, res) {
    try {
        const { foodPartnerId } = req.body;
        const user = req.user;

        const foodPartner = await foodPartnerModel.findById(foodPartnerId);
        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        const existingFollow = await followModel.findOne({
            user: user._id,
            foodPartner: foodPartnerId
        });

        if (existingFollow) {
            await followModel.deleteOne({ _id: existingFollow._id });
            
            await foodPartnerModel.findByIdAndUpdate(foodPartnerId, {
                $inc: { followersCount: -1 }
            });

            return res.status(200).json({
                message: "Unfollowed successfully",
                following: false
            });
        }

        await followModel.create({
            user: user._id,
            foodPartner: foodPartnerId
        });

        await foodPartnerModel.findByIdAndUpdate(foodPartnerId, {
            $inc: { followersCount: 1 }
        });

        // Create notification
        await notificationModel.create({
            type: 'follow',
            message: `${user.fullName} started following you`,
            recipientFoodPartner: foodPartnerId,
            senderUser: user._id
        });

        res.status(201).json({
            message: "Followed successfully",
            following: true
        });
    } catch (error) {
        res.status(500).json({ message: "Error toggling follow", error: error.message });
    }
}

// Check if user follows a food partner
async function checkFollow(req, res) {
    try {
        const { foodPartnerId } = req.params;
        const user = req.user;

        const follow = await followModel.findOne({
            user: user._id,
            foodPartner: foodPartnerId
        });

        res.status(200).json({
            following: !!follow
        });
    } catch (error) {
        res.status(500).json({ message: "Error checking follow status", error: error.message });
    }
}

// Get user's following list
async function getFollowing(req, res) {
    try {
        const user = req.user;
        const { page = 1, limit = 20 } = req.query;

        const following = await followModel.find({ user: user._id })
            .populate('foodPartner', 'name address')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await followModel.countDocuments({ user: user._id });

        res.status(200).json({
            message: "Following list fetched successfully",
            following: following.map(f => f.foodPartner),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching following list", error: error.message });
    }
}

// Get food partner's followers
async function getFollowers(req, res) {
    try {
        const { foodPartnerId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const followers = await followModel.find({ foodPartner: foodPartnerId })
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await followModel.countDocuments({ foodPartner: foodPartnerId });

        res.status(200).json({
            message: "Followers fetched successfully",
            followers: followers.map(f => f.user),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching followers", error: error.message });
    }
}

module.exports = {
    toggleFollow,
    checkFollow,
    getFollowing,
    getFollowers
};
