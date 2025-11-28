// modules/quickRegister.js
import { auth, db, fbAuthApi, fbDbApi } from "../src/firebase-config.js";

const {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber
} = fbAuthApi;

const { doc, setDoc, getDoc } = fbDbApi;

let confirmationResult = null;
let isPhoneMode = false;
let isOtpSent = false;

export function initQuickRegister() {
    console.log("✓ Quick register module loaded");

    const registerForm = document.getElementById("registerForm");
    const googleBtn = document.getElementById("googleBtn");
    const togglePhoneBtn = document.getElementById("togglePhoneBtn");
    const submitBtn = document.getElementById("submitBtn");

    const emailAuthFields = document.getElementById("emailAuthFields");
    const otpAuthFields = document.getElementById("otpAuthFields");
    const otpCodeSection = document.getElementById("otpCodeSection");

    if (!registerForm) {
        console.error("✗ Quick register form not found");
        return;
    }

    // Initialize Recaptcha
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
            console.log("Recaptcha verified");
        }
    });

    // Toggle Phone/Email Mode
    togglePhoneBtn?.addEventListener("click", () => {
        isPhoneMode = !isPhoneMode;
        if (isPhoneMode) {
            emailAuthFields.style.display = "none";
            otpAuthFields.style.display = "block";
            togglePhoneBtn.textContent = "Register with Email";
            submitBtn.textContent = "Send Code";
            document.getElementById("quickTitle").textContent = "Phone Login";
            document.getElementById("quickSub").textContent = "Login with OTP";
        } else {
            emailAuthFields.style.display = "block";
            otpAuthFields.style.display = "none";
            togglePhoneBtn.textContent = "Login with Phone";
            submitBtn.textContent = "Register";
            document.getElementById("quickTitle").textContent = "Quick Register";
            document.getElementById("quickSub").textContent = "You can register fast.";
            otpCodeSection.style.display = "none";
            isOtpSent = false;
        }
    });

    // Google Login
    googleBtn?.addEventListener("click", async () => {
        try {
            // Clear any batches from previous user session BEFORE Google login
            localStorage.removeItem("hg_sync_queue");
            localStorage.removeItem("hg_local_batches");

            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Google login success:", user.uid);

            // Check if user doc exists, if not create it
            await checkAndCreateUserDoc(user, {
                name: user.displayName,
                email: user.email,
                phone: user.phoneNumber,
                photoURL: user.photoURL
            });

            showQuickRegisterSuccess("Login successful!");
            setTimeout(() => {
                window.location.href = "/app.html";
            }, 1000);

        } catch (error) {
            console.error("Google login error:", error);
            if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
                showQuickRegisterError("Sign-in cancelled.");
            } else {
                showQuickRegisterError(error.message);
            }
        }
    });

    // Form Submit
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isPhoneMode) {
            await handlePhoneAuth();
        } else {
            await handleEmailRegister();
        }
    });

    async function handlePhoneAuth() {
        const phoneInput = document.getElementById("otpPhone");
        const codeInput = document.getElementById("otpCode");
        const phoneNumber = phoneInput?.value.trim();
        const code = codeInput?.value.trim();

        if (!isOtpSent) {
            // Send OTP
            if (!phoneNumber) {
                showQuickRegisterError("Please enter phone number");
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = "Sending...";

                // Clear any batches from previous user session BEFORE phone auth
                localStorage.removeItem("hg_sync_queue");
                localStorage.removeItem("hg_local_batches");

                const appVerifier = window.recaptchaVerifier;
                confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

                isOtpSent = true;
                otpCodeSection.style.display = "block";
                submitBtn.textContent = "Verify Code";
                submitBtn.disabled = false;
                showQuickRegisterSuccess("OTP sent to " + phoneNumber);

            } catch (error) {
                console.error("SMS error:", error);
                showQuickRegisterError(error.message);
                submitBtn.disabled = false;
                submitBtn.textContent = "Send Code";
                if (window.recaptchaVerifier) {
                    window.recaptchaVerifier.clear();
                }
            }
        } else {
            // Verify OTP
            if (!code) {
                showQuickRegisterError("Please enter verification code");
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = "Verifying...";

                const result = await confirmationResult.confirm(code);
                const user = result.user;
                console.log("Phone login success:", user.uid);

                // Clear any batches from previous user session
                localStorage.removeItem("hg_sync_queue");
                localStorage.removeItem("hg_local_batches");

                await checkAndCreateUserDoc(user, {
                    phone: user.phoneNumber
                });

                showQuickRegisterSuccess("Login successful!");
                setTimeout(() => {
                    window.location.href = "/app.html";
                }, 1000);

            } catch (error) {
                console.error("OTP verify error:", error);
                showQuickRegisterError("Invalid code");
                submitBtn.disabled = false;
                submitBtn.textContent = "Verify Code";
            }
        }
    }

    async function handleEmailRegister() {
        const nameInput = document.getElementById("rname");
        const phoneInput = document.getElementById("rphone");
        const emailInput = document.getElementById("remail");
        const passwordInput = document.getElementById("rpass");
        const prefLangSelect = document.getElementById("prefLang");

        const name = nameInput?.value.trim();
        const phone = phoneInput?.value.trim();
        const email = emailInput?.value.trim();
        const password = passwordInput?.value;
        const language = prefLangSelect?.value || "en";

        // Validation
        if (!name) return showQuickRegisterError("Please enter your name");
        if (!phone) return showQuickRegisterError("Please enter your phone number");
        if (!email) return showQuickRegisterError("Please enter your email");
        if (!password || password.length < 6) return showQuickRegisterError("Password must be at least 6 characters");

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Registering...";

            // Clear any batches from previous user session BEFORE creating account
            localStorage.removeItem("hg_sync_queue");
            localStorage.removeItem("hg_local_batches");

            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const user = cred.user;

            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                phone,
                language,
                createdAt: new Date().toISOString(),
                badges: [],
                division: "",
                district: "",
                upazila: "",
                onboardingCompleted: false
            });

            showQuickRegisterSuccess("Account created successfully!");
            setTimeout(() => {
                window.location.href = "/app.html";
            }, 1500);

        } catch (err) {
            console.error("Register error:", err);
            let msg = "Registration failed.";
            if (err.code === "auth/email-already-in-use") msg = "Email already registered.";
            if (err.code === "auth/weak-password") msg = "Password too weak.";
            showQuickRegisterError(msg);
            submitBtn.disabled = false;
            submitBtn.textContent = "Register";
        }
    }

    async function checkAndCreateUserDoc(user, data) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                createdAt: new Date().toISOString(),
                onboardingCompleted: false,
                badges: [],
                ...data
            });
        }
    }
}

function showQuickRegisterError(message) {
    const errorEl = document.getElementById("quickRegisterError");
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = "block";
        setTimeout(() => errorEl.style.display = "none", 5000);
    }
}

function showQuickRegisterSuccess(message) {
    const successEl = document.getElementById("quickRegisterSuccess");
    if (successEl) {
        successEl.textContent = message;
        successEl.style.display = "block";
    }
}

export function resetQuickRegister() {
    document.getElementById("registerForm")?.reset();
}
