const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth'); // If you want to protect routes

// Create feedback (public route)
router.post('/', feedbackController.createFeedback);

// Get all feedback (protected route - only for admin)
router.get('/', auth, feedbackController.getAllFeedback);

module.exports = router; 