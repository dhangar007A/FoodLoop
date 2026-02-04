// Input validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return res.status(400).json({ 
                success: false, 
                message: 'Validation failed',
                errors 
            });
        }
        next();
    };
};

// Simple validation helpers (no external dependency)
const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    return password && password.length >= 6;
};

const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/<[^>]*>/g, '');
};

const isValidMongoId = (id) => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
};

const validatePagination = (page, limit) => {
    const validatedPage = Math.max(1, parseInt(page) || 1);
    const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 20));
    return { page: validatedPage, limit: validatedLimit };
};

// Middleware to validate MongoDB ObjectId in params
const validateId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!isValidMongoId(id)) {
            return res.status(400).json({ 
                success: false, 
                message: `Invalid ${paramName} format` 
            });
        }
        next();
    };
};

// Rate limiting by user (in-memory, for production use Redis)
const userRateLimits = new Map();

const rateLimitByUser = (maxRequests = 100, windowMs = 60000) => {
    return (req, res, next) => {
        const userId = req.user?.id || req.ip;
        const now = Date.now();
        
        if (!userRateLimits.has(userId)) {
            userRateLimits.set(userId, { count: 1, resetTime: now + windowMs });
            return next();
        }
        
        const userLimit = userRateLimits.get(userId);
        
        if (now > userLimit.resetTime) {
            userLimit.count = 1;
            userLimit.resetTime = now + windowMs;
            return next();
        }
        
        if (userLimit.count >= maxRequests) {
            return res.status(429).json({ 
                success: false, 
                message: 'Too many requests, please try again later' 
            });
        }
        
        userLimit.count++;
        next();
    };
};

// Clean up old rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [userId, limit] of userRateLimits.entries()) {
        if (now > limit.resetTime) {
            userRateLimits.delete(userId);
        }
    }
}, 60000);

module.exports = {
    validateRequest,
    isEmail,
    isValidPassword,
    sanitizeString,
    isValidMongoId,
    validatePagination,
    validateId,
    rateLimitByUser
};
