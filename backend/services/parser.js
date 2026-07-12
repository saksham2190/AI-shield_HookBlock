function parseAI(text) {

    try {

        const data = JSON.parse(text);

        return {

            summary:
                data.summary || "No summary available.",

            risk:
                data.risk || "UNKNOWN",

            reasons:
                Array.isArray(data.reasons)
                    ? data.reasons
                    : [],

            recommendation:
                data.recommendation ||
                "Proceed carefully.",

            confidence:
                typeof data.confidence === "number"
                    ? data.confidence
                    : 80,

            confidence_reason:
                data.confidence_reason ||
                "Confidence calculated using multiple security indicators.",

            flag_explanations:
                Array.isArray(data.flag_explanations)
                    ? data.flag_explanations
                    : []

        };

    }

    catch {

        return {};

    }

}

module.exports = parseAI;