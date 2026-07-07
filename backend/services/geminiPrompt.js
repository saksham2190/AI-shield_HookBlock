function buildPrompt(data) {

return `
You are a cybersecurity expert.

Analyze the following website.

URL:
${data.url}

Risk Score:
${data.score}

Flags:
${data.flags.join(", ")}

WHOIS:
${data.domainAge}

Trusted Domain:
${data.trusted}

Return ONLY JSON.

{
"phishingProbability":0.0,
"confidence":0.0,
"risk":"Safe",
"reason":""
}

`;

}

module.exports = buildPrompt;