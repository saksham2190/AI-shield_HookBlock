window.onload = () => {

    chrome.storage.local.get(["latestScan"], (storage) => {

        const data = storage.latestScan;

        const result = document.getElementById("result");

        if (!data) {

            result.innerHTML = `
                <div class="card">

                    <h2>No Scan Available</h2>

                    <p>
                        Open a website first and then click HookBlock.
                    </p>

                </div>
            `;

            return;

        }

        let riskColor = "#2ecc71";

        if (data.score < 20)
            riskColor = "#8B0000";

        else if (data.score < 40)
            riskColor = "#e74c3c";

        else if (data.score < 60)
            riskColor = "#f39c12";

        else if (data.score < 80)
            riskColor = "#f1c40f";

        const ai = data.ai || {

            summary: "AI explanation unavailable.",

            reasons: [],

            recommendation: "Proceed carefully.",

            confidence: 0

        };

        result.innerHTML = `

        <div class="card">

            <h2 style="color:${riskColor}">
                ${data.risk.toUpperCase()} RISK
            </h2>

            <p>

                <b>Risk Score</b>

                <br>

                ${data.score}/100

            </p>

            <p>

                <b>Domain Age</b>

                <br>

                ${data.domainAge ?? "Unknown"} days

            </p>

            <hr>

            <h3>🤖 AI Security Report</h3>

            <p>

                ${ai.summary}

            </p>

            <h4>Why?</h4>

            <ul>

                ${ai.reasons.map(reason => `<li>${reason}</li>`).join("")}

            </ul>

            <h4>Recommendation</h4>

            <p>

                ${ai.recommendation}

            </p>

            <hr>

            <p>

                <b>Confidence:</b>

                ${ai.confidence}%

            </p>

            <hr>

            <h4>Security Flags</h4>

            <ul>

                ${data.flags.map(flag => `<li>${flag}</li>`).join("")}

            </ul>

        </div>

        `;

    });

};