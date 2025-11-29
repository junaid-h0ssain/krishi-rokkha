// app.js
import { app, auth, db, fbAuthApi, fbDbApi } from "./firebase-config.js";
import { CLOUDINARY_CONFIG, HF_CONFIG } from "./config.js";
import { initWeather } from "../modules/weather.js";
import { initAiScanner } from "../modules/aiScan.js";

const {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    RecaptchaVerifier,
    PhoneAuthProvider,
    updatePhoneNumber,
    GoogleAuthProvider,
    signInWithPopup
} = fbAuthApi;

const {
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
    addDoc,
    query,
    where,
    updateDoc,
    onSnapshot
} = fbDbApi;

// DOM elements
const authSection = document.getElementById("auth-section");
const mainSection = document.getElementById("main-section");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegisterBtn = document.getElementById("show-register");
const showLoginBtn = document.getElementById("show-login");
const resetPasswordBtn = document.getElementById("reset-password-btn");
const logoutBtn = document.getElementById("logout-btn");
const googleLoginBtn = document.getElementById("google-login-btn");

const navDashboard = document.getElementById("nav-dashboard");
const navWeather = document.getElementById("nav-weather");
const navAiScanner = document.getElementById("nav-ai-scanner");
const navProfile = document.getElementById("nav-profile");
const dashboardView = document.getElementById("dashboard-view");
const weatherView = document.getElementById("weather-view");
const aiScannerView = document.getElementById("ai-scanner-view");
const profileView = document.getElementById("profile-view");

const batchForm = document.getElementById("batch-form");
const activeBatchesDiv = document.getElementById("active-batches");
const noBatchesMsg = document.getElementById("no-batches-msg");
const badgesList = document.getElementById("badges-list");
const noBadgesMsg = document.getElementById("no-badges-msg");
const alertsContainer = document.getElementById("alerts-container");
const exportBtn = document.getElementById("export-btn");

const statActive = document.getElementById("stat-active");
const statCompleted = document.getElementById("stat-completed");
const statMitigated = document.getElementById("stat-mitigated");
const statWeight = document.getElementById("stat-weight");

const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profilePhone = document.getElementById("profile-phone");
const profileBio = document.getElementById("profile-bio");
const profileCreated = document.getElementById("profile-created");
const profileForm = document.getElementById("profile-form");
const passwordForm = document.getElementById("password-form");

const languageSelect = document.getElementById("language-select");

// Crop type dropdown handler
const batchCropSelect = document.getElementById("batch-crop-select");
const batchCropInput = document.getElementById("batch-crop");

if (batchCropSelect && batchCropInput) {
    batchCropSelect.addEventListener("change", () => {
        const selectedValue = batchCropSelect.value;
        if (selectedValue && selectedValue !== "Other") {
            batchCropInput.value = selectedValue;
        } else if (selectedValue === "Other") {
            batchCropInput.value = "";
            batchCropInput.focus();
        }
    });
}


// Offline queue key
const QUEUE_KEY = "hg_sync_queue";
const LOCAL_BATCHES_KEY = "hg_local_batches";

// Basic language packs (English/Bengali)
const LANG = {
    en: {
        noBatches: "No active batches.",
        noBadges: "No badges earned yet.",
        riskMitigatedBadge: "Risk Mitigated Expert",
        firstHarvestBadge: "First Harvest Logged",
        lostStatus: "lost",
        mitigatedStatus: "mitigated",
        activeStatus: "active",
        completedStatus: "completed",
        appTitle: "HarvestGuard",
        loginTitle: "Login",
        registerTitle: "Register",
        emailLabel: "Email",
        passwordLabel: "Password",
        loginBtn: "Login",
        registerBtn: "Register",
        switchToRegister: "No account? Register",
        switchToLogin: "Have an account? Login",
        dashboardTitle: "Dashboard",
        weatherTitle: "Weather",
        aiScanTitle: "AI Scan",
        profileTitle: "Profile",
        activeBatches: "Active Batches",
        completedBatches: "Completed Batches",
        riskMitigated: "Risk Mitigated",
        totalWeight: "Total Weight (kg)",
        createBatchTitle: "Create New Batch",
        cropLabel: "Crop",
        weightLabel: "Weight (kg)",
        dateLabel: "Date",
        storageTypeLabel: "Storage Type",
        locationInputLabel: "Location",
        imageLabel: "Image (optional)",
        createBtn: "Create",
        badgesTitle: "Achievements",
        alertsTitle: "Alerts",
        highRiskDetected: "High moisture risk detected for:",
        suggestedActions: "Suggested actions: dry, move to ventilated storage, treat with recommended method.",
        acceptMitigationBtn: "Accept Mitigation",
        ignoreAlertBtn: "Ignore alert",
        storageLabel: "Storage Type",
        locationLabel: "Location",
        statusLabel: "Status",
        markMitigatedBtn: "Mark Mitigated",
        markLostBtn: "Mark Lost",
        markCompletedBtn: "Mark Completed",
        backToHome: "Back to home page",
        emailPlaceholder: "Email",
        passwordPlaceholder: "Password",
        orGoogle: "Or Google Login",
        googleLoginBtn: "Login with Google",
        forgotPassword: "Forgot Password?",
        createAccount: "Create account",
        fullNamePlaceholder: "Full name",
        phonePlaceholder: "Phone",
        signUpBtn: "Sign up",
        backToLogin: "Back to login",
        navDashboard: "Dashboard",
        navWeather: "Weather",
        navAiScanner: "AI Scanner",
        navProfile: "Profile",
        navLogout: "Logout",
        dashTitle: "Dashboard",
        activeBatchesStat: "Active batches:",
        completedBatchesStat: "Completed batches:",
        mitigatedRisksStat: "Mitigated risks:",
        totalWeightStat: "Total weight (kg):",
        selectCropDefault: "Select crop type (optional)",
        paddy: "Paddy",
        rice: "Rice",
        jute: "Jute",
        wheat: "Wheat",
        otherCrop: "Other (use text field below)",
        cropPlaceholder: "Or enter custom crop type",
        weightPlaceholder: "Weight (kg)",
        dateTypeDefault: "Select date type",
        harvestDate: "Harvest Date",
        expiryDate: "Expiry Date",
        transformationDate: "Transportation Date",
        storageTypeDefault: "Select storage type",
        juteBag: "Jute Bag Stack",
        silo: "Silo",
        openArea: "Open Area",
        addBatchBtn: "Add batch",
        activeBatchesTitle: "Active batches",
        riskAlertsTitle: "Risk alerts",
        exportDataTitle: "Export data",
        exportBtn: "Export JSON + CSV",
        selectAreaLabel: "Select Area:",
        selectOptionDefault: "-- Select --",
        selectAreaMsg: "Please select an area.",
        scannerTitle: "🌱 AI Crop Doctor",
        scannerSubtitle: "Take a photo or upload an image to instantly detect crop diseases with our advanced AI.",
        uploadLabel: "Tap to Upload or Capture",
        uploadSublabel: "Supports JPG, PNG",
        analyzeBtn: "🔍 Analyze Health",
        profilePicTitle: "Profile Picture",
        noPicText: "No picture",
        uploadPicBtn: "Upload Picture",
        removePicBtn: "Remove Picture",
        nameLabel: "Name:",
        phoneLabel: "Phone:",
        bioLabel: "Bio:",
        createdLabel: "Created:",
        editProfileTitle: "Edit profile",
        namePlaceholder: "Name",
        bioPlaceholder: "Short bio",
        saveProfileBtn: "Save profile",
        updatePhoneTitle: "Update phone number",
        otpInfo: "For security, we'll send an OTP to verify your new phone number.",
        phoneInputPlaceholder: "+8801XXXXXXXXX",
        sendOtpBtn: "Send OTP",
        otpPlaceholder: "Enter 6-digit OTP",
        verifyOtpBtn: "Verify OTP & Update Phone",
        changePwdTitle: "Change password",
        currentPwdPlaceholder: "Current password",
        newPwdPlaceholder: "New password",
        updatePwdBtn: "Update password"
    },
    bn: {
        noBatches: "কোনো সক্রিয় ব্যাচ নেই।",
        noBadges: "এখনও কোনো ব্যাজ অর্জিত হয়নি।",
        riskMitigatedBadge: "ঝুঁকি মোকাবিলা বিশেষজ্ঞ",
        firstHarvestBadge: "প্রথম ফসল লগ করা হয়েছে",
        lostStatus: "নষ্ট",
        mitigatedStatus: "প্রতিরোধ করা হয়েছে",
        activeStatus: "সক্রিয়",
        completedStatus: "সম্পন্ন",
        appTitle: "কৃষি রক্ষা",
        loginTitle: "লগইন",
        registerTitle: "নিবন্ধন",
        emailLabel: "ইমেইল",
        passwordLabel: "পাসওয়ার্ড",
        loginBtn: "লগইন",
        registerBtn: "নিবন্ধন করুন",
        switchToRegister: "অ্যাকাউন্ট নেই? নিবন্ধন করুন",
        switchToLogin: "অ্যাকাউন্ট আছে? লগইন করুন",
        dashboardTitle: "ড্যাশবোর্ড",
        weatherTitle: "আবহাওয়া",
        aiScanTitle: "এআই স্ক্যান",
        profileTitle: "প্রোফাইল",
        activeBatches: "সক্রিয় ব্যাচ",
        completedBatches: "সম্পন্ন ব্যাচ",
        riskMitigated: "ঝুঁকি প্রশমিত",
        totalWeight: "মোট ওজন (কেজি)",
        createBatchTitle: "নতুন ব্যাচ তৈরি করুন",
        cropLabel: "ফসল",
        weightLabel: "ওজন (কেজি)",
        dateLabel: "তারিখ",
        storageTypeLabel: "সংরক্ষণাগারের ধরন",
        locationInputLabel: "অবস্থান",
        imageLabel: "ছবি (ঐচ্ছিক)",
        createBtn: "তৈরি করুন",
        badgesTitle: "অর্জনসমূহ",
        alertsTitle: "সতর্কতা",
        highRiskDetected: "উচ্চ আর্দ্রতার ঝুঁকি শনাক্ত হয়েছে:",
        suggestedActions: "প্রস্তাবিত পদক্ষেপ: শুকানো, বায়ুচলাচল ব্যবস্থা উন্নত করা।",
        acceptMitigationBtn: "প্রশমন গ্রহণ করুন",
        ignoreAlertBtn: "সতর্কতা উপেক্ষা করুন",
        storageLabel: "সংরক্ষণাগারের ধরন",
        locationLabel: "অবস্থান",
        statusLabel: "অবস্থা",
        markMitigatedBtn: "প্রশমিত হিসেবে চিহ্নিত করুন",
        markLostBtn: "নষ্ট হিসেবে চিহ্নিত করুন",
        markCompletedBtn: "সম্পন্ন হিসেবে চিহ্নিত করুন",
        backToHome: "হোম পেজে ফিরে যান",
        emailPlaceholder: "ইমেইল",
        passwordPlaceholder: "পাসওয়ার্ড",
        orGoogle: "অথবা গুগল লগইন",
        googleLoginBtn: "গুগল দিয়ে লগইন করুন",
        forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
        createAccount: "অ্যাকাউন্ট তৈরি করুন",
        fullNamePlaceholder: "পুরো নাম",
        phonePlaceholder: "ফোন",
        signUpBtn: "সাইন আপ",
        backToLogin: "লগইন এ ফিরে যান",
        navDashboard: "ড্যাশবোর্ড",
        navWeather: "আবহাওয়া",
        navAiScanner: "এআই স্ক্যানার",
        navProfile: "প্রোফাইল",
        navLogout: "লগআউট",
        dashTitle: "ড্যাশবোর্ড",
        activeBatchesStat: "সক্রিয় ব্যাচ:",
        completedBatchesStat: "সম্পন্ন ব্যাচ:",
        mitigatedRisksStat: "প্রশমিত ঝুঁকি:",
        totalWeightStat: "মোট ওজন (কেজি):",
        selectCropDefault: "ফসলের ধরন নির্বাচন করুন (ঐচ্ছিক)",
        paddy: "ধান",
        rice: "চাল",
        jute: "পাট",
        wheat: "গম",
        otherCrop: "অন্যান্য (নিচে লিখুন)",
        cropPlaceholder: "অথবা কাস্টম ফসলের ধরন লিখুন",
        weightPlaceholder: "ওজন (কেজি)",
        dateTypeDefault: "তারিখের ধরন নির্বাচন করুন",
        harvestDate: "ফসল কাটার তারিখ",
        expiryDate: "মেয়াদ উত্তীর্ণের তারিখ",
        transformationDate: "পরিবহনের তারিখ",
        storageTypeDefault: "স্টোরেজের ধরন নির্বাচন করুন",
        juteBag: "পাটের বস্তার স্তূপ",
        silo: "সাইলো",
        openArea: "খোলা জায়গা",
        addBatchBtn: "ব্যাচ যোগ করুন",
        activeBatchesTitle: "সক্রিয় ব্যাচ",
        riskAlertsTitle: "ঝুঁকির সতর্কতা",
        exportDataTitle: "ডেটা রপ্তানি করুন",
        exportBtn: "JSON + CSV রপ্তানি করুন",
        selectAreaLabel: "এলাকা নির্বাচন করুন:",
        selectOptionDefault: "-- নির্বাচন করুন --",
        selectAreaMsg: "দয়া করে একটি এলাকা নির্বাচন করুন।",
        scannerTitle: "🌱 এআই ক্রপ ডাক্তার",
        scannerSubtitle: "আমাদের উন্নত এআই দিয়ে ফসলের রোগ সনাক্ত করতে একটি ছবি তুলুন বা আপলোড করুন।",
        uploadLabel: "আপলোড বা ছবি তুলতে ট্যাপ করুন",
        uploadSublabel: "JPG, PNG সমর্থিত",
        analyzeBtn: "🔍 স্বাস্থ্য বিশ্লেষণ করুন",
        profilePicTitle: "প্রোফাইল ছবি",
        noPicText: "কোন ছবি নেই",
        uploadPicBtn: "ছবি আপলোড করুন",
        removePicBtn: "ছবি সরান",
        nameLabel: "নাম:",
        phoneLabel: "ফোন:",
        bioLabel: "বায়ো:",
        createdLabel: "তৈরি হয়েছে:",
        editProfileTitle: "প্রোফাইল সম্পাদনা করুন",
        namePlaceholder: "নাম",
        bioPlaceholder: "সংক্ষিপ্ত বায়ো",
        saveProfileBtn: "প্রোফাইল সংরক্ষণ করুন",
        updatePhoneTitle: "ফোন নম্বর আপডেট করুন",
        otpInfo: "নিরাপত্তার জন্য, আমরা আপনার নতুন ফোন নম্বর যাচাই করতে একটি ওটিপি পাঠাব।",
        phoneInputPlaceholder: "+৮৮০১XXXXXXXXX",
        sendOtpBtn: "ওটিপি পাঠান",
        otpPlaceholder: "৬-সংখ্যার ওটিপি লিখুন",
        verifyOtpBtn: "ওটিপি যাচাই এবং ফোন আপডেট করুন",
        changePwdTitle: "পাসওয়ার্ড পরিবর্তন করুন",
        currentPwdPlaceholder: "বর্তমান পাসওয়ার্ড",
        newPwdPlaceholder: "নতুন পাসওয়ার্ড",
        updatePwdBtn: "পাসওয়ার্ড আপডেট করুন"
    }
};

let currentUser = null;
let currentLang = "en";
let batchesCache = []; // local in-memory

// Provide a minimal global helper for cross-module access (used by modules/weather.js)
if (!window.HG) {
    window.HG = {
        getCurrentUser: () => currentUser
    };
} else {
    // keep other potential properties intact, but ensure getCurrentUser exists
    window.HG.getCurrentUser = () => currentUser;
}

// Language handling (Req 6)
function loadLanguagePreference(user) {
    const fromLocal = localStorage.getItem("hg_lang");
    if (fromLocal) {
        currentLang = fromLocal;
    }
    if (user && user.uid) {
        // user-specific lang from profile if exists
        getDoc(doc(db, "users", user.uid)).then(snap => {
            if (snap.exists() && snap.data().language) {
                currentLang = snap.data().language;
            }
            languageSelect.value = currentLang;
            applyLanguage();
        }).catch(() => {
            languageSelect.value = currentLang;
            applyLanguage();
        });
    } else {
        languageSelect.value = currentLang;
        applyLanguage();
    }
}

function applyLanguage() {
    const l = LANG[currentLang];
    if (!l) return;

    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (l[key]) {
            el.textContent = l[key];
        }
    });

    // Update elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (l[key]) {
            el.placeholder = l[key];
        }
    });

    // Update specific elements that might not have data-i18n but are handled manually
    if (noBatchesMsg) noBatchesMsg.textContent = l.noBatches;
    if (noBadgesMsg) noBadgesMsg.textContent = l.noBadges;

    // Re-render batches to update their internal text
    renderBatches();

    localStorage.setItem("hg_lang", currentLang);
}

// Auth UI switches
showRegisterBtn.addEventListener("click", () => {
    document.getElementById("login-card").classList.add("hidden");
    document.getElementById("register-card").classList.remove("hidden");
});

showLoginBtn.addEventListener("click", () => {
    document.getElementById("register-card").classList.add("hidden");
    document.getElementById("login-card").classList.remove("hidden");
});

// Requirement 1: Authentication
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const phone = document.getElementById("reg-phone").value.trim();
    const language = document.getElementById("reg-language").value || "en";

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const user = cred.user;
        const createdAt = new Date().toISOString();

        await setDoc(doc(db, "users", user.uid), {
            name,
            email,
            phone,
            bio: "",
            language,
            createdAt,
            badges: []
        });

        currentLang = language;
        localStorage.setItem("hg_lang", currentLang);
        alert("Account created.");
    } catch (err) {
        if (err.code === "auth/email-already-in-use") {
            alert("Email already registered.");
        } else {
            alert("Registration error.");
        }
    }
});

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        alert("Invalid credentials.");
    }
});

// Google Login
if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore, if not create one
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                const createdAt = new Date().toISOString();
                await setDoc(userDocRef, {
                    name: user.displayName || "User",
                    email: user.email,
                    phone: user.phoneNumber || "",
                    bio: "",
                    language: "en",
                    createdAt,
                    badges: []
                });
                currentLang = "en";
                localStorage.setItem("hg_lang", currentLang);
            } else {
                // Existing user, load language preference
                const data = userDocSnap.data();
                if (data.language) {
                    currentLang = data.language;
                    localStorage.setItem("hg_lang", currentLang);
                }
            }
            // onAuthStateChanged will handle the UI switch
        } catch (error) {
            console.error("Google Login Error:", error);
            alert("Google Login failed: " + error.message);
        }
    });
}

resetPasswordBtn.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    if (!email) {
        alert("Enter your email first.");
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent.");
    } catch {
        alert("Could not send reset email.");
    }
});

logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
});

// Auth state handling + navigation (Req 10)
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) {
        authSection.classList.add("hidden");
        mainSection.classList.remove("hidden");
        loadLanguagePreference(user);
        initUserData();
    } else {
        mainSection.classList.add("hidden");
        authSection.classList.remove("hidden");
    }
});

navDashboard.addEventListener("click", () => {
    dashboardView.classList.remove("hidden");
    weatherView.classList.add("hidden");
    aiScannerView.classList.add("hidden");
    profileView.classList.add("hidden");
});

navWeather.addEventListener("click", () => {
    dashboardView.classList.add("hidden");
    weatherView.classList.remove("hidden");
    aiScannerView.classList.add("hidden");
    profileView.classList.add("hidden");
});

navAiScanner.addEventListener("click", () => {
    dashboardView.classList.add("hidden");
    weatherView.classList.add("hidden");
    aiScannerView.classList.remove("hidden");
    profileView.classList.add("hidden");
});

navProfile.addEventListener("click", () => {
    dashboardView.classList.add("hidden");
    weatherView.classList.add("hidden");
    aiScannerView.classList.add("hidden");
    profileView.classList.remove("hidden");
});

// Profile management (Req 8)
async function loadProfile() {
    if (!currentUser) return;
    const snap = await getDoc(doc(db, "users", currentUser.uid));
    if (snap.exists()) {
        const data = snap.data();
        profileName.textContent = data.name || "";
        profileEmail.textContent = data.email || currentUser.email;
        profilePhone.textContent = data.phone || "";
        profileBio.textContent = data.bio || "";
        profileCreated.textContent = data.createdAt || "";
        document.getElementById("edit-name").value = data.name || "";
        document.getElementById("edit-bio").value = data.bio || "";
        // Load profile picture
        if (data.profilePicture) {
            profilePicture.src = data.profilePicture;
            profilePicture.classList.remove("hidden");
            noPictureText.classList.add("hidden");
            removePictureBtn.style.display = "block";
        } else {
            profilePicture.src = "";
            profilePicture.classList.add("hidden");
            noPictureText.classList.remove("hidden");
            removePictureBtn.style.display = "none";
        }
    }
}

profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const name = document.getElementById("edit-name").value.trim();
    const bio = document.getElementById("edit-bio").value.trim();
    try {
        await updateDoc(doc(db, "users", currentUser.uid), { name, bio });
        await loadProfile();
        alert("Profile updated.");
    } catch {
        alert("Error updating profile.");
    }
});

passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert("You are not logged in.");
        return;
    }
    const currentPwd = document.getElementById("current-password").value;
    const newPwd = document.getElementById("new-password").value;

    // Validate inputs
    if (!currentPwd || !newPwd) {
        alert("Please fill in both password fields.");
        return;
    }

    if (newPwd.length < 6) {
        alert("New password must be at least 6 characters long.");
        return;
    }

    const cred = EmailAuthProvider.credential(currentUser.email, currentPwd);
    try {
        console.log("Reauthenticating user...");
        const result = await reauthenticateWithCredential(currentUser, cred);
        console.log("Reauthentication successful, updating password...");
        await updatePassword(currentUser, newPwd);
        console.log("Password update successful");
        alert("Password updated successfully.");
        passwordForm.reset();
        document.getElementById("current-password").value = "";
        document.getElementById("new-password").value = "";
    } catch (error) {
        console.error("Password update error:", error);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        if (error.code === "auth/wrong-password") {
            alert("Current password is incorrect.");
        } else if (error.code === "auth/weak-password") {
            alert("New password is too weak. Use at least 6 characters.");
        } else if (error.code === "auth/requires-recent-login") {
            alert("Please log in again for security reasons, then try updating your password.");
        } else {
            alert("Password update failed: " + (error.message || "Unknown error"));
        }
    }
});

// Phone number update with OTP verification
let recaptchaVerifier = null;
let confirmationResult = null;

// Get DOM elements for phone update
const sendPhoneOtpBtn = document.getElementById("send-phone-otp-btn");
const verifyPhoneOtpBtn = document.getElementById("verify-phone-otp-btn");
const newPhoneNumberInput = document.getElementById("new-phone-number");
const phoneOtpCodeInput = document.getElementById("phone-otp-code");
const phoneUpdateStatus = document.getElementById("phone-update-status");
const otpVerificationSection = document.getElementById("otp-verification-section");

// Send OTP button handler
if (sendPhoneOtpBtn) {
    sendPhoneOtpBtn.addEventListener("click", async () => {
        if (!currentUser) {
            phoneUpdateStatus.textContent = "You must be logged in.";
            phoneUpdateStatus.style.color = "red";
            return;
        }

        const newPhoneNumber = newPhoneNumberInput.value.trim();

        // Validate phone number format
        if (!newPhoneNumber) {
            phoneUpdateStatus.textContent = "Please enter a phone number.";
            phoneUpdateStatus.style.color = "red";
            return;
        }

        if (!newPhoneNumber.startsWith("+")) {
            phoneUpdateStatus.textContent = "Phone number must start with country code (e.g., +880).";
            phoneUpdateStatus.style.color = "red";
            return;
        }

        try {
            phoneUpdateStatus.textContent = "Sending OTP...";
            phoneUpdateStatus.style.color = "#666";
            sendPhoneOtpBtn.disabled = true;

            // Initialize recaptcha if needed
            if (!recaptchaVerifier) {
                recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                    size: "invisible"
                });
            }

            const provider = new PhoneAuthProvider(auth);
            const verificationId = await provider.verifyPhoneNumber(newPhoneNumber, recaptchaVerifier);

            confirmationResult = verificationId;

            phoneUpdateStatus.textContent = "OTP sent! Please check your phone.";
            phoneUpdateStatus.style.color = "green";

            // Show OTP input section
            otpVerificationSection.classList.remove("hidden");
            sendPhoneOtpBtn.disabled = false;

        } catch (error) {
            console.error("Error sending OTP:", error);
            phoneUpdateStatus.textContent = "Error sending OTP: " + (error.message || "Unknown error");
            phoneUpdateStatus.style.color = "red";
            sendPhoneOtpBtn.disabled = false;

            // Reset recaptcha on error
            if (recaptchaVerifier) {
                recaptchaVerifier.clear();
                recaptchaVerifier = null;
            }
        }
    });
}

// Verify OTP and update phone number
if (verifyPhoneOtpBtn) {
    verifyPhoneOtpBtn.addEventListener("click", async () => {
        if (!currentUser || !confirmationResult) {
            phoneUpdateStatus.textContent = "Please send OTP first.";
            phoneUpdateStatus.style.color = "red";
            return;
        }

        const otpCode = phoneOtpCodeInput.value.trim();

        if (!otpCode || otpCode.length !== 6) {
            phoneUpdateStatus.textContent = "Please enter a valid 6-digit OTP.";
            phoneUpdateStatus.style.color = "red";
            return;
        }

        try {
            phoneUpdateStatus.textContent = "Verifying OTP...";
            phoneUpdateStatus.style.color = "#666";
            verifyPhoneOtpBtn.disabled = true;

            // Create phone credential
            const credential = PhoneAuthProvider.credential(confirmationResult, otpCode);

            // Update phone number in Firebase Auth
            await updatePhoneNumber(currentUser, credential);

            // Update phone number in Firestore
            const newPhoneNumber = newPhoneNumberInput.value.trim();
            await updateDoc(doc(db, "users", currentUser.uid), {
                phone: newPhoneNumber
            });

            phoneUpdateStatus.textContent = "Phone number updated successfully!";
            phoneUpdateStatus.style.color = "green";

            // Reload profile to show new phone number
            await loadProfile();

            // Reset form
            newPhoneNumberInput.value = "";
            phoneOtpCodeInput.value = "";
            otpVerificationSection.classList.add("hidden");
            confirmationResult = null;
            verifyPhoneOtpBtn.disabled = false;

            // Reset recaptcha
            if (recaptchaVerifier) {
                recaptchaVerifier.clear();
                recaptchaVerifier = null;
            }

        } catch (error) {
            console.error("Error verifying OTP:", error);
            let errorMessage = "Error verifying OTP: ";

            if (error.code === "auth/invalid-verification-code") {
                errorMessage += "Invalid OTP code. Please try again.";
            } else if (error.code === "auth/code-expired") {
                errorMessage += "OTP has expired. Please request a new one.";
            } else {
                errorMessage += error.message || "Unknown error";
            }

            phoneUpdateStatus.textContent = errorMessage;
            phoneUpdateStatus.style.color = "red";
            verifyPhoneOtpBtn.disabled = false;
        }
    });
}


// Language selector
languageSelect.addEventListener("change", async () => {
    currentLang = languageSelect.value;
    applyLanguage();
    if (currentUser) {
        try {
            await updateDoc(doc(db, "users", currentUser.uid), { language: currentLang });
        } catch {
            // ignore
        }
    }
});

// Batch management (Req 2 + 5)
batchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const crop = document.getElementById("batch-crop").value.trim();
    const weight = parseFloat(document.getElementById("batch-weight").value);
    const date = document.getElementById("batch-date").value;
    const storage = document.getElementById("batch-storage").value.trim();
    const location = document.getElementById("batch-location").value.trim();
    const imageFile = document.getElementById("batch-image").files[0];

    const newBatch = {
        userId: currentUser.uid,
        crop,
        weight,
        harvestDate: date,
        storageType: storage,
        location,
        status: "active",
        createdAt: new Date().toISOString(),
        imageUrl: null,
        riskStatus: null
    };

    try {
        if (imageFile) {
            const imgUrl = await uploadToCloudinary(imageFile);
            newBatch.imageUrl = imgUrl;
        }
    } catch {
        alert("Image upload failed, saving batch without image.");
    }

    batchesCache.push(newBatch);
    saveLocalBatches();
    renderBatches();
    awardFirstHarvestBadge();

    if (navigator.onLine) {
        await pushBatchToFirestore(newBatch);
    } else {
        enqueueOperation({ type: "addBatch", data: newBatch });
    }

    batchForm.reset();
});

// Cloudinary upload (image storage)
async function uploadToCloudinary(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
    const res = await fetch(url, {
        method: "POST",
        body: data
    });
    const json = await res.json();
    if (!json.secure_url) throw new Error("Upload failed");
    return json.secure_url;
}

// Firestore sync helpers
async function pushBatchToFirestore(batch) {
    const colRef = collection(db, "batches");
    await addDoc(colRef, batch);
}

function enqueueOperation(op) {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    queue.push(op);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

async function processQueue() {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
    if (!queue.length || !navigator.onLine || !currentUser) return;
    for (const op of queue) {
        try {
            if (op.type === "addBatch") {
                await pushBatchToFirestore(op.data);
            } else if (op.type === "updateBatchStatus") {
                await updateBatchStatusRemote(op.data.id, op.data.status, op.data.riskStatus);
            }
        } catch {
            // leave in queue
        }
    }
    localStorage.setItem(QUEUE_KEY, "[]");
}

window.addEventListener("online", processQueue);

// Local batches storage
function saveLocalBatches() {
    localStorage.setItem(LOCAL_BATCHES_KEY, JSON.stringify(batchesCache));
}

function loadLocalBatches() {
    const raw = localStorage.getItem(LOCAL_BATCHES_KEY);
    if (raw) {
        try {
            batchesCache = JSON.parse(raw);
        } catch {
            batchesCache = [];
        }
    } else {
        batchesCache = [];
    }
}

// Render batches & analytics (Req 2, 9)
function renderBatches() {
    activeBatchesDiv.innerHTML = "";
    const active = batchesCache.filter(b => b.status === "active" || b.status === "mitigated" || b.status === "lost");
    if (!active.length) {
        noBatchesMsg.classList.remove("hidden");
    } else {
        noBatchesMsg.classList.add("hidden");
    }
    active.forEach((batch, idx) => {
        const l = LANG[currentLang];
        const statusKey = batch.status + "Status";
        const statusText = l[statusKey] || batch.status;

        // Date formatting
        let dateStr = batch.harvestDate;
        try {
            if (dateStr) {
                dateStr = new Date(dateStr).toLocaleDateString(currentLang === 'bn' ? 'bn-BD' : 'en-US');
            }
        } catch (e) { }

        // Status badge styling
        let statusBadgeClass = "status-badge";
        let statusIcon = "●";
        if (batch.status === "active") {
            statusBadgeClass += " status-active";
            statusIcon = "✓";
        } else if (batch.status === "mitigated") {
            statusBadgeClass += " status-mitigated";
            statusIcon = "🛡️";
        } else if (batch.status === "lost") {
            statusBadgeClass += " status-lost";
            statusIcon = "⚠️";
        } else if (batch.status === "completed") {
            statusBadgeClass += " status-completed";
            statusIcon = "✔️";
        }

        const div = document.createElement("div");
        div.className = "batch-card";
        // Add status-specific class to the card
        if (batch.status === "lost") {
            div.classList.add("batch-card-lost");
        } else if (batch.status === "mitigated") {
            div.classList.add("batch-card-mitigated");
        }

        // Action buttons HTML - show different buttons based on status
        let actionButtons = '';
        if (batch.status === "active") {
            actionButtons = `
                <div class="batch-actions">
                    <button data-idx="${idx}" class="btn-mitigate">🛡️ ${l.markMitigatedBtn || "Mark Mitigated"}</button>
                    <button data-idx="${idx}" class="btn-lost">⚠️ ${l.markLostBtn || "Mark Lost"}</button>
                    <button data-idx="${idx}" class="complete-btn">${l.markCompletedBtn || "Mark Completed"}</button>
                </div>
            `;
        } else {
            // For mitigated or lost batches, only show complete button
            actionButtons = `
                <div class="batch-actions">
                    <button data-idx="${idx}" class="complete-btn">${l.markCompletedBtn || "Mark Completed"}</button>
                </div>
            `;
        }

        // Risk badge + summary (if prediction engine populated fields)
        const hasRisk = typeof batch.etclHours === 'number' && batch.riskStatus;
        const riskColorMap = { high: '#dc2626', 'medium-high': '#ea580c', medium: '#f59e0b', 'low-medium': '#84cc16', low: '#16a34a' };
        const riskColor = riskColorMap[batch.riskStatus] || '#6b7280';
        const levelText = batch.riskLevelText || (batch.riskStatus ? batch.riskStatus.toUpperCase() : '');
        const etclText = typeof batch.etclHours === 'number' ? `${batch.etclHours}h (${Math.floor(batch.etclHours/24)}d ${batch.etclHours%24}h)` : '';
        const riskSummaryText = batch.lastRiskSummaryBn || batch.lastRiskSummaryEn || '';

        const riskBlock = hasRisk ? `
          <div class="risk-block" style="margin-top: 10px;">
            <div class="risk-header" style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="risk-badge" style="background:${riskColor}; color:#fff; padding:6px 10px; border-radius:12px; font-weight:600; font-size:0.85rem;">${levelText}</span>
              <span class="risk-etcl" style="color:#374151; font-size:0.85rem;">ETCL: ${etclText}</span>
            </div>
            ${riskSummaryText ? `<div class="risk-summary" style="margin-top:8px; background:#f9fafb; border:1px solid #e5e7eb; padding:10px; border-radius:8px; font-size:0.9rem; line-height:1.5; white-space:pre-wrap;">${riskSummaryText.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>` : ''}
            ${Array.isArray(batch.riskFactors) && batch.riskFactors.length ? `
              <details style="margin-top:8px;">
                <summary style="cursor:pointer; font-weight:600; font-size:0.85rem; color:#374151;">View ${batch.riskFactors.length} Risk Factor${batch.riskFactors.length>1?'s':''}</summary>
                <div style="margin-top:6px; display:grid; gap:6px;">
                  ${batch.riskFactors.slice(0,3).map(rf => `
                    <div style="background:#fff; border:1px solid #e5e7eb; border-left:3px solid ${rf.severity==='critical'?'#dc2626':rf.severity==='high'?'#ea580c':rf.severity==='medium'?'#f59e0b':'#84cc16'}; border-radius:6px; padding:8px;">
                      <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:700; text-transform:uppercase; font-size:0.7rem; color:#374151;">${rf.severity}</span>
                        <span style="color:#6b7280; font-size:0.8rem;">Impact: ${rf.impact}h</span>
                      </div>
                      <div style="margin-top:4px; color:#374151; font-size:0.9rem;">${rf.description}</div>
                    </div>
                  `).join('')}
                  ${batch.riskFactors.length>3 ? `<div style="text-align:center; color:#6b7280; font-size:0.8rem;">+${batch.riskFactors.length-3} more factors</div>`: ''}
                </div>
              </details>
            `:''}
          </div>
        ` : '';

        div.innerHTML = `
      <div class="batch-header">
        <p><strong>${batch.crop || "Unknown Crop"}</strong> <span class="batch-weight">(${batch.weight || 0} kg)</span></p>
        <span class="${statusBadgeClass}">${statusIcon} ${statusText}</span>
      </div>
      <div class="batch-details">
        <p><strong>${l.harvestDate || "Date"}:</strong> ${dateStr}</p>
        <p><strong>${l.storageLabel || "Storage"}:</strong> ${batch.storageType || "N/A"}</p>
        <p><strong>${l.locationLabel || "Location"}:</strong> ${batch.location || "N/A"}</p>
      </div>
      ${riskBlock}
      ${batch.imageUrl ? `<img src="${batch.imageUrl}" class="batch-img" alt="${batch.crop || 'Batch image'}" />` : ""}
      ${actionButtons}
    `;
        activeBatchesDiv.appendChild(div);
    });

    // Add event listeners for all action buttons
    activeBatchesDiv.querySelectorAll(".complete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-idx"), 10);
            markBatchCompleted(idx);
        });
    });

    activeBatchesDiv.querySelectorAll(".btn-mitigate").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-idx"), 10);
            markBatchMitigated(idx);
        });
    });

    activeBatchesDiv.querySelectorAll(".btn-lost").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-idx"), 10);
            markBatchLost(idx);
        });
    });

    updateAnalytics();
    renderAlerts();
    renderBadges();
}

function updateAnalytics() {
    const active = batchesCache.filter(b => b.status === "active");
    const completed = batchesCache.filter(b => b.status === "completed");
    const mitigated = batchesCache.filter(b => b.riskStatus === "mitigated");
    const totalWeight = batchesCache.reduce((sum, b) => sum + (b.weight || 0), 0);
    statActive.textContent = active.length;
    statCompleted.textContent = completed.length;
    statMitigated.textContent = mitigated.length;
    statWeight.textContent = totalWeight.toFixed(2);
}

function markBatchCompleted(idx) {
    const batch = batchesCache[idx];
    batch.status = "completed";
    saveLocalBatches();
    renderBatches();
    if (navigator.onLine) {
        updateBatchStatusRemoteByFields(batch);
    } else {
        enqueueOperation({ type: "updateBatchStatus", data: { id: batch.id || null, status: "completed" } });
    }
}

async function updateBatchStatusRemoteByFields(batch) {
    // For simplicity, try to find Firestore doc matching userId+createdAt
    const q = query(collection(db, "batches"),
        where("userId", "==", currentUser.uid),
        where("createdAt", "==", batch.createdAt)
    );
    const snaps = await getDocs(q);
    snaps.forEach(async (d) => {
        await updateDoc(doc(db, "batches", d.id), {
            status: batch.status,
            riskStatus: batch.riskStatus || null
        });
    });
}

async function updateBatchStatusRemote(id, status, riskStatus) {
    // optional if you store doc IDs in cache
    await updateDoc(doc(db, "batches", id), { status, riskStatus });
}

// Gamification (Req 7)
async function awardFirstHarvestBadge() {
    if (!currentUser) return;
    const snap = await getDoc(doc(db, "users", currentUser.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    const badges = data.badges || [];
    const label = LANG[currentLang].firstHarvestBadge;
    if (!badges.includes(label)) {
        badges.push(label);
        await updateDoc(doc(db, "users", currentUser.uid), { badges });
        renderBadgesFromData(badges);
    }
}

async function awardRiskMitigatedBadge() {
    if (!currentUser) return;
    const snap = await getDoc(doc(db, "users", currentUser.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    const badges = data.badges || [];
    const label = LANG[currentLang].riskMitigatedBadge;
    if (!badges.includes(label)) {
        badges.push(label);
        await updateDoc(doc(db, "users", currentUser.uid), { badges });
        renderBadgesFromData(badges);
    }
}

async function loadBadges() {
    if (!currentUser) return;
    const snap = await getDoc(doc(db, "users", currentUser.uid));
    if (!snap.exists()) return;
    renderBadgesFromData(snap.data().badges || []);
}

function renderBadgesFromData(badges) {
    badgesList.innerHTML = "";
    if (!badges.length) {
        noBadgesMsg.classList.remove("hidden");
        return;
    }
    noBadgesMsg.classList.add("hidden");
    badges.forEach(b => {
        const li = document.createElement("li");
        li.textContent = b;
        badgesList.appendChild(li);
    });
}

function renderBadges() {
    // keep UI in sync with last loaded badge data
    loadBadges();
}

// Risk detection + alerts (Req 3 + simple HF usage)
async function runRiskDetection() {
    // Example: send concatenated batch description to HF sentiment model and treat negative as high risk
    if (!navigator.onLine) return;
    for (const batch of batchesCache) {
        if (batch.status !== "active") continue;
        const text = `${batch.crop} at ${batch.location} stored in ${batch.storageType}`;
        try {
            const res = await fetch(HF_CONFIG.apiUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${HF_CONFIG.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: text })
            });
            const json = await res.json();
            const label = json[0]?.label || "";
            if (label.toLowerCase().includes("negative")) {
                batch.riskStatus = "high";
            } else {
                batch.riskStatus = "low";
            }
        } catch {
            // ignore HF errors
        }
    }
    saveLocalBatches();
    renderAlerts();
}

function renderAlerts() {
    alertsContainer.innerHTML = "";
    const highRisk = batchesCache.filter(b => b.riskStatus === "high" && b.status === "active");
    highRisk.forEach((batch, idx) => {
        const l = LANG[currentLang];
        const div = document.createElement("div");
        div.className = "alert-card";
        div.innerHTML = `
      <p>${l.highRiskDetected || "High moisture risk detected for"} ${batch.crop} at ${batch.location}.</p>
      <p>${l.suggestedActions || "Suggested actions: dry, move to ventilated storage, treat with recommended method."}</p>
      <button data-idx="${idx}" class="mitigate-btn">${l.acceptMitigationBtn || "Accept mitigation"}</button>
      <button data-idx="${idx}" class="ignore-btn">${l.ignoreAlertBtn || "Ignore alert"}</button>
    `;
        alertsContainer.appendChild(div);
    });

    alertsContainer.querySelectorAll(".mitigate-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-idx"), 10);
            handleMitigation(idx);
        });
    });
    alertsContainer.querySelectorAll(".ignore-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.getAttribute("data-idx"), 10);
            handleIgnore(idx);
        });
    });
}

function handleMitigation(idx) {
    const riskBatches = batchesCache.filter(b => b.riskStatus === "high" && b.status === "active");
    const batch = riskBatches[idx];
    if (!batch) return;
    batch.status = "mitigated";
    batch.riskStatus = "mitigated";
    saveLocalBatches();
    renderBatches();
    awardRiskMitigatedBadge();
    if (navigator.onLine) {
        updateBatchStatusRemoteByFields(batch);
    } else {
        enqueueOperation({ type: "updateBatchStatus", data: { id: batch.id || null, status: "mitigated", riskStatus: "mitigated" } });
    }
}

function handleIgnore(idx) {
    const riskBatches = batchesCache.filter(b => b.riskStatus === "high" && b.status === "active");
    const batch = riskBatches[idx];
    if (!batch) return;
    batch.status = "lost";
    batch.riskStatus = "lost";
    saveLocalBatches();
    renderBatches();
    if (navigator.onLine) {
        updateBatchStatusRemoteByFields(batch);
    } else {
        enqueueOperation({ type: "updateBatchStatus", data: { id: batch.id || null, status: "lost", riskStatus: "lost" } });
    }
}

// Data export (Req 4)
exportBtn.addEventListener("click", () => {
    if (!currentUser) return;
    const exportObj = {
        userId: currentUser.uid,
        batches: batchesCache
    };

    const jsonStr = JSON.stringify(exportObj, null, 2);
    downloadFile(`harvestguard-${currentUser.uid}.json`, jsonStr, "application/json");

    const csv = batchesToCsv(batchesCache);
    downloadFile(`harvestguard-${currentUser.uid}.csv`, csv, "text/csv");
});

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function batchesToCsv(batches) {
    if (!batches.length) return "";
    const headers = Object.keys(batches[0]).join(",");
    const rows = batches.map(b => Object.values(b).join(","));
    return [headers, ...rows].join("\n");
}

// District/Location options (matching weather module)
const DISTRICT_OPTIONS = [
    "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Sylhet",
    "Barisal", "Rangpur", "Mymensingh", "Cumilla", "Gazipur",
    "Narayanganj", "Bogura", "Pabna", "Jessore", "Cox's Bazar"
];

// Populate location dropdown
function populateLocationDropdown() {
    const locationSelect = document.getElementById("batch-location");
    if (!locationSelect) return;

    // Clear existing options except the first one
    locationSelect.innerHTML = '<option value="">Select location</option>';

    // Add district options
    DISTRICT_OPTIONS.sort().forEach(district => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        locationSelect.appendChild(option);
    });
}

// Mark batch as mitigated
function markBatchMitigated(idx) {
    const activeBatches = batchesCache.filter(b => b.status === "active" || b.status === "mitigated" || b.status === "lost");
    const batch = activeBatches[idx];
    if (!batch) return;

    batch.status = "mitigated";
    batch.riskStatus = "mitigated";
    saveLocalBatches();
    renderBatches();
    awardRiskMitigatedBadge();

    if (navigator.onLine) {
        updateBatchStatusRemoteByFields(batch);
    } else {
        enqueueOperation({ type: "updateBatchStatus", data: { id: batch.id || null, status: "mitigated", riskStatus: "mitigated" } });
    }
}

// Mark batch as lost
function markBatchLost(idx) {
    const activeBatches = batchesCache.filter(b => b.status === "active" || b.status === "mitigated" || b.status === "lost");
    const batch = activeBatches[idx];
    if (!batch) return;

    batch.status = "lost";
    batch.riskStatus = "lost";
    saveLocalBatches();
    renderBatches();

    if (navigator.onLine) {
        updateBatchStatusRemoteByFields(batch);
    } else {
        enqueueOperation({ type: "updateBatchStatus", data: { id: batch.id || null, status: "lost", riskStatus: "lost" } });
    }
}

// Profile picture upload functionality
const uploadPictureBtn = document.getElementById("upload-picture-btn");
const profilePictureInput = document.getElementById("profile-picture-input");
const profilePicture = document.getElementById("profile-picture");
const noPictureText = document.getElementById("no-picture-text");
const uploadStatus = document.getElementById("upload-status");
const removePictureBtn = document.getElementById("remove-picture-btn");

if (uploadPictureBtn && profilePictureInput) {
    uploadPictureBtn.addEventListener("click", () => {
        profilePictureInput.click();
    });

    profilePictureInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        uploadStatus.textContent = "Uploading...";
        uploadStatus.style.color = "#666";

        try {
            const imageUrl = await uploadToCloudinary(file);

            // Update the profile picture in the UI
            profilePicture.src = imageUrl;
            profilePicture.classList.remove("hidden");
            noPictureText.classList.add("hidden");
            removePictureBtn.style.display = "block";

            // Save the image URL to Firestore
            if (currentUser) {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    profilePicture: imageUrl
                });
            }

            uploadStatus.textContent = "Upload successful!";
            uploadStatus.style.color = "green";
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            uploadStatus.textContent = "Upload failed. Please try again.";
            uploadStatus.style.color = "red";
        }
    });
}

if (removePictureBtn) {
    removePictureBtn.addEventListener("click", async () => {
        if (!currentUser) return;

        try {
            // Remove the profile picture from Firestore
            await updateDoc(doc(db, "users", currentUser.uid), {
                profilePicture: null
            });

            // Update the UI
            profilePicture.src = "";
            profilePicture.classList.add("hidden");
            noPictureText.classList.remove("hidden");
            removePictureBtn.style.display = "none";

            uploadStatus.textContent = "Profile picture removed.";
            uploadStatus.style.color = "green";
        } catch (error) {
            console.error("Error removing profile picture:", error);
            uploadStatus.textContent = "Failed to remove profile picture.";
            uploadStatus.style.color = "red";
        }
    });
}

// Initialization
async function initUserData() {
    populateLocationDropdown();
    loadLocalBatches();
    renderBatches();
    await loadProfile();
    await processQueue();

    // Initialize weather first so window.HG_weather is available
    try {
        initWeather();
    } catch (e) {
        console.warn("Weather init failed:", e);
    }

    // Auto-update batch risk from weather (ETCL) when available
    try {
        if (window.HG_weather && typeof window.HG_weather.updateBatchRiskFromWeather === 'function') {
            const updated = await window.HG_weather.updateBatchRiskFromWeather(batchesCache);
            if (Array.isArray(updated)) {
                batchesCache = updated;
                saveLocalBatches();
                renderBatches();
            }
        } else {
            console.info("HG_weather not ready; skipping automatic ETCL update.");
        }
    } catch (e) {
        console.error("ETCL update from weather failed:", e);
    }

    // Keep other modules active
    runRiskDetection();
    initAiScanner();
}
