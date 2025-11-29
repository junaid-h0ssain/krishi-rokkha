// modules/weatherRiskLogic.js

/**
 * Enhanced Prediction Engine for Estimated Time to Critical Loss (ETCL)
 * Calculates risk based on:
 * - Continuous high moisture readings
 * - Continuous high temperature readings
 * - Weather forecast (7-day)
 * - Storage conditions
 * - Crop age since harvest
 */

/**
 * Calculate ETCL with enhanced logic
 * @param {Object} batch - Batch object with crop, storage, and harvest info
 * @param {Array} forecastList - Array of 3-hour forecast data points from OpenWeather API
 * @returns {Object} { etcl, level, riskFactors, weatherSummary }
 */
export function calculateETCL(batch, forecastList) {
    // Base ETCL: 5 days (120 hours) for optimal storage conditions
    let etcl = 120;
    const riskFactors = [];

    // Extract weather data for different time windows
    const next24h = forecastList.slice(0, 8);   // 8 * 3h = 24h
    const next48h = forecastList.slice(0, 16);  // 16 * 3h = 48h
    const next72h = forecastList.slice(0, 24);  // 24 * 3h = 72h
    const next7days = forecastList.slice(0, 56); // 56 * 3h ≈ 7 days

    // Calculate weather metrics
    const metrics = calculateWeatherMetrics(next24h, next48h, next72h, next7days);

    // 1. CONTINUOUS HIGH HUMIDITY RISK
    const continuousHighHumidity = detectContinuousCondition(
        forecastList,
        (item) => item.main.humidity > 85,
        12 // 12 hours continuous
    );

    if (continuousHighHumidity) {
        etcl -= 36;
        riskFactors.push({
            type: "continuous_high_humidity",
            severity: "high",
            impact: -36,
            description: "Continuous high humidity (>85%) detected for 12+ hours"
        });
    } else if (metrics.avgHumidity48h > 90) {
        etcl -= 30;
        riskFactors.push({
            type: "very_high_humidity",
            severity: "high",
            impact: -30,
            description: `Very high average humidity: ${Math.round(metrics.avgHumidity48h)}%`
        });
    } else if (metrics.avgHumidity48h > 80) {
        etcl -= 24;
        riskFactors.push({
            type: "high_humidity",
            severity: "medium",
            impact: -24,
            description: `High average humidity: ${Math.round(metrics.avgHumidity48h)}%`
        });
    }

    // 2. CONTINUOUS HIGH TEMPERATURE RISK
    const continuousHighTemp = detectContinuousCondition(
        forecastList,
        (item) => item.main.temp > 32,
        18 // 18 hours continuous
    );

    if (continuousHighTemp) {
        etcl -= 30;
        riskFactors.push({
            type: "continuous_high_temperature",
            severity: "high",
            impact: -30,
            description: "Continuous high temperature (>32°C) for 18+ hours"
        });
    } else if (metrics.avgTemp48h > 35) {
        etcl -= 24;
        riskFactors.push({
            type: "extreme_heat",
            severity: "high",
            impact: -24,
            description: `Extreme heat: ${Math.round(metrics.avgTemp48h)}°C`
        });
    } else if (metrics.avgTemp48h > 32) {
        etcl -= 18;
        riskFactors.push({
            type: "high_temperature",
            severity: "medium",
            impact: -18,
            description: `High temperature: ${Math.round(metrics.avgTemp48h)}°C`
        });
    }

    // 3. COMBINED HEAT + HUMIDITY (Most dangerous for aflatoxin)
    if (metrics.avgHumidity48h > 85 && metrics.avgTemp48h > 30) {
        etcl -= 24;
        riskFactors.push({
            type: "heat_humidity_combo",
            severity: "critical",
            impact: -24,
            description: "Critical: High heat + high humidity = optimal aflatoxin conditions"
        });
    }

    // 4. RAINFALL PROBABILITY RISK
    if (metrics.maxRainProb72h > 80) {
        etcl -= 30;
        riskFactors.push({
            type: "very_high_rain_risk",
            severity: "high",
            impact: -30,
            description: `Very high rain probability: ${Math.round(metrics.maxRainProb72h)}%`
        });
    } else if (metrics.maxRainProb72h > 60) {
        etcl -= 24;
        riskFactors.push({
            type: "high_rain_risk",
            severity: "medium",
            impact: -24,
            description: `High rain probability: ${Math.round(metrics.maxRainProb72h)}%`
        });
    } else if (metrics.maxRainProb72h > 40) {
        etcl -= 12;
        riskFactors.push({
            type: "moderate_rain_risk",
            severity: "low",
            impact: -12,
            description: `Moderate rain probability: ${Math.round(metrics.maxRainProb72h)}%`
        });
    }

    // 5. STORAGE TYPE RISK
    if (batch.storageType === "Open Area") {
        etcl -= 36;
        riskFactors.push({
            type: "open_storage",
            severity: "high",
            impact: -36,
            description: "Open area storage - highly vulnerable to weather"
        });
    } else if (batch.storageType === "Jute Bag Stack") {
        etcl -= 18;
        riskFactors.push({
            type: "jute_bag_storage",
            severity: "medium",
            impact: -18,
            description: "Jute bag storage - moderate ventilation risk"
        });
    } else if (batch.storageType === "Traditional Bamboo Gola") {
        etcl -= 24;
        riskFactors.push({
            type: "bamboo_gola_storage",
            severity: "medium",
            impact: -24,
            description: "Traditional storage - limited protection from humidity"
        });
    }

    // 6. CROP AGE FACTOR (older crops more vulnerable)
    if (batch.harvestDate) {
        const daysOld = Math.floor((Date.now() - new Date(batch.harvestDate).getTime()) / (1000 * 60 * 60 * 24));
        if (daysOld > 14) {
            etcl -= 24;
            riskFactors.push({
                type: "old_crop",
                severity: "medium",
                impact: -24,
                description: `Crop is ${daysOld} days old - increased vulnerability`
            });
        } else if (daysOld > 7) {
            etcl -= 12;
            riskFactors.push({
                type: "aging_crop",
                severity: "low",
                impact: -12,
                description: `Crop is ${daysOld} days old`
            });
        }
    }

    // 7. WEATHER FORECAST TREND (next 7 days)
    const unfavorableDays = metrics.forecast7day.filter(day =>
        day.humidity > 80 || day.rainProb > 50
    ).length;

    if (unfavorableDays >= 5) {
        etcl -= 18;
        riskFactors.push({
            type: "prolonged_bad_weather",
            severity: "medium",
            impact: -18,
            description: `${unfavorableDays}/7 days forecast unfavorable conditions`
        });
    }

    // Ensure ETCL doesn't go below minimum threshold
    if (etcl < 12) etcl = 12;

    // Determine risk level
    let level, levelText;
    if (etcl < 24) {
        level = "high";
        levelText = "Critical Risk";
    } else if (etcl < 48) {
        level = "medium-high";
        levelText = "High Risk";
    } else if (etcl < 72) {
        level = "medium";
        levelText = "Moderate Risk";
    } else if (etcl < 96) {
        level = "low-medium";
        levelText = "Low-Moderate Risk";
    } else {
        level = "low";
        levelText = "Low Risk";
    }

    return {
        etcl,
        level,
        levelText,
        riskFactors,
        weatherMetrics: metrics,
        weatherSummary: generateWeatherSummary(metrics)
    };
}

/**
 * Calculate comprehensive weather metrics
 */
function calculateWeatherMetrics(next24h, next48h, next72h, next7days) {
    return {
        avgHumidity24h: average(next24h.map(i => i.main.humidity)),
        avgHumidity48h: average(next48h.map(i => i.main.humidity)),
        avgHumidity72h: average(next72h.map(i => i.main.humidity)),
        avgTemp24h: average(next24h.map(i => i.main.temp)),
        avgTemp48h: average(next48h.map(i => i.main.temp)),
        avgTemp72h: average(next72h.map(i => i.main.temp)),
        maxTemp72h: Math.max(...next72h.map(i => i.main.temp)),
        minTemp72h: Math.min(...next72h.map(i => i.main.temp)),
        maxRainProb24h: Math.max(...next24h.map(i => (i.pop || 0) * 100)),
        maxRainProb72h: Math.max(...next72h.map(i => (i.pop || 0) * 100)),
        forecast7day: aggregate7DayForecast(next7days)
    };
}

/**
 * Aggregate forecast into daily summaries for 7-day view
 */
function aggregate7DayForecast(forecastList) {
    const byDay = {};

    forecastList.forEach(item => {
        const dateKey = item.dt_txt ? item.dt_txt.split(" ")[0] : new Date(item.dt * 1000).toISOString().split("T")[0];
        if (!byDay[dateKey]) byDay[dateKey] = [];
        byDay[dateKey].push(item);
    });

    return Object.keys(byDay).slice(0, 7).map(dateKey => {
        const items = byDay[dateKey];
        return {
            date: dateKey,
            temp: average(items.map(i => i.main.temp)),
            humidity: average(items.map(i => i.main.humidity)),
            rainProb: Math.max(...items.map(i => (i.pop || 0) * 100)),
            tempMin: Math.min(...items.map(i => i.main.temp_min || i.main.temp)),
            tempMax: Math.max(...items.map(i => i.main.temp_max || i.main.temp))
        };
    });
}

/**
 * Detect continuous condition (e.g., continuous high humidity)
 * @param {Array} forecastList - Forecast data
 * @param {Function} condition - Function that returns true if condition is met
 * @param {Number} minHours - Minimum continuous hours required
 */
function detectContinuousCondition(forecastList, condition, minHours) {
    const minIntervals = Math.ceil(minHours / 3); // Convert hours to 3-hour intervals
    let consecutiveCount = 0;

    for (const item of forecastList) {
        if (condition(item)) {
            consecutiveCount++;
            if (consecutiveCount >= minIntervals) {
                return true;
            }
        } else {
            consecutiveCount = 0;
        }
    }

    return false;
}

/**
 * Generate weather summary text
 */
function generateWeatherSummary(metrics) {
    const summaries = [];

    if (metrics.maxRainProb72h > 60) {
        summaries.push(`High rainfall probability (${Math.round(metrics.maxRainProb72h)}%)`);
    }
    if (metrics.avgHumidity48h > 85) {
        summaries.push(`Very high humidity (${Math.round(metrics.avgHumidity48h)}%)`);
    }
    if (metrics.avgTemp48h > 32) {
        summaries.push(`High temperature (${Math.round(metrics.avgTemp48h)}°C)`);
    }

    return summaries.length > 0 ? summaries.join(", ") : "Favorable conditions";
}

/**
 * Generate human-readable risk summary
 * @param {Object} result - Result from calculateETCL
 * @param {Object} batch - Batch information
 * @returns {Object} { english, bangla }
 */
export function generateRiskSummary(result, batch) {
    const { etcl, level, levelText, riskFactors, weatherSummary } = result;

    // English Summary
    let englishSummary = "";
    let banglaSummary = "";

    if (level === "high" || level === "medium-high") {
        const primaryRisk = identifyPrimaryRisk(riskFactors);

        if (primaryRisk.includes("aflatoxin") || primaryRisk.includes("heat_humidity")) {
            englishSummary = `⚠️ HIGH RISK OF AFLATOXIN MOLD (ETCL: ${etcl} hours)\n\n`;
            banglaSummary = `⚠️ অ্যাফ্লাটক্সিন ছাঁচের উচ্চ ঝুঁকি (ETCL: ${etcl} ঘন্টা)\n\n`;
        } else if (primaryRisk.includes("rain")) {
            englishSummary = `⚠️ HIGH RISK OF MOISTURE DAMAGE (ETCL: ${etcl} hours)\n\n`;
            banglaSummary = `⚠️ আর্দ্রতা ক্ষতির উচ্চ ঝুঁকি (ETCL: ${etcl} ঘন্টা)\n\n`;
        } else {
            englishSummary = `⚠️ ${levelText.toUpperCase()} (ETCL: ${etcl} hours)\n\n`;
            banglaSummary = `⚠️ ${getBanglaRiskLevel(level)} (ETCL: ${etcl} ঘন্টা)\n\n`;
        }

        // Add weather forecast impact
        if (weatherSummary && weatherSummary !== "Favorable conditions") {
            englishSummary += `Weather forecast: ${weatherSummary}. `;
            banglaSummary += `আবহাওয়ার পূর্বাভাস: ${getBanglaWeatherSummary(result.weatherMetrics)}। `;
        }

        // Add recommendations
        const recommendations = generateRecommendations(result, batch);
        englishSummary += `\n\nRECOMMENDED ACTIONS:\n${recommendations.english}`;
        banglaSummary += `\n\nসুপারিশকৃত পদক্ষেপ:\n${recommendations.bangla}`;

    } else {
        englishSummary = `✓ ${levelText} (ETCL: ${etcl} hours)\n\nConditions are currently favorable. Continue regular monitoring.`;
        banglaSummary = `✓ ${getBanglaRiskLevel(level)} (ETCL: ${etcl} ঘন্টা)\n\nবর্তমান পরিস্থিতি অনুকূল। নিয়মিত পর্যবেক্ষণ চালিয়ে যান।`;
    }

    return {
        english: englishSummary,
        bangla: banglaSummary,
        short: `${levelText} - ETCL: ${etcl}h`
    };
}

/**
 * Identify primary risk from risk factors
 */
function identifyPrimaryRisk(riskFactors) {
    if (!riskFactors.length) return "";

    // Find the most severe risk
    const critical = riskFactors.find(rf => rf.type === "heat_humidity_combo");
    if (critical) return "aflatoxin";

    const highSeverity = riskFactors.filter(rf => rf.severity === "high" || rf.severity === "critical");
    if (highSeverity.length > 0) {
        return highSeverity[0].type;
    }

    return riskFactors[0].type;
}

/**
 * Generate action recommendations based on risk assessment
 */
function generateRecommendations(result, batch) {
    const { riskFactors, weatherMetrics } = result;
    const englishRecs = [];
    const banglaRecs = [];

    // Check for high humidity + rain
    if (weatherMetrics.avgHumidity48h > 85 && weatherMetrics.maxRainProb72h > 60) {
        englishRecs.push("• URGENT: Move crop to covered, well-ventilated indoor storage");
        banglaRecs.push("• জরুরি: ফসল ঢাকা, ভালো বায়ুচলাচল সহ ঘরের ভিতরে সরান");

        englishRecs.push("• Use indoor aeration to reduce humidity");
        banglaRecs.push("• আর্দ্রতা কমাতে অভ্যন্তরীণ বায়ুচলাচল ব্যবহার করুন");
    } else if (weatherMetrics.maxRainProb72h > 60) {
        englishRecs.push("• Cover storage area with tarpaulin before rainfall");
        banglaRecs.push("• বৃষ্টির আগে স্টোরেজ এলাকা তেরপল দিয়ে ঢেকে দিন");
    }

    // Check for high temperature
    if (weatherMetrics.avgTemp48h > 32) {
        englishRecs.push("• Increase ventilation to prevent heat buildup");
        banglaRecs.push("• তাপ জমা প্রতিরোধে বায়ুচলাচল বৃদ্ধি করুন");
    }

    // Storage-specific recommendations
    if (batch.storageType === "Open Area") {
        englishRecs.push("• Immediate action required: Open storage is extremely risky");
        banglaRecs.push("• তাৎক্ষণিক পদক্ষেপ প্রয়োজন: খোলা স্টোরেজ অত্যন্ত ঝুঁকিপূর্ণ");
    }

    // Aflatoxin prevention
    if (weatherMetrics.avgHumidity48h > 85 && weatherMetrics.avgTemp48h > 28) {
        englishRecs.push("• Test for aflatoxin contamination immediately");
        banglaRecs.push("• অবিলম্বে অ্যাফ্লাটক্সিন দূষণের জন্য পরীক্ষা করুন");

        englishRecs.push("• Consider immediate sale or processing to minimize loss");
        banglaRecs.push("• ক্ষতি কমাতে তাৎক্ষণিক বিক্রয় বা প্রক্রিয়াকরণ বিবেচনা করুন");
    }

    // General monitoring
    if (englishRecs.length === 0) {
        englishRecs.push("• Continue regular moisture and temperature monitoring");
        banglaRecs.push("• নিয়মিত আর্দ্রতা এবং তাপমাত্রা পর্যবেক্ষণ চালিয়ে যান");
    }

    return {
        english: englishRecs.join("\n"),
        bangla: banglaRecs.join("\n")
    };
}

/**
 * Get Bangla risk level text
 */
function getBanglaRiskLevel(level) {
    const levels = {
        "high": "গুরুতর ঝুঁকি",
        "medium-high": "উচ্চ ঝুঁকি",
        "medium": "মধ্যম ঝুঁকি",
        "low-medium": "নিম্ন-মধ্যম ঝুঁকি",
        "low": "নিম্ন ঝুঁকি"
    };
    return levels[level] || "ঝুঁকি";
}

/**
 * Get Bangla weather summary
 */
function getBanglaWeatherSummary(metrics) {
    const parts = [];

    if (metrics.maxRainProb72h > 60) {
        parts.push(`উচ্চ বৃষ্টিপাতের সম্ভাবনা (${Math.round(metrics.maxRainProb72h)}%)`);
    }
    if (metrics.avgHumidity48h > 85) {
        parts.push(`অত্যন্ত উচ্চ আর্দ্রতা (${Math.round(metrics.avgHumidity48h)}%)`);
    }
    if (metrics.avgTemp48h > 32) {
        parts.push(`উচ্চ তাপমাত্রা (${Math.round(metrics.avgTemp48h)}°সে)`);
    }

    return parts.length > 0 ? parts.join(", ") : "অনুকূল পরিস্থিতি";
}

/**
 * Utility: Calculate average
 */
function average(arr) {
    if (!arr.length) return 0;
    return arr.reduce((s, x) => s + x, 0) / arr.length;
}
