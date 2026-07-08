require("dotenv").config();

const model = require("./config/geminiConfig");

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

Respond ONLY in JSON.

{
  "summary":"",
  "reasons":["","",""],
  "recommendation":"",
  "confidence":95
}
`;

        const result = await model.generateContent(prompt);

        const response = await result.response;

        const text = response.text();

        console.log("\n========== GEMINI RESPONSE ==========\n");
        console.log(text);
        console.log("\n=====================================\n");

    } catch (error) {

        console.error("Gemini Test Failed\n");
        console.error(error);

    }
}

testGemini();