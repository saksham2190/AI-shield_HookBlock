// Create Sensitive Detector
const detector = new SensitiveDetector();

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

            // Start monitoring ALL pages that contain forms
            detector.start(response);

            // Show overlay only on dangerous websites
            if (response.score < 40) {

                if (typeof showHookBlockOverlay === "function") {
                    showHookBlockOverlay(response);
                }

            }

        }
    );

})();