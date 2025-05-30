const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    fuelType: {
        type: String,
        required: true,
        enum: ["Regular Fuel", "Premium Fuel", "Diesel"]
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    selectedBunk: {
        name: {
            type: String,
            required: true
        },
        distance: {
            type: String,
            required: true
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["UPI", "Card", "Cash on Delivery"]
    },
    orderStatus: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Confirmed", "In Transit", "Delivered", "Cancelled"]
    },
    mobileNumber: {
        type: String,
        required: true
    },
    estimatedDeliveryTime: {
        type: String,
        default: "20-25 minutes"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Order", orderSchema);
