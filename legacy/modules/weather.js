// modules/weather.js
import { WEATHER_CONFIG } from "../src/config.js";
import { calculateETCL, generateRiskSummary } from "./weatherRiskLogic.js";

// Expanded mapping of district/upazila -> coordinates
const DISTRICT_COORDS = {
    // Chittagong Upazilas
    "Anwara": { lat: 22.4167, lon: 91.7667 },
    "Banshkhali": { lat: 22.3000, lon: 91.9833 },
    "Boalkhali": { lat: 22.4667, lon: 91.8167 },
    "Chandanaish": { lat: 22.4667, lon: 91.9833 },
    "Fatikchhari": { lat: 22.6667, lon: 91.8000 },
    "Hathazari": { lat: 22.5000, lon: 91.8000 },
    "Lohagara": { lat: 22.4167, lon: 91.9167 },
    "Mirsharai": { lat: 22.7500, lon: 91.6167 },
    "Patiya": { lat: 22.3000, lon: 91.9667 },
    "Rangunia": { lat: 22.5833, lon: 91.9167 },
    "Raozan": { lat: 22.5333, lon: 91.8667 },
    "Sandwip": { lat: 22.5167, lon: 91.4500 },
    "Satkania": { lat: 22.1000, lon: 92.0500 },
    "Sitakunda": { lat: 22.6333, lon: 91.6667 },
    "Chattogram Sadar": { lat: 22.3569, lon: 91.7832 }
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
    if (!coords) return getMockWeatherData(); // Fallback to mock if coords not found

    const url = `${WEATHER_CONFIG.baseUrl}?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_CONFIG.apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn("Weather API failed, using mock data");
            return getMockWeatherData();
        }
        return res.json();
    } catch (err) {
        console.error("Weather fetch error, using mock data:", err);
        return getMockWeatherData();
    }
}

function getMockWeatherData() {
    const list = [];
    const now = new Date();
    
    // Generate 7 days of 3-hour intervals (56 items)
    for (let i = 0; i < 56; i++) {
        const date = new Date(now.getTime() + i * 3 * 60 * 60 * 1000);
        const isDay = date.getHours() > 6 && date.getHours() < 18;
        
        // Mock data pattern: High humidity in morning/night, high temp in day
        // Random variations to make it look realistic
        const baseTemp = isDay ? 30 : 24;
        const temp = baseTemp + (Math.random() * 4 - 2);
        
        const baseHum = isDay ? 60 : 85;
        const humidity = Math.min(100, Math.max(40, baseHum + (Math.random() * 10 - 5)));
        
        // Random rain probability
        const pop = Math.random() > 0.7 ? Math.random() : 0;

        list.push({
            dt: Math.floor(date.getTime() / 1000),
            dt_txt: date.toISOString().replace('T', ' ').substring(0, 19),
            main: {
                temp: temp,
                humidity: humidity,
                temp_min: temp - 1,
                temp_max: temp + 1
            },
            weather: [{ main: pop > 0.5 ? "Rain" : "Clear" }],
            pop: pop
        });
    }

    return { list };
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

        // Use enhanced ETCL calculation
        const result = calculateETCL(b, forecastList);
        const riskSummary = generateRiskSummary(result, b);

        return {
            ...b,
            etclHours: result.etcl,
            riskStatus: result.level,
            riskLevelText: result.levelText,
            lastRiskSummaryBn: riskSummary.bangla,
            lastRiskSummaryEn: riskSummary.english,
            riskSummaryShort: riskSummary.short,
            riskFactors: result.riskFactors,
            weatherMetrics: result.weatherMetrics,
            lastWeatherUpdate: new Date().toISOString()
        };
    });

    if (window.HG_offline) window.HG_offline.saveBatches(updated);
    return updated;
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
