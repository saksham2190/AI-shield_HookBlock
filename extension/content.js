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

        console.log("✅ HookBlock Scan Result:", response);

    });

})();