const dns = require("dns").promises;
const { URL } = require("url");

async function analyzeDNS(website) {

    try {

        const hostname = new URL(website).hostname;

        const result = {

            hostname,

            nameservers: [],

            addresses: [],

            score: 10,

            flags: []

        };

        // IPv4 addresses
        try {

            result.addresses = await dns.resolve4(hostname);

        } catch {

            result.flags.push("DNS A Record Missing");
            result.score -= 20;

        }

        // Name Servers
        try {

            result.nameservers = await dns.resolveNs(hostname);

        } catch {

            result.flags.push("Nameserver Lookup Failed");
            result.score -= 10;

        }

        if (result.nameservers.length > 0) {

            result.flags.push("DNS Resolved");

        }

        return result;

    }

    catch {

        return {

            hostname: null,

            nameservers: [],

            addresses: [],

            score: -20,

            flags: ["DNS Lookup Failed"]

        };

    }

}

module.exports = analyzeDNS;