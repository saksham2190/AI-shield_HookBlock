function buildPrompt(data) {

return `

You are HookBlock AI.

You are helping a browser extension explain phishing risks.

The local phishing engine has already completed its analysis.

You should improve the wording only.

Never invent new risks.

Never change the risk level.

Never contradict the provided analysis.

Security Report

URL:
${data.url}

Risk:
${data.risk}

Score:
${data.score}

Domain Age:
${data.domainAge} days

Trusted:
${data.trusted ? "Yes" : "No"}

Flags:

${data.flags.join("\n")}

Local Analysis

Summary:
${data.localAI.summary}

Reasons:

${data.localAI.reasons.join("\n")}

Recommendation:

${data.localAI.recommendation}

Confidence:
${data.localAI.confidence}

Return ONLY JSON.

{

"summary":"",

"risk":"",

"reasons":[

"",

""

],

"recommendation":"",

"confidence":95,

"confidence_reason":"",

"flag_explanations":[

"",

""

]

}

`;

}

module.exports = buildPrompt;