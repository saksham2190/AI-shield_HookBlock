function parseAIResponse(text) {

    try {

        text = text.replace(/```json/g, "");
        text = text.replace(/```/g, "");
        text = text.trim();

        const parsed = JSON.parse(text);

        return {

            summary:
                parsed.summary || "No summary available.",

            reasons:
                parsed.reasons || [],

            recommendation:
                parsed.recommendation || "Proceed carefully.",

            confidence:
                parsed.confidence || 90

        };

    } catch (error) {

        console.log("AI Parser Error:", error.message);

        return {

            summary:
                "Unable to generate AI explanation.",

            reasons: [
                "AI response could not be parsed."
            ],

            recommendation:
                "Use the rule-based security analysis.",

            confidence: 0

        };

    }

}

module.exports = parseAIResponse;