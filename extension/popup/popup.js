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
// Popup Rendering
// ==========================================

function renderScanResult(data) {
    const result = document.getElementById("result");

    if (!data || !data.success) {
        result.innerHTML = `
            <div class="card">
                <h2>No Scan Available</h2>
                <p>Open a website first and then click HookBlock, or click below to scan the active tab.</p>
                <button id="rescanBtn" style="margin-top: 10px; padding: 8px 16px; background: #3498db; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    🔄 Scan Current Tab
                </button>
            </div>
        `;
        document.getElementById("rescanBtn")?.addEventListener("click", triggerActiveTabScan);
        return;
    }

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
        confidence: 0,
        aiGenerated: false
    };

    result.innerHTML = `
        <div class="card">
            <!-- Risk -->
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="color:${riskColor}; margin: 0;">
                    ${(data.risk || "UNKNOWN").toUpperCase()}
                </h2>
                <button id="rescanBtn" title="Re-analyze website with AI" style="padding: 4px 10px; font-size: 12px; background: #edf2f7; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer;">
                    🔄 Rescan
                </button>
            </div>

            <p>
                <b>Risk Score</b><br>
                ${data.score}/100
            </p>

            <!-- Scanned Website -->
            <p>
                <b>Website</b><br>
                <span title="${data.url}" style="display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    ${formatUrl(data.url)}
                </span>
            </p>

            <!-- Domain Age -->
            <p>
                <b>Domain Age</b><br>
                ${data.domainAge !== null && data.domainAge !== undefined ? data.domainAge : "Unknown"} days
            </p>

            <hr>

            <!-- SSL -->
            <h3>🔐 SSL Information</h3>
            <p><b>Certificate Status</b><br>${ssl.valid ? "✅ Valid" : "❌ Invalid"}</p>
            <p><b>Issuer</b><br>${ssl.issuer || "Unknown"}</p>
            <p><b>Expires In</b><br>${ssl.expiresIn === "Unknown" || ssl.expiresIn === undefined ? "Unknown" : `${ssl.expiresIn} days`}</p>
            <p><b>Self Signed</b><br>${ssl.selfSigned ? "Yes" : "No"}</p>

            <hr>

            <!-- DNS -->
            <h3>🌐 DNS Information</h3>
            <p><b>Hostname</b><br>${data.dns?.hostname || "Unknown"}</p>
            <p><b>IP Address</b><br>${data.dns?.addresses && data.dns.addresses.length ? data.dns.addresses.join("<br>") : "Unavailable"}</p>
            <p><b>Name Servers</b><br>${data.dns?.nameservers && data.dns.nameservers.length ? data.dns.nameservers.join("<br>") : "Unavailable"}</p>

            <hr>

            <!-- AI Security Report -->
            <h3>
                🤖 AI Security Report
                ${ai.aiGenerated ? '<span style="font-size: 11px; background: #e8f0fe; color: #1a73e8; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: normal;">✨ Gemini AI</span>' : '<span style="font-size: 11px; background: #f1f3f4; color: #5f6368; padding: 2px 6px; border-radius: 4px; margin-left: 6px; font-weight: normal;">🛡️ Local Engine</span>'}
            </h3>

            <p>${ai.summary}</p>

            <h4>Why?</h4>
            <ul>
                ${ai.reasons && ai.reasons.length ? ai.reasons.map(reason => `<li>${reason}</li>`).join("") : "<li>No additional reasons provided.</li>"}
            </ul>

            <h4>Recommendation</h4>
            <p>${ai.recommendation}</p>

            <hr>

            <!-- Confidence -->
            <p>
                <b>Confidence:</b> ${ai.confidence}%
                ${ai.confidence_reason ? `<br><small style="color: #666;">${ai.confidence_reason}</small>` : ""}
            </p>

            <hr>

            <!-- Security Flags -->
            <h4>Security Flags</h4>
            <ul>
                ${data.flags && data.flags.length ? data.flags.map(flag => `<li>${flag}</li>`).join("") : "<li>No security flags detected.</li>"}
            </ul>
        </div>
    `;

    document.getElementById("rescanBtn")?.addEventListener("click", triggerActiveTabScan);
}

function triggerActiveTabScan() {
    const result = document.getElementById("result");
    result.innerHTML = `
        <div class="card" style="text-align: center; padding: 20px;">
            <div style="font-size: 24px; margin-bottom: 8px;">⚡</div>
            <h3>Analyzing with Gemini AI...</h3>
            <p style="color: #666; font-size: 13px;">Checking URL reputation, SSL certificates, DNS, and generating threat intelligence report...</p>
        </div>
    `;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs && tabs[0];
        if (!activeTab || !activeTab.url || !activeTab.url.startsWith("http")) {
            renderScanResult(null);
            return;
        }

        chrome.runtime.sendMessage({
            type: "SCAN_URL",
            url: activeTab.url
        }, (response) => {
            renderScanResult(response);
            loadDashboard();
        });
    });
}

window.onload = () => {
    loadDashboard();

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs && tabs[0];

        chrome.storage.local.get(["latestScan"], (storage) => {
            const data = storage.latestScan;

            // If latestScan exists and matches active tab, display it
            if (data && activeTab && data.url === activeTab.url) {
                renderScanResult(data);
            } else if (activeTab && activeTab.url && activeTab.url.startsWith("http")) {
                // Otherwise scan active tab directly
                triggerActiveTabScan();
            } else {
                renderScanResult(data || null);
            }
        });
    });
};