const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false // Optional since users might give feedback without logging in
    },
    feedback: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema); 