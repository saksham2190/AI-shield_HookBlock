const model = require("../config/geminiConfig");

const buildPrompt = require("./promptBuilder");
const parseAI = require("./Parser");

const buildLocalAI = require("./aiEngine");

async function analyzeWithAI(data) {

    // -----------------------------
    // 1. Build Local AI First
    // -----------------------------

    const localAI = buildLocalAI(data);

    try {

        const prompt = buildPrompt({

            ...data,

            localAI

        });

        const result = await model.generateContent(prompt);

        const response = await result.response;

        const text = response.text();

        const parsed = parseAI(text);

        // -----------------------------------
        // Merge Gemini response with Local AI
        // -----------------------------------

        return {

            summary:
                parsed.summary || localAI.summary,

            risk:
                parsed.risk || data.risk,

            reasons:
                parsed.reasons || localAI.reasons,

            recommendation:
                parsed.recommendation || localAI.recommendation,

            confidence:
                parsed.confidence || localAI.confidence,

            confidence_reason:
                parsed.confidence_reason || localAI.confidence_reason,

            flag_explanations:
                parsed.flag_explanations || localAI.flag_explanations

        };

    }

    catch (error) {

        console.log("Gemini unavailable. Using Local AI.");

        return localAI;

    }

}

module.exports = analyzeWithAI;