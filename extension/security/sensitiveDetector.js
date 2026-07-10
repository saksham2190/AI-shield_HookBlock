// ===============================
// HookBlock Sensitive Data Detector
// ===============================

function detectSensitiveFields() {

    const detected = [];

    const inputs = document.querySelectorAll("input");

    inputs.forEach(input => {

        const type = (input.type || "").toLowerCase();

        const name = (input.name || "").toLowerCase();

        const id = (input.id || "").toLowerCase();

        const placeholder = (input.placeholder || "").toLowerCase();

        const text = `${type} ${name} ${id} ${placeholder}`;

        // Password
        if (type === "password") {

            detected.push("Password");

        }

        // Email
        if (type === "email" || text.includes("email")) {

            detected.push("Email");

        }

        // Phone
        if (
            type === "tel" ||
            text.includes("phone") ||
            text.includes("mobile")
        ) {

            detected.push("Phone");

        }

        // OTP
        if (
            text.includes("otp") ||
            text.includes("verification")
        ) {

            detected.push("OTP");

        }

        // Credit Card
        if (
            text.includes("card") ||
            text.includes("credit") ||
            text.includes("debit")
        ) {

            detected.push("Credit Card");

        }

        // CVV
        if (
            text.includes("cvv") ||
            text.includes("cvc")
        ) {

            detected.push("CVV");

        }

        // Aadhaar
        if (
            text.includes("aadhaar") ||
            text.includes("aadhar")
        ) {

            detected.push("Aadhaar");

        }

        // PAN
        if (
            text.includes("pan")
        ) {

            detected.push("PAN");

        }

        // UPI
        if (
            text.includes("upi")
        ) {

            detected.push("UPI");

        }

    });

    return [...new Set(detected)];

}

window.detectSensitiveFields = detectSensitiveFields;