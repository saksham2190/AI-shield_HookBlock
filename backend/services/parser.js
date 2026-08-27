function parseAIResponse(text) {

    try {

        let cleaned = text.replace(/```json/g, "");
        cleaned = cleaned.replace(/```/g, "");
        cleaned = cleaned.trim();

        const parsed = JSON.parse(cleaned);

        return {

            summary:
                parsed.summary || null,

            risk:
                parsed.risk || null,

            reasons:
                Array.isArray(parsed.reasons) ? parsed.reasons : [],

            recommendation:
                parsed.recommendation || null,

            confidence:
                typeof parsed.confidence === "number" ? parsed.confidence : null,

            confidence_reason:
                parsed.confidence_reason || null,

            flag_explanations:
                Array.isArray(parsed.reasons) ? parsed.reasons : []

        };

    } catch (error) {

        // Log the raw text so you can see exactly why parsing failed
        // (bad JSON, markdown fences, refusal text, quota error text, etc.)
        console.log("AI Parser Error:", error.message);
        console.log("Raw Gemini output was:", text);

        return {

            summary: null,
            risk: null,
            reasons: [],
            recommendation: null,
            confidence: null,
            confidence_reason: null,
            flag_explanations: []

        };

    }

}

module.exports = parseAIResponse;