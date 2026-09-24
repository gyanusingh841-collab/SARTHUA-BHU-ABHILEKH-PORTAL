// Sarthua Bhu-Abhilekh Portal - Pure Government Web GIS Client
// Direct AWS Mumbai Lambda API (100% Government GIS Streaming)
// Used on: map-viewer.html

(function (window) {
    'use strict';

    // Official Survey & Sheet GIS Bounding Boxes (EPSG:3857 Web Mercator meters).
    // These are also the exact bounds of the pre-rendered overview images.
    const SHEET_CONFIG = {
        RS: {
            name: 'रिविजनल सर्वे (1970)',
            sheets: {
                1: { minX: 263376.0, minY: 2820048.3, maxX: 264946.2, maxY: 2821778.3, label: 'चादर 01', gis_code: 'RS29010402902180701' },
                2: { minX: 264063.9, minY: 2818638.0, maxX: 264939.3, maxY: 2820091.1, label: 'चादर 02', gis_code: 'RS29010402902180702' },
                3: { minX: 264850.2, minY: 2818164.4, maxX: 266738.0, maxY: 2820127.8, label: 'चादर 03', gis_code: 'RS29010402902180703' },
                4: { minX: 264837.2, minY: 2820030.7, maxX: 266738.5, maxY: 2821578.1, label: 'चादर 04', gis_code: 'RS29010402902180704' },
                5: { minX: 266659.1, minY: 2818671.3, maxX: 267422.9, maxY: 2820445.4, label: 'चादर 05', gis_code: 'RS29010402902180705' },
                6: { minX: 265624.7, minY: 2819662.5, maxX: 266174.8, maxY: 2820107.1, label: 'चादर 06', gis_code: 'RS29010402902180706' }
            }
        },
        CS: {
            name: 'कैडस्ट्रल सर्वे (1911)',
            sheets: {
                0: { minX: 263300.4, minY: 2817999.2, maxX: 267341.4, maxY: 2821701.8, label: 'सम्पूर्ण मौजा', gis_code: 'CS29010402902180700' },
                1: { minX: 263305.1, minY: 2819946.9, maxX: 264841.3, maxY: 2821689.0, label: 'चादर 01', gis_code: 'CS29010402902180701' },
                2: { minX: 263950.1, minY: 2818513.4, maxX: 264812.2, maxY: 2819995.5, label: 'चादर 02', gis_code: 'CS29010402902180702' },
                3: { minX: 264755.1, minY: 2818019.5, maxX: 266620.9, maxY: 2819975.0, label: 'चादर 03', gis_code: 'CS29010402902180703' },
                4: { minX: 264778.6, minY: 2819887.0, maxX: 266627.7, maxY: 2821465.5, label: 'चादर 04', gis_code: 'CS29010402902180704' },
                5: { minX: 266569.4, minY: 2818490.1, maxX: 267332.5, maxY: 2820302.1, label: 'चादर 05', gis_code: 'CS29010402902180705' }
            }
        }
    };

    // Pre-rendered sheet overviews (downscaled from the 8K maps, served from R2).
    // Shown at the fitted sheet zoom; the live WMS API is only used once the user zooms in.
    // Two sizes (long side in px); the smallest one that stays sharp on this screen is used.
    const OVERVIEW_SIZES = [800, 1600];
    const OVERVIEW_URL = (survey, sheet, size) => `https://docs.sarthua.in/maps/overview/${survey}_${sheet}-${size}.webp?v=1`;
    const LIVE_WMS_ZOOM_DELTA = 0.3;

    const SarthuaMapViewer = {
        map: null,
        currentSurvey: 'RS',
        currentSheet: 1,
        apiBaseUrl: 'https://api.sarthua.in',
        wmsOverlay: null,
        overviewOverlay: null,
        overviewZoom: null,
        overviewFailed: false,
        clickMarker: null,
        khasraIndex: null,
        isInitialized: false,
        wmsDebounceTimer: null,
        activeImageElement: null,
        toastTimer: null,

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

            // Deep link: ?survey=RS|CS&sheet=N&q=<khesra>
            const params = new URLSearchParams(window.location.search);
            const urlSurvey = (params.get('survey') || '').toUpperCase();
            if (SHEET_CONFIG[urlSurvey]) this.currentSurvey = urlSurvey;
            const urlSheet = parseInt(params.get('sheet'), 10);
            if (SHEET_CONFIG[this.currentSurvey].sheets[urlSheet]) this.currentSheet = urlSheet;
            const urlQuery = (params.get('q') || '').trim();

            this.loadKhasraIndex(urlQuery);

            // Direct Real GIS Coordinate Space (CRS.Simple: Lat=Y, Lng=X)
            this.map = L.map('sarthuaMapContainer', {
                crs: L.CRS.Simple,
                minZoom: -4, // low enough to fit a whole sheet on narrow phones
                maxZoom: 6,
                zoomDelta: 0.5,
                zoomSnap: 0.1,
                bounceAtZoomLimits: false,
                attributionControl: false,
                zoomControl: false
            });

            this.fitToActiveSheet();

            // Map Event Listeners
            this.map.on('moveend zoomend', () => this.scheduleWmsUpdate());
            this.map.on('click', (e) => this.handleMapClick(e.latlng));

            // Initial WMS Render
            this.updateWms();
            this.syncSurveyButtons();
            this.renderSheetSwitcher();
            this.updateDownloadLink();
            this.updatePageState(true);
            this.bindUi();
            this.isInitialized = true;

            setTimeout(() => {
                if (this.map) this.map.invalidateSize();
            }, 100);
        },

        bindUi: function () {
            // Overlays sit above the map; keep their taps and wheel from reaching it
            ['mvControls', 'mvDock', 'mvPlotSheet'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    L.DomEvent.disableClickPropagation(el);
                    L.DomEvent.disableScrollPropagation(el);
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key !== 'Escape') return;
                const info = document.getElementById('mvInfo');
                if (info && info.classList.contains('open')) this.toggleInfo(false);
                else this.closePlotSheet();
            });

            document.addEventListener('fullscreenchange', () => {
                const icon = document.querySelector('#mvFullscreenBtn i');
                if (icon) icon.className = document.fullscreenElement ? 'fas fa-compress' : 'fas fa-expand';
            });

            // Toolbar height changes (rotation, on-screen keyboard) resize the map area
            window.addEventListener('resize', () => {
                if (this.map) this.map.invalidateSize();
            });
        },

        isMobile: function () {
            return window.matchMedia('(max-width: 899px)').matches;
        },

        // Keeps sheets clear of the floating dock (bottom) and controls (right)
        getFitPadding: function () {
            const dock = document.getElementById('mvDock');
            const dockH = dock ? dock.offsetHeight : 0;
            return {
                paddingTopLeft: [16, 16],
                paddingBottomRight: [68, dockH + 24]
            };
        },

        getActiveSheet: function () {
            const s = SHEET_CONFIG[this.currentSurvey] || SHEET_CONFIG.RS;
            return s.sheets[this.currentSheet] || s.sheets[1] || Object.values(s.sheets)[0];
        },

        getSheetLabel: function (sheet) {
            return sheet === 0 ? 'सम्पूर्ण मौजा' : 'चादर ' + (sheet < 10 ? '0' + sheet : sheet);
        },

        fitToActiveSheet: function () {
            const cfg = this.getActiveSheet();
            const bounds = L.latLngBounds([cfg.minY, cfg.minX], [cfg.maxY, cfg.maxX]);
            this.map.fitBounds(bounds, this.getFitPadding());
            this.overviewZoom = this.map.getZoom();
            this.showOverview();
        },

        showOverview: function () {
            const cfg = this.getActiveSheet();
            const bounds = [[cfg.minY, cfg.minX], [cfg.maxY, cfg.maxX]];
            const url = OVERVIEW_URL(this.currentSurvey, this.currentSheet, this.pickOverviewSize(bounds));
            const alt = `सरथुआ ${SHEET_CONFIG[this.currentSurvey].name} ${this.getSheetLabel(this.currentSheet)} भू-नक्शा`;
            this.overviewFailed = false;

            if (!this.overviewOverlay) {
                this.overviewOverlay = L.imageOverlay(url, bounds, { zIndex: 400, alt }).addTo(this.map);
                this.overviewOverlay.on('error', () => {
                    // No overview for this sheet: fall back to the live API at every zoom
                    this.overviewFailed = true;
                    this.updateWms();
                });
            } else {
                this.overviewOverlay.setUrl(url);
                this.overviewOverlay.setBounds(L.latLngBounds(bounds));
                const el = this.overviewOverlay.getElement();
                if (el) el.alt = alt;
            }
        },

        pickOverviewSize: function (bounds) {
            const a = this.map.latLngToContainerPoint(bounds[0]);
            const b = this.map.latLngToContainerPoint(bounds[1]);
            const need = Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)) * Math.min(window.devicePixelRatio || 1, 2);
            return OVERVIEW_SIZES.find(size => size * 1.1 >= need) || OVERVIEW_SIZES[OVERVIEW_SIZES.length - 1];
        },

        needsLiveWms: function () {
            if (this.overviewFailed || this.overviewZoom === null) return true;
            return this.map.getZoom() > this.overviewZoom + LIVE_WMS_ZOOM_DELTA;
        },

        hideLiveWms: function () {
            if (this.activeImageElement) {
                this.activeImageElement.onload = null;
                this.activeImageElement.onerror = null;
                this.activeImageElement = null;
            }
            if (this.wmsOverlay) {
                this.map.removeLayer(this.wmsOverlay);
                this.wmsOverlay = null;
            }
        },

        loadKhasraIndex: function (pendingQuery) {
            fetch('js/khasra_index.json')
                .then(res => res.json())
                .then(data => {
                    this.khasraIndex = data;
                    if (pendingQuery) {
                        const input = document.getElementById('mapKhasraSearchInput');
                        if (input) input.value = pendingQuery;
                        this.searchPlot(pendingQuery);
                    }
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

            // At the overview zoom the CDN image is enough; skip the API call
            if (!this.needsLiveWms()) {
                this.hideLiveWms();
                return;
            }

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
                    this.wmsOverlay = L.imageOverlay(wmsUrl, targetBounds, {
                        opacity: 1.0,
                        zIndex: 500,
                        alt: `सरथुआ ${SHEET_CONFIG[survey].name} ${this.getSheetLabel(sheet)} भू-नक्शा`
                    }).addTo(this.map);
                } else {
                    this.wmsOverlay.setBounds(targetBounds);
                    this.wmsOverlay.setUrl(wmsUrl);
                }
            };

            img.onerror = () => {
                if (this.activeImageElement === img) {
                    this.activeImageElement = null;
                    this.showToast('नक्शा लोड नहीं हो सका। इंटरनेट कनेक्शन जांचें।');
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
                iconAnchor: [17, 42]
            });
        },

        handleMouseMove: function (latlng) {
            const coordsDisplay = document.getElementById('mapCoordsDisplay');
            if (coordsDisplay) {
                coordsDisplay.innerHTML = `X: <strong>${Math.round(latlng.lng)}</strong> | Y: <strong>${Math.round(latlng.lat)}</strong>`;
            }
        },

        handleMapClick: function (latlng) {
            const x = Math.round(latlng.lng);
            const y = Math.round(latlng.lat);

            if (this.clickMarker) {
                this.map.removeLayer(this.clickMarker);
            }
            this.clickMarker = L.marker(latlng, { icon: this.createPinIcon(), keyboard: false }).addTo(this.map);

            // Open loading panel immediately
            this.renderPopup(latlng, { loading: true, x, y });

            // Query Government GIS Database directly via Lambda API
            const survey = this.currentSurvey;
            const sheet = this.currentSheet;
            const queryUrl = `${this.apiBaseUrl}/api/bihar-plot?x=${x}&y=${y}&survey=${survey}&sheet=${sheet}`;
            fetch(queryUrl)
                .then(res => res.json())
                .then(data => {
                    // Ignore stale responses after the user tapped elsewhere
                    if (!this.clickMarker || !this.clickMarker.getLatLng().equals(latlng)) return;
                    if (data && data.success && data.has_data === 'Y' && data.plotNo && String(data.plotNo) !== '-1') {
                        this.renderPopup(latlng, {
                            plotNo: data.plotNo,
                            pniu: data.pniu,
                            gis_code: data.gis_code,
                            survey: data.survey || survey,
                            sheet: data.sheet !== undefined ? parseInt(data.sheet, 10) : sheet,
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
                    <div class="map-plot-popup">
                        <div class="mpp-loading">
                            <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                            सरकारी भू-अभिलेख से जांच जारी...
                        </div>
                    </div>
                `;
            } else if (plot.notFound) {
                html = `
                    <div class="map-plot-popup">
                        <div class="mpp-header">
                            <span class="mpp-badge"><i class="fas fa-landmark"></i> मौजा: सरथुआ (${this.currentSurvey === 'CS' ? 'CS 1911' : 'RS 1970'})</span>
                            <h2 class="mpp-title">भू-निर्देशांक बिंदु</h2>
                        </div>
                        <div class="mpp-body">
                            <div class="mpp-row"><span>GIS X</span> <strong>${plot.x}</strong></div>
                            <div class="mpp-row"><span>GIS Y</span> <strong>${plot.y}</strong></div>
                            <div class="mpp-row"><span>चादर</span> <strong>${this.getSheetLabel(this.currentSheet)}</strong></div>
                            <div class="mpp-row"><span>थाना नं</span> <strong>218 (उदवंतनगर)</strong></div>
                        </div>
                        <p class="mpp-note">इस बिंदु पर कोई प्लॉट नहीं मिला। थोड़ा ज़ूम करके प्लॉट के अंदर टैप करें।</p>
                    </div>
                `;
            } else {
                const isCS = plot.survey === 'CS';
                html = `
                    <div class="map-plot-popup">
                        <div class="mpp-header">
                            <span class="mpp-badge"><i class="fas fa-check-circle" style="color: #34d399;"></i> प्रमाणित सरकारी भू-प्लॉट</span>
                            <h2 class="mpp-title">खेसरा संख्या: ${plot.plotNo}</h2>
                        </div>
                        <div class="mpp-body">
                            <div class="mpp-row"><span>PNIU कोड</span> <strong class="mpp-mono">${plot.pniu || 'उपलब्ध'}</strong></div>
                            <div class="mpp-row"><span>सर्वेक्षण</span> <strong>${isCS ? '1911 कैडस्ट्रल' : '1970 रिविजनल'}</strong></div>
                            <div class="mpp-row"><span>चादर संख्या</span> <strong>${this.getSheetLabel(plot.sheet)}</strong></div>
                            <div class="mpp-row"><span>मौजा / थाना</span> <strong>सरथुआ (218)</strong></div>
                        </div>
                        <div class="mpp-actions">
                            <a href="${isCS ? 'cadastral-survey' : 'revisional-survey'}" target="_blank">
                                <i class="fas fa-book"></i> ${isCS ? '1911' : '1970'} खतियान
                            </a>
                            <a href="jamabandi" target="_blank" class="mpp-secondary">
                                <i class="fas fa-file-invoice"></i> जमाबंदी देखें
                            </a>
                        </div>
                    </div>
                `;
            }

            this.openPlotSheet(html, latlng);
        },

        // Plot details: bottom sheet on phones, side card on desktop
        openPlotSheet: function (html, latlng) {
            const sheet = document.getElementById('mvPlotSheet');
            const content = document.getElementById('mvPlotContent');
            if (!sheet || !content) return;
            content.innerHTML = html;
            sheet.classList.add('open');

            // On phones the sheet covers the lower map; lift the pin above it
            if (latlng && this.map && this.isMobile()) {
                requestAnimationFrame(() => {
                    const pt = this.map.latLngToContainerPoint(latlng);
                    const visibleBottom = this.map.getSize().y - sheet.offsetHeight - 24;
                    if (pt.y > visibleBottom) this.map.panBy([0, pt.y - visibleBottom + 40]);
                });
            }
        },

        closePlotSheet: function () {
            const sheet = document.getElementById('mvPlotSheet');
            if (sheet) sheet.classList.remove('open');
            if (this.clickMarker && this.map) {
                this.map.removeLayer(this.clickMarker);
                this.clickMarker = null;
            }
        },

        showToast: function (msg) {
            const toast = document.getElementById('mvToast');
            if (!toast) return;
            toast.textContent = msg;
            toast.classList.add('show');
            clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
        },

        toggleInfo: function (open) {
            const drawer = document.getElementById('mvInfo');
            const btn = document.getElementById('mvInfoBtn');
            if (!drawer) return;
            drawer.classList.toggle('open', open);
            drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
            if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open) {
                const closeBtn = drawer.querySelector('button');
                if (closeBtn) closeBtn.focus();
            } else if (btn) {
                btn.focus();
            }
        },

        // Reflect survey/sheet in the tab title, subtitle and a shareable URL.
        // On a plain /map-viewer load the SEO <title> and clean URL are kept as-is
        // (search engines index the rendered title).
        updatePageState: function (initial) {
            const surveyShort = this.currentSurvey === 'CS' ? '1911 CS' : '1970 RS';
            const sheetLabel = this.getSheetLabel(this.currentSheet);
            const sub = document.getElementById('mvSubtitleText') || document.getElementById('mvSubtitle');
            if (sub) sub.textContent = `मौजा सरथुआ • थाना 218 • ${surveyShort} • ${sheetLabel}`;

            const search = new URLSearchParams(window.location.search);
            if (initial && !search.has('survey') && !search.has('sheet')) return;

            document.title = `${surveyShort} ${sheetLabel} - सरथुआ भू-नक्शा (GIS Map Viewer) | थाना 218`;

            if (window.history && history.replaceState) {
                const params = new URLSearchParams(window.location.search);
                params.set('survey', this.currentSurvey);
                params.set('sheet', String(this.currentSheet));
                history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
            }
        },

        syncSurveyButtons: function () {
            document.querySelectorAll('.map-survey-btn').forEach(btn => {
                const on = btn.getAttribute('data-survey') === this.currentSurvey;
                btn.classList.toggle('active', on);
                btn.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
        },

        searchPlot: function (khasraNo) {
            const input = document.getElementById('mapKhasraSearchInput');
            const query = String(khasraNo || (input && input.value) || '').trim();
            if (!query) {
                this.showToast('कृपया खेसरा संख्या दर्ज करें (उदा. 64, 763)');
                if (input) input.focus();
                return;
            }
            if (!this.khasraIndex) {
                this.showToast('खेसरा इंडेक्स लोड हो रहा है, कृपया एक क्षण बाद दोबारा प्रयास करें।');
                return;
            }
            // Dismiss the on-screen keyboard so the result is visible
            if (input) input.blur();

            let found = null;
            let targetSurvey = this.currentSurvey;

            if (this.khasraIndex[this.currentSurvey] && this.khasraIndex[this.currentSurvey][query]) {
                found = this.khasraIndex[this.currentSurvey][query];
            } else {
                const other = this.currentSurvey === 'RS' ? 'CS' : 'RS';
                if (this.khasraIndex[other] && this.khasraIndex[other][query]) {
                    found = this.khasraIndex[other][query];
                    targetSurvey = other;
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
                this.showToast(`खेसरा संख्या ${query} इंडेक्स में नहीं मिला।`);
            }
        },

        switchSurvey: function (survey) {
            if (this.currentSurvey === survey || !SHEET_CONFIG[survey]) return;
            this.currentSurvey = survey;
            this.currentSheet = 1;

            this.syncSurveyButtons();
            this.closePlotSheet();
            this.renderSheetSwitcher();
            this.fitToActiveSheet();
            this.updateWms();
            this.updateDownloadLink();
            this.updatePageState();
        },

        switchSheet: function (sheet) {
            sheet = parseInt(sheet, 10);
            if (this.currentSheet === sheet) return;
            this.currentSheet = sheet;

            document.querySelectorAll('.map-sheet-btn').forEach(btn => {
                const on = parseInt(btn.getAttribute('data-sheet'), 10) === sheet;
                btn.classList.toggle('active', on);
                btn.setAttribute('aria-pressed', on ? 'true' : 'false');
                if (on && btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            });

            this.closePlotSheet();
            this.fitToActiveSheet();
            this.updateWms();
            this.updateDownloadLink();
            this.updatePageState();
        },

        renderSheetSwitcher: function () {
            const wrap = document.getElementById('mapSheetSwitcherWrap');
            if (!wrap) return;

            const sInfo = SHEET_CONFIG[this.currentSurvey];
            if (!sInfo) return;

            let html = '<span class="sheet-switcher-label"><i class="fas fa-map" aria-hidden="true"></i> चादर</span>';
            for (const sheetNo of Object.keys(sInfo.sheets)) {
                const sheetNum = parseInt(sheetNo, 10);
                const on = sheetNum === this.currentSheet;
                const label = sheetNum === 0 ? 'पूरा मौजा' : (sheetNum < 10 ? '0' + sheetNum : '' + sheetNum);
                html += `<button type="button" class="map-sheet-btn${on ? ' active' : ''}" data-sheet="${sheetNum}" aria-pressed="${on}" onclick="SarthuaMapViewer.switchSheet(${sheetNum})">${label}</button>`;
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
                this.closePlotSheet();
                this.fitToActiveSheet();
            }
        },

        toggleFullscreen: function () {
            const root = document.documentElement;
            if (!document.fullscreenElement) {
                if (!root.requestFullscreen) {
                    this.showToast('इस ब्राउज़र में फुल स्क्रीन उपलब्ध नहीं है।');
                    return;
                }
                root.requestFullscreen().catch(err => console.warn(err));
            } else {
                document.exitFullscreen().catch(err => console.warn(err));
            }
        }
    };

    window.SarthuaMapViewer = SarthuaMapViewer;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SarthuaMapViewer.init());
    } else {
        SarthuaMapViewer.init();
    }

})(window);
