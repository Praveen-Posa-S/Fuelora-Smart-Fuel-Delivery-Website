const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get all users (public route)
router.get('/all', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password') // Exclude password from response
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// Get user by ID (protected route)
router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
});

module.exports = router; 