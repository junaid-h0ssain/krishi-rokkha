// modules/weatherDisplay.js
// Enhanced weather display with 7-day forecast and risk visualization

/**
 * Render enhanced 7-day weather forecast
 */
export function renderEnhancedWeather(dailyData, container) {
    container.innerHTML = "";

    // Add header with summary
    const header = document.createElement("div");
    header.style.marginBottom = "1.5rem";
    header.innerHTML = `
        <h2 style="margin-bottom: 0.5rem;">৭-দিনের আবহাওয়া পূর্বাভাস</h2>
        <p style="color: #6b7280; font-size: 0.9rem;">7-Day Weather Forecast</p>
    `;
    container.appendChild(header);

    // Show up to 7 days
    dailyData.slice(0, 7).forEach((day, index) => {
        const div = document.createElement("div");
        const advice = makeBanglaAdvice(day);
        const riskLevel = getWeatherRiskLevel(day);
        
        div.className = "weather-day card";
        div.style.marginBottom = "1rem";
        div.style.borderLeft = `4px solid ${getRiskColor(riskLevel)}`;

        const date = new Date(day.dt * 1000).toLocaleDateString("bn-BD", { weekday: 'long', day: 'numeric', month: 'long' });
        const dateEn = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });

        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div>
                    <h3 style="margin: 0;">${date}</h3>
                    <p style="color: #6b7280; font-size: 0.85rem; margin: 0;">${dateEn}</p>
                </div>
                <span style="background: ${getRiskColor(riskLevel)}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">
                    ${getRiskBadge(riskLevel)}
                </span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 12px; background: #f9fafb; padding: 12px; border-radius: 8px;">
                <div style="text-align: center;">
                    <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 4px;">তাপমাত্রা / Temp</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: ${day.temp > 32 ? '#dc2626' : '#059669'};">
                        ${Math.round(day.temp)}°C
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 4px;">আর্দ্রতা / Humidity</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: ${day.humidity > 80 ? '#dc2626' : '#059669'};">
                        ${Math.round(day.humidity)}%
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 4px;">বৃষ্টি / Rain</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: ${day.rainProb > 60 ? '#dc2626' : '#059669'};">
                        ${Math.round(day.rainProb)}%
                    </div>
                </div>
            </div>
            <div class="weather-advice" style="background: ${getAdviceBackground(riskLevel)}; padding: 12px; border-radius: 6px; border-left: 4px solid ${getRiskColor(riskLevel)};">
                <strong style="display: block; margin-bottom: 4px;">পরামর্শ / Advisory:</strong>
                <span style="font-size: 0.95rem;">${advice}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

/**
 * Display comprehensive batch risk summary
 */
export function displayBatchRiskSummary(batch, container) {
    if (!batch.riskStatus || !batch.etclHours) {
        container.innerHTML = `
            <div style="padding: 16px; background: #f3f4f6; border-radius: 8px;">
                <p style="color: #6b7280; margin: 0;">Risk assessment pending. Update weather data to see risk analysis.</p>
            </div>
        `;
        return;
    }

    const riskColor = getRiskColor(batch.riskStatus);
    const summary = batch.lastRiskSummaryBn || batch.lastRiskSummaryEn || "No risk summary available";

    container.innerHTML = `
        <div style="border: 2px solid ${riskColor}; border-radius: 12px; overflow: hidden;">
            <!-- Risk Header -->
            <div style="background: ${riskColor}; color: white; padding: 16px;">
                <h3 style="margin: 0 0 8px 0; font-size: 1.25rem;">Risk Assessment</h3>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.5rem; font-weight: 700;">ETCL: ${batch.etclHours} Hours</span>
                    <span style="background: rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 20px; font-weight: 600;">
                        ${batch.riskLevelText || batch.riskStatus.toUpperCase()}
                    </span>
                </div>
            </div>

            <!-- Risk Summary -->
            <div style="padding: 16px; background: white;">
                <div style="white-space: pre-wrap; line-height: 1.6; font-size: 0.95rem;">
                    ${summary.replace(/\n/g, '<br>')}
                </div>
            </div>

            <!-- Risk Factors -->
            ${batch.riskFactors && batch.riskFactors.length > 0 ? `
                <div style="padding: 16px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
                    <h4 style="margin: 0 0 12px 0; font-size: 1rem; color: #374151;">Contributing Risk Factors:</h4>
                    ${batch.riskFactors.map(rf => `
                        <div style="margin-bottom: 8px; padding: 8px 12px; background: white; border-radius: 6px; border-left: 3px solid ${getSeverityColor(rf.severity)};">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 600; color: ${getSeverityColor(rf.severity)}; text-transform: uppercase; font-size: 0.75rem;">
                                ${rf.severity} SEVERITY
                            </span>
                            <span style="color: #6b7280; font-size: 0.85rem; margin-left: auto;">
                                Impact: ${rf.impact}h
                            </span>
                        </div>
                            <p style="margin: 4px 0 0 0; font-size: 0.9rem; color: #374151;">
                                ${rf.description}
                            </p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <!-- Last Update -->
            ${batch.lastWeatherUpdate ? `
                <div style="padding: 12px 16px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 0.85rem;">
                    Last updated: ${new Date(batch.lastWeatherUpdate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Determine weather risk level for a day
 */
function getWeatherRiskLevel(day) {
    if ((day.humidity > 85 && day.temp > 30) || day.rainProb > 80) {
        return "high";
    }
    if (day.humidity > 80 || day.rainProb > 60 || day.temp > 35) {
        return "medium";
    }
    return "low";
}

/**
 * Get risk color
 */
function getRiskColor(level) {
    const colors = {
        "high": "#dc2626",          // red
        "critical": "#dc2626",
        "medium-high": "#ea580c",   // dark orange
        "medium": "#f59e0b",        // orange
        "low-medium": "#84cc16",    // lime
        "low": "#16a34a"            // green
    };
    return colors[level] || colors.low;
}

/**
 * Get severity color
 */
function getSeverityColor(severity) {
    const colors = {
        "critical": "#dc2626",
        "high": "#ea580c",
        "medium": "#f59e0b",
        "low": "#84cc16"
    };
    return colors[severity] || "#6b7280";
}

/**
 * Get risk badge text
 */
function getRiskBadge(level) {
    const badges = {
        "high": "উচ্চ ঝুঁকি / High Risk",
        "medium": "মধ্যম / Medium",
        "low": "নিরাপদ / Safe"
    };
    return badges[level] || badges.low;
}

/**
 * Get advice background color
 */
function getAdviceBackground(level) {
    const backgrounds = {
        "high": "#fee2e2",      // light red
        "medium": "#fef3c7",    // light orange
        "low": "#f0fdf4"        // light green
    };
    return backgrounds[level] || backgrounds.low;
}

/**
 * Generate Bangla advice for a weather day
 */
function makeBanglaAdvice(day) {
    if (day.rainProb > 80) {
        return "বৃষ্টির সম্ভাবনা খুব বেশি (৮০%+)। আজই ধান কাটুন অথবা ঢেকে রাখুন। / Very high rain probability (80%+). Harvest or cover crops immediately.";
    }
    if (day.rainProb > 50) {
        return "বৃষ্টির সম্ভাবনা আছে। শস্য বাইরে রাখবেন না। / Rain likely. Keep crops covered.";
    }
    if (day.temp > 35) {
        return "তাপমাত্রা অনেক বেশি (৩৫°সে+)। নিয়মিত বায়ুচলাচল নিশ্চিত করুন। / Very hot (35°C+). Ensure regular ventilation.";
    }
    if (day.humidity > 85) {
        return "বাতাসে আর্দ্রতা বেশি। শস্যে পোকা বা ছত্রাক হতে পারে, সতর্ক থাকুন। / High humidity. Watch for pests and fungus.";
    }
    if (day.humidity > 80 && day.temp > 30) {
        return "উচ্চ আর্দ্রতা ও তাপমাত্রা - অ্যাফ্লাটক্সিনের ঝুঁকি! অবিলম্বে পরীক্ষা করুন। / High humidity & temp - aflatoxin risk! Check immediately.";
    }
    if (day.temp < 15) {
        return "শীতল আবহাওয়া। চারা ঢেকে রাখার ব্যবস্থা করতে পারেন। / Cold weather. Consider covering seedlings.";
    }

    return "আবহাওয়া স্বাভাবিক আছে। নিয়মিত পরিচর্যা করুন। / Weather is normal. Continue regular monitoring.";
}

/**
 * Create a compact risk indicator badge
 */
export function createRiskBadge(batch) {
    if (!batch.riskStatus || !batch.etclHours) {
        return `<span style="background: #9ca3af; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">N/A</span>`;
    }

    const color = getRiskColor(batch.riskStatus);
    const text = batch.riskLevelText || batch.riskStatus.toUpperCase();
    
    return `
        <span style="background: ${color}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
            ${text} (${batch.etclHours}h)
        </span>
    `;
}

/**
 * Export weather metrics as readable summary
 */
export function formatWeatherMetrics(metrics) {
    if (!metrics) return "No weather data available";

    const parts = [];
    
    if (metrics.avgHumidity48h !== undefined) {
        parts.push(`Humidity: ${Math.round(metrics.avgHumidity48h)}% (48h avg)`);
    }
    if (metrics.avgTemp48h !== undefined) {
        parts.push(`Temperature: ${Math.round(metrics.avgTemp48h)}°C (48h avg)`);
    }
    if (metrics.maxRainProb72h !== undefined) {
        parts.push(`Rain Probability: ${Math.round(metrics.maxRainProb72h)}% (72h max)`);
    }

    return parts.join(" | ");
}

