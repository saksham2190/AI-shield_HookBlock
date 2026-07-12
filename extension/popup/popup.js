// ==========================================
// HookBlock Dashboard
// ==========================================

function loadDashboard() {

    chrome.storage.local.get(["hookblockHistory"], (storage) => {

        const history = storage.hookblockHistory || [];

        const dashboard = document.getElementById("dashboard");

        if (history.length === 0) {

            dashboard.innerHTML = `
                <div class="card">
                    <h3>📊 Today's Activity</h3>
                    <p>No websites scanned yet.</p>
                </div>
            `;

            return;

        }

        const total = history.length;

        const dangerous = history.filter(site => site.score < 40).length;

        const safe = history.filter(site => site.score >= 40).length;

        const recent = history.slice(0, 5);

        dashboard.innerHTML = `

            <div class="card">

                <h3>📊 Today's Activity</h3>

                <p><b>🌐 Sites Scanned:</b> ${total}</p>

                <p><b>🚨 Dangerous Sites:</b> ${dangerous}</p>

                <p><b>🟢 Safe Sites:</b> ${safe}</p>

                <hr>

                <h3>🕒 Recent Activity</h3>

                <ul id="recentScans"></ul>

            </div>

        `;

        const list = document.getElementById("recentScans");

        recent.forEach(site => {

            const icon =
                site.score < 40
                    ? "🔴"
                    : site.score < 60
                        ? "🟡"
                        : "🟢";

            list.innerHTML += `
                <li>
                    ${icon}
                    ${site.url}
                </li>
            `;

        });

    });

}

// ==========================================
// Popup
// ==========================================

window.onload = () => {

    loadDashboard();

    chrome.storage.local.get(["latestScan"], (storage) => {

        const data = storage.latestScan;

        const result = document.getElementById("result");

        if (!data) {

            result.innerHTML = `
                <div class="card">

                    <h2>No Scan Available</h2>

                    <p>
                        Open a website first and then click HookBlock.
                    </p>

                </div>
            `;

            return;

        }

        let riskColor = "#2ecc71";

        if (data.score < 20)
            riskColor = "#8B0000";

        else if (data.score < 40)
            riskColor = "#e74c3c";

        else if (data.score < 60)
            riskColor = "#f39c12";

        else if (data.score < 80)
            riskColor = "#f1c40f";

        const ssl = data.ssl || {

            issuer: "Unknown",

            valid: false,

            expiresIn: "Unknown",

            selfSigned: false

        };

        const ai = data.ai || {

            summary: "AI explanation unavailable.",

            reasons: [],

            recommendation: "Proceed carefully.",

            confidence: 0

        };

        result.innerHTML = `

        <div class="card">

            <h2 style="color:${riskColor}">
                ${data.risk.toUpperCase()}
            </h2>

            <p>

                <b>Risk Score</b>

                <br>

                ${data.score}/100

            </p>

            <p>

                <b>Domain Age</b>

                <br>

                ${data.domainAge ?? "Unknown"} days

            </p>

            <hr>

            <h3>🔐 SSL Information</h3>

            <p>

                <b>Certificate Status</b>

                <br>

                ${ssl.valid ? "✅ Valid" : "❌ Invalid"}

            </p>

            <p>

                <b>Issuer</b>

                <br>

                ${ssl.issuer || "Unknown"}

            </p>

            <p>

                <b>Expires In</b>

                <br>

                ${
                    ssl.expiresIn === "Unknown" ||
                    ssl.expiresIn === undefined
                        ? "Unknown"
                        : `${ssl.expiresIn} days`
                }

            </p>

            <p>

                <b>Self Signed</b>

                <br>

                ${ssl.selfSigned ? "Yes" : "No"}

            </p>

            <hr>

            <h3>🤖 AI Security Report</h3>

            <p>

                ${ai.summary}

            </p>

            <h4>Why?</h4>

            <ul>

                ${ai.reasons.map(reason => `<li>${reason}</li>`).join("")}

            </ul>

            <h4>Recommendation</h4>

            <p>

                ${ai.recommendation}

            </p>

            <hr>

            <p>

                <b>Confidence:</b>

                ${ai.confidence}%

            </p>

            <hr>

            <h4>Security Flags</h4>

            <ul>

                ${data.flags.map(flag => `<li>${flag}</li>`).join("")}

            </ul>

        </div>

        `;

    });

};