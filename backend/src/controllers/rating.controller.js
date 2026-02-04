const ratingModel = require('../models/rating.model');
const foodPartnerModel = require('../models/foodpartner.model');

// Add or update rating
async function addRating(req, res) {
    try {
        const { foodPartnerId, rating, review } = req.body;
        const user = req.user;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const foodPartner = await foodPartnerModel.findById(foodPartnerId);
        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        // Check for existing rating
        const existingRating = await ratingModel.findOne({
            user: user._id,
            foodPartner: foodPartnerId
        });

        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            existingRating.review = review || existingRating.review;
            await existingRating.save();

            // Recalculate average
            await updateAverageRating(foodPartnerId);

            return res.status(200).json({
                message: "Rating updated successfully",
                rating: existingRating
            });
        }

        // Create new rating
        const newRating = await ratingModel.create({
            rating,
            review,
            user: user._id,
            foodPartner: foodPartnerId
        });

        // Update average rating
        await updateAverageRating(foodPartnerId);

        res.status(201).json({
            message: "Rating added successfully",
            rating: newRating
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding rating", error: error.message });
    }
}

// Helper to update average rating
async function updateAverageRating(foodPartnerId) {
    const result = await ratingModel.aggregate([
        { $match: { foodPartner: foodPartnerId } },
        { 
            $group: { 
                _id: null, 
                averageRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 }
            } 
        }
    ]);

    const { averageRating = 0, totalRatings = 0 } = result[0] || {};
    
    await foodPartnerModel.findByIdAndUpdate(foodPartnerId, {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings
    });
}

// Get ratings for a food partner
async function getRatings(req, res) {
    try {
        const { foodPartnerId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const ratings = await ratingModel.find({ foodPartner: foodPartnerId })
            .populate('user', 'fullName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await ratingModel.countDocuments({ foodPartner: foodPartnerId });

        // Get rating distribution
        const distribution = await ratingModel.aggregate([
            { $match: { foodPartner: foodPartnerId } },
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: -1 } }
        ]);

        res.status(200).json({
            message: "Ratings fetched successfully",
            ratings,
            distribution,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching ratings", error: error.message });
    }
}

// Get user's rating for a food partner
async function getUserRating(req, res) {
    try {
        const { foodPartnerId } = req.params;
        const user = req.user;

        const rating = await ratingModel.findOne({
            user: user._id,
            foodPartner: foodPartnerId
        });

        res.status(200).json({
            rating: rating || null
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user rating", error: error.message });
    }
}

// Delete rating
async function deleteRating(req, res) {
    try {
        const { foodPartnerId } = req.params;
        const user = req.user;

        const rating = await ratingModel.findOneAndDelete({
            user: user._id,
            foodPartner: foodPartnerId
        });

        if (!rating) {
            return res.status(404).json({ message: "Rating not found" });
        }

        // Update average
        await updateAverageRating(foodPartnerId);

        res.status(200).json({ message: "Rating deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting rating", error: error.message });
    }
}

module.exports = {
    addRating,
    getRatings,
    getUserRating,
    deleteRating
};
