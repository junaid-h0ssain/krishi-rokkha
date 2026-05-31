// modules/ui.js
export function initUI() {
    const navDashboard = document.getElementById("nav-dashboard");
    const navProfile = document.getElementById("nav-profile");
    const navWeather = document.getElementById("nav-weather");
    const navAiScanner = document.getElementById("nav-ai-scanner");
    const dashboardView = document.getElementById("dashboard-view");
    const profileView = document.getElementById("profile-view");
    const weatherView = document.getElementById("weather-view");
    const aiScannerView = document.getElementById("ai-scanner-view");
    const authSection = document.getElementById("auth-section");
    const mainSection = document.getElementById("main-section");

    function hideAllViews() {
        dashboardView.classList.add("hidden");
        profileView.classList.add("hidden");
        weatherView.classList.add("hidden");
        aiScannerView.classList.add("hidden");
    }

    navDashboard?.addEventListener("click", () => {
        hideAllViews();
        dashboardView.classList.remove("hidden");
    });

    navProfile?.addEventListener("click", () => {
        hideAllViews();
        profileView.classList.remove("hidden");
    });

    navWeather?.addEventListener("click", () => {
        hideAllViews();
        weatherView.classList.remove("hidden");
    });

    navAiScanner?.addEventListener("click", () => {
        hideAllViews();
        aiScannerView.classList.remove("hidden");
    });

    const globalNav = document.querySelector(".nav");

    // Helpers to show/hide top-level sections
    window.HG_UI = {
        showAuth() {
            authSection?.classList.remove("hidden");
            mainSection?.classList.add("hidden");
            globalNav?.classList.remove("hidden");
        },
        showApp() {
            authSection?.classList.add("hidden");
            mainSection?.classList.remove("hidden");
            globalNav?.classList.add("hidden");
        }
    };
}
