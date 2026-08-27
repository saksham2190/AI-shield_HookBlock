function buildPrompt(data) {

    return `
You are a cybersecurity analyst reviewing a website scan for phishing risk.

Write a natural, specific explanation based on the actual data below — do not use generic filler sentences. Reference the actual flags, domain age, and score in your reasoning. Vary your wording between different sites; do not repeat the same phrasing across different scans.

URL: ${data.url}
Risk Score: ${data.score}
Risk Level: ${data.risk}
Domain Age (days): ${data.domainAge}
Trusted Domain: ${data.trusted}
Security Flags: ${data.flags.join(", ")}

Return ONLY valid JSON, no markdown fences, no extra text, in exactly this shape:

{
  "summary": "2-3 sentence plain-English summary of why this site got this risk level, referencing the specific flags/data above",
  "risk": "Safe | Low Risk | Moderate Risk | High Risk | Critical Risk",
  "reasons": ["specific reason 1 tied to actual flags", "specific reason 2", "..."],
  "recommendation": "specific, actionable advice for this exact site given its actual flags",
  "confidence": 0-100,
  "confidence_reason": "1 sentence on why you have this confidence level given the evidence available"
}
`;

}

module.exports = buildPrompt;