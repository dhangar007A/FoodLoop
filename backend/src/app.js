// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const commentRoutes = require('./routes/comment.routes');
const followRoutes = require('./routes/follow.routes');
const ratingRoutes = require('./routes/rating.routes');
const notificationRoutes = require('./routes/notification.routes');
const searchRoutes = require('./routes/search.routes');
const userRoutes = require('./routes/user.routes');
const cors = require('cors');

const app = express();

// Rate limiting for security
const rateLimit = {};
const rateLimitMiddleware = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    if (!rateLimit[ip]) rateLimit[ip] = [];
    rateLimit[ip] = rateLimit[ip].filter(time => now - time < 60000);
    if (rateLimit[ip].length > 100) {
        return res.status(429).json({ message: "Too many requests" });
    }
    rateLimit[ip].push(now);
    next();
};

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests from any localhost port for development
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
            'http://localhost:5177',
            'http://localhost:5178',
            'http://localhost:3000'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(rateLimitMiddleware);

app.get("/", (req, res) => {
    res.send("FoodLoop API v1.0");
})

// Auth routes
app.use('/api/auth', authRoutes);

// Food routes
app.use('/api/food', foodRoutes);

// Food partner routes
app.use('/api/food-partner', foodPartnerRoutes);

// Comment routes
app.use('/api/comments', commentRoutes);

// Follow routes
app.use('/api/follow', followRoutes);

// Rating routes
app.use('/api/ratings', ratingRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// Search routes
app.use('/api/search', searchRoutes);

// User routes
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

module.exports = app;