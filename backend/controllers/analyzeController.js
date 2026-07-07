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

        // ----------------------------
        // 1. URL Analysis
        // ----------------------------
        const result = analyze(url);

        // ----------------------------
        // 2. WHOIS Analysis
        // ----------------------------
        const whoisResult = await getDomainAge(url);

        // ----------------------------
        // 3. Trusted Domain Check
        // ----------------------------
        const trustedResult = isTrustedDomain(url);

        if (trustedResult.trusted) {
            result.score += 20;

            if (result.score > 100) {
                result.score = 100;
            }
        }

        result.flags.push(trustedResult.message);

        // ----------------------------
        // 4. WHOIS Flag
        // ----------------------------
        result.flags.push(whoisResult.flag);

        // ----------------------------
        // 5. Calculate Final Risk
        // ----------------------------
        const finalResult = calculateRisk(result, whoisResult);

        // ----------------------------
        // 6. AI Analysis (Only if Needed)
        // ----------------------------
        let aiResult = null;

        if (shouldCallAI(finalResult.score, trustedResult.trusted)) {
            aiResult = await analyzeWithAI({
                url,
                score: finalResult.score,
                flags: result.flags,
                domainAge: whoisResult.age,
                trusted: trustedResult.trusted
            });
        }

        // ----------------------------
        // 7. Final Response
        // ----------------------------
        res.status(200).json({
            success: true,
            url,
            score: finalResult.score,
            risk: finalResult.risk,
            flags: result.flags,
            domainAge: whoisResult.age,
            trusted: trustedResult.trusted,
            ai: aiResult
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = { analyzeURL };