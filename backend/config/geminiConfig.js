const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

// Ensure .env is loaded from backend directory if not already set
if (!process.env.GEMINI_API_KEY) {
    dotenv.config({ path: path.join(__dirname, "../.env") });
}

let aiInstance = null;

function getAI() {
    if (!aiInstance) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("⚠️ Warning: GEMINI_API_KEY is not set in environment variables.");
        }
        aiInstance = new GoogleGenAI({
            apiKey: apiKey
        });
    }

    return aiInstance;
}

module.exports = { getAI };