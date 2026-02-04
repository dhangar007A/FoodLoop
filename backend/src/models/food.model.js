const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        enum: ['Pizza', 'Burger', 'Sushi', 'Pasta', 'Dessert', 'Drinks', 'Indian', 'Chinese', 'Mexican', 'Salad', 'Seafood', 'Vegan', 'Other'],
        default: 'Other'
    },
    tags: [{
        type: String
    }],
    price: {
        type: Number,
        min: 0
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    savesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    shareCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for better search performance
foodSchema.index({ name: 'text', description: 'text' });
foodSchema.index({ category: 1 });
foodSchema.index({ createdAt: -1 });
foodSchema.index({ likeCount: -1 });

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;