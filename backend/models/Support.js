const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    language: {
        type: String,
        required: [true, 'Language preference is required'],
        enum: ['english', 'hindi', 'tamil', 'telugu', 'kannada'],
        lowercase: true
    },
    issue: {
        type: String,
        required: [true, 'Issue description is required'],
        trim: true
    },
    username: {
        type: String,
        default: 'Anonymous'
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'closed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Support', supportSchema); 