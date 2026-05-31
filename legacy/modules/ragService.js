/**
 * RAG Service Module
 * Handles communication with the RAG backend for pest/disease identification
 */

const RAG_API_URL = import.meta.env.VITE_RAG_API_URL || 'http://localhost:3001/api/identify';

/**
 * Identifies pest/disease from an image file using RAG backend
 * @param {File} imageFile - The image file to analyze
 * @param {Object} options - Optional parameters
 * @param {string} options.division - Division/region name
 * @param {string} options.district - District name
 * @param {string} options.language - Language preference ('bn' or 'en')
 * @returns {Promise<Object>} - Identification result with treatment plan
 */
export async function identifyPestWithRAG(imageFile, options = {}) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        if (options.division) formData.append('division', options.division);
        if (options.district) formData.append('district', options.district);
        if (options.language) formData.append('language', options.language);

        console.log('[RAG Service] Sending image to RAG API:', RAG_API_URL);

        const response = await fetch(RAG_API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[RAG Service] Received response:', data);

        return {
            success: true,
            pest: data.pest,
            risk: data.risk,
            confidence: data.confidence,
            treatmentPlan: data.plan_bangla,
            prevention: data.prevention,
            sources: data.sources || []
        };

    } catch (error) {
        console.error('[RAG Service] Error:', error);
        return {
            success: false,
            error: error.message,
            pest: 'Error',
            risk: 'Unknown',
            confidence: '0',
            treatmentPlan: 'দুঃখিত, বর্তমানে সেবাটি উপলব্ধ নেই। পরে আবার চেষ্টা করুন।',
            prevention: '',
            sources: []
        };
    }
}

/**
 * Check if RAG service is available
 * @returns {Promise<boolean>}
 */
export async function checkRAGServiceHealth() {
    try {
        const healthUrl = RAG_API_URL.replace('/api/identify', '/health');
        const response = await fetch(healthUrl, { method: 'GET' });
        return response.ok;
    } catch (error) {
        console.warn('[RAG Service] Health check failed:', error.message);
        return false;
    }
}

/**
 * Get risk level color for UI display
 * @param {string} risk - Risk level (High/Medium/Low/None)
 * @returns {string} - CSS color value
 */
export function getRiskColor(risk) {
    const riskLower = (risk || '').toLowerCase();

    if (riskLower.includes('high') || riskLower.includes('উচ্চ')) {
        return '#d32f2f'; // Red
    } else if (riskLower.includes('medium') || riskLower.includes('মাঝারি')) {
        return '#f57c00'; // Orange
    } else if (riskLower.includes('low') || riskLower.includes('নিম্ন')) {
        return '#fbc02d'; // Yellow
    } else {
        return '#2e7d32'; // Green (None/Healthy)
    }
}

/**
 * Format treatment plan for display
 * @param {string} plan - Raw treatment plan text
 * @returns {string} - Formatted HTML
 */
export function formatTreatmentPlan(plan) {
    if (!plan) return '';

    // Convert newlines to <br> and preserve formatting
    return plan
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            // Bold headers (lines ending with :)
            if (line.endsWith(':')) {
                return `<strong>${line}</strong>`;
            }
            // List items (lines starting with - or •)
            if (line.startsWith('-') || line.startsWith('•')) {
                return `&nbsp;&nbsp;${line}`;
            }
            return line;
        })
        .join('<br>');
}
