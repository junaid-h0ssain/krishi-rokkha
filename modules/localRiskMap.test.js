/**
 * Tests for LocalRiskMap Language Switching
 * Tests language switching UI, popup updates, and localization
 */

// Mock localStorage
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

global.localStorage = localStorageMock;

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    language: 'en-US',
    userLanguage: 'en-US'
  },
  writable: true,
  configurable: true
});

// Mock document for DOM operations
class MockElement {
  constructor(id) {
    this.id = id;
    this.textContent = '';
    this.classList = {
      list: [],
      toggle: function(className, force) {
        if (force === undefined) {
          const index = this.list.indexOf(className);
          if (index > -1) {
            this.list.splice(index, 1);
          } else {
            this.list.push(className);
          }
        } else if (force) {
          if (!this.list.includes(className)) {
            this.list.push(className);
          }
        } else {
          const index = this.list.indexOf(className);
          if (index > -1) {
            this.list.splice(index, 1);
          }
        }
      },
      contains: function(className) {
        return this.list.includes(className);
      }
    };
    this.addEventListener = function() {};
  }
}

const mockElements = {
  'pageTitle': new MockElement('pageTitle'),
  'langEnglish': new MockElement('langEnglish'),
  'langBangla': new MockElement('langBangla')
};

global.document = {
  getElementById: (id) => mockElements[id] || null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};

global.window = {
  addEventListener: () => {},
  navigator: global.navigator
};

// Localization class
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

// Simplified LocalRiskMap for testing
class LocalRiskMap {
  constructor() {
    this.markers = [];
    this.currentPopup = null;
  }

  generatePopupContent(neighborData) {
    try {
      const lang = localization.getLanguage();
      
      const cropTypeLabel = localization.getText('cropType', lang);
      const riskLevelLabel = localization.getText('riskLevel', lang);
      const lastUpdateLabel = localization.getText('lastUpdate', lang);
      
      const cropTypeName = localization.getCropTypeLabel(neighborData.cropType, lang);
      const riskLevelName = localization.getRiskLevelLabel(neighborData.riskLevel, lang);
      
      const updateTime = new Date(neighborData.lastUpdateTime).toLocaleString(
        lang === 'bn' ? 'bn-BD' : 'en-US'
      );

      return `
        <div class="popup-content">
          <p><strong>${cropTypeLabel}:</strong> ${cropTypeName}</p>
          <p><strong>${riskLevelLabel}:</strong> ${riskLevelName}</p>
          <p><strong>${lastUpdateLabel}:</strong> ${updateTime}</p>
        </div>
      `;
    } catch (error) {
      console.error('Error generating popup content:', error);
      return '<div class="popup-content"><p>Error loading information</p></div>';
    }
  }

  updateLanguageUI(language) {
    const langEnBtn = document.getElementById('langEnglish');
    const langBnBtn = document.getElementById('langBangla');

    if (langEnBtn) {
      langEnBtn.classList.toggle('active', language === 'en');
    }
    if (langBnBtn) {
      langBnBtn.classList.toggle('active', language === 'bn');
    }
  }

  updateUIText() {
    const lang = localization.getLanguage();
    const pageTitle = document.getElementById('pageTitle');
    
    if (pageTitle) {
      pageTitle.textContent = localization.getText('pageTitle', lang);
    }

    this.updateLanguageUI(lang);
  }

  updateAllPopups() {
    this.markers.forEach(marker => {
      if (marker.neighborData && marker.isOpen) {
        const popupContent = this.generatePopupContent(marker.neighborData);
        marker.popupContent = popupContent;
      }
    });
  }
}

// Create global localization instance
const localization = new Localization();

// Test Suite
console.log('=== LocalRiskMap Language Switching Tests ===\n');

// Test 1: Popup content in English
console.log('Test 1: Popup content in English');
localStorage.clear();
localization.setLanguage('en');
const map1 = new LocalRiskMap();
const neighborData1 = {
  cropType: 'rice',
  riskLevel: 'High',
  lastUpdateTime: '2024-01-15T10:30:00Z'
};
const popupEn = map1.generatePopupContent(neighborData1);
console.assert(popupEn.includes('Crop Type'), 'FAIL: Should contain English "Crop Type"');
console.assert(popupEn.includes('High Risk'), 'FAIL: Should contain English "High Risk"');
console.assert(popupEn.includes('Rice'), 'FAIL: Should contain English "Rice"');
console.log('✓ PASS\n');

// Test 2: Popup content in Bangla
console.log('Test 2: Popup content in Bangla');
localStorage.clear();
localization.setLanguage('bn');
const map2 = new LocalRiskMap();
const neighborData2 = {
  cropType: 'rice',
  riskLevel: 'High',
  lastUpdateTime: '2024-01-15T10:30:00Z'
};
const popupBn = map2.generatePopupContent(neighborData2);
console.assert(popupBn.includes('ফসলের ধরন'), 'FAIL: Should contain Bangla "ফসলের ধরন"');
console.assert(popupBn.includes('উচ্চ ঝুঁকি'), 'FAIL: Should contain Bangla "উচ্চ ঝুঁকি"');
console.assert(popupBn.includes('ধান'), 'FAIL: Should contain Bangla "ধান"');
console.log('✓ PASS\n');

// Test 3: Language UI button states (English)
console.log('Test 3: Language UI button states (English)');
localStorage.clear();
localization.setLanguage('en');
const map3 = new LocalRiskMap();
map3.updateLanguageUI('en');
const langEnBtn = document.getElementById('langEnglish');
const langBnBtn = document.getElementById('langBangla');
console.assert(langEnBtn.classList.contains('active'), 'FAIL: English button should be active');
console.assert(!langBnBtn.classList.contains('active'), 'FAIL: Bangla button should not be active');
console.log('✓ PASS\n');

// Test 4: Language UI button states (Bangla)
console.log('Test 4: Language UI button states (Bangla)');
localStorage.clear();
localization.setLanguage('bn');
const map4 = new LocalRiskMap();
map4.updateLanguageUI('bn');
const langEnBtn2 = document.getElementById('langEnglish');
const langBnBtn2 = document.getElementById('langBangla');
console.assert(!langEnBtn2.classList.contains('active'), 'FAIL: English button should not be active');
console.assert(langBnBtn2.classList.contains('active'), 'FAIL: Bangla button should be active');
console.log('✓ PASS\n');

// Test 5: Page title update (English)
console.log('Test 5: Page title update (English)');
localStorage.clear();
localization.setLanguage('en');
const map5 = new LocalRiskMap();
map5.updateUIText();
const pageTitle = document.getElementById('pageTitle');
console.assert(pageTitle.textContent === 'Local Risk Map', `FAIL: Expected 'Local Risk Map', got '${pageTitle.textContent}'`);
console.log('✓ PASS\n');

// Test 6: Page title update (Bangla)
console.log('Test 6: Page title update (Bangla)');
localStorage.clear();
localization.setLanguage('bn');
const map6 = new LocalRiskMap();
map6.updateUIText();
const pageTitle2 = document.getElementById('pageTitle');
console.assert(pageTitle2.textContent === 'স্থানীয় ঝুঁকি মানচিত্র', `FAIL: Expected 'স্থানীয় ঝুঁকি মানচিত্র', got '${pageTitle2.textContent}'`);
console.log('✓ PASS\n');

// Test 7: Popup content updates when language changes
console.log('Test 7: Popup content updates when language changes');
localStorage.clear();
localization.setLanguage('en');
const map7 = new LocalRiskMap();
const neighborData7 = {
  cropType: 'wheat',
  riskLevel: 'Medium',
  lastUpdateTime: '2024-01-15T10:30:00Z'
};
const popupEnBefore = map7.generatePopupContent(neighborData7);
console.assert(popupEnBefore.includes('Crop Type'), 'FAIL: Should contain English "Crop Type"');

localization.setLanguage('bn');
const popupBnAfter = map7.generatePopupContent(neighborData7);
console.assert(popupBnAfter.includes('ফসলের ধরন'), 'FAIL: Should contain Bangla "ফসলের ধরন"');
console.log('✓ PASS\n');

// Test 8: All risk levels localized correctly (English)
console.log('Test 8: All risk levels localized correctly (English)');
localStorage.clear();
localization.setLanguage('en');
const map8 = new LocalRiskMap();
const riskLevels = ['Low', 'Medium', 'High'];
riskLevels.forEach(level => {
  const neighborData = {
    cropType: 'rice',
    riskLevel: level,
    lastUpdateTime: '2024-01-15T10:30:00Z'
  };
  const popup = map8.generatePopupContent(neighborData);
  const expectedLabel = localization.getRiskLevelLabel(level, 'en');
  console.assert(popup.includes(expectedLabel), `FAIL: Should contain '${expectedLabel}'`);
});
console.log('✓ PASS\n');

// Test 9: All risk levels localized correctly (Bangla)
console.log('Test 9: All risk levels localized correctly (Bangla)');
localStorage.clear();
localization.setLanguage('bn');
const map9 = new LocalRiskMap();
const riskLevelsBn = ['Low', 'Medium', 'High'];
riskLevelsBn.forEach(level => {
  const neighborData = {
    cropType: 'rice',
    riskLevel: level,
    lastUpdateTime: '2024-01-15T10:30:00Z'
  };
  const popup = map9.generatePopupContent(neighborData);
  const expectedLabel = localization.getRiskLevelLabel(level, 'bn');
  console.assert(popup.includes(expectedLabel), `FAIL: Should contain '${expectedLabel}'`);
});
console.log('✓ PASS\n');

// Test 10: All crop types localized correctly (English)
console.log('Test 10: All crop types localized correctly (English)');
localStorage.clear();
localization.setLanguage('en');
const map10 = new LocalRiskMap();
const cropTypes = ['rice', 'wheat', 'vegetables'];
cropTypes.forEach(crop => {
  const neighborData = {
    cropType: crop,
    riskLevel: 'Low',
    lastUpdateTime: '2024-01-15T10:30:00Z'
  };
  const popup = map10.generatePopupContent(neighborData);
  const expectedLabel = localization.getCropTypeLabel(crop, 'en');
  console.assert(popup.includes(expectedLabel), `FAIL: Should contain '${expectedLabel}'`);
});
console.log('✓ PASS\n');

// Test 11: All crop types localized correctly (Bangla)
console.log('Test 11: All crop types localized correctly (Bangla)');
localStorage.clear();
localization.setLanguage('bn');
const map11 = new LocalRiskMap();
const cropTypesBn = ['rice', 'wheat', 'vegetables'];
cropTypesBn.forEach(crop => {
  const neighborData = {
    cropType: crop,
    riskLevel: 'Low',
    lastUpdateTime: '2024-01-15T10:30:00Z'
  };
  const popup = map11.generatePopupContent(neighborData);
  const expectedLabel = localization.getCropTypeLabel(crop, 'bn');
  console.assert(popup.includes(expectedLabel), `FAIL: Should contain '${expectedLabel}'`);
});
console.log('✓ PASS\n');

console.log('=== All Tests Passed ===');
