const suspiciousKeywords = require("../utils/keywords");
const trustedBrands = require("../utils/trustedBrands");
const levenshteinDistance = require("../utils/levenshtein");

const analyzeURL = (url) => {
    let score = 100;
    let flags = [];

    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname.toLowerCase();
        // Extract main domain name
const domainName = hostname.replace("www.", "").split(".")[0];

// Brand Spoof Detection
trustedBrands.forEach((brand) => {
    const distance = levenshteinDistance(domainName, brand);

    if (distance > 0 && distance <= 2) {
        score -= 30;
        flags.push(`Possible brand spoofing detected: ${domainName} looks like ${brand}`);
    }
});

        // Check HTTPS
        if (parsedURL.protocol !== "https:") {
            score -= 20;
            flags.push("Website is not using HTTPS");
        } else {
            flags.push("HTTPS Enabled");
        }

        // Check URL length
        if (url.length > 75) {
            score -= 10;
            flags.push("Long URL detected");
        }

        // Check suspicious keywords
        suspiciousKeywords.forEach((keyword) => {
            if (url.toLowerCase().includes(keyword)) {
                score -= 5;
                flags.push(`Suspicious keyword: ${keyword}`);
            }
        });

        // Check IP address URL
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

        if (ipRegex.test(hostname)) {
            score -= 25;
            flags.push("Website uses IP address instead of domain");
        }

        // Suspicious TLDs
        const suspiciousTLDs = [
            ".xyz",
            ".top",
            ".click",
            ".shop",
            ".live",
            ".buzz",
            ".gq",
            ".tk"
        ];

        suspiciousTLDs.forEach((tld) => {
            if (hostname.endsWith(tld)) {
                score -= 15;
                flags.push(`Suspicious domain extension: ${tld}`);
            }
        });

        if (score < 0) score = 0;

        return {
            score,
            flags
        };

    } catch (error) {
        return {
            score: 0,
            flags: ["Invalid URL"]
        };
    }
};

module.exports = analyzeURL;