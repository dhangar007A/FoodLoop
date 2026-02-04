const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        maxlength: 1000
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodpartner",
        required: true
    }
}, {
    timestamps: true
});

// One rating per user per food partner
ratingSchema.index({ user: 1, foodPartner: 1 }, { unique: true });

const ratingModel = mongoose.model("rating", ratingSchema);

module.exports = ratingModel;
