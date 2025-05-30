const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");

// Create a new order
router.post("/create", auth, async (req, res) => {
    try {
        console.log("Received Order Request:", req.body);
        console.log("Authenticated User:", req.user);

        const {
            fuelType,
            quantity,
            totalAmount,
            selectedBunk,
            paymentMethod,
            mobileNumber
        } = req.body;

        // Validate required fields
        if (!fuelType || !quantity || !totalAmount || !selectedBunk || !paymentMethod || !mobileNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                missingFields: {
                    fuelType: !fuelType,
                    quantity: !quantity,
                    totalAmount: !totalAmount,
                    selectedBunk: !selectedBunk,
                    paymentMethod: !paymentMethod,
                    mobileNumber: !mobileNumber
                }
            });
        }

        // Create new order with correct field names
        const order = new Order({
            userId: req.user.userId,      // Using mapped userId
            userName: req.user.userName,   // Using mapped userName
            fuelType,
            quantity,
            totalAmount,
            selectedBunk,
            paymentMethod,
            mobileNumber
        });

        // Save order to database
        await order.save();
        console.log("Order saved successfully:", order);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message
        });
    }
});

// Get all orders for logged in user
router.get("/my-orders", auth, async (req, res) => {
    try {
        // Find all orders for the logged-in user
        const orders = await Order.find({ userId: req.user.userId })
            .sort({ createdAt: -1 }); // Sort by newest first

        console.log(`Found ${orders.length} orders for user:`, req.user.userName);

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
});

// Get specific order by ID
router.get("/:orderId", auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            userId: req.user.userId // Ensure user can only access their own orders
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching order",
            error: error.message
        });
    }
});

// Get all orders for admin dashboard
router.get("/admin/all-orders", auth, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Admin access required"
            });
        }

        // Find all orders
        const orders = await Order.find()
            .sort({ createdAt: -1 }); // Sort by newest first

        // Calculate statistics
        const totalOrders = orders.length;
        const categoryStats = {
            "Regular Fuel": 0,
            "Premium Fuel": 0,
            "Diesel": 0
        };

        orders.forEach(order => {
            categoryStats[order.fuelType]++;
        });

        res.status(200).json({
            success: true,
            totalOrders,
            categoryStats
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
});

// Get all orders (no authentication required)
router.get("/all", async (req, res) => {
    try {
        // Find all orders
        const orders = await Order.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .select('-__v'); // Exclude version field

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
