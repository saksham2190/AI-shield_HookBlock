// ==========================================
// HookBlock Sensitive Banner
// ==========================================

function showSensitiveBanner(type) {

    // Don't create multiple banners
    if (document.getElementById("hookblock-sensitive-banner")) {
        return;
    }

    const banner = document.createElement("div");
    banner.id = "hookblock-sensitive-banner";

    banner.innerHTML = `
        <div class="hb-sensitive-title">
            🔒 HookBlock Protection Active
        </div>

        <div class="hb-sensitive-text">
            Sensitive information detected.

            <div class="hb-sensitive-type">
                ${type}
            </div>

            <br><br>

            HookBlock will monitor this information before it is submitted.
        </div>
    `;

    document.body.appendChild(banner);

    // Slide in
    requestAnimationFrame(() => {
        banner.classList.add("show");
    });

    // Auto-hide after 4 seconds
    setTimeout(() => {

        banner.classList.remove("show");

        setTimeout(() => {

            banner.remove();

        }, 350);

    }, 4000);

}

// Make it available globally
window.showSensitiveBanner = showSensitiveBanner;