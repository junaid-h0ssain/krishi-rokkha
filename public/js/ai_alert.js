// Note: Files in /public are not processed by Vite, so we can't use import.meta.env
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "f905bf0fa32ad70f3a3937ae1abcabf4";

const areaCoords = {
  "Chittagong": { lat: 22.3569, lon: 91.7832 },
  "Patiya": { lat: 22.2958, lon: 91.9795 },
  "Rangunia": { lat: 22.4650, lon: 92.0284 },
  "Hathazari": { lat: 22.5040, lon: 91.8040 },
  "Anwara": { lat: 22.2130, lon: 91.8100 },
  "Fatikchhari": { lat: 22.6920, lon: 91.7900 },
  "Boalkhali": { lat: 22.3810, lon: 91.9130 },
};

// Risk calculation with debug logs

function calculateRisk(weather) {
  const humidity = weather.main.humidity;
  const rain = weather.rain ? (weather.rain["1h"] || weather.rain["3h"] || 0) : 0;
  const temp = weather.main.temp - 273.15;

  console.log("DEBUG → Humidity:", humidity, "Rain:", rain, "Temp:", temp);

  if ((humidity > 75 && rain > 2) || temp > 33) {
    console.log("Risk: Critical");
    return "Critical";
  }
  if (humidity > 70 || rain > 1) {
    console.log("Risk: High");
    return "High";
  }
  if (humidity > 60) {
    console.log("Risk: Medium");
    return "Medium";
  }
  console.log("Risk: Low");
  return "Low";
}


// Bangla message generator
function generateBanglaMessage(crop, area, weather, risk) {
  const humidity = weather.main.humidity;
  const rain = weather.rain ? weather.rain["1h"] || 0 : 0;

  if (risk === "Critical") {
    console.log(`📱 SMS Notification: ${area}-এর ${crop}-এর ঝুঁকি ক্রিটিকাল! অবিলম্বে ব্যবস্থা নিন।`);
    return `
      ⚠️ ক্রিটিকাল ঝুঁকি!
      ${area}-এ ভারী বৃষ্টি এবং আর্দ্রতা ${humidity}% ।
      আপনার ${crop} এখনই নিরাপদ করতে হবে!
    `;
  }

  if (risk === "High") {
    return `
      🔥 উচ্চ ঝুঁকি:
      ${area}-এ আর্দ্রতা ${humidity}% এবং বৃষ্টি ${rain}mm।
      আপনার ${crop} সংরক্ষণস্থলে বাতাস চলাচল নিশ্চিত করুন।
    `;
  }

  if (risk === "Medium") {
    return `
      ⚠️ মাঝারি ঝুঁকি:
      ${area}-এ আর্দ্রতা ${humidity}% ।
      ${crop} নিয়মিত পরীক্ষা করুন।
    `;
  }

  return `
      ✔️ নিম্ন ঝুঁকি:
      বর্তমানে আবহাওয়া স্বাভাবিক।
      আপনার ${crop} নিরাপদ রয়েছে।
  `;
}

// Main function
export async function getWeatherAndRisk() {
  const crop = document.getElementById("cropSelect").value;
  const area = document.getElementById("areaSelect").value;

  if (!crop || !area) {
    alert("ফসল ও এলাকা নির্বাচন করুন");
    return;
  }

  const coords = areaCoords[area];
  const url = `${apiUrl}?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const weather = await response.json();

    console.log("WEATHER:", weather);

    const risk = calculateRisk(weather);
    const message = generateBanglaMessage(crop, area, weather, risk);

    document.getElementById("alertContainer").innerHTML = `
      <div class="alert-box ${risk.toLowerCase()}">${message}</div>
    `;

  } catch (err) {
    console.error(err);
    alert("আবহাওয়া তথ্য পাওয়া যায়নি");
  }
}

// ✅ Attach to window so inline onclick works
window.getWeatherAndRisk = getWeatherAndRisk;
