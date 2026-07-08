const model = require("../config/geminiConfig");

const buildPrompt = require("./promptBuilder");

const parseAIResponse = require("./Parser");

async function analyzeWithAI(data) {

    try {

        const prompt = buildPrompt(data);

        const result = await model.generateContent(prompt);

        const response = await result.response;

        const text = response.text();

        return parseAIResponse(text);

    } catch (error) {

        console.error("Gemini Error:", error.message);

        return {

            summary:
                "AI explanation is currently unavailable.",

            reasons: [
                "Gemini service failed."
            ],

            recommendation:
                "Use the rule-based analysis.",

            confidence: 0

        };

    }

}

module.exports = analyzeWithAI;