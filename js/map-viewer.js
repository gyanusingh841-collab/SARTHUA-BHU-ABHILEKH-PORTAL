/**
 * Sarthua Bhu-Abhilekh Portal - Official 8K Digital Bhu-Naksha (GIS Multi-Survey & Multi-Sheet Viewer)
 * High-performance interactive map engine for Mauza Sarthua (Thana 218).
 * Supports:
 *   1. 1970 Revisional Survey (RS): चादर 01, 02, 03, 04, 05, 06
 *   2. 1911 Cadastral Survey (CS): चादर 00 (सम्पूर्ण मौजा), चादर 01, 02, 03, 04, 05
 * 100% Authentic Government Records Only.
 */

const SarthuaMapViewer = {
    map: null,
    imageOverlay: null,
    currentSurvey: 'RS', // 'RS' (1970) or 'CS' (1911)
    currentSheet: 1,     // Active sheet number
    clickMarker: null,
    imageBounds: null,
    isInitialized: false,

    // Survey Map Layers & Spatial Reference Registry (AWS S3 Hosted with Referer Protection)
    s3BaseUrl: 'https://docs.sarthua.in',
    surveys: {
        'RS': {
            name: 'रिविजनल सर्वे (1970)',
            defaultSheet: 1,
            sheets: {
                1: {
                    name: 'चादर 01',
                    gis_code: 'RS29010402902180701',
                    white: 'https://docs.sarthua.in/maps/Sarthua_Sheet_1_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_Sheet_1_HD.png',
                    imgWidth: 7265,
                    imgHeight: 8000,
                    bounds: { minX: 263375.602, minY: 2820048.664, maxX: 264945.802, maxY: 2821777.710 }
                },
                2: {
                    name: 'चादर 02',
                    gis_code: 'RS29010402902180702',
                    white: 'https://docs.sarthua.in/maps/Sarthua_Sheet_2_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_Sheet_2_HD.png',
                    imgWidth: 4819,
                    imgHeight: 8000,
                    bounds: { minX: 264063.704, minY: 2818638.237, maxX: 264939.069, maxY: 2820091.325 }
                },
                3: {
                    name: 'चादर 03',
                    gis_code: 'RS29010402902180703',
                    white: 'https://docs.sarthua.in/maps/Sarthua_Sheet_3_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_Sheet_3_HD.png',
                    imgWidth: 7690,
                    imgHeight: 8000,
                    bounds: { minX: 264850.142, minY: 2818164.791, maxX: 266737.105, maxY: 2820127.927 }
                },
                4: {
                    name: 'चादर 04',
                    gis_code: 'RS29010402902180704',
                    white: 'https://docs.sarthua.in/maps/Sarthua_Sheet_4_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_Sheet_4_HD.png',
                    imgWidth: 8000,
                    imgHeight: 6501,
                    bounds: { minX: 264836.941, minY: 2820031.306, maxX: 266737.824, maxY: 2821575.966 }
                },
                5: {
                    name: 'चादर 05',
                    gis_code: 'RS29010402902180705',
                    white: 'https://docs.sarthua.in/maps/Sarthua_Sheet_5_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_Sheet_5_HD.png',
                    imgWidth: 3441,
                    imgHeight: 8000,
                    bounds: { minX: 266658.792, minY: 2818671.265, maxX: 267422.110, maxY: 2820445.667 }
                },
                6: {
                    name: 'चादर 06',
                    gis_code: 'RS29010402902180706',
                    white: 'https://docs.sarthua.in/maps/Sarthua_Sheet_6_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_Sheet_6_HD.png',
                    imgWidth: 8000,
                    imgHeight: 6468,
                    bounds: { minX: 265624.633, minY: 2819662.519, maxX: 266174.588, maxY: 2820107.181 }
                }
            }
        },
        'CS': {
            name: 'कैडस्ट्रल सर्वे (1911)',
            defaultSheet: 0,
            sheets: {
                0: {
                    name: 'सम्पूर्ण मौजा',
                    gis_code: 'CS29010402902180600',
                    white: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_00_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_00_HD.png',
                    imgWidth: 8000,
                    imgHeight: 7327,
                    bounds: { minX: 263300.0, minY: 2818000.0, maxX: 267340.0, maxY: 2821700.0 }
                },
                1: {
                    name: 'चादर 01',
                    gis_code: 'CS29010402902180601',
                    white: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_1_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_1_HD.png',
                    imgWidth: 7054,
                    imgHeight: 8000,
                    bounds: { minX: 263305.0, minY: 2819948.0, maxX: 264915.0, maxY: 2821715.0 }
                },
                2: {
                    name: 'चादर 02',
                    gis_code: 'CS29010402902180602',
                    white: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_2_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_2_HD.png',
                    imgWidth: 4653,
                    imgHeight: 8000,
                    bounds: { minX: 263950.0, minY: 2818513.0, maxX: 264939.0, maxY: 2820091.0 }
                },
                3: {
                    name: 'चादर 03',
                    gis_code: 'CS29010402902180603',
                    white: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_3_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_3_HD.png',
                    imgWidth: 7639,
                    imgHeight: 8000,
                    bounds: { minX: 264755.0, minY: 2818020.0, maxX: 266737.0, maxY: 2820127.0 }
                },
                4: {
                    name: 'चादर 04',
                    gis_code: 'CS29010402902180604',
                    white: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_4_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_4_HD.png',
                    imgWidth: 8000,
                    imgHeight: 6835,
                    bounds: { minX: 264780.0, minY: 2819887.0, maxX: 266737.0, maxY: 2821575.0 }
                },
                5: {
                    name: 'चादर 05',
                    gis_code: 'CS29010402902180605',
                    white: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_5_HD_WhiteBG.png',
                    transparent: 'https://docs.sarthua.in/maps/Sarthua_CS_Sheet_5_HD.png',
                    imgWidth: 3370,
                    imgHeight: 8000,
                    bounds: { minX: 266569.0, minY: 2818490.0, maxX: 267422.0, maxY: 2820445.0 }
                }
            }
        }
    },

    // Verified Government GIS Data
    plotsDb: {},
    isDbLoaded: false,

    // Get Active Sheet Info Object
    getActiveSheet: function () {
        const survey = this.surveys[this.currentSurvey] || this.surveys['RS'];
        return survey.sheets[this.currentSheet] || survey.sheets[survey.defaultSheet];
    },

    // Convert pixel coordinates to EPSG:3857 coordinates for current sheet
    pixelToGeo: function (lat, lng) {
        const sheet = this.getActiveSheet();
        const r = sheet.bounds;
        const normX = Math.max(0, Math.min(1, lng / sheet.imgWidth));
        const normY = Math.max(0, Math.min(1, (sheet.imgHeight - lat) / sheet.imgHeight));
        const gx = Math.round(r.minX + normX * (r.maxX - r.minX));
        const gy = Math.round(r.maxY - normY * (r.maxY - r.minY));
        return { x: gx, y: gy };
    },

    // Convert Geo EPSG:3857 (x, y) to Leaflet Image Pixel [lat, lng] for a sheet
    geoToPixel: function (gx, gy, surveyKey, sheetNum) {
        const survey = this.surveys[surveyKey || this.currentSurvey] || this.surveys['RS'];
        const sheet = survey.sheets[sheetNum !== undefined ? sheetNum : this.currentSheet] || survey.sheets[survey.defaultSheet];
        const r = sheet.bounds;
        const normX = (gx - r.minX) / (r.maxX - r.minX);
        const normY = (gy - r.minY) / (r.maxY - r.minY);
        const lng = Math.round(normX * sheet.imgWidth);
        const lat = Math.round(normY * sheet.imgHeight);
        return [lat, lng];
    },

    // Load static offline database
    loadDatabase: function () {
        if (this.isDbLoaded && Object.keys(this.plotsDb).length > 10) return Promise.resolve();

        if (typeof sarthuaPlotsData !== 'undefined' && sarthuaPlotsData && sarthuaPlotsData.plots) {
            this.plotsDb = sarthuaPlotsData.plots;
            this.isDbLoaded = true;
            return Promise.resolve();
        }
        if (window.sarthuaPlotsData && window.sarthuaPlotsData.plots) {
            this.plotsDb = window.sarthuaPlotsData.plots;
            this.isDbLoaded = true;
            return Promise.resolve();
        }

        return fetch('sarthua_plots_db.json?v=' + Date.now())
            .then(res => res.json())
            .then(data => {
                if (data && data.plots) {
                    this.plotsDb = data.plots;
                    this.isDbLoaded = true;
                }
            })
            .catch(err => {
                console.warn('[BhuNaksha] Fallback used:', err);
                if (window.sarthuaPlotsData) {
                    this.plotsDb = window.sarthuaPlotsData.plots;
                    this.isDbLoaded = true;
                }
            });
    },

    // Find best matching plot at coordinates (gx, gy)
    findPlotAtCoords: function (gx, gy) {
        let bestMatch = null;
        let minDistance = Infinity;

        for (const [plotNo, data] of Object.entries(this.plotsDb)) {
            if (!data.center) continue;
            const cx = data.center.x;
            const cy = data.center.y;
            const bbox = data.bbox;

            if (bbox) {
                const isInside = (gx >= bbox.xmin - 3 && gx <= bbox.xmax + 3 &&
                                 gy >= bbox.ymin - 3 && gy <= bbox.ymax + 3);
                if (isInside) {
                    const dist = Math.hypot(gx - cx, gy - cy);
                    if (dist < minDistance) {
                        minDistance = dist;
                        bestMatch = data;
                    }
                }
            }
        }

        if (!bestMatch) {
            let snapDist = 35;
            for (const [plotNo, data] of Object.entries(this.plotsDb)) {
                if (!data.center) continue;
                const dist = Math.hypot(gx - data.center.x, gy - data.center.y);
                if (dist < snapDist) {
                    snapDist = dist;
                    bestMatch = data;
                }
            }
        }

        return bestMatch;
    },

    // Initialize Leaflet Map Engine
    init: function () {
        const container = document.getElementById('sarthuaMapContainer');
        if (!container || this.isInitialized) return;

        if (typeof L === 'undefined') {
            console.warn('[BhuNaksha] Leaflet library loading, retrying in 50ms...');
            setTimeout(() => this.init(), 50);
            return;
        }

        this.loadDatabase();

        const sheet = this.getActiveSheet();
        const h = sheet.imgHeight;
        const w = sheet.imgWidth;
        this.imageBounds = [[0, 0], [h, w]];

        // Initialize Leaflet Map with Pixel Coordinate System
        this.map = L.map('sarthuaMapContainer', {
            crs: L.CRS.Simple,
            minZoom: -3,
            maxZoom: 3,
            zoomDelta: 0.5,
            zoomSnap: 0.25,
            wheelPxPerZoomLevel: 80,
            attributionControl: false,
            zoomControl: false,
            maxBounds: [[-1000, -1000], [h + 1000, w + 1000]]
        });

        // Add 8K Ultra-HD Authentic Survey Map Layer
        this.imageOverlay = L.imageOverlay(sheet.white, this.imageBounds).addTo(this.map);
        this.map.fitBounds(this.imageBounds);
        setTimeout(() => {
            if (this.map) this.map.invalidateSize();
        }, 150);

        // Render dynamic sheet switcher buttons
        this.renderSheetSwitcher();

        // Real-time Coordinate Tracker on Mouse Move
        this.map.on('mousemove', (e) => {
            this.updateCoordinateDisplay(e.latlng);
        });

        // Click on Map to Inspect Point Coordinates & Details
        this.map.on('click', (e) => {
            this.handleMapClick(e.latlng);
        });

        // Anti-download and Anti-drag protection on map canvas
        const preventSave = (e) => {
            e.preventDefault();
            return false;
        };
        container.addEventListener('contextmenu', preventSave);
        container.addEventListener('dragstart', preventSave);

        this.isInitialized = true;
        this.setupKeyboardControls();
    },

    // Switch Survey Type: 'RS' (1970) or 'CS' (1911)
    switchSurvey: function (surveyType) {
        if (!this.surveys[surveyType]) return;
        this.currentSurvey = surveyType;
        const survey = this.surveys[surveyType];
        this.currentSheet = survey.defaultSheet;

        // Update Survey switcher buttons
        document.querySelectorAll('.map-survey-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.survey === surveyType);
        });

        // Re-render sheet switcher pills
        this.renderSheetSwitcher();

        // Load map
        this.switchSheet(this.currentSheet, true);
    },

    // Render Sheet Switcher Pills dynamically
    renderSheetSwitcher: function () {
        const wrap = document.getElementById('mapSheetSwitcherWrap');
        if (!wrap) return;

        const survey = this.surveys[this.currentSurvey];
        let html = `<span class="sheet-switcher-label"><i class="fas fa-layer-group"></i> चादर:</span>`;

        for (const [sheetKey, sheetObj] of Object.entries(survey.sheets)) {
            const sheetNum = parseInt(sheetKey);
            const label = sheetNum === 0 ? 'पूरा मौजा' : (sheetNum < 10 ? `0${sheetNum}` : `${sheetNum}`);
            const isActive = sheetNum === this.currentSheet ? 'active' : '';
            html += `<button class="map-sheet-btn ${isActive}" data-sheet="${sheetNum}" onclick="SarthuaMapViewer.switchSheet(${sheetNum})" title="${sheetObj.name}">${label}</button>`;
        }

        wrap.innerHTML = html;
    },

    // Switch active cadastral sheet
    switchSheet: function (sheetNum, silent) {
        const survey = this.surveys[this.currentSurvey];
        sheetNum = parseInt(sheetNum);
        if (!survey.sheets[sheetNum]) return;
        this.currentSheet = sheetNum;

        const sheet = survey.sheets[sheetNum];
        const h = sheet.imgHeight;
        const w = sheet.imgWidth;
        this.imageBounds = [[0, 0], [h, w]];

        if (this.imageOverlay && this.map) {
            this.imageOverlay.setBounds(this.imageBounds);
            this.imageOverlay.setUrl(sheet.white);
            this.map.setMaxBounds([[-1000, -1000], [h + 1000, w + 1000]]);
            this.map.fitBounds(this.imageBounds, { animate: true });
        }

        if (this.clickMarker) {
            this.map.removeLayer(this.clickMarker);
            this.clickMarker = null;
        }

        // Update UI Elements
        document.querySelectorAll('.map-sheet-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.sheet) === sheetNum);
        });

        const sheetBadge = document.getElementById('mapActiveSheetBadge');
        if (sheetBadge) {
            const sheetLabel = sheetNum === 0 ? 'सम्पूर्ण मौजा' : (sheetNum < 10 ? `0${sheetNum}` : `${sheetNum}`);
            const surveyLabel = this.currentSurvey === 'CS' ? '1911 कैडस्ट्रल' : '1970 रिविजनल';
            sheetBadge.innerHTML = `<i class="fas fa-layer-group"></i> <strong>${surveyLabel}</strong> • चादर: <strong>${sheetLabel}</strong>`;
        }

        const coordsBadge = document.getElementById('mapCoordsDisplay');
        if (coordsBadge) {
            coordsBadge.innerHTML = `<i class="fas fa-layer-group"></i> ${this.currentSurvey} चादर ${sheetNum === 0 ? '00 (पूरा मौजा)' : '0' + sheetNum} सक्रिय`;
        }

        if (window.AppView && !silent) {
            AppView.showAlert(`${survey.name} — ${sheet.name} का 8K नक्शा लोड हुआ!`, 'success');
        }
    },

    // Create precision map pin marker
    createPinIcon: function () {
        return L.divIcon({
            className: 'sarthua-geo-pin',
            html: `
                <div class="geo-pin-wrap">
                    <div class="geo-pin-pulse"></div>
                    <div class="geo-pin-body">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                </div>
            `,
            iconSize: [32, 42],
            iconAnchor: [16, 42],
            popupAnchor: [0, -42]
        });
    },

    // Handle user click anywhere on the authentic map
    handleMapClick: function (latlng) {
        const geo = this.pixelToGeo(latlng.lat, latlng.lng);
        const matchedPlot = this.findPlotAtCoords(geo.x, geo.y);
        const currentSheetInfo = this.getActiveSheet();

        if (this.clickMarker) {
            this.map.removeLayer(this.clickMarker);
        }

        this.clickMarker = L.marker(latlng, { icon: this.createPinIcon() }).addTo(this.map);

        let popupContent = '';
        if (matchedPlot) {
            const plotSheet = matchedPlot.sheet || this.currentSheet;
            const gisCode = currentSheetInfo.gis_code;
            const lpmUrl = `https://bhunaksha.bihar.gov.in/plotReportPDF.jsp?state=10&giscode=${gisCode}&plotno=${matchedPlot.plot_no}&sameowner=false&derivedLayers=-1&selectedLayers=-1&scale=0`;
            const surveyName = this.currentSurvey === 'CS' ? 'कैडस्ट्रल (1911)' : 'रिविजनल (1970)';

            popupContent = `
                <div class="map-plot-popup">
                    <div class="mpp-header">
                        <span class="mpp-badge"><i class="fas fa-landmark"></i> मौजा: सरथुआ (थाना 218 • ${surveyName})</span>
                        <h4 class="mpp-title">खेसरा संख्या: <strong>${matchedPlot.plot_no}</strong></h4>
                    </div>
                    <div class="mpp-body">
                        <div class="mpp-row"><span>ULPIN (भू-आधार):</span> <strong class="text-mono text-primary">${matchedPlot.pniu || 'सरकारी अभिलेख'}</strong></div>
                        <div class="mpp-row"><span>GIS X (Easting):</span> <strong class="text-mono">${geo.x}</strong></div>
                        <div class="mpp-row"><span>GIS Y (Northing):</span> <strong class="text-mono">${geo.y}</strong></div>
                        <div class="mpp-row"><span>चादर संख्या:</span> <strong>${this.currentSheet === 0 ? 'सम्पूर्ण मौजा' : '0' + this.currentSheet}</strong></div>
                    </div>
                    <div class="mpp-actions">
                        <a href="jamabandi.html?q=${encodeURIComponent(matchedPlot.plot_no)}" class="btn btn--sm btn--primary">
                            <i class="fas fa-book"></i> खतियान में देखें
                        </a>
                        <a href="${lpmUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--sm btn--secondary" title="सरकारी LPM नक्शा रिपोर्ट PDF">
                            <i class="fas fa-file-pdf"></i> LPM रिपोर्ट
                        </a>
                    </div>
                </div>
            `;
        } else {
            popupContent = `
                <div class="map-plot-popup">
                    <div class="mpp-header">
                        <span class="mpp-badge"><i class="fas fa-landmark"></i> मौजा: सरथुआ (${this.currentSurvey === 'CS' ? 'CS 1911' : 'RS 1970'})</span>
                        <h4 class="mpp-title">भू-निर्देशांक बिंदु (GIS Point)</h4>
                    </div>
                    <div class="mpp-body">
                        <div class="mpp-row"><span>GIS X:</span> <strong class="text-mono">${geo.x}</strong></div>
                        <div class="mpp-row"><span>GIS Y:</span> <strong class="text-mono">${geo.y}</strong></div>
                        <div class="mpp-row"><span>चादर:</span> <strong>${this.currentSheet === 0 ? 'सम्पूर्ण मौजा' : '0' + this.currentSheet}</strong></div>
                        <div class="mpp-row"><span>अंचल / थाना:</span> <strong>उदवंतनगर (218)</strong></div>
                    </div>
                    <div class="mpp-actions">
                        <a href="revisional-survey.html" class="btn btn--sm btn--primary">
                            <i class="fas fa-history"></i> 1970 खतियान
                        </a>
                        <a href="cadastral-survey.html" class="btn btn--sm btn--secondary">
                            <i class="fas fa-book-open"></i> 1911 खतियान
                        </a>
                    </div>
                </div>
            `;
        }

        this.clickMarker.bindPopup(popupContent, { maxWidth: 320, className: 'sarthua-leaflet-popup' }).openPopup();

        const coordsBadge = document.getElementById('mapCoordsDisplay');
        if (coordsBadge) {
            coordsBadge.innerHTML = `<i class="fas fa-crosshairs text-success"></i> X: <strong>${geo.x}</strong> | Y: <strong>${geo.y}</strong>`;
        }
    },

    // Search Khasra Plot Locator
    searchPlot: function (khasraNo) {
        const query = (khasraNo || document.getElementById('mapKhasraSearchInput')?.value || '').trim();
        if (!query) {
            if (window.AppView) {
                AppView.showAlert('कृपया खेसरा संख्या दर्ज करें (उदा. 64)', 'info');
            } else {
                alert('कृपया खेसरा संख्या दर्ज करें (उदा. 64)');
            }
            return;
        }

        if (this.clickMarker) {
            this.map.removeLayer(this.clickMarker);
        }

        const record = this.plotsDb[query];
        let targetLatLng = null;

        if (record && record.sheet !== undefined && record.sheet !== this.currentSheet) {
            this.switchSheet(record.sheet);
        }

        if (record && record.pixel) {
            targetLatLng = record.pixel;
        } else if (record && record.center) {
            targetLatLng = this.geoToPixel(record.center.x, record.center.y);
        } else {
            const sheet = this.getActiveSheet();
            targetLatLng = [Math.round(sheet.imgHeight / 2), Math.round(sheet.imgWidth / 2)];
        }

        this.clickMarker = L.marker(targetLatLng, { icon: this.createPinIcon() }).addTo(this.map);

        const currentSheetInfo = this.getActiveSheet();
        const pniuDisplay = (record && record.pniu) ? record.pniu : 'सरकारी अभिलेख';
        const lpmLink = `https://bhunaksha.bihar.gov.in/plotReportPDF.jsp?state=10&giscode=${currentSheetInfo.gis_code}&plotno=${query}&sameowner=false&derivedLayers=-1&selectedLayers=-1&scale=0`;

        const popupHtml = `
            <div class="map-plot-popup">
                <div class="mpp-header">
                    <span class="mpp-badge"><i class="fas fa-landmark"></i> मौजा: सरथुआ (${this.currentSurvey === 'CS' ? 'CS 1911' : 'RS 1970'})</span>
                    <h4 class="mpp-title">खेसरा संख्या: <strong>${query}</strong></h4>
                </div>
                <div class="mpp-body">
                    <div class="mpp-row"><span>अंचल:</span> <strong>उदवंतनगर (भोजपुर)</strong></div>
                    <div class="mpp-row"><span>ULPIN / भू-आधार:</span> <strong class="text-mono text-primary">${pniuDisplay}</strong></div>
                    <div class="mpp-row"><span>चादर संख्या:</span> <strong>${this.currentSheet === 0 ? 'सम्पूर्ण मौजा' : '0' + this.currentSheet}</strong></div>
                </div>
                <div class="mpp-actions">
                    <a href="jamabandi.html?q=${encodeURIComponent(query)}" class="btn btn--sm btn--primary">
                        <i class="fas fa-history"></i> खतियान में देखें
                    </a>
                    <a href="${lpmLink}" target="_blank" rel="noopener noreferrer" class="btn btn--sm btn--secondary" title="सरकारी LPM नक्शा रिपोर्ट PDF">
                        <i class="fas fa-file-pdf"></i> LPM रिपोर्ट
                    </a>
                </div>
            </div>
        `;

        this.clickMarker.bindPopup(popupHtml, { maxWidth: 320, className: 'sarthua-leaflet-popup' }).openPopup();
        this.map.setView(targetLatLng, 1.2, { animate: true });

        if (window.AppView) {
            AppView.showAlert(`खेसरा नं. ${query} (${this.currentSurvey} चादर ${this.currentSheet}) में लोकेट हुआ!`, 'success');
        }
    },

    // Reset View
    resetView: function () {
        if (!this.map || !this.imageBounds) return;
        this.map.fitBounds(this.imageBounds, { animate: true });
        if (this.clickMarker) {
            this.map.removeLayer(this.clickMarker);
            this.clickMarker = null;
        }
    },

    // Zoom Controls
    zoomIn: function () {
        if (this.map) this.map.zoomIn();
    },

    zoomOut: function () {
        if (this.map) this.map.zoomOut();
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

    // Coordinate Tracker
    updateCoordinateDisplay: function (latlng) {
        const geo = this.pixelToGeo(latlng.lat, latlng.lng);
        const coordsBadge = document.getElementById('mapCoordsDisplay');
        if (coordsBadge && !this.clickMarker) {
            coordsBadge.innerHTML = `<i class="fas fa-crosshairs"></i> X: ${geo.x} | Y: ${geo.y}`;
        }
    },

    // Keyboard Shortcuts
    setupKeyboardControls: function () {
        document.addEventListener('keydown', (e) => {
            const container = document.getElementById('sarthuaMapContainer');
            if (!container || !this.map) return;
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

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
            } else if (e.key >= '0' && e.key <= '6' && e.altKey) {
                e.preventDefault();
                this.switchSheet(parseInt(e.key));
            }
        });
    }
};

window.SarthuaMapViewer = SarthuaMapViewer;

// Auto-initialize when running on bhu-naksha.html
(function bootSarthuaMap() {
    function tryInit() {
        const container = document.getElementById('sarthuaMapContainer');
        if (!container) return;
        if (typeof L !== 'undefined' && window.SarthuaMapViewer) {
            window.SarthuaMapViewer.init();
        } else {
            setTimeout(tryInit, 50);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }
})();
