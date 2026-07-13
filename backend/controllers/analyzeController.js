const analyze = require("../services/urlAnalyzer");
const getDomainAge = require("../services/whoisService");
const analyzeSSL = require("../services/sslAnalyzer");
const calculateRisk = require("../services/riskScorer");
const isTrustedDomain = require("../services/trustedDomainService");

const analyzeWithAI = require("../services/aiService");
const shouldCallAI = require("../utils/aiThreshold");

const buildLocalAI = require("../services/aiEngine");
const analyzeDNS = require("../services/dnsAnalyzer");

const analyzeURL = async (req, res) => {

    try {

        const { url } = req.body;

        if (!url) {

            return res.status(400).json({
                success: false,
                message: "URL is required"
            });

        }

        // ===============================
        // URL Analysis
        // ===============================

        const result = analyze(url);

        // ===============================
        // WHOIS
        // ===============================

        const whoisResult = await getDomainAge(url);
        const sslResult = await analyzeSSL(url);
        const dnsResult = await analyzeDNS(url);

        // ===============================
        // Trusted Domain
        // ===============================

        const trustedResult = isTrustedDomain(url);

        if (trustedResult.trusted) {

            result.score += 20;

            if (result.score > 100)
                result.score = 100;

        }

        result.flags.push(trustedResult.message);
        result.flags.push(whoisResult.flag);
        result.flags.push(sslResult.flag);
        dnsResult.flags.forEach(flag => result.flags.push(flag));

        // ===============================
        // Final Score
        // ===============================

        const finalResult = calculateRisk(result, whoisResult);

        // ===============================
        // AI
        // ===============================

        let ai;

        if (shouldCallAI(finalResult.score, trustedResult.trusted)) {

            ai = await analyzeWithAI({

                url,

                score: finalResult.score,

                risk: finalResult.risk,

                flags: result.flags,

                domainAge: whoisResult.age,

                trusted: trustedResult.trusted

            });

        } else {

            ai = buildLocalAI({

    score: finalResult.score,

    risk: finalResult.risk,

    flags: result.flags,

    trusted: trustedResult.trusted,

    domainAge: whoisResult.age

});

        }

        // ===============================
        // Response
        // ===============================

        return res.status(200).json({

            success: true,

            url,

            score: finalResult.score,

            risk: finalResult.risk,

            flags: result.flags,

            domainAge: whoisResult.age,

            trusted: trustedResult.trusted,

            ssl: {

            issuer: sslResult.issuer,

            valid: sslResult.valid,

            expiresIn: sslResult.remainingDays,

            selfSigned: sslResult.selfSigned

            },
            dns: {

            hostname: dnsResult.hostname,

            nameservers: dnsResult.nameservers,

            addresses: dnsResult.addresses

        },

            ai

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = {
    analyzeURL
};