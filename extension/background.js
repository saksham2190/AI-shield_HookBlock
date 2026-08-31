const LOCAL_API_URL = "http://localhost:5000/api/analyze";
const REMOTE_API_URL = "https://ai-shield-hookblock.onrender.com/api/analyze";

// Extension Installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("🪝 HookBlock Installed");
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "SCAN_URL") {

        analyzeWebsite(message.url)
            .then(result => {

                // Save latest scan
                chrome.storage.local.set({
                    latestScan: result
                });

                // Update browser badge
                if (result && typeof result.score === "number") {
                    updateBadge(result.score);
                }

                sendResponse(result);

            })
            .catch(error => {

                console.error("HookBlock Error:", error);

                sendResponse({
                    success: false,
                    message: "Scan Failed"
                });

            });

        return true;
    }

    if (message.type === "GET_RESULT") {

        chrome.storage.local.get(["latestScan"], (data) => {

            sendResponse(data.latestScan || null);

        });

        return true;
    }

});

async function postJSON(endpoint, body, timeoutMs = 15000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });
        return await response.json();
    } finally {
        clearTimeout(timer);
    }
}

async function analyzeWebsite(url) {
    // 1. Try local backend first (best for active local development and updated Gemini AI)
    try {
        const localResult = await postJSON(LOCAL_API_URL, { url }, 4000);
        if (localResult && localResult.success) {
            return localResult;
        }
    } catch (err) {
        console.log("Local backend not available, attempting remote backend fallback...", err.message);
    }

    // 2. Fallback to deployed Render backend
    return await postJSON(REMOTE_API_URL, { url }, 15000);
}

function updateBadge(score) {

    let color = "#2ecc71";

    if (score < 20) {

        color = "#8B0000";

    } else if (score < 40) {

        color = "#e74c3c";

    } else if (score < 60) {

        color = "#f39c12";

    } else if (score < 80) {

        color = "#f1c40f";

    }

    chrome.action.setBadgeText({
        text: String(score)
    });

    chrome.action.setBadgeBackgroundColor({
        color
    });

}