function calculateRisk(result, whoisResult) {

    let score = result.score;

    // Apply WHOIS deduction
    score -= whoisResult.score;

    if (score < 0) {
        score = 0;
    }

    let risk = "Safe";

    if (score < 20) {
        risk = "Critical";
    } else if (score < 40) {
        risk = "High";
    } else if (score < 60) {
        risk = "Moderate";
    } else if (score < 80) {
        risk = "Low";
    }

    return {
        score,
        risk
    };
}

module.exports = calculateRisk;