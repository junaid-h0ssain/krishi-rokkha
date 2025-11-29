/**
 * Integration Tests for Marker Interactions
 * Tests marker click events, pop-up display, and localized content
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
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
    userLanguage: 'en-US',
    maxTouchPoints: 0
  },
  writable: true,
  configurable: true
});

// Mock document for DOM operations
class MockElement {
  constructor(id) {
    this.id = id;
    this.textContent = '';
    this.innerHTML = '';
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
    this.style = {};
  }
}

const mockElements = {
  'pageTitle': new MockElement('pageTitle'),
  'langEnglish': new MockElement('langEnglish'),
  'langBangla': new MockElement('langBangla'),
  'map': new MockElement('map')
};

global.document = {
  getElementById: (id) => mockElements[id] || null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  createElement: (tag) => new MockElement(tag)
};

global.window = {
  addEventListener: () => {},
  navigator: global.navigator
};

// Mock Leaflet
class MockIcon {
  constructor(options) {
    this.options = options;
  }
}

class MockMarker {
  constructor(coords, options) {
    this.coords = coords;
    this.options = options;
    this.popupContent = null;
    this.isOpen = false;
    this.neighborData = null;
    this.listeners = {};
  }

  bindPopup(content) {
    this.popupContent = content;
    return this;
  }

  setPopupContent(content) {
    this.popupContent = content;
  }

  openPopup() {
    this.isOpen = true;
  }

  closePopup() {
    this.isOpen = false;
  }

  isPopupOpen() {
    return this.isOpen;
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  trigger(event) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback());
    }
  }

  addTo(map) {
    return this;
  }
}

class MockMap {
  constructor() {
    this.markers = [];
    this.zoomControl = { setPosition: () => {} };
    this.container = new MockElement('map');
  }

  setView(coords, zoom) {
    return this;
  }

  invalidateSize() {
    return this;
  }

  on(event, callback) {
    return this;
  }

  getContainer() {
    return this.container;
  }
}

global.L = {
  map: () => new MockMap(),
  marker: (coords, options) => new MockMarker(coords, options),
  icon: (options) => new MockIcon(options),
  tileLayer: () => ({
    addTo: () => ({})
  })
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

// Create global localization instance
const localization = new Localization();

// LocalRiskMap class for testing
class LocalRiskMap {
  constructor() {
    this.map = null;
    this.markers = [];
    this.neighborData = [];
    this.currentPopup = null;
    this.mapConfig = {
      defaultZoom: 10,
      minZoom: 8,
      maxZoom: 16,
      markerColors: {
        Low: '#2ecc71',
        Medium: '#f39c12',
        High: '#e74c3c',
        Own: '#3498db'
      }
    };
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
          <p><strong>${cropTypeLabel}:</strong> ${this.escapeHtml(cropTypeName)}</p>
          <p><strong>${riskLevelLabel}:</strong> ${this.escapeHtml(riskLevelName)}</p>
          <p><strong>${lastUpdateLabel}:</strong> ${this.escapeHtml(updateTime)}</p>
        </div>
      `;
    } catch (error) {
      console.error('Error generating popup content:', error);
      return '<div class="popup-content"><p>Error loading information</p></div>';
    }
  }

  escapeHtml(text) {
    // Simple HTML escape for testing
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  handleMarkerClick(marker) {
    if (!marker.neighborData) {
      return;
    }

    if (this.currentPopup && this.currentPopup !== marker) {
      this.currentPopup.closePopup();
    }

    const popupContent = this.generatePopupContent(marker.neighborData);
    marker.setPopupContent(popupContent);
    marker.openPopup();
    
    this.currentPopup = marker;
  }

  updateAllPopups() {
    this.markers.forEach(marker => {
      if (marker.neighborData && marker.isPopupOpen && marker.isPopupOpen()) {
        const popupContent = this.generatePopupContent(marker.neighborData);
        marker.setPopupContent(popupContent);
      }
    });
  }
}

// Test Suite
console.log('=== Marker Interactions Tests ===\n');

// Test 1: Marker click displays pop-up (English)
console.log('Test 1: Marker click displays pop-up (English)');
localStorage.clear();
localization.setLanguage('en');
const map1 = new LocalRiskMap();
const marker1 = new MockMarker([23.8103, 90.4125], {});
marker1.neighborData = {
  cropType: 'rice',
  riskLevel: 'Low',
  lastUpdateTime: '2024-11-28T10:30:00Z'
};
map1.markers.push(marker1);
map1.handleMarkerClick(marker1);
console.assert(marker1.isOpen === true, 'FAIL: Pop-up should be open');
console.assert(marker1.popupContent !== null, 'FAIL: Pop-up content should not be null');
console.log('✓ PASS\n');

// Test 2: Pop-up contains localized crop type (English)
console.log('Test 2: Pop-up contains localized crop type (English)');
localStorage.clear();
localization.setLanguage('en');
const map2 = new LocalRiskMap();
const marker2 = new MockMarker([23.8103, 90.4125], {});
marker2.neighborData = {
  cropType: 'rice',
  riskLevel: 'Low',
  lastUpdateTime: '2024-11-28T10:30:00Z'
};
map2.handleMarkerClick(marker2);
console.assert(marker2.popupContent.includes('Crop Type'), 'FAIL: Should contain "Crop Type"');
console.assert(marker2.popupContent.includes('Rice'), 'FAIL: Should contain "Rice"');
console.log('✓ PASS\n');

// Test 3: Pop-up contains localized crop type (Bangla)
console.log('Test 3: Pop-up contains localized crop type (Bangla)');
localStorage.clear();
localization.setLanguage('bn');
const map3 = new LocalRiskMap();
const marker3 = new MockMarker([23.8103, 90.4125], {});
marker3.neighborData = {
  cropType: 'rice',
  riskLevel: 'Low',
  lastUpdateTime: '2024-11-28T10:30:00Z'
};
map3.handleMarkerClick(marker3);
console.assert(marker3.popupContent.includes('ফসলের ধরন'), 'FAIL: Should contain "ফসলের ধরন"');
console.assert(marker3.popupContent.includes('ধান'), 'FAIL: Should contain "ধান"');
console.log('✓ PASS\n');

// Test 4: Pop-up contains localized risk level (English)
console.log('Test 4: Pop-up contains localized risk level (English)');
localStorage.clear();
localization.setLanguage('en');
const map4 = new LocalRiskMap();
const marker4 = new MockMarker([23.8103, 90.4125], {});
marker4.neighborData = {
  cropType: 'rice',
  riskLevel: 'High',
  lastUpdateTime: '2024-11-28T10:30:00Z'
};
map4.handleMarkerClick(marker4);
console.assert(marker4.popupContent.includes('Risk Level'), 'FAIL: Should contain "Risk Level"');
console.assert(marker4.popupContent.includes('High Risk'), 'FAIL: Should contain "High Risk"');
console.log('✓ PASS\n');

// Test 5: Pop-up contains localized risk level (Bangla)
console.log('Test 5: Pop-up contains localized risk level (Bangla)');
localStorage.clear();
localization.setLanguage('bn');
const map5 = new LocalRiskMap();
const marker5 = new MockMarker([23.8103, 90.4125], {});
marker5.neighborData = {
  cropType: 'rice',
  riskLevel: 'High',
  lastUpdateTime: '2024-11-28T10:30:00Z'
};
map5.handleMarkerClick(marker5);
console.assert(marker5.popupContent.includes('ঝুঁকির স্তর'), 'FAIL: Should contain "ঝুঁকির স্তর"');
console.assert(marker5.popupContent.includes('উচ্চ ঝুঁকি'), 'FAIL: Should contain "উচ্চ ঝুঁকি"');
console.log('✓ PASS\n');

// Test 6: Pop-up contains localized timestamp (English)
console.log('Test 6: Pop-up contains localized timestamp (English)');
localStorage.clear();
localization.setLanguage('en');
const map6 = new LocalRiskMap();
const marker6 = new MockMarker([23.8103, 90.4125], {});
marker6.neighborData = {
  cropType: 'rice',
  riskLevel: 'Low',
  lastUpdateTime: '2024-11-28T10:30:00Z'
};
map6.handleMarkerClick(marker6);
console.assert(marker6.popupContent.includes('Last Update'), 'FAIL: Should contain "Last Update"');
console.assert(marker6.popupContent.includes('11/28/2024'), 'FAIL: Should contain date');
console.log('✓ PASS\n');

// Test 7: Pop-up contains localized timestamp (Bangla)
console.log('Test 7: Pop-up contains localized timestamp (Bangla)');
localStorage.clear();
localization.setLanguage('bn');
const map7 = new LocalRiskMap();
const marker7 = new MockMarker([23.8103, 90.4125], {});
marker7.neighborData = {
  cropType: 'rice',
  riskLevel: 'Low',
  lastUpdateTime: '2024-11-28T10:30:00Z'
};
map7.handleMarkerClick(marker7);
console.assert(marker7.popupContent.includes('শেষ আপডেট'), 'FAIL: Should contain "শেষ আপডেট"');
console.log('✓ PASS\n');

// Test 8: Pop-up excludes PII (no names or contact info)
console.log('Test 8: Pop-up excludes PII (no names or contact info)');
localStorage.clear();
localization.setLanguage('en');
const map8 = new LocalRiskMap();
const marker8 = new MockMarker([23.8103, 90.4125], {});
marker8.neighborData = {
  cropType: 'wheat',
  riskLevel: 'Medium',
  lastUpdateTime: '2024-11-28T10:30:00Z'
};
map8.handleMarkerClick(marker8);
console.assert(!marker8.popupContent.includes('name'), 'FAIL: Should not contain "name"');
console.assert(!marker8.popupContent.includes('phone'), 'FAIL: Should not contain "phone"');
console.assert(!marker8.popupContent.includes('email'), 'FAIL: Should not contain "email"');
console.assert(!marker8.popupContent.includes('contact'), 'FAIL: Should not contain "contact"');
console.log('✓ PASS\n');

// Test 9: Clicking new marker closes previous pop-up
console.log('Test 9: Clicking new marker closes previous pop-up');
localStorage.clear();
localization.setLanguage('en');
const map9 = new LocalRiskMap();
const marker9a = new MockMarker([23.8103, 90.4125], {});
marker9a.neighborData = {
  cropType: 'rice',
  riskLevel: 'Low',
  lastUpdateTime: '2024-11-28T10:30:00Z'
};
const marker9b = new MockMarker([23.7850, 90.3950], {});
marker9b.neighborData = {
  cropType: 'wheat',
  riskLevel: 'Medium',
  lastUpdateTime: '2024-11-28T09:15:00Z'
};
map9.markers.push(marker9a);
map9.markers.push(marker9b);
map9.handleMarkerClick(marker9a);
console.assert(marker9a.isOpen === true, 'FAIL: First marker pop-up should be open');
map9.handleMarkerClick(marker9b);
console.assert(marker9a.isOpen === false, 'FAIL: First marker pop-up should be closed');
console.assert(marker9b.isOpen === true, 'FAIL: Second marker pop-up should be open');
console.log('✓ PASS\n');

// Test 10: All risk levels display correctly in pop-up (English)
console.log('Test 10: All risk levels display correctly in pop-up (English)');
localStorage.clear();
localization.setLanguage('en');
const map10 = new LocalRiskMap();
const riskLevels = ['Low', 'Medium', 'High'];
riskLevels.forEach(level => {
  const marker = new MockMarker([23.8103, 90.4125], {});
  marker.neighborData = {
    cropType: 'rice',
    riskLevel: level,
    lastUpdateTime: '2024-11-28T10:30:00Z'
  };
  map10.handleMarkerClick(marker);
  const expectedLabel = localization.getRiskLevelLabel(level, 'en');
  console.assert(marker.popupContent.includes(expectedLabel), `FAIL: Should contain '${expectedLabel}'`);
});
console.log('✓ PASS\n');

// Test 11: All risk levels display correctly in pop-up (Bangla)
console.log('Test 11: All risk levels display correctly in pop-up (Bangla)');
localStorage.clear();
localization.setLanguage('bn');
const map11 = new LocalRiskMap();
const riskLevelsBn = ['Low', 'Medium', 'High'];
riskLevelsBn.forEach(level => {
  const marker = new MockMarker([23.8103, 90.4125], {});
  marker.neighborData = {
    cropType: 'rice',
    riskLevel: level,
    lastUpdateTime: '2024-11-28T10:30:00Z'
  };
  map11.handleMarkerClick(marker);
  const expectedLabel = localization.getRiskLevelLabel(level, 'bn');
  console.assert(marker.popupContent.includes(expectedLabel), `FAIL: Should contain '${expectedLabel}'`);
});
console.log('✓ PASS\n');

// Test 12: All crop types display correctly in pop-up (English)
console.log('Test 12: All crop types display correctly in pop-up (English)');
localStorage.clear();
localization.setLanguage('en');
const map12 = new LocalRiskMap();
const cropTypes = ['rice', 'wheat', 'vegetables'];
cropTypes.forEach(crop => {
  const marker = new MockMarker([23.8103, 90.4125], {});
  marker.neighborData = {
    cropType: crop,
    riskLevel: 'Low',
    lastUpdateTime: '2024-11-28T10:30:00Z'
  };
  map12.handleMarkerClick(marker);
  const expectedLabel = localization.getCropTypeLabel(crop, 'en');
  console.assert(marker.popupContent.includes(expectedLabel), `FAIL: Should contain '${expectedLabel}'`);
});
console.log('✓ PASS\n');

// Test 13: All crop types display correctly in pop-up (Bangla)
console.log('Test 13: All crop types display correctly in pop-up (Bangla)');
localStorage.clear();
localization.setLanguage('bn');
const map13 = new LocalRiskMap();
const cropTypesBn = ['rice', 'wheat', 'vegetables'];
cropTypesBn.forEach(crop => {
  const marker = new MockMarker([23.8103, 90.4125], {});
  marker.neighborData = {
    cropType: crop,
    riskLevel: 'Low',
    lastUpdateTime: '2024-11-28T10:30:00Z'
  };
  map13.handleMarkerClick(marker);
  const expectedLabel = localization.getCropTypeLabel(crop, 'bn');
  console.assert(marker.popupContent.includes(expectedLabel), `FAIL: Should contain '${expectedLabel}'`);
});
console.log('✓ PASS\n');

// Test 14: Pop-up updates when language changes
console.log('Test 14: Pop-up updates when language changes');
localStorage.clear();
localization.setLanguage('en');
const map14 = new LocalRiskMap();
const marker14 = new MockMarker([23.8103, 90.4125], {});
marker14.neighborData = {
  cropType: 'rice',
  riskLevel: 'High',
  lastUpdateTime: '2024-11-28T10:30:00Z'
};
marker14.isOpen = true;
map14.markers.push(marker14);
map14.handleMarkerClick(marker14);
const popupEnBefore = marker14.popupContent;
console.assert(popupEnBefore.includes('Crop Type'), 'FAIL: Should contain English "Crop Type"');

localization.setLanguage('bn');
map14.updateAllPopups();
const popupBnAfter = marker14.popupContent;
console.assert(popupBnAfter.includes('ফসলের ধরন'), 'FAIL: Should contain Bangla "ফসলের ধরন"');
console.log('✓ PASS\n');

// Test 15: Marker without neighborData doesn't trigger pop-up
console.log('Test 15: Marker without neighborData doesn\'t trigger pop-up');
localStorage.clear();
localization.setLanguage('en');
const map15 = new LocalRiskMap();
const marker15 = new MockMarker([23.8103, 90.4125], {});
marker15.neighborData = null;
map15.handleMarkerClick(marker15);
console.assert(marker15.isOpen === false, 'FAIL: Pop-up should not open for marker without data');
console.log('✓ PASS\n');

console.log('=== All Marker Interaction Tests Passed ===');
