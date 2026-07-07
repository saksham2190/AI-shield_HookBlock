const express = require("express");
const router = express.Router();

const getDomainAge = require("../services/whoisService");

router.post("/whois", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required"
            });
        }

        const result = await getDomainAge(url);

        res.json({
            success: true,
            result
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

module.exports = router;