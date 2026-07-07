const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const analyzeRoute = require("./routes/analyzeRoute");
const whoisRoute = require("./routes/whoisRoute");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", analyzeRoute);
app.use("/api", whoisRoute);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 PhishShield Backend is Running!"
    });
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});