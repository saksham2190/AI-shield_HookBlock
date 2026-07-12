// ==========================================
// HookBlock Content Script
// ==========================================

// Create HookBlock components
const detector = new SensitiveDetector();
const submissionGuard = new SubmissionGuard();

(async () => {

    const currentURL = window.location.href;

    console.log("🌍 HookBlock Scanning:", currentURL);

    chrome.runtime.sendMessage(
        {
            type: "SCAN_URL",
            url: currentURL
        },
        (response) => {

            if (chrome.runtime.lastError) {

                console.error("HookBlock Error:", chrome.runtime.lastError);

                return;

            }

            if (!response || !response.success) {

                console.log("❌ Scan Failed");

                return;

            }

            console.log("✅ HookBlock Scan Result:", response);

            // ==========================================
            // Save latest scan for Popup
            // ==========================================

            chrome.storage.local.set({
                latestScan: response
            });

            // ==========================================
            // Save Scan History
            // ==========================================

            chrome.storage.local.get(["hookblockHistory"], (storage) => {

                const history = storage.hookblockHistory || [];

                history.unshift({

                    url: currentURL,

                    score: response.score,

                    risk: response.risk,

                    time: Date.now()

                });

                if (history.length > 100) {

                    history.pop();

                }

                chrome.storage.local.set({

                    hookblockHistory: history

                });

            });

            // ==========================================
            // Dangerous Website Overlay
            // ==========================================

            if (response.score < 40) {

                if (typeof showHookBlockOverlay === "function") {

                    showHookBlockOverlay(response);

                }

            }

            // ==========================================
            // Sensitive Data Detection
            // ==========================================

            detector.start(response);

            // ==========================================
            // Submission Protection
            // ==========================================

            submissionGuard.start(response);

        }

    );

})();