/**
 * Pest Scan - Gemini Visual RAG Feature
 * Uses Google Gemini API with Google Search grounding for pest identification
 */

// Get API key from window (injected by pest-scan-entry.js)
import { GOOGLE_CONFIG } from "../../src/pest-scan-entry.js";

const GEMINI_API_KEY = GOOGLE_CONFIG.apiKey;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// DOM Elements
let fileInput, uploadArea, imagePreview, previewSection, removeBtn;
let scanButton, statusMessage, resultsSection;
let selectedFile = null;

/**
 * Initialize the pest scan feature
 */
function initPestScan() {
    // Get DOM elements
    fileInput = document.getElementById('file-input');
    uploadArea = document.getElementById('upload-area');
    imagePreview = document.getElementById('image-preview');
    previewSection = document.getElementById('preview-section');
    removeBtn = document.getElementById('remove-image-btn');
    scanButton = document.getElementById('scan-button');
    statusMessage = document.getElementById('status-message');
    resultsSection = document.getElementById('results-section');

    if (!fileInput || !uploadArea || !scanButton) {
        console.error('[PestScan] Required elements not found');
        return;
    }

    // Setup event listeners
    setupEventListeners();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Click on upload area triggers file input
    uploadArea.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Remove image button
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearImage();
    });

    // Scan button
    scanButton.addEventListener('click', performScan);
}

/**
 * Handle file selection
 */
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

/**
 * Handle drag over
 */
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('dragover');
}

/**
 * Handle drag leave
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');
}

/**
 * Handle drop
 */
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        processFile(file);
    } else {
        showStatus('শুধুমাত্র JPEG বা PNG ছবি আপলোড করুন।', 'error');
    }
}

/**
 * Process the selected file
 */
function processFile(file) {
    // Validate file type
    if (!file.type.match('image/(jpeg|png)')) {
        showStatus('শুধুমাত্র JPEG বা PNG ছবি আপলোড করুন।', 'error');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showStatus('ছবির আকার ১০ MB এর কম হতে হবে।', 'error');
        return;
    }

    selectedFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        previewSection.classList.add('visible');
        uploadArea.style.display = 'none';
        hideStatus();
        hideResults();
    };
    reader.readAsDataURL(file);
}

/**
 * Clear selected image
 */
function clearImage() {
    selectedFile = null;
    fileInput.value = '';
    imagePreview.src = '';
    previewSection.classList.remove('visible');
    uploadArea.style.display = 'block';
    hideResults();
    hideStatus();
}

/**
 * Show status message
 */
function showStatus(message, type = 'loading') {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message visible ' + type;
}

/**
 * Hide status message
 */
function hideStatus() {
    statusMessage.className = 'status-message';
}

/**
 * Hide results section
 */
function hideResults() {
    resultsSection.classList.remove('visible');
    resultsSection.innerHTML = '';
}

/**
 * Convert file to base64
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Remove the data URL prefix to get pure base64
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Perform pest scan using Gemini API with Google Search grounding
 */
async function performScan() {
    if (!selectedFile) {
        showStatus('প্রথমে একটি ছবি আপলোড করুন।', 'error');
        return;
    }

    // Update UI to loading state
    scanButton.disabled = true;
    scanButton.classList.add('loading');
    showStatus('🔍 ছবি বিশ্লেষণ করা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন...', 'loading');
    hideResults();

    try {
        // Convert image to base64
        const base64Image = await fileToBase64(selectedFile);
        const mimeType = selectedFile.type;

        // Create the prompt for Gemini
        const prompt = `তুমি একজন বাংলাদেশী কৃষি বিশেষজ্ঞ। এই ছবিটি বিশ্লেষণ করো এবং নিম্নলিখিত তথ্য দাও:

১. **পোকা/রোগ শনাক্তকরণ**: ছবিতে যদি কোনো পোকামাকড়, রোগ, বা ফসলের ক্ষতি দেখা যায় তাহলে সেটি শনাক্ত করো। যদি ফসল সুস্থ থাকে তাহলে সেটাও জানাও।

২. **ঝুঁকির স্তর**: ঝুঁকির স্তর নির্ধারণ করো - "উচ্চ" (High), "মাঝারি" (Medium), বা "নিম্ন" (Low)।

৩. **চিকিৎসা পরিকল্পনা**: বাংলাদেশের প্রেক্ষাপটে ব্যবহারযোগ্য স্থানীয় পদ্ধতি এবং সহজলভ্য উপকরণ ব্যবহার করে একটি বিস্তারিত চিকিৎসা পরিকল্পনা দাও। জৈব পদ্ধতি এবং রাসায়নিক উভয় বিকল্প দাও।

৪. **প্রতিরোধমূলক ব্যবস্থা**: ভবিষ্যতে এই সমস্যা এড়াতে কী করা উচিত।

সম্পূর্ণ উত্তর বাংলায় দাও। উত্তরটি JSON ফরম্যাটে দাও এই স্ট্রাকচার অনুসরণ করে:
{
    "pest_name": "পোকা/রোগের নাম",
    "pest_name_english": "English name if known",
    "description": "সংক্ষিপ্ত বর্ণনা",
    "risk_level": "উচ্চ/মাঝারি/নিম্ন",
    "treatment_plan": "বিস্তারিত চিকিৎসা পরিকল্পনা",
    "prevention": "প্রতিরোধমূলক ব্যবস্থা",
    "is_healthy": false
}

যদি ফসল সুস্থ থাকে, is_healthy true করো এবং pest_name এ "সুস্থ ফসল" লেখো।`;

        // Make API request to Gemini with Google Search grounding
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: prompt
                        },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Image
                            }
                        }
                    ]
                }],
                tools: [{
                    google_search: {}
                }],
                generationConfig: {
                    temperature: 0.4,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 4096
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[PestScan] API Error:', errorData);
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const data = await response.json();
        console.log('[PestScan] API Response:', data);

        // Extract the text response
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!textResponse) {
            throw new Error('No response from API');
        }

        // Extract grounding sources if available
        const groundingMetadata = data.candidates?.[0]?.groundingMetadata;
        const sources = [];
        
        if (groundingMetadata?.groundingChunks) {
            groundingMetadata.groundingChunks.forEach(chunk => {
                if (chunk.web?.uri) {
                    sources.push({
                        title: chunk.web.title || chunk.web.uri,
                        url: chunk.web.uri
                    });
                }
            });
        }

        // Parse the JSON response
        let parsedResult;
        try {
            // Try to extract JSON from the response
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedResult = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.warn('[PestScan] JSON parse error, using text response:', parseError);
            // Fallback: create a result from the text response
            parsedResult = {
                pest_name: 'বিশ্লেষণ সম্পন্ন',
                description: textResponse,
                risk_level: 'মাঝারি',
                treatment_plan: textResponse,
                prevention: '',
                is_healthy: false
            };
        }

        // Display results
        displayResults(parsedResult, sources);
        hideStatus();

    } catch (error) {
        console.error('[PestScan] Error:', error);
        showStatus('❌ ত্রুটি: ' + error.message, 'error');
    } finally {
        scanButton.disabled = false;
        scanButton.classList.remove('loading');
    }
}

/**
 * Get risk badge class based on risk level
 */
function getRiskBadgeClass(riskLevel) {
    const risk = (riskLevel || '').toLowerCase();
    if (risk.includes('উচ্চ') || risk.includes('high')) return 'high';
    if (risk.includes('মাঝারি') || risk.includes('medium')) return 'medium';
    return 'low';
}

/**
 * Get risk badge text
 */
function getRiskBadgeText(riskLevel) {
    const risk = (riskLevel || '').toLowerCase();
    if (risk.includes('উচ্চ') || risk.includes('high')) return '🔴 উচ্চ ঝুঁকি';
    if (risk.includes('মাঝারি') || risk.includes('medium')) return '🟡 মাঝারি ঝুঁকি';
    return '🟢 নিম্ন ঝুঁকি';
}

/**
 * Format treatment plan text to HTML
 */
function formatToHTML(text) {
    if (!text) return '';
    
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // Convert numbered lists
            if (/^\d+[\.\)]/.test(line)) {
                return `<li>${line.replace(/^\d+[\.\)]\s*/, '')}</li>`;
            }
            // Convert bullet points
            if (/^[-•*]/.test(line)) {
                return `<li>${line.replace(/^[-•*]\s*/, '')}</li>`;
            }
            // Bold text for headers (text ending with :)
            if (line.endsWith(':') || line.includes('**')) {
                return `<p><strong>${line.replace(/\*\*/g, '')}</strong></p>`;
            }
            return `<p>${line}</p>`;
        })
        .join('');
}

/**
 * Display scan results
 */
function displayResults(result, sources = []) {
    const isHealthy = result.is_healthy === true;
    const riskClass = isHealthy ? 'low' : getRiskBadgeClass(result.risk_level);
    const riskText = isHealthy ? '🟢 সুস্থ' : getRiskBadgeText(result.risk_level);
    const icon = isHealthy ? '✅' : '🐛';

    let html = `
        <div class="result-card">
            <div class="result-header">
                <span class="result-icon">${icon}</span>
                <div class="result-title">
                    <h3>শনাক্তকরণ ফলাফল</h3>
                    <p>AI বিশ্লেষণ সম্পন্ন</p>
                </div>
                <span class="risk-badge ${riskClass}">${riskText}</span>
            </div>
            
            <div class="pest-info">
                <div class="pest-name">${result.pest_name || 'অজানা'}</div>
                ${result.pest_name_english ? `<p style="color: var(--muted); font-size: 14px; margin-bottom: 8px;">(${result.pest_name_english})</p>` : ''}
                <p class="pest-description">${result.description || ''}</p>
            </div>
    `;

    // Treatment plan
    if (result.treatment_plan && !isHealthy) {
        html += `
            <div class="treatment-section">
                <h4>💊 চিকিৎসা পরিকল্পনা</h4>
                <div class="treatment-content">
                    ${formatToHTML(result.treatment_plan)}
                </div>
            </div>
        `;
    }

    // Prevention
    if (result.prevention) {
        html += `
            <div class="prevention-section">
                <h4>🛡️ প্রতিরোধমূলক ব্যবস্থা</h4>
                <div class="treatment-content">
                    ${formatToHTML(result.prevention)}
                </div>
            </div>
        `;
    }

    // Sources
    if (sources.length > 0) {
        html += `
            <div class="sources-section">
                <h5>📚 তথ্যসূত্র (Google Search)</h5>
                <ul class="sources-list">
                    ${sources.map(src => `<li><a href="${src.url}" target="_blank" rel="noopener">${src.title}</a></li>`).join('')}
                </ul>
            </div>
        `;
    }

    html += '</div>';

    resultsSection.innerHTML = html;
    resultsSection.classList.add('visible');

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initPestScan);
