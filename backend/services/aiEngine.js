const FLAG_EXPLANATIONS = {

    "HTTPS Enabled":
        "The website uses HTTPS encryption, helping protect data exchanged between your browser and the server.",

    "No HTTPS":
        "The website does not use HTTPS encryption. Information could potentially be intercepted during transmission.",

    "Trusted Domain":
        "This domain matches a trusted service that is commonly used and has a good reputation.",

    "Unknown Domain":
        "The domain is not recognized as a trusted service. Extra caution is recommended.",

    "Very New Domain":
        "The domain was registered recently. Newly created domains are frequently used in phishing attacks.",

    "Old Domain":
        "The domain has existed for a long time, which generally increases trustworthiness.",

    "Domain Age: Recently Registered":
        "The website was registered recently, making it more likely to be associated with phishing campaigns.",

    "Brand Spoof":
        "The website appears to imitate a legitimate brand by using a similar-looking domain name.",

    "Suspicious Keyword":
        "The URL contains words that are frequently found in phishing websites such as 'login', 'verify', 'secure', or 'update'.",

    "Long URL":
        "The unusually long URL may be attempting to hide suspicious paths or mislead users.",

    "IP Address Used":
        "The website uses an IP address instead of a domain name, which is uncommon for legitimate services.",

    "Expired SSL":
        "The SSL certificate has expired, reducing the trustworthiness of the secure connection."

};

// Normalize every possible risk string
function normalizeRisk(risk) {

    if (!risk) return "UNKNOWN";

    const r = risk.toString().trim().toUpperCase();

    if (r === "SAFE")
        return "SAFE";

    if (r === "LOW" || r === "LOW RISK")
        return "LOW RISK";

    if (r === "MODERATE" || r === "MEDIUM" || r === "MODERATE RISK")
        return "MODERATE RISK";

    if (r === "HIGH" || r === "HIGH RISK")
        return "HIGH RISK";

    if (r === "CRITICAL" || r === "CRITICAL RISK")
        return "CRITICAL RISK";

    return r;

}

function recommendation(risk) {

    switch (normalizeRisk(risk)) {

        case "SAFE":
            return "No major security concerns were detected. Continue browsing normally, but always verify websites before sharing sensitive information.";

        case "LOW RISK":
            return "The website appears mostly safe. Exercise normal caution before entering passwords or personal information.";

        case "MODERATE RISK":
            return "Some suspicious indicators were detected. Verify the website before entering passwords, banking information or personal details.";

        case "HIGH RISK":
            return "Strong phishing indicators were detected. Avoid logging in or submitting sensitive information until the website is verified.";

        case "CRITICAL RISK":
            return "This website shows severe phishing indicators. Leave the website immediately and do not enter passwords, OTPs, banking information, Aadhaar, PAN, UPI IDs or any personal data.";

        default:
            return "Exercise caution while using this website.";

    }

}

function summary(score, risk, flags) {

    risk = normalizeRisk(risk);

    if (risk === "SAFE") {

        return "The website appears trustworthy based on the available security evidence. No significant phishing indicators were detected during analysis.";

    }

    return `The website has been classified as ${risk}. ${flags.length} security indicators contributed to this assessment. Users should review the detected warnings before sharing sensitive information.`;

}

function confidence(score, flags, result = {}) {

    let value = 100;

    // --------------------------
    // Risk score effect
    // --------------------------

    if (score < 90)
        value -= 5;

    if (score < 80)
        value -= 10;

    if (score < 60)
        value -= 10;

    if (score < 40)
        value -= 10;

    if (score < 20)
        value -= 10;

    // --------------------------
    // Too many indicators
    // --------------------------

    if (flags.length >= 3)
        value -= 5;

    if (flags.length >= 5)
        value -= 5;

    // --------------------------
    // Unknown domain
    // --------------------------

    if (result.trusted === false)
        value -= 5;

    // --------------------------
    // Very new domain
    // --------------------------

    if (
        result.domainAge !== undefined &&
        result.domainAge >= 0 &&
        result.domainAge < 30
    ) {
        value -= 10;
    }

    if (value > 99)
        value = 99;

    if (value < 40)
        value = 40;

    return value;

}

function buildAI(result) {

    const risk = normalizeRisk(result.risk);

    const explanations = (result.flags || []).map(flag => {

        return FLAG_EXPLANATIONS[flag] ||
            "This security indicator contributed to the overall security assessment.";

    });

    return {

        summary: summary(result.score, risk, result.flags),

        risk,

        reasons: explanations,

        recommendation: recommendation(risk),

        confidence: confidence(result.score, result.flags),

        confidence_reason:
            `This assessment is based on ${result.flags.length} independent security indicators including URL analysis, SSL validation, domain age, trusted domain verification and phishing heuristics.`,

        flag_explanations: explanations

    };

}

module.exports = buildAI;