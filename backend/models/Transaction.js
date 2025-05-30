const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    payment_method: {
        type: String,
        enum: ['UPI', 'Card', 'Cash on Delivery'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'transactions'
});

module.exports = mongoose.model('Transaction', transactionSchema); 