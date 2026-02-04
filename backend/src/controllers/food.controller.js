const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })

}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems
    })
}


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });

}

// Increment view count when a video is viewed
async function incrementViewCount(req, res) {
    const { foodId } = req.params;
    
    try {
        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { viewCount: 1 }
        });
        
        res.status(200).json({
            success: true,
            message: "View count incremented"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to increment view count"
        });
    }
}

// Get a single food item by ID
async function getFoodById(req, res) {
    const { foodId } = req.params;
    
    try {
        const food = await foodModel.findById(foodId).populate('foodPartner', 'name address profilePicture');
        
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }
        
        res.status(200).json({
            success: true,
            food
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get food item"
        });
    }
}

// Get foods by category
async function getFoodsByCategory(req, res) {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    try {
        const foods = await foodModel.find({ category })
            .populate('foodPartner', 'name address')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        
        const total = await foodModel.countDocuments({ category });
        
        res.status(200).json({
            success: true,
            foods,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get foods by category"
        });
    }
}


module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFood,
    incrementViewCount,
    getFoodById,
    getFoodsByCategory
}