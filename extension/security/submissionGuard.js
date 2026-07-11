// ==========================================
// HookBlock Submission Guard
// ==========================================

class SubmissionGuard {

    constructor() {
        this.scanResult = null;
        this.started = false;
    }

    start(scanResult) {

        if (this.started) return;

        this.started = true;
        this.scanResult = scanResult;

        this.attachToForms();

        // Watch for dynamically added forms
        const observer = new MutationObserver(() => {
            this.attachToForms();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

    }

    attachToForms() {

        const forms = document.querySelectorAll("form");

        forms.forEach(form => {

            if (form.dataset.hookblockProtected) return;

            form.dataset.hookblockProtected = "true";

            form.addEventListener("submit", (e) => {

                // Only protect risky websites
                if (this.scanResult.score >= 40) {
                    return;
                }

                e.preventDefault();

                const proceed = confirm(
                    "⚠ HookBlock Warning\n\n" +
                    "You are about to submit sensitive information to a HIGH RISK website.\n\n" +
                    "Press OK to continue anyway.\n\n" +
                    "Press Cancel to stay safe."
                );

                if (proceed) {
                    form.submit();
                }

            });

        });

    }

}

window.SubmissionGuard = SubmissionGuard;