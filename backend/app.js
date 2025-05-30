const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const publicRoutes = require('./routes/publicRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const supportRoutes = require('./routes/supportRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/support', supportRoutes);

// Debug route to check if server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- POST /api/support');
    console.log('- GET /api/support/my-support');
    console.log('- GET /api/support/all');
    console.log('- PUT /api/support/:id/status');
}); 