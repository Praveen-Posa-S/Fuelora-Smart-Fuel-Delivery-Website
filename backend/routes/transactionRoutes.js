const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Debug middleware for transaction routes
router.use((req, res, next) => {
    console.log(`Transaction route accessed: ${req.method} ${req.url}`);
    next();
});

// Create a new transaction
router.post('/', auth, async (req, res) => {
    try {
        console.log('Creating transaction with data:', req.body);
        const { amount, order_id, payment_method } = req.body;

        // Validate required fields
        if (!amount || !order_id || !payment_method) {
            console.log('Missing required fields:', { amount, order_id, payment_method });
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create new transaction
        const transaction = new Transaction({
            amount,
            order_id,
            user_id: req.user.userId,
            payment_method
        });

        console.log('Saving transaction:', transaction);
        await transaction.save();

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction
        });
    } catch (error) {
        console.error('Transaction creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating transaction',
            error: error.message
        });
    }
});

// Get user's transactions
router.get('/user', auth, async (req, res) => {
    try {
        console.log('Fetching transactions for user:', req.user.userId);
        const transactions = await Transaction.find({ user_id: req.user.userId })
            .populate('order_id')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
});

module.exports = router; 