(async () => {

    const currentURL = window.location.href;

    console.log("🌍 Scanning:", currentURL);

    chrome.runtime.sendMessage({

        type: "SCAN_URL",

        url: currentURL

    }, (response) => {

        console.log("Scan Result", response);

    });

})();