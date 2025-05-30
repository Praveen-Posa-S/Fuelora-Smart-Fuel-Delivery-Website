const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token contents:', decoded); // Debug log

            // Use the exact field names from the token
            req.user = {
                userId: decoded.userId,       // Exact match
                userName: decoded.userName,    // Exact match
                email: decoded.email
            };
            
            console.log('User info from token:', req.user); // Debug log

            // Validate required fields
            if (!req.user.userId || !req.user.userName) {
                return res.status(401).json({
                    success: false,
                    message: 'Token missing required fields',
                    debug: {
                        received: decoded,
                        mapped: req.user
                    }
                });
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = auth; 