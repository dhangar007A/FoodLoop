const foodModel = require('../models/food.model');
const foodPartnerModel = require('../models/foodpartner.model');

// Search food items
async function searchFood(req, res) {
    try {
        const { q, category, sort = 'recent', page = 1, limit = 20 } = req.query;

        const query = {};

        // Text search
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Sort options
        let sortOption = {};
        switch (sort) {
            case 'popular':
                sortOption = { likeCount: -1 };
                break;
            case 'trending':
                sortOption = { likeCount: -1, createdAt: -1 };
                break;
            case 'recent':
            default:
                sortOption = { createdAt: -1 };
        }

        const foods = await foodModel.find(query)
            .populate('foodPartner', 'name address')
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await foodModel.countDocuments(query);

        res.status(200).json({
            message: "Search results fetched successfully",
            foods,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error searching", error: error.message });
    }
}

// Search food partners
async function searchFoodPartners(req, res) {
    try {
        const { q, sort = 'rating', page = 1, limit = 20 } = req.query;

        const query = {};

        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { address: { $regex: q, $options: 'i' } }
            ];
        }

        let sortOption = {};
        switch (sort) {
            case 'rating':
                sortOption = { averageRating: -1 };
                break;
            case 'followers':
                sortOption = { followersCount: -1 };
                break;
            case 'recent':
            default:
                sortOption = { createdAt: -1 };
        }

        const foodPartners = await foodPartnerModel.find(query)
            .select('-password')
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await foodPartnerModel.countDocuments(query);

        res.status(200).json({
            message: "Food partners fetched successfully",
            foodPartners,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error searching food partners", error: error.message });
    }
}

// Get trending/popular food
async function getTrending(req, res) {
    try {
        const { limit = 10 } = req.query;

        // Get foods with most likes in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trending = await foodModel.find({
            createdAt: { $gte: sevenDaysAgo }
        })
        .populate('foodPartner', 'name address')
        .sort({ likeCount: -1, savesCount: -1 })
        .limit(parseInt(limit));

        res.status(200).json({
            message: "Trending food fetched successfully",
            foods: trending
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching trending", error: error.message });
    }
}

// Get categories
async function getCategories(req, res) {
    try {
        const categories = await foodModel.distinct('category');
        
        // Count items per category
        const categoriesWithCount = await Promise.all(
            categories.filter(c => c).map(async (category) => {
                const count = await foodModel.countDocuments({ category });
                return { name: category, count };
            })
        );

        res.status(200).json({
            message: "Categories fetched successfully",
            categories: categoriesWithCount
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
}

// Get explore page data
async function getExplore(req, res) {
    try {
        // Trending foods
        const trending = await foodModel.find({})
            .populate('foodPartner', 'name address')
            .sort({ likeCount: -1 })
            .limit(5);

        // Recent foods
        const recent = await foodModel.find({})
            .populate('foodPartner', 'name address')
            .sort({ createdAt: -1 })
            .limit(10);

        // Top food partners
        const topPartners = await foodPartnerModel.find({})
            .select('-password')
            .sort({ averageRating: -1, followersCount: -1 })
            .limit(5);

        // Categories
        const categories = await foodModel.distinct('category');

        res.status(200).json({
            message: "Explore data fetched successfully",
            trending,
            recent,
            topPartners,
            categories: categories.filter(c => c)
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching explore data", error: error.message });
    }
}

module.exports = {
    searchFood,
    searchFoodPartners,
    getTrending,
    getCategories,
    getExplore
};
