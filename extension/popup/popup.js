window.onload = () => {

    chrome.runtime.sendMessage({

        type: "GET_RESULT"

    }, (data) => {

        const result = document.getElementById("result");

        if (!data) {

            result.innerHTML = "No Scan Available";

            return;

        }

        result.innerHTML = `

<b>Risk :</b> ${data.risk}

<br><br>

<b>Score :</b> ${data.score}

<br><br>

<b>Domain Age :</b> ${data.domainAge}

<br><br>

<b>Flags</b>

<br>

${data.flags.join("<br>")}

`;

    });

};