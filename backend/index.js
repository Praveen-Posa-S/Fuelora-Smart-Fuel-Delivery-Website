const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const orderRoutes = require('./routes/orderRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const publicRoutes = require('./routes/publicRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const userRoutes = require('./routes/userRoutes');

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// ✅ MongoDB Connection
console.log("✅ Attempting to connect to MongoDB:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Ensure indexes for Transaction model
    const Transaction = require('./models/Transaction');
    await Transaction.createIndexes();
    console.log("✅ Transaction indexes created");
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/feedback', feedbackRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('Test the server by visiting:');
    console.log(`http://localhost:${PORT}/test`);
    console.log('Available API endpoints:');
    console.log('- GET /api/users/all');
    console.log('- GET /api/public/orders');
    console.log('- POST /api/transactions');
    console.log('- GET /api/transactions/user');
    console.log('- POST /api/feedback');
    console.log('- GET /api/feedback');
}); 

const fuelTypeMap = {
    'power_petrol': 'power petrol',
    'normal_petrol': 'normal petrol',
    'x95_petrol': 'x95petrol',
    'diesel': 'diesel'
} 

const paymentMethodMap = {
    'UPI Payment': 'UPI_PAYMENT',
    'Card Payment': 'CARD_PAYMENT',
    'Cash on Delivery': 'CASH_ON_DELIVERY',
    'Wallet Payment': 'WALLET_PAYMENT'
} 
