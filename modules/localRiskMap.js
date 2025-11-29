/**
 * Local Risk Map Module
 * Manages the interactive map display with risk-based markers and localization
 */

class LocalRiskMap {
  constructor() {
    this.map = null;
    this.markers = [];
    this.neighborData = [];
    this.farmerLocation = { latitude: 23.8103, longitude: 90.4125 }; // Default Dhaka center
    this.currentPopup = null;
    
    this.mapConfig = {
      defaultZoom: 10,
      minZoom: 8,
      maxZoom: 16,
      markerColors: {
        Low: '#2ecc71',      // Green
        Medium: '#f39c12',   // Yellow
        High: '#e74c3c',     // Red
        Own: '#3498db'       // Blue
      },
      tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    };
  }

  /**
   * Initialize the map and load data
   */
  async initialize() {
    try {
      // Initialize map
      this.initializeMap(this.farmerLocation, this.mapConfig.defaultZoom);
      
      // Load mock data
      await this.loadMockData();
      
      // Add farmer marker
      this.addFarmerMarker();
      
      // Add neighbor markers
      this.addNeighborMarkers();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Set up language switcher
      this.setupLanguageSwitcher();
      
      // Update UI text
      this.updateUIText();
    } catch (error) {
      console.error('Error initializing Local Risk Map:', error);
    }
  }

  /**
   * Initialize Leaflet map with OpenStreetMap tiles
   * Sets default center to Bangladesh (23.6850° N, 90.3563° E)
   * Sets zoom level to 10
   * Configures pan/zoom controls and touch support
   * @param {Object} center - Center coordinates {latitude, longitude}
   * @param {number} zoom - Initial zoom level
   */
  initializeMap(center, zoom) {
    // Initialize map with center coordinates and zoom level
    // Enable default controls (zoom, attribution)
    this.map = L.map('map', {
      zoomControl: true,
      attributionControl: true,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      tap: true
    }).setView(
      [center.latitude, center.longitude],
      zoom
    );

    // Add OpenStreetMap tile layer
    L.tileLayer(this.mapConfig.tileLayer, {
      attribution: '© OpenStreetMap contributors',
      minZoom: this.mapConfig.minZoom,
      maxZoom: this.mapConfig.maxZoom
    }).addTo(this.map);

    // Configure zoom control position and behavior
    this.map.zoomControl.setPosition('bottomright');

    // Handle window resize to keep map responsive
    window.addEventListener('resize', () => {
      if (this.map) {
        this.map.invalidateSize();
      }
    });

    // Set up touch-friendly controls
    this.setupTouchControls();
  }

  /**
   * Load mock neighbor data from JSON file
   */
  async loadMockData() {
    try {
      const response = await fetch('data/mock-neighbors.json');
      if (!response.ok) {
        throw new Error(`Failed to load mock data: ${response.statusText}`);
      }
      const data = await response.json();
      this.neighborData = this.validateData(data);
    } catch (error) {
      console.error('Error loading mock data:', error);
      this.neighborData = [];
    }
  }

  /**
   * Validate neighbor data
   * @param {Array} data - Raw data array
   * @returns {Array} Validated data array
   */
  validateData(data) {
    if (!Array.isArray(data)) {
      console.warn('Data is not an array');
      return [];
    }

    return data.filter(item => {
      // Check required fields
      if (!item.coordinates || 
          typeof item.coordinates.latitude !== 'number' ||
          typeof item.coordinates.longitude !== 'number') {
        console.warn('Invalid coordinates in data item:', item);
        return false;
      }

      if (!['Low', 'Medium', 'High'].includes(item.riskLevel)) {
        console.warn('Invalid risk level in data item:', item);
        return false;
      }

      if (!item.cropType) {
        console.warn('Missing crop type in data item:', item);
        return false;
      }

      return true;
    });
  }

  /**
   * Add farmer's own location marker with distinct blue styling
   * Uses a distinct icon/styling to differentiate from neighbor markers
   */
  addFarmerMarker() {
    // Create blue marker icon for farmer's location
    const farmerIcon = this.createIcon(this.mapConfig.markerColors.Own);
    
    // Add marker at farmer's location
    const marker = L.marker(
      [this.farmerLocation.latitude, this.farmerLocation.longitude],
      { icon: farmerIcon }
    ).addTo(this.map);

    // Bind popup to farmer marker
    marker.bindPopup('Your Location');
    
    // Store marker reference
    this.markers.push(marker);
  }

  /**
   * Add neighbor markers to the map
   */
  addNeighborMarkers() {
    this.neighborData.forEach(neighbor => {
      try {
        const color = this.mapConfig.markerColors[neighbor.riskLevel];
        const icon = this.createIcon(color);
        
        const marker = L.marker(
          [neighbor.coordinates.latitude, neighbor.coordinates.longitude],
          { icon: icon }
        ).addTo(this.map);

        // Store neighbor data on marker for popup
        marker.neighborData = neighbor;

        // Add click event listener
        marker.on('click', () => this.handleMarkerClick(marker));

        this.markers.push(marker);
      } catch (error) {
        console.warn('Error adding marker for neighbor:', neighbor, error);
      }
    });
  }

  /**
   * Create a custom icon with specified color
   * @param {string} color - Hex color code
   * @returns {L.Icon} Leaflet icon
   */
  createIcon(color) {
    return L.icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="${color}"/>
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }

  /**
   * Handle marker click event
   * Displays pop-up on marker click and closes any previously open pop-up
   * @param {L.Marker} marker - Clicked marker
   */
  handleMarkerClick(marker) {
    if (!marker.neighborData) {
      return;
    }

    // Close previous pop-up if one is open
    if (this.currentPopup && this.currentPopup !== marker) {
      this.currentPopup.closePopup();
    }

    // Generate and display pop-up content
    const popupContent = this.generatePopupContent(marker.neighborData);
    marker.setPopupContent(popupContent);
    marker.openPopup();
    
    // Track current open pop-up
    this.currentPopup = marker;
  }

  /**
   * Generate localized popup content
   * Creates HTML template with crop type, risk level, and last update time
   * Excludes any personally identifiable information
   * @param {Object} neighborData - Neighbor data object with coordinates, riskLevel, cropType, lastUpdateTime
   * @returns {string} HTML popup content
   */
  generatePopupContent(neighborData) {
    try {
      const lang = localization.getLanguage();
      
      // Get localized labels
      const cropTypeLabel = localization.getText('cropType', lang);
      const riskLevelLabel = localization.getText('riskLevel', lang);
      const lastUpdateLabel = localization.getText('lastUpdate', lang);
      
      // Get localized values
      const cropTypeName = localization.getCropTypeLabel(neighborData.cropType, lang);
      const riskLevelName = localization.getRiskLevelLabel(neighborData.riskLevel, lang);
      
      // Format timestamp in appropriate locale
      const updateTime = new Date(neighborData.lastUpdateTime).toLocaleString(
        lang === 'bn' ? 'bn-BD' : 'en-US'
      );

      // Create HTML template - no PII included
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

  /**
   * Escape HTML special characters to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Set up touch-friendly controls for mobile devices
   * Ensures controls are appropriately sized and responsive to touch events
   */
  setupTouchControls() {
    if (!this.map) return;

    // Detect if device supports touch
    const isTouchDevice = () => {
      return (('ontouchstart' in window) ||
              (navigator.maxTouchPoints > 0) ||
              (navigator.msMaxTouchPoints > 0));
    };

    // Add touch event listeners for better mobile support
    if (isTouchDevice()) {
      // Prevent default touch behaviors that might interfere with map
      this.map.getContainer().addEventListener('touchmove', (e) => {
        // Allow Leaflet to handle touch moves
      }, { passive: true });

      // Ensure zoom controls are touch-friendly
      const zoomControls = document.querySelectorAll('.leaflet-control-zoom-in, .leaflet-control-zoom-out');
      zoomControls.forEach(control => {
        // Ensure minimum touch target size (44x44px per WCAG guidelines)
        control.style.minWidth = '44px';
        control.style.minHeight = '44px';
        control.style.lineHeight = '44px';
      });
    }
  }

  /**
   * Set up event listeners for map interactions
   */
  setupEventListeners() {
    // Touch support for mobile
    if (this.map) {
      this.map.on('touchstart', () => {
        // Touch events are handled by Leaflet by default
      });
    }
  }

  /**
   * Set up language switcher buttons
   */
  setupLanguageSwitcher() {
    const langEnBtn = document.getElementById('langEnglish');
    const langBnBtn = document.getElementById('langBangla');

    if (langEnBtn) {
      langEnBtn.addEventListener('click', () => {
        localization.setLanguage('en');
        this.updateLanguageUI('en');
        this.updateAllPopups();
      });
    }

    if (langBnBtn) {
      langBnBtn.addEventListener('click', () => {
        localization.setLanguage('bn');
        this.updateLanguageUI('bn');
        this.updateAllPopups();
      });
    }
  }

  /**
   * Update language UI (button states)
   * @param {string} language - Language code
   */
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

  /**
   * Update all popup content when language changes
   */
  updateAllPopups() {
    this.markers.forEach(marker => {
      if (marker.neighborData && marker.isPopupOpen && marker.isPopupOpen()) {
        const popupContent = this.generatePopupContent(marker.neighborData);
        marker.setPopupContent(popupContent);
      }
    });
  }

  /**
   * Update UI text based on current language
   */
  updateUIText() {
    const lang = localization.getLanguage();
    const pageTitle = document.getElementById('pageTitle');
    
    if (pageTitle) {
      pageTitle.textContent = localization.getText('pageTitle', lang);
    }

    this.updateLanguageUI(lang);
  }
}
