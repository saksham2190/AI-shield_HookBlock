const whois = require("whois-json");

async function getDomainAge(url) {
    try {
        const hostname = new URL(url).hostname;

        const data = await whois(hostname);

        if (!data.creationDate) {
            return {
                age: null,
                score: 0,
                flag: "Domain age unavailable"
            };
        }

        const created = new Date(data.creationDate);
        const today = new Date();

        const ageInDays = Math.floor(
            (today - created) / (1000 * 60 * 60 * 24)
        );

        let deduction = 0;
        let flag = `Domain Age: ${ageInDays} days`;

        if (ageInDays < 7) {
            deduction = 60;
            flag += " (Very New Domain)";
        } else if (ageInDays < 30) {
            deduction = 40;
            flag += " (Recently Registered)";
        }

        return {
            age: ageInDays,
            score: deduction,
            flag
        };

    } catch (error) {
        return {
            age: null,
            score: 0,
            flag: "WHOIS lookup failed"
        };
    }
}

module.exports = getDomainAge;
