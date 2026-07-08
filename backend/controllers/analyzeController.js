const analyze = require("../services/urlAnalyzer");
const getDomainAge = require("../services/whoisService");
const calculateRisk = require("../services/riskScorer");
const isTrustedDomain = require("../services/trustedDomainService");

const analyzeWithAI = require("../services/aiService");
const shouldCallAI = require("../utils/aiThreshold");

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
        // WHOIS Analysis
        // ===============================

        const whoisResult = await getDomainAge(url);

        // ===============================
        // Trusted Domain Check
        // ===============================

        const trustedResult = isTrustedDomain(url);

        if (trustedResult.trusted) {

            result.score += 20;

            if (result.score > 100) {

                result.score = 100;

            }

        }

        result.flags.push(trustedResult.message);

        result.flags.push(whoisResult.flag);

        // ===============================
        // Final Risk Score
        // ===============================

        const finalResult = calculateRisk(result, whoisResult);

        // ===============================
        // AI Explanation
        // ===============================

        let ai = null;

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

            ai = {

                summary:
                    "This website appears safe based on our security checks.",

                reasons: [

                    "No major phishing indicators were detected.",

                    "The domain appears trustworthy.",

                    "The overall security score is good."

                ],

                recommendation:
                    "You may continue browsing, but always verify sensitive websites before entering personal information.",

                confidence: 95

            };

        }

        // ===============================
        // Final Response
        // ===============================

        return res.status(200).json({

            success: true,

            url,

            score: finalResult.score,

            risk: finalResult.risk,

            flags: result.flags,

            domainAge: whoisResult.age,

            trusted: trustedResult.trusted,

            ai

        });

    } catch (error) {

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