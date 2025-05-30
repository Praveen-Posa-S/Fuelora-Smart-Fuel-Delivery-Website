const Feedback = require('../models/Feedback');
const jwt = require('jsonwebtoken');

// Create new feedback
exports.createFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;
        let username = 'Anonymous';

        // Get the authorization header
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader); // Debug log
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                // Verify and decode the token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log('Decoded token:', decoded); // Debug log
                
                // Try different possible username fields from the token
                username = decoded.name || decoded.userName || decoded.username || 'Anonymous';
                console.log('Extracted username:', username); // Debug log
            } catch (error) {
                console.log('Token verification failed:', error.message);
            }
        }

        console.log('Final username being saved:', username); // Debug log

        const newFeedback = new Feedback({
            username,
            feedback
        });

        await newFeedback.save();
        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: newFeedback
        });
    } catch (error) {
        console.error('Error in createFeedback:', error); // Debug log
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback',
            error: error.message
        });
    }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching feedback',
            error: error.message
        });
    }
}; 