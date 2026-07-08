window.onload = () => {

    chrome.storage.local.get(["latestScan"], (storage) => {

        const data = storage.latestScan;

        const result = document.getElementById("result");

        if (!data) {

            result.innerHTML = `
                <h3>No Scan Available</h3>
                <p>Open a website first, then reopen HookBlock.</p>
            `;

            return;

        }

        result.innerHTML = `

        <b>Risk :</b> ${data.risk}

        <br><br>

        <b>Score :</b> ${data.score}

        <br><br>

        <b>Domain Age :</b> ${data.domainAge ?? "Unknown"}

        <br><br>

        <b>Flags</b>

        <br>

        ${data.flags.join("<br>")}

        `;

    });

};