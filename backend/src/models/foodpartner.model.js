const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    coverImage: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: 300,
        default: ''
    },
    website: {
        type: String
    },
    openingHours: {
        type: String
    },
    followersCount: {
        type: Number,
        default: 0
    },
    totalMeals: {
        type: Number,
        default: 0
    },
    customersServed: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    categories: [{
        type: String
    }]
}, {
    timestamps: true
});

const foodPartnerModel = mongoose.model("foodpartner", foodPartnerSchema);

module.exports = foodPartnerModel;