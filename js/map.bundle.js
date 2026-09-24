// Sarthua Bhu-Abhilekh Portal - Pure Government Web GIS Client
// Direct AWS Mumbai Lambda API (100% Government GIS Streaming)
// Used on: map-viewer.html & bhu-naksha.html

(function (window) {
    'use strict';

    // Official Survey & Sheet GIS Bounding Boxes (EPSG:3857 Web Mercator meters)
    const SHEET_CONFIG = {
        RS: {
            name: 'रिविजनल सर्वे (1970)',
            sheets: {
                1: { minX: 263390.6, minY: 2820063.6, maxX: 264930.8, maxY: 2821762.7, label: 'चादर 01', gis_code: 'RS29010402902180701' },
                2: { minX: 264078.7, minY: 2818653.2, maxX: 264924.0, maxY: 2820076.3, label: 'चादर 02', gis_code: 'RS29010402902180702' },
                3: { minX: 264865.1, minY: 2818179.7, maxX: 266722.1, maxY: 2820112.9, label: 'चादर 03', gis_code: 'RS29010402902180703' },
                4: { minX: 264851.9, minY: 2820046.3, maxX: 266722.8, maxY: 2821560.9, label: 'चादर 04', gis_code: 'RS29010402902180704' },
                5: { minX: 266673.7, minY: 2818686.2, maxX: 267407.1, maxY: 2820430.6, label: 'चादर 05', gis_code: 'RS29010402902180705' },
                6: { minX: 265639.6, minY: 2819677.5, maxX: 266159.5, maxY: 2820092.1, label: 'चादर 06', gis_code: 'RS29010402902180706' }
            }
        },
        CS: {
            name: 'कैडस्ट्रल सर्वे (1911)',
            sheets: {
                0: { minX: 263200.0, minY: 2818000.0, maxX: 267600.0, maxY: 2822000.0, label: 'सम्पूर्ण मौजा', gis_code: 'CS29010402902180700' },
                1: { minX: 263390.6, minY: 2820063.6, maxX: 264930.8, maxY: 2821762.7, label: 'चादर 01', gis_code: 'CS29010402902180701' },
                2: { minX: 264078.7, minY: 2818653.2, maxX: 264924.0, maxY: 2820076.3, label: 'चादर 02', gis_code: 'CS29010402902180702' },
                3: { minX: 264865.1, minY: 2818179.7, maxX: 266722.1, maxY: 2820112.9, label: 'चादर 03', gis_code: 'CS29010402902180703' },
                4: { minX: 264851.9, minY: 2820046.3, maxX: 266722.8, maxY: 2821560.9, label: 'चादर 04', gis_code: 'CS29010402902180704' }
            }
        }
    };

    const SarthuaMapViewer = {
        map: null,
        currentSurvey: 'RS',
        currentSheet: 1,
        apiBaseUrl: 'https://api.sarthua.in',
        wmsOverlay: null,
        clickMarker: null,
        khasraIndex: null,
        isInitialized: false,
        wmsDebounceTimer: null,
        activeImageElement: null,

        detectApiEndpoint: function () {
            // Check if local dev server or cloud proxy
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                this.apiBaseUrl = '';
            } else {
                this.apiBaseUrl = 'https://api.sarthua.in';
            }
        },

        init: function () {
            const container = document.getElementById('sarthuaMapContainer');
            if (!container || this.isInitialized) return;

            if (typeof L === 'undefined') {
                setTimeout(() => this.init(), 50);
                return;
            }

            this.detectApiEndpoint();
            this.loadKhasraIndex();

            const sheetCfg = this.getActiveSheet();
            const centerLat = (sheetCfg.minY + sheetCfg.maxY) / 2;
            const centerLng = (sheetCfg.minX + sheetCfg.maxX) / 2;

            // Direct Real GIS Coordinate Space (CRS.Simple: Lat=Y, Lng=X)
            this.map = L.map('sarthuaMapContainer', {
                crs: L.CRS.Simple,
                minZoom: -2,
                maxZoom: 6,
                zoomDelta: 0.5,
                zoomSnap: 0.1,
                attributionControl: false,
                zoomControl: false
            });

            this.fitToActiveSheet();

            // Map Event Listeners
            this.map.on('moveend zoomend', () => this.scheduleWmsUpdate());
            this.map.on('click', (e) => this.handleMapClick(e.latlng));
            this.map.on('mousemove', (e) => this.handleMouseMove(e.latlng));

            // Initial WMS Render
            this.updateWms();
            this.renderSheetSwitcher();
            this.isInitialized = true;

            setTimeout(() => {
                if (this.map) this.map.invalidateSize();
            }, 100);
        },

        getActiveSheet: function () {
            const s = SHEET_CONFIG[this.currentSurvey] || SHEET_CONFIG.RS;
            return s.sheets[this.currentSheet] || s.sheets[1] || Object.values(s.sheets)[0];
        },

        fitToActiveSheet: function () {
            const cfg = this.getActiveSheet();
            const bounds = L.latLngBounds([cfg.minY, cfg.minX], [cfg.maxY, cfg.maxX]);
            this.map.fitBounds(bounds, { padding: [20, 20] });
        },

        loadKhasraIndex: function () {
            fetch('js/khasra_index.json')
                .then(res => res.json())
                .then(data => {
                    this.khasraIndex = data;
                })
                .catch(err => {
                    console.warn('[Map Viewer] Khasra index fetch warning:', err);
                });
        },

        scheduleWmsUpdate: function () {
            if (this.wmsDebounceTimer) {
                clearTimeout(this.wmsDebounceTimer);
            }
            this.wmsDebounceTimer = setTimeout(() => {
                this.updateWms();
            }, 150);
        },

        updateWms: function () {
            if (!this.map) return;

            const size = this.map.getSize();
            if (!size || size.x < 100 || size.y < 100) return;

            const bounds = this.map.getBounds();
            const minX = Math.round(bounds.getWest());
            const maxX = Math.round(bounds.getEast());
            const minY = Math.round(bounds.getSouth());
            const maxY = Math.round(bounds.getNorth());

            // 1:1 matching user's screen size so Khasra numbers are crisp and readable
            const w = Math.max(256, Math.round(size.x));
            const h = Math.max(256, Math.round(size.y));

            const survey = this.currentSurvey;
            const sheet = this.currentSheet;
            const wmsUrl = `${this.apiBaseUrl}/api/bihar-wms?minx=${minX}&miny=${minY}&maxx=${maxX}&maxy=${maxY}&w=${w}&h=${h}&survey=${survey}&sheet=${sheet}`;
            const targetBounds = [[minY, minX], [maxY, maxX]];

            if (this.activeImageElement) {
                this.activeImageElement.onload = null;
                this.activeImageElement.onerror = null;
                this.activeImageElement = null;
            }

            const img = new Image();
            this.activeImageElement = img;

            img.onload = () => {
                if (this.activeImageElement !== img) return;
                this.activeImageElement = null;
                if (this.currentSurvey !== survey || this.currentSheet !== sheet) return;

                if (!this.wmsOverlay) {
                    this.wmsOverlay = L.imageOverlay(wmsUrl, targetBounds, { opacity: 1.0, zIndex: 500 }).addTo(this.map);
                } else {
                    this.wmsOverlay.setBounds(targetBounds);
                    this.wmsOverlay.setUrl(wmsUrl);
                }
            };

            img.onerror = () => {
                if (this.activeImageElement === img) {
                    this.activeImageElement = null;
                }
            };

            img.src = wmsUrl;
        },

        createPinIcon: function () {
            return L.divIcon({
                className: 'sarthua-pin-wrap',
                html: `
                    <div style="position: relative; transform: translate(-50%, -100%); pointer-events: none;">
                        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.5));">
                            <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="#1a73e8"/>
                            <circle cx="17" cy="16" r="7" fill="#ffffff"/>
                        </svg>
                    </div>
                `,
                iconSize: [34, 42],
                iconAnchor: [17, 42],
                popupAnchor: [0, -42]
            });
        },

        handleMouseMove: function (latlng) {
            const coordsDisplay = document.getElementById('mapCoordsDisplay');
            if (coordsDisplay) {
                coordsDisplay.innerHTML = `<i class="fas fa-crosshairs text-success"></i> X: <strong>${Math.round(latlng.lng)}</strong> | Y: <strong>${Math.round(latlng.lat)}</strong>`;
            }
        },

        handleMapClick: function (latlng) {
            const x = Math.round(latlng.lng);
            const y = Math.round(latlng.lat);

            if (this.clickMarker) {
                this.map.removeLayer(this.clickMarker);
            }
            this.clickMarker = L.marker(latlng, { icon: this.createPinIcon() }).addTo(this.map);

            // Open loading popup immediately
            this.renderPopup(latlng, { loading: true, x, y });

            // Query Government GIS Database directly via Lambda API
            const queryUrl = `${this.apiBaseUrl}/api/bihar-plot?x=${x}&y=${y}&survey=${this.currentSurvey}&sheet=${this.currentSheet}`;
            fetch(queryUrl)
                .then(res => res.json())
                .then(data => {
                    if (data && data.success && data.has_data === 'Y' && data.plotNo && String(data.plotNo) !== '-1') {
                        this.renderPopup(latlng, {
                            plotNo: data.plotNo,
                            pniu: data.pniu,
                            gis_code: data.gis_code,
                            survey: data.survey || this.currentSurvey,
                            sheet: data.sheet !== undefined ? data.sheet : this.currentSheet,
                            x,
                            y
                        });
                    } else {
                        this.renderPopup(latlng, { notFound: true, x, y });
                    }
                })
                .catch(err => {
                    console.warn('[Map Viewer] Plot query error:', err);
                    this.renderPopup(latlng, { notFound: true, x, y });
                });
        },

        renderPopup: function (latlng, plot) {
            let html = '';
            if (plot.loading) {
                html = `
                    <div class="map-plot-popup" style="padding: 10px; text-align: center;">
                        <i class="fas fa-spinner fa-spin" style="color: #8ab4f8; font-size: 20px;"></i>
                        <p style="margin-top: 6px; font-size: 12px; color: #bdc1c6;">सरकारी भू-अभिलेख से जांच जारी...</p>
                    </div>
                `;
            } else if (plot.notFound) {
                const sheetLabel = this.currentSheet === 0 ? 'सम्पूर्ण मौजा' : 'चादर ' + (this.currentSheet < 10 ? '0' + this.currentSheet : this.currentSheet);
                html = `
                    <div class="map-plot-popup">
                        <div class="mpp-header">
                            <span class="mpp-badge"><i class="fas fa-landmark"></i> मौजा: सरथुआ (${this.currentSurvey === 'CS' ? 'CS 1911' : 'RS 1970'})</span>
                            <h4 class="mpp-title">भू-निर्देशांक बिंदु</h4>
                        </div>
                        <div class="mpp-body">
                            <div class="mpp-row"><span>GIS X:</span> <strong>${plot.x}</strong></div>
                            <div class="mpp-row"><span>GIS Y:</span> <strong>${plot.y}</strong></div>
                            <div class="mpp-row"><span>चादर:</span> <strong>${sheetLabel}</strong></div>
                            <div class="mpp-row"><span>थाना नं:</span> <strong>218 (उदवंतनगर)</strong></div>
                        </div>
                    </div>
                `;
            } else {
                const sheetLabel = plot.sheet === 0 ? 'सम्पूर्ण मौजा' : 'चादर ' + (plot.sheet < 10 ? '0' + plot.sheet : plot.sheet);
                html = `
                    <div class="map-plot-popup">
                        <div class="mpp-header">
                            <span class="mpp-badge"><i class="fas fa-check-circle" style="color: #34d399;"></i> प्रमाणित सरकारी भू-प्लॉट</span>
                            <h4 class="mpp-title">खेसरा संख्या: <strong>${plot.plotNo}</strong></h4>
                        </div>
                        <div class="mpp-body">
                            <div class="mpp-row"><span>PNIU कोड:</span> <strong class="text-mono" style="color: #8ab4f8;">${plot.pniu || 'उपलब्ध'}</strong></div>
                            <div class="mpp-row"><span>सर्वेक्षण:</span> <strong>${plot.survey === 'CS' ? '1911 कैडस्ट्रल' : '1970 रिविजनल'}</strong></div>
                            <div class="mpp-row"><span>चादर संख्या:</span> <strong>${sheetLabel}</strong></div>
                            <div class="mpp-row"><span>मौजा / थाना:</span> <strong>सरथुआ (218)</strong></div>
                        </div>
                        <div class="mpp-actions" style="display: flex; gap: 6px; margin-top: 10px;">
                            <a href="revisional-survey" target="_blank" style="flex: 1; text-align: center; font-size: 11px; padding: 5px 8px; background: #1a73e8; color: #fff; border-radius: 4px; text-decoration: none; font-weight: 600;">
                                <i class="fas fa-book"></i> 1970 खतियान
                            </a>
                            <a href="jamabandi" target="_blank" style="flex: 1; text-align: center; font-size: 11px; padding: 5px 8px; background: #2d3035; border: 1px solid #5f6368; color: #fff; border-radius: 4px; text-decoration: none; font-weight: 600;">
                                <i class="fas fa-file-invoice"></i> जमाबंदी देखें
                            </a>
                        </div>
                    </div>
                `;
            }

            if (this.clickMarker) {
                this.clickMarker.bindPopup(html, { maxWidth: 300, className: 'sarthua-leaflet-popup' }).openPopup();
            }
        },

        searchPlot: function (khasraNo) {
            const query = (khasraNo || document.getElementById('mapKhasraSearchInput')?.value || '').trim();
            if (!query) {
                alert('कृपया खेसरा संख्या दर्ज करें (उदा. 64, 763)');
                return;
            }

            let found = null;
            let targetSurvey = this.currentSurvey;

            if (this.khasraIndex) {
                if (this.khasraIndex[this.currentSurvey] && this.khasraIndex[this.currentSurvey][query]) {
                    found = this.khasraIndex[this.currentSurvey][query];
                } else {
                    const other = this.currentSurvey === 'RS' ? 'CS' : 'RS';
                    if (this.khasraIndex[other] && this.khasraIndex[other][query]) {
                        found = this.khasraIndex[other][query];
                        targetSurvey = other;
                    }
                }
            }

            if (found) {
                const targetX = found[0];
                const targetY = found[1];
                const targetSheet = found[2];

                if (targetSurvey !== this.currentSurvey) {
                    this.switchSurvey(targetSurvey);
                }
                if (targetSheet !== this.currentSheet) {
                    this.switchSheet(targetSheet);
                }

                const latlng = L.latLng(targetY, targetX);
                this.map.setView(latlng, 2.5);

                setTimeout(() => {
                    this.handleMapClick(latlng);
                }, 300);
            } else {
                alert(`खेसरा संख्या ${query} वर्तमान इंडेक्स में नहीं मिला।`);
            }
        },

        switchSurvey: function (survey) {
            if (this.currentSurvey === survey) return;
            this.currentSurvey = survey;
            this.currentSheet = 1;

            document.querySelectorAll('.map-survey-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-survey') === survey);
            });

            this.renderSheetSwitcher();
            this.fitToActiveSheet();
            this.updateWms();
            this.updateDownloadLink();
        },

        switchSheet: function (sheet) {
            sheet = parseInt(sheet, 10);
            if (this.currentSheet === sheet) return;
            this.currentSheet = sheet;

            document.querySelectorAll('.map-sheet-btn').forEach(btn => {
                btn.classList.toggle('active', parseInt(btn.getAttribute('data-sheet'), 10) === sheet);
            });

            this.fitToActiveSheet();
            this.updateWms();
            this.updateDownloadLink();
        },

        renderSheetSwitcher: function () {
            const wrap = document.getElementById('mapSheetSwitcherWrap');
            if (!wrap) return;

            const sInfo = SHEET_CONFIG[this.currentSurvey];
            if (!sInfo) return;

            let html = '<span class="sheet-switcher-label"><i class="fas fa-map"></i> चादर:</span>';
            for (const [sheetNo, cfg] of Object.entries(sInfo.sheets)) {
                const sheetNum = parseInt(sheetNo, 10);
                const activeCls = sheetNum === this.currentSheet ? ' active' : '';
                const label = sheetNum === 0 ? '00' : (sheetNum < 10 ? '0' + sheetNum : '' + sheetNum);
                html += `<button class="map-sheet-btn${activeCls}" data-sheet="${sheetNum}" onclick="SarthuaMapViewer.switchSheet(${sheetNum})">${label}</button>`;
            }
            wrap.innerHTML = html;
        },

        updateDownloadLink: function () {
            const btn = document.getElementById('requestDownloadBtn');
            if (!btn) return;
            const surveyName = this.currentSurvey === 'RS' ? '1970 रिविजनल सर्वे' : '1911 कैडस्ट्रल सर्वे';
            const sheetName = this.currentSheet === 0 ? 'सम्पूर्ण मौजा' : `चादर ${this.currentSheet}`;
            const msg = `नमस्ते, मुझे मौजा सरथुआ (थाना 218) के ${surveyName} की ${sheetName} के भू-नक्शे की प्रमाणित डिजिटल प्रतिलिपि हेतु जानकारी चाहिए।`;
            btn.href = `https://wa.me/919006035986?text=${encodeURIComponent(msg)}`;
        },

        zoomIn: function () {
            if (this.map) this.map.zoomIn();
        },

        zoomOut: function () {
            if (this.map) this.map.zoomOut();
        },

        resetView: function () {
            if (this.map) {
                if (this.clickMarker) {
                    this.map.removeLayer(this.clickMarker);
                    this.clickMarker = null;
                }
                this.fitToActiveSheet();
            }
        },

        toggleFullscreen: function () {
            const container = document.getElementById('sarthuaMapContainer')?.parentElement || document.body;
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => console.warn(err));
            } else {
                document.exitFullscreen().catch(err => console.warn(err));
            }
        }
    };

    window.SarthuaMapViewer = SarthuaMapViewer;

    document.addEventListener('DOMContentLoaded', () => {
        SarthuaMapViewer.init();
    });

})(window);
