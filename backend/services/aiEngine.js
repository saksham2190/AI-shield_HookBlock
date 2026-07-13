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

    "Brand Spoof":
        "The website appears to imitate a legitimate brand by using a similar-looking domain name.",

    "Suspicious Keyword":
        "The URL contains words that are frequently found in phishing websites such as login, verify, secure or update.",

    "Long URL":
        "The unusually long URL may be attempting to hide suspicious paths or mislead users.",

    "IP Address Used":
        "The website uses an IP address instead of a domain name, which is uncommon for legitimate services.",

    "Expired SSL":
        "The SSL certificate has expired, reducing the trustworthiness of the secure connection.",

    "SSL Valid":
        "The website's SSL certificate is valid and the encrypted connection is secure.",

    "DNS Resolved":
        "The domain successfully resolves to a valid server, indicating normal DNS configuration."

};

function normalizeRisk(risk) {

    if (!risk) return "UNKNOWN";

    const r = risk.toString().trim().toUpperCase();

    if (r === "SAFE") return "SAFE";

    if (r === "LOW" || r === "LOW RISK") return "LOW RISK";

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

function confidence(result) {

    let value = 50;

    // ==========================
    // Website Score
    // ==========================

    if (result.score >= 95)
        value += 18;
    else if (result.score >= 80)
        value += 12;
    else if (result.score >= 60)
        value += 6;
    else if (result.score >= 40)
        value += 2;

    // ==========================
    // Trusted Domain
    // ==========================

    if (result.trusted)
        value += 15;

    // ==========================
    // Domain Age
    // ==========================

    if (result.domainAge >= 3650)
        value += 12;

    else if (result.domainAge >= 365)
        value += 8;

    else if (result.domainAge >= 90)
        value += 4;

    else
        value -= 12;

    // ==========================
    // SSL
    // ==========================

    if (result.flags.includes("SSL Valid"))
        value += 6;

    if (result.flags.includes("Expired SSL"))
        value -= 12;

    // ==========================
    // HTTPS
    // ==========================

    if (result.flags.includes("HTTPS Enabled"))
        value += 5;

    if (result.flags.includes("No HTTPS"))
        value -= 12;

    // ==========================
    // DNS
    // ==========================

    if (result.flags.includes("DNS Resolved"))
        value += 4;

    // ==========================
    // Phishing Indicators
    // ==========================

    result.flags.forEach(flag => {

        if (flag.startsWith("Suspicious keyword"))
            value -= 5;

        if (flag.includes("Brand Spoof"))
            value -= 12;

        if (flag.includes("IP Address"))
            value -= 10;

        if (flag.includes("Long URL"))
            value -= 4;

    });

    // ==========================
    // Risk Adjustment
    // ==========================

    switch (normalizeRisk(result.risk)) {

        case "SAFE":
            value += 6;
            break;

        case "LOW RISK":
            value += 2;
            break;

        case "MODERATE RISK":
            value -= 5;
            break;

        case "HIGH RISK":
            value -= 12;
            break;

        case "CRITICAL RISK":
            value -= 20;
            break;

    }

    // Clamp

    if (value > 99)
        value = 99;

    if (value < 10)
        value = 10;

    return Math.round(value);

}

function explainFlag(flag, result) {

    if (flag.startsWith("Domain Age:")) {

        if (result.domainAge >= 365) {

            return `The domain has existed for ${result.domainAge} days, which generally increases its credibility.`;

        }

        return `The domain was registered only ${result.domainAge} days ago. Newly registered domains deserve additional caution.`;

    }

    if (flag.startsWith("Suspicious keyword:")) {

        const keyword = flag.split(":")[1]?.trim() || "";

        return `The URL contains the suspicious keyword "${keyword}", which is commonly seen in phishing websites.`;

    }

    return FLAG_EXPLANATIONS[flag] ||
        "This security indicator affected the overall security assessment.";

}

function buildAI(result) {

    const risk = normalizeRisk(result.risk);

    const explanations = [];

    const used = new Set();

    (result.flags || []).forEach(flag => {

        const explanation = explainFlag(flag, result);

        if (!used.has(explanation)) {

            used.add(explanation);

            explanations.push(explanation);

        }

    });

    return {

        summary: summary(result.score, risk, result.flags),

        risk,

        reasons: explanations,

        recommendation: recommendation(risk),

        confidence: confidence(result),

        confidence_reason:
            `This assessment is based on ${result.flags.length} independent security indicators including URL analysis, SSL validation, DNS verification, domain age and phishing heuristics.`,

        flag_explanations: explanations

    };

}

module.exports = buildAI;