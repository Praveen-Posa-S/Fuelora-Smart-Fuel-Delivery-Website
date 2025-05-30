const Support = require('../models/Support');
const jwt = require('jsonwebtoken');

// Create a new support request
exports.createSupport = async (req, res) => {
    try {
        const { name, phone, language, issue } = req.body;
        let username = 'Anonymous';

        // Get token from header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                username = decoded.username || 'Anonymous';
            } catch (error) {
                console.error('Token verification failed:', error);
            }
        }

        const newSupport = new Support({
            name,
            phone,
            language,
            issue,
            username
        });

        await newSupport.save();

        res.status(201).json({
            success: true,
            message: 'Support request created successfully',
            data: newSupport
        });
    } catch (error) {
        console.error('Error creating support request:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating support request',
            error: error.message
        });
    }
};

// Get all support requests (admin only)
exports.getAllSupport = async (req, res) => {
    try {
        const supportRequests = await Support.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: supportRequests.length,
            data: supportRequests
        });
    } catch (error) {
        console.error('Error fetching support requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching support requests',
            error: error.message
        });
    }
};

// Get user's support requests
exports.getUserSupport = async (req, res) => {
    try {
        const username = req.user.username;
        const supportRequests = await Support.find({ username })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: supportRequests.length,
            data: supportRequests
        });
    } catch (error) {
        console.error('Error fetching user support requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user support requests',
            error: error.message
        });
    }
};

// Update support request status (admin only)
exports.updateSupportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const supportRequest = await Support.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!supportRequest) {
            return res.status(404).json({
                success: false,
                message: 'Support request not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Support request status updated successfully',
            data: supportRequest
        });
    } catch (error) {
        console.error('Error updating support request status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating support request status',
            error: error.message
        });
    }
}; 