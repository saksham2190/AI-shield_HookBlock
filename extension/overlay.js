(async () => {

    const currentURL = window.location.href;

    console.log("🌍 HookBlock Scanning:", currentURL);

    chrome.runtime.sendMessage({

        type: "SCAN_URL",

        url: currentURL

    }, (response) => {

        if (chrome.runtime.lastError) {

            console.error(chrome.runtime.lastError);
            return;

        }

        if (!response || !response.success) {

            console.log("❌ Scan Failed");
            return;

        }

        console.log("✅ HookBlock Scan Result:", response);

        // Only show warning for dangerous websites
        if (response.score < 40) {

            showHookBlockOverlay(response);

        }

    });

})();