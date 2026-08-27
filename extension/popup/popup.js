// ==========================================
// HookBlock Dashboard
// ==========================================

// Format long URLs for clean display
function formatUrl(url) {
    if (!url) return "Unknown";

    try {
        const parsed = new URL(url);

        // Hostname only
        const hostname = parsed.hostname;

        // Get pathname but remove unnecessary trailing slash
        let path = parsed.pathname;

        if (path === "/") {
            path = "";
        }

        // Keep pathname short
        if (path.length > 35) {
            path = path.substring(0, 32) + "...";
        }

        return hostname + path;

    } catch (error) {
        // Fallback for invalid URLs
        if (url.length > 45) {
            return url.substring(0, 42) + "...";
        }

        return url;
    }
}


// ==========================================
// Load Dashboard
// ==========================================

function loadDashboard() {

    chrome.storage.local.get(["hookblockHistory"], (storage) => {

        const history = storage.hookblockHistory || [];

        const dashboard = document.getElementById("dashboard");

        if (history.length === 0) {

            dashboard.innerHTML = `
                <div class="card">

                    <h3>📊 Today's Activity</h3>

                    <p>
                        No websites scanned yet.
                    </p>

                </div>
            `;

            return;
        }


        const total = history.length;

        const dangerous =
            history.filter(site => site.score < 40).length;

        const safe =
            history.filter(site => site.score >= 40).length;


        const recent = history.slice(0, 5);


        dashboard.innerHTML = `

            <div class="card">

                <h3>📊 Today's Activity</h3>

                <p>
                    <b>🌐 Sites Scanned:</b>
                    ${total}
                </p>

                <p>
                    <b>🚨 Dangerous Sites:</b>
                    ${dangerous}
                </p>

                <p>
                    <b>🟢 Safe Sites:</b>
                    ${safe}
                </p>

                <hr>

                <h3>🕒 Recent Activity</h3>

                <ul id="recentScans"></ul>

            </div>

        `;


        const list =
            document.getElementById("recentScans");


        recent.forEach(site => {

            const icon =
                site.score < 40
                    ? "🔴"
                    : site.score < 60
                        ? "🟡"
                        : "🟢";


            const displayUrl =
                formatUrl(site.url);


            list.innerHTML += `

                <li
                    title="${site.url}"
                    style="
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap;
                    "
                >

                    ${icon}

                    <span>
                        ${displayUrl}
                    </span>

                </li>

            `;

        });

    });

}


// ==========================================
// Popup
// ==========================================

window.onload = () => {

    // Load dashboard
    loadDashboard();


    // Load latest scan
    chrome.storage.local.get(["latestScan"], (storage) => {

        const data = storage.latestScan;

        const result =
            document.getElementById("result");


        // ==========================================
        // No Scan
        // ==========================================

        if (!data) {

            result.innerHTML = `

                <div class="card">

                    <h2>No Scan Available</h2>

                    <p>
                        Open a website first and then
                        click HookBlock.
                    </p>

                </div>

            `;

            return;
        }


        // ==========================================
        // Risk Color
        // ==========================================

        let riskColor = "#2ecc71";


        if (data.score < 20) {

            riskColor = "#8B0000";

        } else if (data.score < 40) {

            riskColor = "#e74c3c";

        } else if (data.score < 60) {

            riskColor = "#f39c12";

        } else if (data.score < 80) {

            riskColor = "#f1c40f";

        }


        // ==========================================
        // SSL Data
        // ==========================================

        const ssl = data.ssl || {

            issuer: "Unknown",

            valid: false,

            expiresIn: "Unknown",

            selfSigned: false

        };


        // ==========================================
        // AI Data
        // ==========================================

        const ai = data.ai || {

            summary:
                "AI explanation unavailable.",

            reasons: [],

            recommendation:
                "Proceed carefully.",

            confidence: 0

        };


        // ==========================================
        // Main Result
        // ==========================================

        result.innerHTML = `

            <div class="card">


                <!-- ============================== -->
                <!-- Risk -->
                <!-- ============================== -->

                <h2 style="color:${riskColor}">

                    ${data.risk.toUpperCase()}

                </h2>


                <p>

                    <b>Risk Score</b>

                    <br>

                    ${data.score}/100

                </p>


                <!-- ============================== -->
                <!-- Scanned Website -->
                <!-- ============================== -->

                <p>

                    <b>Website</b>

                    <br>

                    <span
                        title="${data.url}"
                        style="
                            display:block;
                            overflow:hidden;
                            text-overflow:ellipsis;
                            white-space:nowrap;
                        "
                    >
                        ${formatUrl(data.url)}
                    </span>

                </p>


                <!-- ============================== -->
                <!-- Domain Age -->
                <!-- ============================== -->

                <p>

                    <b>Domain Age</b>

                    <br>

                    ${data.domainAge ?? "Unknown"} days

                </p>


                <hr>


                <!-- ============================== -->
                <!-- SSL -->
                <!-- ============================== -->

                <h3>
                    🔐 SSL Information
                </h3>


                <p>

                    <b>Certificate Status</b>

                    <br>

                    ${ssl.valid
                        ? "✅ Valid"
                        : "❌ Invalid"}

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

                    ${ssl.selfSigned
                        ? "Yes"
                        : "No"}

                </p>


                <hr>


                <!-- ============================== -->
                <!-- DNS -->
                <!-- ============================== -->

                <h3>
                    🌐 DNS Information
                </h3>


                <p>

                    <b>Hostname</b>

                    <br>

                    ${data.dns?.hostname || "Unknown"}

                </p>


                <p>

                    <b>IP Address</b>

                    <br>

                    ${
                        data.dns?.addresses &&
                        data.dns.addresses.length

                            ? data.dns.addresses.join("<br>")

                            : "Unavailable"
                    }

                </p>


                <p>

                    <b>Name Servers</b>

                    <br>

                    ${
                        data.dns?.nameservers &&
                        data.dns.nameservers.length

                            ? data.dns.nameservers.join("<br>")

                            : "Unavailable"
                    }

                </p>


                <hr>


                <!-- ============================== -->
                <!-- AI Security Report -->
                <!-- ============================== -->

                <h3>
                    🤖 AI Security Report
                </h3>


                <p>

                    ${ai.summary}

                </p>


                <h4>
                    Why?
                </h4>


                <ul>

                    ${
                        ai.reasons &&
                        ai.reasons.length

                            ? ai.reasons
                                .map(
                                    reason =>
                                        `<li>${reason}</li>`
                                )
                                .join("")

                            : "<li>No additional reasons provided.</li>"
                    }

                </ul>


                <h4>
                    Recommendation
                </h4>


                <p>

                    ${ai.recommendation}

                </p>


                <hr>


                <!-- ============================== -->
                <!-- Confidence -->
                <!-- ============================== -->

                <p>

                    <b>Confidence:</b>

                    ${ai.confidence}%

                </p>


                <hr>


                <!-- ============================== -->
                <!-- Security Flags -->
                <!-- ============================== -->

                <h4>
                    Security Flags
                </h4>


                <ul>

                    ${
                        data.flags &&
                        data.flags.length

                            ? data.flags
                                .map(
                                    flag =>
                                        `<li>${flag}</li>`
                                )
                                .join("")

                            : "<li>No security flags detected.</li>"
                    }

                </ul>


            </div>

        `;

    });

};