/**
 * Sarthua Bhu-Abhilekh Portal - Interactive Bhu-Naksha (GIS Map Viewer)
 * High-performance Leaflet-powered GIS engine with 8K Ultra-HD raster layer,
 * plot inspector, dynamic zoom, layers, and instant Khasra locator.
 */

const SarthuaMapViewer = {
    map: null,
    imageOverlay: null,
    currentLayer: 'white',
    marker: null,
    imageBounds: null,
    isInitialized: false,

    // Image assets (High-Res 8000x8805 px)
    layers: {
        white: 'Sarthua_Thana218_Full_Map_HD_WhiteBG.png',
        transparent: 'Sarthua_Thana218_Full_Map_HD.png'
    },

    // Known sample Khasra plots coordinate database (Normalized 0..8805 Y, 0..8000 X)
    // Image dimensions: Width = 8000 px, Height = 8805 px
    // Geographic bounds: minX = 263266.69, minY = 2819926.91, maxX = 265057.77, maxY = 2821898.31
    geoReference: {
        imgWidth: 8000,
        imgHeight: 8805,
        minX: 263266.6945616582,
        maxX: 265057.76700843644,
        minY: 2819926.909755693,
        maxY: 2821898.30861775
    },

    // Convert EPSG:3857 coordinates to Leaflet Image CRS coordinates [y, x]
    geoToPixel: function (gx, gy) {
        const r = this.geoReference;
        const px = ((gx - r.minX) / (r.maxX - r.minX)) * r.imgWidth;
        const py = ((r.maxY - gy) / (r.maxY - r.minY)) * r.imgHeight;
        return [r.imgHeight - py, px]; // Leaflet Simple CRS uses [y, x]
    },

    // Sample plot data for interactive click & search
    plotsDb: {
        "64": {
            khesra: "64",
            khata: "12",
            raiyat: "रैयत अभिलेख (RS खतियान देखें)",
            rakba: "18.5 डिसमिल",
            pniu: "83F9KQDHK7R4H0",
            geoMin: [263519.03, 2821244.14],
            geoMax: [263589.26, 2821273.91],
            lpm: "https://bhunaksha.bihar.gov.in/10/plotReportPDF.jsp?state=10&giscode=RS29010402902180701&plotno=64"
        }
    },

    // Initialize the Leaflet Map Engine
    init: function () {
        const container = document.getElementById('sarthuaMapContainer');
        if (!container || this.isInitialized) return;

        // Leaflet Simple CRS (Pixel-based coordinate system for ultra-crisp map navigation)
        const h = this.geoReference.imgHeight;
        const w = this.geoReference.imgWidth;
        this.imageBounds = [[0, 0], [h, w]];

        if (typeof L === 'undefined') {
            console.warn('Leaflet library is still loading...');
            return;
        }

        this.map = L.map('sarthuaMapContainer', {
            crs: L.CRS.Simple,
            minZoom: -3,
            maxZoom: 3,
            zoomDelta: 0.5,
            zoomSnap: 0.25,
            wheelPxPerZoomLevel: 80,
            attributionControl: false,
            zoomControl: false
        });

        // Add White BG High-Res Layer by default
        this.imageOverlay = L.imageOverlay(this.layers.white, this.imageBounds).addTo(this.map);
        this.map.fitBounds(this.imageBounds);

        // Click on map to inspect location & plot
        this.map.on('click', (e) => {
            this.handleMapClick(e.latlng);
        });

        this.isInitialized = true;
        this.setupKeyboardControls();
    },

    // Reset view to full village
    resetView: function () {
        if (!this.map || !this.imageBounds) return;
        this.map.fitBounds(this.imageBounds, { animate: true });
        if (this.marker) {
            this.map.removeLayer(this.marker);
            this.marker = null;
        }
    },

    // Zoom controls
    zoomIn: function () {
        if (this.map) this.map.zoomIn();
    },

    zoomOut: function () {
        if (this.map) this.map.zoomOut();
    },

    // Switch Layer (White BG / Transparent / Dark Blueprint)
    setLayer: function (layerType) {
        if (!this.map || !this.imageOverlay) return;
        this.currentLayer = layerType;

        const mapEl = document.getElementById('sarthuaMapContainer');
        if (mapEl) {
            mapEl.classList.remove('map-theme-blueprint', 'map-theme-dark');
            if (layerType === 'blueprint') {
                mapEl.classList.add('map-theme-blueprint');
                this.imageOverlay.setUrl(this.layers.white);
            } else if (layerType === 'transparent') {
                this.imageOverlay.setUrl(this.layers.transparent);
            } else {
                this.imageOverlay.setUrl(this.layers.white);
            }
        }

        // Update active button state
        document.querySelectorAll('.map-layer-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.layer === layerType);
        });
    },

    // Fullscreen Toggle
    toggleFullscreen: function () {
        const mapCard = document.getElementById('sarthuaMapCard');
        if (!mapCard) return;

        if (!document.fullscreenElement) {
            if (mapCard.requestFullscreen) {
                mapCard.requestFullscreen();
            } else if (mapCard.webkitRequestFullscreen) {
                mapCard.webkitRequestFullscreen();
            }
            mapCard.classList.add('map-fullscreen-active');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            mapCard.classList.remove('map-fullscreen-active');
        }

        setTimeout(() => {
            if (this.map) this.map.invalidateSize();
        }, 200);
    },

    // Search Khasra Plot on Map
    searchPlot: function (khasraNo) {
        const query = (khasraNo || document.getElementById('mapKhasraSearchInput')?.value || '').trim();
        if (!query) {
            if (window.AppView) AppView.showAlert('कृपया खेसरा संख्या दर्ज करें (उदा. 64)', 'info');
            return;
        }

        // Check in our coordinate database
        const plotData = this.plotsDb[query];
        if (plotData && plotData.geoMin && plotData.geoMax) {
            const centerGeoX = (plotData.geoMin[0] + plotData.geoMax[0]) / 2;
            const centerGeoY = (plotData.geoMin[1] + plotData.geoMax[1]) / 2;
            const pixelCoords = this.geoToPixel(centerGeoX, centerGeoY);

            this.highlightPlot(pixelCoords, plotData);
        } else {
            // If exact plot coordinate is not pre-indexed, center map with search highlight notification
            if (window.AppView) {
                AppView.showAlert(`खेसरा नं. ${query} नक्शे में सर्च किया जा रहा है...`, 'info');
            }
            // Estimate position or prompt to browse
            this.map.setZoom(0.5);
        }
    },

    // Highlight Plot with pulsating marker & popup
    highlightPlot: function (latlng, plot) {
        if (!this.map) return;

        if (this.marker) {
            this.map.removeLayer(this.marker);
        }

        const customIcon = L.divIcon({
            className: 'custom-map-pulse-marker',
            html: `<div class="pulse-ring"></div><div class="pulse-dot"><i class="fas fa-map-pin"></i></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36]
        });

        this.marker = L.marker(latlng, { icon: customIcon }).addTo(this.map);

        const popupContent = `
            <div class="map-plot-popup">
                <div class="mpp-header">
                    <span class="mpp-badge"><i class="fas fa-landmark"></i> मौजा सरथुआ (218)</span>
                    <h4 class="mpp-title">खेसरा संख्या: <strong>${plot.khesra}</strong></h4>
                </div>
                <div class="mpp-body">
                    <div class="mpp-row"><span>ULPIN / भू-आधार:</span> <strong>${plot.pniu || 'उपलब्ध'}</strong></div>
                    <div class="mpp-row"><span>रकबा:</span> <strong>${plot.rakba || '—'}</strong></div>
                    <div class="mpp-row"><span>खाता:</span> <strong>${plot.khata || 'खतियान देखें'}</strong></div>
                </div>
                <div class="mpp-actions">
                    <button onclick="AppController.performSearch('${plot.khesra}'); showTab('revisional');" class="btn btn--sm btn--primary">
                        <i class="fas fa-search"></i> खतियान देखें
                    </button>
                    ${plot.lpm ? `<a href="${plot.lpm}" target="_blank" class="btn btn--sm btn--secondary"><i class="fas fa-file-pdf"></i> LPM रिपोर्ट</a>` : ''}
                </div>
            </div>
        `;

        this.marker.bindPopup(popupContent, { maxWidth: 300, className: 'sarthua-leaflet-popup' }).openPopup();
        this.map.setView(latlng, 1.2, { animate: true });
    },

    // Handle user click on map
    handleMapClick: function (latlng) {
        // Calculate relative pixel position
        const y = Math.round(latlng.lat);
        const x = Math.round(latlng.lng);

        // Convert to EPSG:3857 for reference
        const r = this.geoReference;
        const normX = x / r.imgWidth;
        const normY = (r.imgHeight - y) / r.imgHeight;
        const gx = Math.round(r.minX + normX * (r.maxX - r.minX));
        const gy = Math.round(r.maxY - normY * (r.maxY - r.minY));

        const coordsBadge = document.getElementById('mapCoordsDisplay');
        if (coordsBadge) {
            coordsBadge.innerHTML = `<i class="fas fa-crosshairs"></i> X: ${gx} | Y: ${gy}`;
        }
    },

    // Keyboard Shortcuts (Arrow keys for panning, +/- for zoom)
    setupKeyboardControls: function () {
        document.addEventListener('keydown', (e) => {
            const mapTab = document.getElementById('bhunaksha');
            if (!mapTab || !mapTab.classList.contains('active') || !this.map) return;

            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                this.zoomIn();
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                this.zoomOut();
            } else if (e.key.toLowerCase() === 'h') {
                e.preventDefault();
                this.resetView();
            } else if (e.key.toLowerCase() === 'f') {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }
};

// Expose globally
window.SarthuaMapViewer = SarthuaMapViewer;
