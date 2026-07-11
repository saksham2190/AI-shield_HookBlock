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

    }

    detectSensitiveFields() {

        const fields = document.querySelectorAll("input");

        fields.forEach(field => {

            if (field.dataset.hookblockAttached) return;

            field.dataset.hookblockAttached = "true";

            field.addEventListener("input", () => {

                let type = "";

                if (field.type === "password") {
                    type = "Password";
                }
                else if (field.type === "email") {
                    type = "Email Address";
                }
                else if (
                    field.name &&
                    field.name.toLowerCase().includes("card")
                ) {
                    type = "Credit Card";
                }
                else if (
                    field.name &&
                    field.name.toLowerCase().includes("cvv")
                ) {
                    type = "CVV";
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

}

// Make available globally
window.SensitiveDetector = SensitiveDetector;