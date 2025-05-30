const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public route - Create support request
router.post('/', supportController.createSupport);

// Protected routes - User's support requests
router.get('/my-support', authenticateToken, supportController.getUserSupport);

// Admin routes
router.get('/all', authenticateToken, isAdmin, supportController.getAllSupport);
router.put('/:id/status', authenticateToken, isAdmin, supportController.updateSupportStatus);

module.exports = router; 