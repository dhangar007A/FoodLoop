const express = require('express');
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

// Add comment
router.post('/', authMiddleware.authUserMiddleware, commentController.addComment);

// Get comments for a food item
router.get('/food/:foodId', authMiddleware.authUserMiddleware, commentController.getComments);

// Get replies for a comment
router.get('/:commentId/replies', authMiddleware.authUserMiddleware, commentController.getReplies);

// Like/unlike comment
router.post('/like', authMiddleware.authUserMiddleware, commentController.likeComment);

// Delete comment
router.delete('/:commentId', authMiddleware.authUserMiddleware, commentController.deleteComment);

module.exports = router;
