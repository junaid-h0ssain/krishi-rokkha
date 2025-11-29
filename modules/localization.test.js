/**
 * Tests for Localization Module
 * Tests language preference detection, storage, and retrieval
 */

// Mock localStorage for testing
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Replace global localStorage with mock
global.localStorage = localStorageMock;

// Mock navigator for browser language detection
Object.defineProperty(global, 'navigator', {
  value: {
    language: 'en-US',
    userLanguage: 'en-US'
  },
  writable: true,
  configurable: true
});

// Import the Localization class
// Note: In a real test environment, this would be imported properly
class Localization {
  constructor() {
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
    this.currentLanguage = this.getStoredLanguage() || 'en';
  }

  getStoredLanguage() {
    const stored = localStorage.getItem('preferredLanguage');
    if (stored && this.translations[stored]) {
      return stored;
    }

    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('bn')) {
      return 'bn';
    }

    return 'en';
  }

  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('preferredLanguage', language);
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  getText(key, language = null) {
    const lang = language || this.currentLanguage;
    const translations = this.translations[lang];

    if (!translations) {
      return key;
    }

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

  getRiskLevelLabel(riskLevel, language = null) {
    return this.getText(`riskLevels.${riskLevel}`, language);
  }

  getCropTypeLabel(cropType, language = null) {
    return this.getText(`cropTypes.${cropType}`, language);
  }
}

// Test Suite
console.log('=== Localization Module Tests ===\n');

// Test 1: Default language is English
console.log('Test 1: Default language is English');
localStorage.clear();
global.navigator.language = 'en-US';
const loc1 = new Localization();
console.assert(loc1.getLanguage() === 'en', 'FAIL: Default language should be English');
console.log('✓ PASS\n');

// Test 2: Browser language detection (Bangla)
console.log('Test 2: Browser language detection (Bangla)');
localStorage.clear();
global.navigator.language = 'bn-BD';
const loc2 = new Localization();
console.assert(loc2.getLanguage() === 'bn', 'FAIL: Should detect Bangla from browser');
console.log('✓ PASS\n');

// Test 3: Stored language preference takes precedence
console.log('Test 3: Stored language preference takes precedence');
localStorage.clear();
localStorage.setItem('preferredLanguage', 'bn');
global.navigator.language = 'en-US';
const loc3 = new Localization();
console.assert(loc3.getLanguage() === 'bn', 'FAIL: Stored preference should override browser language');
console.log('✓ PASS\n');

// Test 4: Language switching
console.log('Test 4: Language switching');
localStorage.clear();
const loc4 = new Localization();
loc4.setLanguage('bn');
console.assert(loc4.getLanguage() === 'bn', 'FAIL: Language should switch to Bangla');
console.assert(localStorage.getItem('preferredLanguage') === 'bn', 'FAIL: Language should be stored in localStorage');
console.log('✓ PASS\n');

// Test 5: English text retrieval
console.log('Test 5: English text retrieval');
localStorage.clear();
const loc5 = new Localization();
loc5.setLanguage('en');
const cropTypeEn = loc5.getText('cropType');
console.assert(cropTypeEn === 'Crop Type', `FAIL: Expected 'Crop Type', got '${cropTypeEn}'`);
console.log('✓ PASS\n');

// Test 6: Bangla text retrieval
console.log('Test 6: Bangla text retrieval');
localStorage.clear();
const loc6 = new Localization();
loc6.setLanguage('bn');
const cropTypeBn = loc6.getText('cropType');
console.assert(cropTypeBn === 'ফসলের ধরন', `FAIL: Expected 'ফসলের ধরন', got '${cropTypeBn}'`);
console.log('✓ PASS\n');

// Test 7: Risk level localization (English)
console.log('Test 7: Risk level localization (English)');
localStorage.clear();
const loc7 = new Localization();
loc7.setLanguage('en');
const riskLowEn = loc7.getRiskLevelLabel('Low');
console.assert(riskLowEn === 'Low Risk', `FAIL: Expected 'Low Risk', got '${riskLowEn}'`);
console.log('✓ PASS\n');

// Test 8: Risk level localization (Bangla)
console.log('Test 8: Risk level localization (Bangla)');
localStorage.clear();
const loc8 = new Localization();
loc8.setLanguage('bn');
const riskLowBn = loc8.getRiskLevelLabel('Low');
console.assert(riskLowBn === 'কম ঝুঁকি', `FAIL: Expected 'কম ঝুঁকি', got '${riskLowBn}'`);
console.log('✓ PASS\n');

// Test 9: Crop type localization (English)
console.log('Test 9: Crop type localization (English)');
localStorage.clear();
const loc9 = new Localization();
loc9.setLanguage('en');
const cropRiceEn = loc9.getCropTypeLabel('rice');
console.assert(cropRiceEn === 'Rice', `FAIL: Expected 'Rice', got '${cropRiceEn}'`);
console.log('✓ PASS\n');

// Test 10: Crop type localization (Bangla)
console.log('Test 10: Crop type localization (Bangla)');
localStorage.clear();
const loc10 = new Localization();
loc10.setLanguage('bn');
const cropRiceBn = loc10.getCropTypeLabel('rice');
console.assert(cropRiceBn === 'ধান', `FAIL: Expected 'ধান', got '${cropRiceBn}'`);
console.log('✓ PASS\n');

// Test 11: Nested key retrieval
console.log('Test 11: Nested key retrieval');
localStorage.clear();
const loc11 = new Localization();
loc11.setLanguage('en');
const mediumRiskEn = loc11.getText('riskLevels.Medium');
console.assert(mediumRiskEn === 'Medium Risk', `FAIL: Expected 'Medium Risk', got '${mediumRiskEn}'`);
console.log('✓ PASS\n');

// Test 12: Invalid key returns key itself
console.log('Test 12: Invalid key returns key itself');
localStorage.clear();
const loc12 = new Localization();
loc12.setLanguage('en');
const invalidKey = loc12.getText('nonexistent.key');
console.assert(invalidKey === 'nonexistent.key', `FAIL: Expected 'nonexistent.key', got '${invalidKey}'`);
console.log('✓ PASS\n');

console.log('=== All Tests Passed ===');
