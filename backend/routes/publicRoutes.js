const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Debug middleware for public routes
router.use((req, res, next) => {
    console.log(`Public route accessed: ${req.method} ${req.url}`);
    next();
});

// Get all orders (no authentication required)
router.get("/orders", async (req, res) => {
    try {
        console.log("Fetching all orders...");
        // Find all orders
        const orders = await Order.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .select('-__v'); // Exclude version field

        console.log(`Found ${orders.length} orders`);
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching all orders",
            error: error.message
        });
    }
});

module.exports = router; 