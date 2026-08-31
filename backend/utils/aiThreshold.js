function shouldCallAI(score, trusted) {
    // If Gemini API Key is configured, attempt AI analysis for all scans.
    // aiService will gracefully fall back to local rule engine if Gemini is unreachable.
    if (process.env.GEMINI_API_KEY) {
        return true;
    }

    // Default fallback rule if no API key is set
    return !trusted && score < 70;
}

module.exports = shouldCallAI;