function showHookBlockOverlay(data) {

    if (document.getElementById("hookblock-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "hookblock-overlay";

    overlay.innerHTML = `

<div class="hb-overlay">

<div class="hb-card">

<div class="hb-header">

<div class="hb-logo">

<img src="${chrome.runtime.getURL("assets/shield.svg")}" alt="HookBlock">

</div>

<div>

<h1>HookBlock</h1>

<p>Blocks Phishing Hooks</p>

</div>

</div>

<div class="hb-warning">

<img src="${chrome.runtime.getURL("assets/danger.svg")}" class="hb-warning-icon">

<h2>${data.risk.toUpperCase()} RISK WEBSITE</h2>

</div>

<div class="hb-score-box">

<span class="hb-score">${data.score}</span>

<span class="hb-score-text">Risk Score /100</span>

</div>

<div class="hb-section">

<h3>

<img src="${chrome.runtime.getURL("assets/ai.svg")}">

AI Security Report

</h3>

<p>${data.ai.summary}</p>

</div>

<div class="hb-section">

<h3>Detected Threats</h3>

<ul>

${data.ai.reasons.map(r => `<li>${r}</li>`).join("")}

</ul>

</div>

<div class="hb-section">

<h3>Security Flags</h3>

<ul>

${data.flags.map(f => `<li>${f}</li>`).join("")}

</ul>

</div>

<div class="hb-section">

<h3>Recommendation</h3>

<p>${data.ai.recommendation}</p>

</div>

<div class="hb-confidence">

AI Confidence

<strong>${data.ai.confidence}%</strong>

</div>

<div class="hb-buttons">

<button id="hb-leave">Leave Website</button>

<button id="hb-continue">Continue Anyway</button>

</div>

</div>

</div>

`;

    document.body.appendChild(overlay);

    document.getElementById("hb-leave").onclick = () => {

        if (history.length > 1)
            history.back();
        else
            location.href = "https://google.com";

    };

    document.getElementById("hb-continue").onclick = () => {

        overlay.remove();

    };

}

window.showHookBlockOverlay = showHookBlockOverlay;