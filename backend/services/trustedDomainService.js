const trustedDomains = require("../utils/trustedDomains");

function isTrustedDomain(url) {
    try {
        const hostname = new URL(url).hostname
            .replace("www.", "")
            .toLowerCase();

        const trusted = trustedDomains.includes(hostname);

        return {
            trusted,
            message: trusted
                ? "Trusted Domain"
                : "Unknown Domain"
        };

    } catch (error) {
        return {
            trusted: false,
            message: "Invalid URL"
        };
    }
}

module.exports = isTrustedDomain;