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
                console.error(chrome.runtime.lastError);
                return;
            }

            if (!response || !response.success) {
                console.log("❌ Scan Failed");
                return;
            }

            console.log("✅ HookBlock Scan Result:", response);

            // Show warning overlay only for dangerous websites
            if (response.score < 40) {

                if (typeof showHookBlockOverlay === "function") {
                    showHookBlockOverlay(response);
                }

            }

            // Start monitoring sensitive fields on ALL websites
            detector.start(response);

            // Protect form submissions
            submissionGuard.start(response);

        }
    );

})();