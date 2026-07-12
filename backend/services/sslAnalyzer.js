const tls = require("tls");
const { URL } = require("url");

function analyzeSSL(website) {

    return new Promise((resolve) => {

        try {

            const hostname = new URL(website).hostname;

            const socket = tls.connect(
                443,
                hostname,
                {
                    servername: hostname,
                    rejectUnauthorized: false
                },
                () => {

                    const cert = socket.getPeerCertificate();

                    if (!cert || Object.keys(cert).length === 0) {

                        socket.end();

                        return resolve({
                            https: false,
                            valid: false,
                            score: -20,
                            flag: "SSL Certificate Missing"
                        });

                    }

                    const issuer =
                        cert.issuer?.O ||
                        cert.issuer?.CN ||
                        "Unknown";

                    const validFrom = new Date(cert.valid_from);

                    const validTo = new Date(cert.valid_to);

                    const today = new Date();

                    const remainingDays = Math.floor(
                        (validTo - today) / (1000 * 60 * 60 * 24)
                    );

                    const expired = remainingDays < 0;

                    const selfSigned =
                        cert.subject?.CN === cert.issuer?.CN;

                    let score = 15;

                    let flag = "SSL Valid";

                    if (expired) {

                        score = -30;
                        flag = "Expired SSL";

                    }

                    if (selfSigned) {

                        score -= 15;
                        flag = "Self Signed SSL";

                    }

                    socket.end();

                    resolve({

                        https: true,

                        valid: !expired,

                        issuer,

                        validFrom,

                        validTo,

                        remainingDays,

                        expired,

                        selfSigned,

                        score,

                        flag

                    });

                }

            );

            socket.on("error", () => {

                resolve({

                    https: false,

                    valid: false,

                    score: -20,

                    flag: "No HTTPS"

                });

            });

        }

        catch {

            resolve({

                https: false,

                valid: false,

                score: -20,

                flag: "Invalid URL"

            });

        }

    });

}

module.exports = analyzeSSL;