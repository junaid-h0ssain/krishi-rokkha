// This file is processed by Vite so import.meta.env works
// It injects the API key into window before pest-scan.js loads
// window.VITE_GOOGLE_AI_API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;


export const GOOGLE_CONFIG = {
    apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY
};

export const SMART_AI_CONFIG = {
    apiUrl : import.meta.env.VITE_SMART_AI_API_URL,
    apiKey: import.meta.env.VITE_SMART_AI_API_KEY
};
