import { RF_CONFIG } from "../src/config.js";
import { identifyPestWithRAG, getRiskColor, formatTreatmentPlan } from "./ragService.js";

export function initAiScanner() {
    const fileInput = document.getElementById("ai-scan-input");
    const scanButton = document.getElementById("ai-scan-button");
    const ragButton = document.getElementById("ai-rag-button");
    const statusEl = document.getElementById("ai-scan-status");
    const resultEl = document.getElementById("ai-scan-result");
    const ragResultEl = document.getElementById("ai-rag-result");
    const previewEl = document.getElementById("ai-scan-preview");

    let selectedFile = null;

    if (!fileInput || !scanButton || !resultEl || !previewEl) return;

    // Show image preview on file select
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        selectedFile = file;
        resultEl.textContent = "";
        if (ragResultEl) ragResultEl.innerHTML = "";
        statusEl.textContent = "";
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                previewEl.src = reader.result;
                previewEl.classList.remove("hidden");
            };
            reader.readAsDataURL(file);
        } else {
            previewEl.src = "";
            previewEl.classList.add("hidden");
        }
    });

    // Roboflow scan button
    scanButton.addEventListener("click", async () => {
        const file = selectedFile || fileInput.files[0];
        if (!file) {
            resultEl.textContent = "Please select an image first.";
            return;
        }
        resultEl.textContent = "";
        statusEl.textContent = "স্ক্যান হচ্ছে...";
        try {
            // Convert to base64
            const base64 = await fileToBase64(file);
            const base64Payload = base64.split(",")[1];
            // Set endpoint with api_key as query param
            const url = `${RF_CONFIG.apiUrl}?api_key=${RF_CONFIG.apiKey}`;

            // Debug logs
            console.log("[AI SCAN] API URL:", url);
            console.log("[AI SCAN] Base64 preview:", base64.substring(0, 50) + "...");

            // Post to Roboflow per docs
            // Send the base64 string directly as the body.
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: base64Payload
            });
            const data = await res.json();
            console.log("[AI SCAN] Roboflow response:", data);
            if (!res.ok) throw new Error("Roboflow error: " + (data.message || res.status));

            let label = "";
            let confidence = 0;
            if (data.predictions && Array.isArray(data.predictions) && data.predictions.length > 0) {
                // Find prediction with highest confidence
                const topPrediction = data.predictions.reduce((prev, current) => {
                    return (prev.confidence > current.confidence) ? prev : current;
                });
                label = topPrediction.class;
                confidence = topPrediction.confidence;
            } else {
                label = data.label || data.result || "Unknown";
                confidence = data.confidence || 0;
            }

            const status = interpretLabel(label);

            // Display result with enhanced details
            resultEl.innerHTML = `
                <span style="font-size: 1.5rem; font-weight: bold;">${label}</span><br>
                <span style="font-size: 1rem;">Confidence: ${(confidence * 100).toFixed(1)}%</span><br>
                <span style="font-size: 1.2rem; font-weight: bold;">${status.messageBn}</span>
            `;

            resultEl.style.marginTop = "10px";

            if (status.healthStatus === "rotten") {
                resultEl.style.color = "#d32f2f"; // Red
            } else if (status.healthStatus === "fresh") {
                resultEl.style.color = "#2e7d32"; // Green
            } else {
                resultEl.style.color = "#f57c00"; // Orange
            }

            statusEl.textContent = "";
        } catch (err) {
            statusEl.textContent = "স্ক্যান করা যায়নি। পরে চেষ্টা করুন।";
            resultEl.textContent = "";
            console.error("[AI SCAN] ERROR:", err);
        }
    });

    // RAG-based treatment plan button
    if (ragButton && ragResultEl) {
        ragButton.addEventListener("click", async () => {
            const file = selectedFile || fileInput.files[0];
            if (!file) {
                ragResultEl.innerHTML = '<p style="color: #d32f2f;">প্রথমে একটি ছবি আপলোড করুন।</p>';
                return;
            }

            ragResultEl.innerHTML = "";
            statusEl.textContent = "তথ্য যাচাই করা হচ্ছে… অনুগ্রহ করে অপেক্ষা করুন...";
            ragButton.disabled = true;

            try {
                // Get user's location from profile if available
                const division = localStorage.getItem('userDivision') || '';
                const district = localStorage.getItem('userDistrict') || '';
                const language = localStorage.getItem('language') || 'bn';

                const result = await identifyPestWithRAG(file, {
                    division,
                    district,
                    language
                });

                if (result.success) {
                    const riskColor = getRiskColor(result.risk);
                    const formattedPlan = formatTreatmentPlan(result.treatmentPlan);
                    const formattedPrevention = formatTreatmentPlan(result.prevention);

                    ragResultEl.innerHTML = `
                        <div style="background: #f7f7f7; padding: 16px; border-radius: 8px; margin-top: 16px;">
                            <h3 style="margin-top: 0; color: #333;">🔍 শনাক্তকরণ ফলাফল</h3>
                            
                            <div style="margin-bottom: 12px;">
                                <strong>পোকা/রোগ:</strong> 
                                <span style="font-size: 1.2rem; color: ${riskColor};">${result.pest}</span>
                            </div>
                            
                            <div style="margin-bottom: 12px;">
                                <strong>ঝুঁকির স্তর:</strong> 
                                <span style="font-size: 1.1rem; font-weight: bold; color: ${riskColor};">${result.risk}</span>
                            </div>
                            
                            ${result.confidence ? `
                                <div style="margin-bottom: 12px;">
                                    <strong>নিশ্চয়তা:</strong> ${result.confidence}%
                                </div>
                            ` : ''}
                            
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
                            
                            <h4 style="color: #2e7d32; margin-bottom: 8px;">💊 চিকিৎসা পরিকল্পনা</h4>
                            <div style="line-height: 1.6; color: #333;">
                                ${formattedPlan}
                            </div>
                            
                            ${formattedPrevention ? `
                                <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
                                <h4 style="color: #1976d2; margin-bottom: 8px;">🛡️ প্রতিরোধমূলক ব্যবস্থা</h4>
                                <div style="line-height: 1.6; color: #333;">
                                    ${formattedPrevention}
                                </div>
                            ` : ''}
                            
                            ${result.sources && result.sources.length > 0 ? `
                                <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
                                <h4 style="color: #666; margin-bottom: 8px;">📚 তথ্যসূত্র</h4>
                                <ul style="margin: 0; padding-left: 20px;">
                                    ${result.sources.map(src => `<li><a href="${src}" target="_blank" style="color: #1976d2;">${src}</a></li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    `;
                } else {
                    ragResultEl.innerHTML = `
                        <div style="background: #ffebee; padding: 16px; border-radius: 8px; margin-top: 16px; color: #c62828;">
                            <strong>ত্রুটি:</strong> ${result.error || 'সেবাটি বর্তমানে উপলব্ধ নেই।'}
                        </div>
                    `;
                }

                statusEl.textContent = "";
            } catch (err) {
                ragResultEl.innerHTML = `
                    <div style="background: #ffebee; padding: 16px; border-radius: 8px; margin-top: 16px; color: #c62828;">
                        <strong>ত্রুটি:</strong> ${err.message}
                    </div>
                `;
                statusEl.textContent = "";
                console.error("[RAG] ERROR:", err);
            } finally {
                ragButton.disabled = false;
            }
        });
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = e => reject(e);
        reader.readAsDataURL(file);
    });
}

function interpretLabel(label) {
    const lower = label.toLowerCase();
    if (lower.includes("healthy") || lower.includes("fresh")) {
        return {
            healthStatus: "fresh",
            messageBn: "ফসল সুস্থ আছে।"
        };
    }

    const diseaseKeywords = ["rot", "mold", "unhealthy", "sick", "disease", "blight", "scab", "rust", "spot", "mildew", "fungus", "virus", "wilt", "yellow", "curl", "mosaic", "burn"];

    if (diseaseKeywords.some(k => lower.includes(k))) {
        return {
            healthStatus: "rotten",
            messageBn: "রোগ শনাক্ত হয়েছে। দ্রুত ব্যবস্থা নিন।"
        };
    }

    return {
        healthStatus: "unknown",
        messageBn: "ফসলটি পর্যবেক্ষণ করুন।"
    };
}