const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { getAI } = require("./config/geminiConfig");

async function testGemini() {
    try {
        const prompt = `
You are HookBlock AI.

A website has the following details:

URL: https://paypa1-login-security.xyz
Risk Score: 32
Risk Level: High
Flags:
- Newly registered domain
- Brand spoof detected
- Suspicious keywords found

Respond ONLY in valid JSON.

{
  "summary": "Plain English summary",
  "reasons": ["Reason 1", "Reason 2"],
  "recommendation": "Recommended action",
  "confidence": 95
}
`;

        const ai = getAI();
        const candidateModels = ["gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite"];
        let result = null;
        let modelUsed = null;

        for (const model of candidateModels) {
            try {
                result = await ai.models.generateContent({
                    model,
                    contents: prompt
                });
                modelUsed = model;
                break;
            } catch (err) {
                console.warn(`Model ${model} failed in test: ${err.message}`);
            }
        }

        if (!result) {
            throw new Error("No Gemini models responded successfully.");
        }

        const text = result.text;

        console.log(`\n========== GEMINI RESPONSE (Model: ${modelUsed}) ==========\n`);
        console.log(text);
        console.log("\n==========================================================\n");

    } catch (error) {
        console.error("Gemini Test Failed\n");
        console.error(error);
    }
}

testGemini();