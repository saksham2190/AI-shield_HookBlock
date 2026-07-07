const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const analyzeRoute = require("./routes/analyzeRoute");
const detectorRoute = require("./routes/detectorRoute");

// Load environment variables
dotenv.config();

// Create Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/api", analyzeRoute);
app.use("/api", detectorRoute);

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