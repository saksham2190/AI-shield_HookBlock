// ==========================================
// HookBlock Sensitive Data Detector
// ==========================================

class SensitiveDetector {

    constructor() {

        this.scanResult = null;
        this.started = false;

    }

    start(scanResult) {

        if (this.started) return;

        this.started = true;
        this.scanResult = scanResult;

        this.detectSensitiveFields();

        const observer = new MutationObserver(() => {

        this.detectSensitiveFields();

        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        window.addEventListener("focus", () => {

            this.detectSensitiveFields();

        });

        window.addEventListener("click", () => {

            this.detectSensitiveFields();

        });

        window.addEventListener("keyup", () => {

            this.detectSensitiveFields();

        });

    }

    detectSensitiveFields() {

        const fields = document.querySelectorAll("input, textarea");

        fields.forEach(field => {

            if (field.dataset.hookblockAttached) return;

            field.dataset.hookblockAttached = "true";

            this.attachPasteListener(field);

            field.addEventListener("input", () => {

                const value = field.value.trim();

                const normalized = value.replace(/\s/g, "");

                const text = (
                    `${field.name} ${field.id} ${field.placeholder} ${field.ariaLabel}`
                ).toLowerCase();

                let type = "";

                // Password
                if (field.type === "password") {

                    type = "Password";

                }

                // Email
                else if (
                    field.type === "email" ||
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ) {

                    type = "Email Address";

                }

                // Credit Card
                else if (
                    text.includes("card") ||
                    /^(?:\d[ -]?){13,19}$/.test(normalized)
                ) {

                    type = "Credit Card";

                }

                // CVV
                else if (
                    text.includes("cvv") ||
                    text.includes("cvc")
                ) {

                    type = "CVV";

                }

                // Aadhaar
                else if (
                    text.includes("aadhaar") ||
                    text.includes("aadhar") ||
                    /^\d{4}\s?\d{4}\s?\d{4}$/.test(normalized)
                ) {

                    type = "Aadhaar Number";

                }

                // PAN
                else if (
                    text.includes("pan") ||
                    /^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(value)
                ) {

                    type = "PAN Number";

                }

                // Phone
                else if (
                    field.type === "tel" ||
                    text.includes("phone") ||
                    text.includes("mobile") ||
                    /^(?:\+91|91)?[6-9]\d{9}$/.test(normalized)
                ) {

                    type = "Phone Number";

                }

                // OTP
                else if (
                    (text.includes("otp") ||
                    text.includes("verification") ||
                    text.includes("verification code")) &&
                    /^\d{4,8}$/.test(normalized)
                ) {

                    type = "One-Time Password (OTP)";

                }

                // UPI ID
                else if (
                    text.includes("upi") ||
                    /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/.test(value)
                ) {

                    type = "UPI ID";

                }

                // Bank Account
                else if (
                    text.includes("account") ||
                    text.includes("bank account") ||
                    /^\d{9,18}$/.test(normalized)
                ) {

                    type = "Bank Account Number";

                }

                else {

                    return;

                }

                console.log("🔒 Sensitive field detected:", type);

                if (typeof showSensitiveBanner === "function") {

                    showSensitiveBanner(type);

                }

            });

        });

    }
    attachPasteListener(field) {

    if (field.dataset.hookblockPaste)
        return;

    field.dataset.hookblockPaste = "true";

    field.addEventListener("paste", () => {

        let type = "";

        const text = (
            `${field.name} ${field.id} ${field.placeholder} ${field.ariaLabel}`
        ).toLowerCase();

        if (field.type === "password")
            type = "Password";

        else if (text.includes("otp"))
            type = "One-Time Password (OTP)";

        else if (text.includes("upi"))
            type = "UPI ID";

        else if (text.includes("aadhaar") || text.includes("aadhar"))
            type = "Aadhaar Number";

        else if (text.includes("pan"))
            type = "PAN Number";

        else if (text.includes("account"))
            type = "Bank Account Number";

        if (!type)
            return;

        console.log("📋 Sensitive information pasted:", type);

        if (typeof showSensitiveBanner === "function") {

            showSensitiveBanner(`${type} (Pasted)`);

        }

    });

}attachPasteListener(field) {

    if (field.dataset.hookblockPaste)
        return;

    field.dataset.hookblockPaste = "true";

    field.addEventListener("paste", () => {

        let type = "";

        const text = (
            `${field.name} ${field.id} ${field.placeholder} ${field.ariaLabel}`
        ).toLowerCase();

        if (field.type === "password")
            type = "Password";

        else if (text.includes("otp"))
            type = "One-Time Password (OTP)";

        else if (text.includes("upi"))
            type = "UPI ID";

        else if (text.includes("aadhaar") || text.includes("aadhar"))
            type = "Aadhaar Number";

        else if (text.includes("pan"))
            type = "PAN Number";

        else if (text.includes("account"))
            type = "Bank Account Number";

        if (!type)
            return;

        console.log("📋 Sensitive information pasted:", type);

        if (typeof showSensitiveBanner === "function") {

            showSensitiveBanner(`${type} (Pasted)`);

        }

    });

}

}

window.SensitiveDetector = SensitiveDetector;