const API_URL = "http://localhost:5000/api/analyze";

let latestScan = null;

// Extension Installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("🪝 HookBlock Installed");
});

// Listen for URL from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "SCAN_URL") {

        analyzeWebsite(message.url)
            .then(result => {

                latestScan = result;

                updateBadge(result.score);

                sendResponse(result);

            })
            .catch(error => {

                console.error(error);

                sendResponse({
                    success: false,
                    message: "Scan Failed"
                });

            });

        return true;
    }

    if (message.type === "GET_RESULT") {

        sendResponse(latestScan);

    }

});

async function analyzeWebsite(url) {

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            url
        })

    });

    return await response.json();

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