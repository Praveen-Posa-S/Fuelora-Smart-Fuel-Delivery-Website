const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const Admin = require('../models/Admin');

const router = express.Router();

// Register Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create token with exact field names needed for Order model
    const token = jwt.sign(
      { 
        userId: user._id,    // Changed from id to userId
        userName: user.name, // Changed from name to userName
        email: user.email
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // Log token payload for debugging
    console.log('Token payload:', { userId: user._id, userName: user.name, email: user.email });

    res.json({ 
      success: true,
      token,
      user: {
        userId: user._id,
        userName: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Protected route to get user details
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Admin Login Route
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        adminId: admin._id,
        name: admin.name,
        email: admin.email,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      admin: {
        adminId: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Sign-Up Route
router.post("/admin-signup", async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: "Admin already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    admin = new Admin({ name, email, password: hashedPassword, adminCode });
    await admin.save();

    res.status(201).json({ success: true, message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

module.exports = router;
