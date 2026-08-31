const { getAI } = require("../config/geminiConfig");

const buildPrompt = require("./promptBuilder");
const parseAI = require("./parser");
const buildLocalAI = require("./aiEngine");

const CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.6-flash"
];

async function callGeminiWithFallback(ai, prompt) {
    let lastError = null;

    for (const model of CANDIDATE_MODELS) {
        try {
            const generatePromise = ai.models.generateContent({
                model,
                contents: prompt
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`Gemini request timed out for model ${model}`)), 5000)
            );

            const result = await Promise.race([generatePromise, timeoutPromise]);

            if (result && result.text) {
                return { text: result.text, modelUsed: model };
            }
        } catch (error) {
            lastError = error;
            console.warn(`Model ${model} failed (${error.message}), trying next fallback if available...`);
        }
    }

    throw lastError || new Error("All Gemini candidate models failed");
}

async function analyzeWithAI(data) {

    // -----------------------------
    // 1. Build Local AI First (fallback, always ready)
    // -----------------------------
    const localAI = buildLocalAI(data);

    try {
        const prompt = buildPrompt({
            ...data,
            localAI
        });

        // -----------------------------------
        // 2. Get the Gemini client and call candidate models
        // -----------------------------------
        const ai = getAI();
        const { text, modelUsed } = await callGeminiWithFallback(ai, prompt);

        const parsed = parseAI(text);

        // -----------------------------------
        // 3. Merge Gemini response with Local AI
        // -----------------------------------
        return {
            summary:
                parsed.summary || localAI.summary,

            risk:
                parsed.risk || data.risk,

            reasons:
                (parsed.reasons && parsed.reasons.length) ? parsed.reasons : localAI.reasons,

            recommendation:
                parsed.recommendation || localAI.recommendation,

            confidence:
                (parsed.confidence !== null && parsed.confidence !== undefined)
                    ? parsed.confidence
                    : localAI.confidence,

            confidence_reason:
                parsed.confidence_reason || localAI.confidence_reason,

            flag_explanations:
                (parsed.flag_explanations && parsed.flag_explanations.length)
                    ? parsed.flag_explanations
                    : localAI.flag_explanations,

            aiGenerated: true,
            model: modelUsed
        };

    } catch (error) {
        console.log("Gemini unavailable, using local fallback:", error.message);

        return {
            ...localAI,
            aiGenerated: false
        };
    }
}

module.exports = analyzeWithAI;