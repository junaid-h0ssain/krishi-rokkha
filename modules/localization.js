/**
 * Localization Module
 * Provides language-specific strings and translations for the Local Risk Map
 */

class Localization {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || 'en';
    this.translations = {
      en: {
        pageTitle: 'Local Risk Map',
        cropType: 'Crop Type',
        riskLevel: 'Risk Level',
        lastUpdate: 'Last Update',
        riskLevels: {
          Low: 'Low Risk',
          Medium: 'Medium Risk',
          High: 'High Risk'
        },
        cropTypes: {
          rice: 'Rice',
          wheat: 'Wheat',
          vegetables: 'Vegetables'
        }
      },
      bn: {
        pageTitle: 'স্থানীয় ঝুঁকি মানচিত্র',
        cropType: 'ফসলের ধরন',
        riskLevel: 'ঝুঁকির স্তর',
        lastUpdate: 'শেষ আপডেট',
        riskLevels: {
          Low: 'কম ঝুঁকি',
          Medium: 'মধ্যম ঝুঁকি',
          High: 'উচ্চ ঝুঁকি'
        },
        cropTypes: {
          rice: 'ধান',
          wheat: 'গম',
          vegetables: 'সবজি'
        }
      }
    };
  }

  /**
   * Get stored language preference from localStorage
   * @returns {string|null} Stored language code or null
   */
  getStoredLanguage() {
    return localStorage.getItem('preferredLanguage');
  }

  /**
   * Set language preference and store in localStorage
   * @param {string} language - Language code ('en' or 'bn')
   */
  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('preferredLanguage', language);
    }
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Get localized text for a given key
   * @param {string} key - Translation key
   * @param {string} language - Language code (optional, uses current language if not provided)
   * @returns {string} Localized text or key if not found
   */
  getText(key, language = null) {
    const lang = language || this.currentLanguage;
    const translations = this.translations[lang];

    if (!translations) {
      return key;
    }

    // Handle nested keys like "riskLevels.Low"
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return value || key;
  }

  /**
   * Get localized risk level label
   * @param {string} riskLevel - Risk level ('Low', 'Medium', 'High')
   * @param {string} language - Language code (optional)
   * @returns {string} Localized risk level label
   */
  getRiskLevelLabel(riskLevel, language = null) {
    return this.getText(`riskLevels.${riskLevel}`, language);
  }

  /**
   * Get localized crop type label
   * @param {string} cropType - Crop type key
   * @param {string} language - Language code (optional)
   * @returns {string} Localized crop type name
   */
  getCropTypeLabel(cropType, language = null) {
    return this.getText(`cropTypes.${cropType}`, language);
  }
}

// Create global instance
const localization = new Localization();
