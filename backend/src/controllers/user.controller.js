const userModel = require('../models/user.model');
const likeModel = require('../models/likes.model');
const saveModel = require('../models/save.model');
const followModel = require('../models/follow.model');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

// Get user profile
async function getProfile(req, res) {
    try {
        const user = req.user;

        const likesCount = await likeModel.countDocuments({ user: user._id });
        const savesCount = await saveModel.countDocuments({ user: user._id });
        const followingCount = await followModel.countDocuments({ user: user._id });

        res.status(200).json({
            message: "Profile fetched successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                createdAt: user.createdAt
            },
            stats: {
                likesCount,
                savesCount,
                followingCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
}

// Update user profile
async function updateProfile(req, res) {
    try {
        const user = req.user;
        const { fullName, bio } = req.body;

        const updates = {};
        if (fullName) updates.fullName = fullName;
        if (bio !== undefined) updates.bio = bio;

        // Handle profile picture upload
        if (req.file) {
            const result = await storageService.uploadFile(req.file.buffer, `profile-${uuid()}`);
            updates.profilePicture = result.url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            updates,
            { new: true }
        ).select('-password');

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
}

// Change password
async function changePassword(req, res) {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Current and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const userWithPassword = await userModel.findById(user._id);
        const isValid = await bcrypt.compare(currentPassword, userWithPassword.password);

        if (!isValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
}

// Get liked videos
async function getLikedVideos(req, res) {
    try {
        const user = req.user;
        const { page = 1, limit = 20 } = req.query;

        const likes = await likeModel.find({ user: user._id })
            .populate({
                path: 'food',
                populate: { path: 'foodPartner', select: 'name' }
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await likeModel.countDocuments({ user: user._id });

        res.status(200).json({
            message: "Liked videos fetched successfully",
            videos: likes.map(l => l.food).filter(Boolean),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching liked videos", error: error.message });
    }
}

// Get following feed
async function getFollowingFeed(req, res) {
    try {
        const user = req.user;
        const { page = 1, limit = 20 } = req.query;

        // Get followed food partners
        const follows = await followModel.find({ user: user._id });
        const followedIds = follows.map(f => f.foodPartner);

        if (followedIds.length === 0) {
            return res.status(200).json({
                message: "No following feed available",
                videos: [],
                pagination: { page: 1, limit: 20, total: 0, pages: 0 }
            });
        }

        const foodModel = require('../models/food.model');
        const videos = await foodModel.find({ foodPartner: { $in: followedIds } })
            .populate('foodPartner', 'name address')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await foodModel.countDocuments({ foodPartner: { $in: followedIds } });

        res.status(200).json({
            message: "Following feed fetched successfully",
            videos,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching following feed", error: error.message });
    }
}

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getLikedVideos,
    getFollowingFeed
};
