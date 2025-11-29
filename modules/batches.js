import { db, fbDbApi } from "../src/firebase-config.js";
import { CLOUDINARY_CONFIG } from "../src/config.js";
const { collection, addDoc, query, where, getDocs, updateDoc, doc } = fbDbApi;

const LOCATIONS = [
{ value: "Chattogram", label: "Chattogram (Chittagong)" },
{ value: "Coxs Bazar", label: "Cox’s Bazar" },
{ value: "Cumilla", label: "Cumilla (Comilla)" },
{ value: "Feni", label: "Feni" },
{ value: "Brahmanbaria", label: "Brahmanbaria" },
{ value: "Chandpur", label: "Chandpur" },
{ value: "Noakhali", label: "Noakhali" },
{ value: "Lakshmipur", label: "Lakshmipur" },
{ value: "Khagrachhari", label: "Khagrachhari" },
{ value: "Bandarban", label: "Bandarban" }
];

let batchesCache = [];

function populateLocationSelect() {
const select = document.getElementById("batch-location");
if (!select) return;
select.innerHTML = "";

const placeholder = document.createElement("option");
placeholder.value = "";
placeholder.textContent = "Select district";
placeholder.disabled = true;
placeholder.selected = true;
select.appendChild(placeholder);

LOCATIONS.forEach(loc => {
const opt = document.createElement("option");
opt.value = loc.value;
opt.textContent = loc.label;
select.appendChild(opt);
});
}

export function initBatches() {
const batchForm = document.getElementById("batch-form");
const exportBtn = document.getElementById("export-btn");

populateLocationSelect();

batchForm?.addEventListener("submit", onCreateBatch);
exportBtn?.addEventListener("click", onExport);

window.HG_batches = {
initUserData,
updateLatestBatchHealth
};

// let offline.js know how to process queue
if (window.HG_offline) {
window.HG_offline.processQueue = processQueue;
}
}

async function initUserData() {
batchesCache = window.HG_offline?.loadBatches() || [];
renderBatches();
await processQueue();
if (window.HG_weather) {
batchesCache = await window.HG_weather.updateBatchRiskFromWeather(batchesCache);
renderBatches();
}
}

async function onCreateBatch(e) {
e.preventDefault();
const user = window.HG.getCurrentUser();
if (!user) return;

const crop = document.getElementById("batch-crop").value.trim();
const weight = parseFloat(document.getElementById("batch-weight").value);
const storage = document.getElementById("batch-storage").value;
const location = document.getElementById("batch-location").value;
const dateType = document.getElementById("batch-date-type").value;
const file = document.getElementById("batch-image").files[0];
const dateRaw = document.getElementById("batch-date").value;
const dateIso = dateRaw ? new Date(dateRaw).toISOString() : null;

const batch = {
userId: user.uid,
cropType: crop,
estimatedWeightKg: weight,
harvestDate: dateIso,
dateType: dateType,
storageType: storage,
storageLocationFreeText: location,
status: "active",
riskStatus: null,
etclHours: null,
lastRiskSummaryBn: "",
createdAt: new Date().toISOString(),
imageUrl: null,
cropHealthStatus: null
};

try {
if (file) {
batch.imageUrl = await uploadToCloudinary(file);
}
} catch {
alert("Image upload failed; continuing without image.");
}

batchesCache.push(batch);
window.HG_offline?.saveBatches(batchesCache);
renderBatches();
awardFirstHarvestBadge();

if (navigator.onLine) {
await pushBatchToFirestore(batch);
} else {
window.HG_offline?.enqueue({ type: "addBatch", data: batch });
}

e.target.reset();
}

async function uploadToCloudinary(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
    const res = await fetch(url, { method: "POST", body: data });
    const json = await res.json();
    if (!json.secure_url) throw new Error("Upload failed");
    return json.secure_url;
}

async function pushBatchToFirestore(batch) {
    await addDoc(collection(db, "batches"), batch);
}

async function processQueue() {
    const queue = window.HG_offline?.getQueue() || [];
    if (!queue.length || !navigator.onLine) return;
    for (const op of queue) {
        try {
            if (op.type === "addBatch") {
                await pushBatchToFirestore(op.data);
            } else if (op.type === "updateBatchStatus") {
                await updateBatchStatusRemote(op.data);
            }
        } catch {
            // keep in queue
        }
    }
    window.HG_offline?.clearQueue();
}

// Render + analytics + actions
function formatDate(isoString) {
    if (!isoString) return "N/A";
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    } catch {
        return isoString;
    }
}

function formatDateTime(isoString) {
    if (!isoString) return "N/A";
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } catch {
        return isoString;
    }
}

function renderBatches() {
    const list = document.getElementById("active-batches");
    const noMsg = document.getElementById("no-batches-msg");
    const statActive = document.getElementById("stat-active");
    const statCompleted = document.getElementById("stat-completed");
    const statMitigated = document.getElementById("stat-mitigated");
    const statWeight = document.getElementById("stat-weight");
    const badgesList = document.getElementById("badges-list");
    const noBadgesMsg = document.getElementById("no-badges-msg");

    list.innerHTML = "";
    const active = batchesCache.filter(b => b.status !== "completed");
    if (!active.length) {
        noMsg.classList.remove("hidden");
    } else {
        noMsg.classList.add("hidden");
    }

    active.forEach((b, idx) => {
        const card = document.createElement("div");
        card.className = "batch-card";
        const dateTypeLabel = b.dateType || "Harvest";

        // Generate enhanced risk display
        const riskBadgeHtml = generateRiskBadgeHtml(b);
        const riskDetailsHtml = generateRiskDetailsHtml(b);

        card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
        <div>
          <p><strong style="font-size: 1.1rem;">${b.cropType}</strong> <span style="color: #6b7280;">(${b.estimatedWeightKg} kg)</span></p>
          <p style="font-size: 0.9rem; color: #6b7280;">${dateTypeLabel}: ${formatDate(b.harvestDate)} • ${b.storageType}</p>
        </div>
        ${riskBadgeHtml}
      </div>
      
      ${riskDetailsHtml}
      
      ${b.imageUrl ? `<img src="${b.imageUrl}" alt="${b.cropType} batch image" class="batch-img" style="margin: 10px 0; max-width: 100%; border-radius: 8px;" />` : ""}
      
      ${b.cropHealthStatus ? `
        <div style="padding: 8px; background: #f0fdf4; border-radius: 6px; margin: 10px 0; border-left: 3px solid #16a34a;">
          <strong>স্বাস্থ্য স্ট্যাটাস:</strong> ${b.cropHealthStatus}
        </div>
      ` : ""}
      
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button data-idx="${idx}" class="complete-btn" style="flex: 1;">Complete</button>
        <button data-idx="${idx}" class="mitigate-btn" style="flex: 1;">Mitigate</button>
        <button data-idx="${idx}" class="lose-btn" style="flex: 1;">Mark Lost</button>
      </div>
    `;
        list.appendChild(card);
    });

    list.querySelectorAll(".complete-btn").forEach(btn => {
        btn.addEventListener("click", () => updateStatus(btn, "completed"));
    });
    list.querySelectorAll(".mitigate-btn").forEach(btn => {
        btn.addEventListener("click", () => updateStatus(btn, "mitigated"));
    });
    list.querySelectorAll(".lose-btn").forEach(btn => {
        btn.addEventListener("click", () => updateStatus(btn, "lost"));
    });

    const completed = batchesCache.filter(b => b.status === "completed");
    const mitigated = batchesCache.filter(b => b.status === "mitigated");
    const totalWeight = batchesCache.reduce((s, b) => s + (b.estimatedWeightKg || 0), 0);

    statActive.textContent = active.length;
    statCompleted.textContent = completed.length;
    statMitigated.textContent = mitigated.length;
    statWeight.textContent = totalWeight.toFixed(2);

    renderBadges(badgesList, noBadgesMsg);
}

async function updateStatus(btn, status) {
    const idx = parseInt(btn.getAttribute("data-idx"), 10);
    const batch = batchesCache[idx];
    if (!batch) return;
    batch.status = status;
    if (status === "mitigated") awardRiskMitigatedBadge();
    if (status === "completed") awardCompletionistBadge();
    window.HG_offline?.saveBatches(batchesCache);
    renderBatches();

    if (navigator.onLine) {
        await updateBatchStatusRemote(batch);
    } else {
        window.HG_offline?.enqueue({ type: "updateBatchStatus", data: batch });
    }
}

async function updateBatchStatusRemote(batch) {
    const user = window.HG.getCurrentUser();
    if (!user) return;
    const q = query(
        collection(db, "batches"),
        where("userId", "==", user.uid),
        where("createdAt", "==", batch.createdAt)
    );
    const snaps = await getDocs(q);
    snaps.forEach(async d => {
        await updateDoc(doc(db, "batches", d.id), {
            status: batch.status,
            riskStatus: batch.riskStatus || null,
            etclHours: batch.etclHours || null,
            lastRiskSummaryBn: batch.lastRiskSummaryBn || "",
            cropHealthStatus: batch.cropHealthStatus || null
        });
    });
}

// Badges
async function awardFirstHarvestBadge() {
    const { loadProfile } = await import("./profile.js");
    const { db, fbDbApi } = await import("../src/firebase-config.js");
    const { doc, getDoc, updateDoc } = fbDbApi;
    const user = window.HG.getCurrentUser();
    if (!user) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    const badges = data.badges || [];
    if (!badges.includes("First Harvest Logged")) {
        badges.push("First Harvest Logged");
        await updateDoc(doc(db, "users", user.uid), { badges });
        await loadProfile();
    }
}

async function awardRiskMitigatedBadge() {
    const { loadProfile } = await import("./profile.js");
    const { db, fbDbApi } = await import("../src/firebase-config.js");
    const { doc, getDoc, updateDoc } = fbDbApi;
    const user = window.HG.getCurrentUser();
    if (!user) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    const badges = data.badges || [];
    
    // Count how many batches have been mitigated
    const mitigatedCount = batchesCache.filter(b => b.status === "mitigated").length;
    
    // Only award badge if at least 5 batches have been mitigated
    if (mitigatedCount >= 5 && !badges.includes("Risk Mitigated Expert")) {
        badges.push("Risk Mitigated Expert");
        await updateDoc(doc(db, "users", user.uid), { badges });
        alert("Achievement unlocked: Risk Mitigated Expert badge earned!");
        await loadProfile();
    }
}

async function awardCompletionistBadge() {
    const { loadProfile } = await import("./profile.js");
    const { db, fbDbApi } = await import("../src/firebase-config.js");
    const { doc, getDoc, updateDoc } = fbDbApi;
    const user = window.HG.getCurrentUser();
    if (!user) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    const badges = data.badges || [];
    
    // Count how many batches have been completed
    const completedCount = batchesCache.filter(b => b.status === "completed").length;
    
    // Only award badge if at least 5 batches have been completed
    if (completedCount >= 5 && !badges.includes("Completionist")) {
        badges.push("Completionist");
        await updateDoc(doc(db, "users", user.uid), { badges });
        alert("Achievement unlocked: Completionist badge earned!");
        await loadProfile();
    }
}

async function renderBadges(listEl, emptyEl) {
    const { db, fbDbApi } = await import("../src/firebase-config.js");
    const { doc, getDoc } = fbDbApi;
    const user = window.HG.getCurrentUser();
    if (!user) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return;
    const data = snap.data();
    const badges = data.badges || [];
    listEl.innerHTML = "";
    if (!badges.length) {
        emptyEl.classList.remove("hidden");
        return;
    }
    emptyEl.classList.add("hidden");
    badges.forEach(b => {
        const li = document.createElement("li");
        li.textContent = b;
        listEl.appendChild(li);
    });
}

// Export
function onExport() {
    const user = window.HG.getCurrentUser();
    if (!user) return;
    const jsonStr = JSON.stringify({ userId: user.uid, batches: batchesCache }, null, 2);
    downloadFile(`harvestguard-${user.uid}.json`, jsonStr, "application/json");
    const csv = toCsv(batchesCache);
    downloadFile(`harvestguard-${user.uid}.csv`, csv, "text/csv");
}

function toCsv(batches) {
    const headers = ["cropType", "estimatedWeightKg", "harvestDate", "storageType",
        "storageLocationFreeText", "status", "riskStatus", "etclHours",
        "cropHealthStatus", "createdAt"];
    const lines = [headers.join(",")];
    batches.forEach(b => {
        const row = headers.map(h => JSON.stringify(b[h] ?? ""));
        lines.push(row.join(","));
    });
    return lines.join("\n");
}

function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// AI scanner hook
function updateLatestBatchHealth(status) {
    if (!batchesCache.length) return;
    const latest = batchesCache[batchesCache.length - 1];
    latest.cropHealthStatus = status;
    window.HG_offline?.saveBatches(batchesCache);
    renderBatches();
    if (navigator.onLine) {
        updateBatchStatusRemote(latest);
    } else {
        window.HG_offline?.enqueue({ type: "updateBatchStatus", data: latest });
    }
}

export { updateLatestBatchHealth };

// Helper functions for enhanced risk display
function generateRiskBadgeHtml(batch) {
    if (!batch.riskStatus || !batch.etclHours) {
        return `<span style="background: #9ca3af; color: white; padding: 6px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">No Risk Data</span>`;
    }

    const riskColors = {
        "high": "#dc2626",
        "critical": "#dc2626",
        "medium-high": "#ea580c",
        "medium": "#f59e0b",
        "low-medium": "#84cc16",
        "low": "#16a34a"
    };

    const color = riskColors[batch.riskStatus] || "#9ca3af";
    const levelText = batch.riskLevelText || batch.riskStatus.toUpperCase();

    return `
        <div style="text-align: right;">
            <div style="background: ${color}; color: white; padding: 6px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px;">
                ${levelText}
            </div>
            <div style="font-size: 0.75rem; color: #6b7280;">
                ETCL: ${batch.etclHours}h (${Math.floor(batch.etclHours / 24)}d ${batch.etclHours % 24}h)
            </div>
        </div>
    `;
}

function generateRiskDetailsHtml(batch) {
    if (!batch.riskStatus) {
        return `
            <div style="padding: 12px; background: #f3f4f6; border-radius: 8px; margin: 10px 0;">
                <p style="color: #6b7280; font-size: 0.9rem; margin: 0;">⏳ Risk assessment pending. Weather data will update automatically.</p>
            </div>
        `;
    }

    const riskColors = {
        "high": "#dc2626",
        "critical": "#dc2626",
        "medium-high": "#ea580c",
        "medium": "#f59e0b",
        "low-medium": "#84cc16",
        "low": "#16a34a"
    };

    const bgColors = {
        "high": "#fee2e2",
        "critical": "#fee2e2",
        "medium-high": "#ffedd5",
        "medium": "#fef3c7",
        "low-medium": "#f0fdf4",
        "low": "#f0fdf4"
    };

    const color = riskColors[batch.riskStatus] || "#6b7280";
    const bgColor = bgColors[batch.riskStatus] || "#f3f4f6";

    // Use Bangla summary if available, fallback to English
    const summary = batch.lastRiskSummaryBn || batch.lastRiskSummaryEn || "No detailed risk summary available";

    let html = `
        <div style="padding: 12px; background: ${bgColor}; border-radius: 8px; border-left: 4px solid ${color}; margin: 10px 0;">
            <div style="font-size: 0.9rem; line-height: 1.6; white-space: pre-wrap;">
                ${summary.substring(0, 200)}${summary.length > 200 ? '...' : ''}
            </div>
    `;

    // Show risk factors if available
    if (batch.riskFactors && batch.riskFactors.length > 0) {
        const topFactors = batch.riskFactors.slice(0, 3); // Show top 3 factors
        html += `
            <details style="margin-top: 10px;">
                <summary style="cursor: pointer; font-weight: 600; font-size: 0.85rem; color: #374151;">
                    View ${batch.riskFactors.length} Risk Factor${batch.riskFactors.length > 1 ? 's' : ''}
                </summary>
                <div style="margin-top: 8px;">
                    ${topFactors.map(rf => `
                        <div style="padding: 6px 8px; background: white; border-radius: 4px; margin: 4px 0; font-size: 0.85rem;">
                            <span style="font-weight: 600; color: ${getSeverityColor(rf.severity)}; text-transform: uppercase; font-size: 0.7rem;">
                                ${rf.severity}
                            </span>
                            <span style="float: right; color: #6b7280;">${rf.impact}h</span>
                            <div style="color: #374151; margin-top: 2px;">${rf.description}</div>
                        </div>
                    `).join('')}
                    ${batch.riskFactors.length > 3 ? `<div style="font-size: 0.8rem; color: #6b7280; text-align: center; margin-top: 4px;">+${batch.riskFactors.length - 3} more factors</div>` : ''}
                </div>
            </details>
        `;
    }

    // Show last update time if available
    if (batch.lastWeatherUpdate) {
        const updateTime = new Date(batch.lastWeatherUpdate).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        html += `
            <div style="font-size: 0.75rem; color: #6b7280; margin-top: 8px; text-align: right;">
                Last updated: ${updateTime}
            </div>
        `;
    }

    html += `</div>`;

    return html;
}

function getSeverityColor(severity) {
    const colors = {
        "critical": "#dc2626",
        "high": "#ea580c",
        "medium": "#f59e0b",
        "low": "#84cc16"
    };
    return colors[severity] || "#6b7280";
}
