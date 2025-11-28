// modules/weather.js
import { WEATHER_CONFIG } from "../src/config.js";

// Expanded mapping of district/upazila -> coordinates
const DISTRICT_COORDS = {
    "Dhaka": { lat: 23.8103, lon: 90.4125 },
    "Chattogram": { lat: 22.3569, lon: 91.7832 },
    "Rajshahi": { lat: 24.3745, lon: 88.6042 },
    "Khulna": { lat: 22.8456, lon: 89.5403 },
    "Sylhet": { lat: 24.8949, lon: 91.8687 },
    "Barisal": { lat: 22.7010, lon: 90.3535 },
    "Rangpur": { lat: 25.7439, lon: 89.2752 },
    "Mymensingh": { lat: 24.7471, lon: 90.4203 },
    "Cumilla": { lat: 23.4607, lon: 91.1809 },
    "Gazipur": { lat: 24.0023, lon: 90.4264 },
    "Narayanganj": { lat: 23.6238, lon: 90.5000 },
    "Bogura": { lat: 24.8481, lon: 89.3730 },
    "Pabna": { lat: 24.0063, lon: 89.2372 },
    "Jessore": { lat: 23.1634, lon: 89.2182 },
    "Cox's Bazar": { lat: 21.4272, lon: 92.0058 }
};

export function initWeather() {
    window.HG_weather = {
        fetchAndRenderWeather,
        updateBatchRiskFromWeather
    };

    // Initialize dropdown
    const select = document.getElementById("weather-location");
    if (select) {
        Object.keys(DISTRICT_COORDS).sort().forEach(loc => {
            const opt = document.createElement("option");
            opt.value = loc;
            opt.textContent = loc; // In a real app, we might map this to Bangla names
            select.appendChild(opt);
        });

        select.addEventListener("change", (e) => {
            if (e.target.value) {
                fetchAndRenderWeather(e.target.value);
            }
        });
    }
}

async function fetchWeatherForDistrict(district) {
    const coords = DISTRICT_COORDS[district];
    if (!coords) return null;

    const url = `${WEATHER_CONFIG.baseUrl}?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_CONFIG.apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return res.json();
    } catch (err) {
        console.error("Weather fetch error:", err);
        return null;
    }
}

async function fetchAndRenderWeather(districtOverride = null) {
    const weatherPanel = document.getElementById("weather-panel");
    if (!weatherPanel) return;

    let district = districtOverride;

    // If no override, try to get from user profile
    if (!district) {
        const user = window.HG.getCurrentUser();
        if (user) {
            const userData = await getUserData(user.uid);
            if (userData?.district) {
                district = userData.district;
                // Update dropdown to match
                const select = document.getElementById("weather-location");
                if (select) select.value = district;
            }
        }
    }

    if (!district) {
        weatherPanel.innerHTML = "<p>দয়া করে একটি এলাকা নির্বাচন করুন। (Please select an area)</p>";
        return;
    }

    weatherPanel.innerHTML = "<p>লোড হচ্ছে... (Loading...)</p>";

    const data = await fetchWeatherForDistrict(district);
    if (!data || !data.list) {
        weatherPanel.innerHTML = "<p>আবহাওয়া তথ্য পাওয়া যায়নি। (Weather data not found)</p>";
        return;
    }

    const daily = aggregateToDaily(data.list);
    renderWeather(daily, weatherPanel);
}

function renderWeather(dailyData, container) {
    container.innerHTML = "";

    dailyData.slice(0, 5).forEach(day => {
        const div = document.createElement("div");
        const advice = makeBanglaAdvice(day);
        div.className = "weather-day card"; // Reusing card class for style
        div.style.marginBottom = "1rem";

        const date = new Date(day.dt * 1000).toLocaleDateString("bn-BD", { weekday: 'long', day: 'numeric', month: 'long' });

        div.innerHTML = `
            <h3>${date}</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>তাপমাত্রা: <strong>${Math.round(day.temp)}°C</strong></span>
                <span>আর্দ্রতা: <strong>${Math.round(day.humidity)}%</strong></span>
                <span>বৃষ্টি: <strong>${Math.round(day.rainProb)}%</strong></span>
            </div>
            <div class="weather-advice" style="background: #f0fdf4; padding: 10px; border-radius: 5px; border-left: 4px solid #16a34a;">
                <strong>পরামর্শ:</strong> ${advice}
            </div>
        `;
        container.appendChild(div);
    });
}

// Aggregate 3-hour forecast into daily averages
function aggregateToDaily(list) {
    const byDay = {};

    list.forEach(item => {
        const dateKey = item.dt_txt.split(" ")[0];
        if (!byDay[dateKey]) byDay[dateKey] = [];
        byDay[dateKey].push(item);
    });

    return Object.keys(byDay).map(dateKey => {
        const items = byDay[dateKey];
        const avg = (arr) => arr.reduce((s, x) => s + x, 0) / arr.length;

        return {
            dt: Math.floor(new Date(dateKey).getTime() / 1000),
            temp: avg(items.map(i => i.main.temp)),
            humidity: avg(items.map(i => i.main.humidity)),
            rainProb: avg(items.map(i => (i.pop || 0) * 100))
        };
    });
}

function makeBanglaAdvice(day) {
    // “আগামী ৩ দিন বৃষ্টি ৮৫% → আজই ধান কাটুন অথবা ঢেকক রাখুন”
    // “তাপমাত্রা ৩৬°C উঠকব → দবকককের দিকক ঢেচ দিন”

    if (day.rainProb > 80) {
        return "বৃষ্টির সম্ভাবনা খুব বেশি (৮০%+)। আজই ধান কাটুন অথবা ঢেকে রাখুন।";
    }
    if (day.rainProb > 50) {
        return "বৃষ্টির সম্ভাবনা আছে। শস্য বাইরে রাখবেন না।";
    }
    if (day.temp > 35) {
        return "তাপমাত্রা অনেক বেশি (৩৫°C+)। নিয়মিত সেচ দিন।";
    }
    if (day.humidity > 85) {
        return "বাতাসে আর্দ্রতা বেশি। শস্যে পোকা বা ছত্রাক হতে পারে, সতর্ক থাকুন।";
    }
    if (day.temp < 15) {
        return "শীতল আবহাওয়া। চারা ঢেকে রাখার ব্যবস্থা করতে পারেন।";
    }

    return "আবহাওয়া স্বাভাবিক আছে। নিয়মিত পরিচর্যা করুন।";
}

// Risk update for batches using weather data
async function updateBatchRiskFromWeather(batches) {
    const user = window.HG.getCurrentUser();
    if (!user) return batches;

    const userData = await getUserData(user.uid);
    if (!userData?.district) return batches;

    const data = await fetchWeatherForDistrict(userData.district);
    if (!data || !data.list) return batches;

    const forecastList = data.list;
    const updated = batches.map(b => {
        if (b.status !== "active") return b;

        const { etcl, level } = calculateETCL(b, forecastList);
        return {
            ...b,
            etclHours: etcl,
            riskStatus: level,
            lastRiskSummaryBn: makeRiskSummaryBn(b, etcl, level)
        };
    });

    if (window.HG_offline) window.HG_offline.saveBatches(updated);
    return updated;
}

function makeRiskSummaryBn(batch, etcl, level) {
    if (level === "high") {
        return `উচ্চ ঝুঁকি, ETCL ${etcl} ঘন্টা; ফসল দ্রুত শুকিয়ে নিরাপদ গুদামে নিন।`;
    }
    if (level === "medium") {
        return `মধ্যম ঝুঁকি, ETCL ${etcl} ঘন্টা; নিয়মিত আর্দ্রতা পরীক্ষা করুন।`;
    }
    return `কম ঝুঁকি, ETCL ${etcl} ঘন্টা; বর্তমান সংরক্ষণ ভালো।`;
}

// ETCL calculation logic (duplicated for now, or import if module structure allows)
// Ideally this should be imported from weatherRiskLogic.js but for simplicity keeping it here if imports are tricky
// But since we have modules/weatherRiskLogic.js, let's try to use it if possible. 
// However, the original file had it inline or similar. 
// Let's re-implement simple version here to avoid import issues if not set up, 
// OR better, let's just keep the logic consistent.
function calculateETCL(batch, forecastList) {
    let etcl = 120; // base hours

    const last48 = forecastList.slice(0, 16); // ~48 hours (3-hour intervals)
    const next72 = forecastList.slice(0, 24); // ~72 hours

    const avgHum = average(last48.map(i => i.main?.humidity || 0));
    const avgTemp = average(last48.map(i => i.main?.temp || 0));
    const maxRainProb = Math.max(...next72.map(i => (i.pop || 0) * 100));

    // Apply risk factors
    if (avgHum > 80) etcl -= 24;
    if (avgHum > 90) etcl -= 24;
    if (avgTemp > 32) etcl -= 12;
    if (maxRainProb > 60) etcl -= 24;

    // Storage type factors
    if (batch.storageType === "Open Area") etcl -= 24;
    if (batch.storageType === "Jute Bag Stack") etcl -= 12;

    // Determine risk level
    if (etcl < 24) return { etcl: 24, level: "high" };
    if (etcl < 72) return { etcl, level: "medium" };
    return { etcl, level: "low" };
}

function average(arr) {
    if (!arr.length) return 0;
    return arr.reduce((s, x) => s + x, 0) / arr.length;
}

// Helper to get user data
async function getUserData(uid) {
    try {
        const { db, fbDbApi } = await import("../src/firebase-config.js");
        const { doc, getDoc } = fbDbApi;
        const snap = await getDoc(doc(db, "users", uid));
        return snap.exists() ? snap.data() : null;
    } catch (err) {
        console.error("Error fetching user data:", err);
        return null;
    }
}
