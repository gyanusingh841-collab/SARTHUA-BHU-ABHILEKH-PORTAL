/**
 * Sarthua Bhu-Abhilekh Portal - Continuous Vertical Scrolling PDF Streaming & Reader Engine
 * - Continuous infinite/lazy-loading scroll (like Google Chrome / Acrobat) for 200+ page land records
 * - Virtualized rendering via IntersectionObserver & memory eviction to prevent browser crashes
 * - Synchronized floating dock page indicators (Page X / Total) and jump-to-page navigation
 * - Responsive zoom (Fit Width, Fit Page, Zoom In/Out, Pinch-to-zoom) and 90° rotation
 * - Strict anti-download and single-page official printing
 */

// Configure PDF.js Worker
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

const PdfViewerEngine = {
    state: {
        pdfDoc: null,
        currentPage: 1,
        totalPages: 0,
        zoomScale: 1.0,
        zoomMode: 'fit-width', // 'fit-width', 'fit-page', 'manual'
        rotation: 0,
        baseWidth: 0,
        baseHeight: 0,
        isLandscape: false,
        renderedPages: new Set(),
        renderingPages: new Set(),
        maxActiveCanvases: 18, // Optimal RAM limit while holding 5-page lookahead buffer
        bufferAheadCount: 5,   // Always keep 5 pages ahead preloaded in buffer
        pdfUrl: '',
        filename: '',
        observer: null,
        scrollRafId: null,
        isProgrammaticScroll: false,
        touch: {
            initialDist: 0,
            initialScale: 1.0,
            isPinching: false,
            startX: 0,
            startY: 0,
            lastTapTime: 0
        }
    },

    // Exact byte sizes for zero-head, zero-416 Cloudflare byte-range streaming
    exactFileSizes: {
        "Sarthua_Vol_01_1970.pdf": 2142456,
        "Sarthua_Vol_02_1970.pdf": 80187190,
        "Sarthua_Vol_04_1970.pdf": 55772939,
        "Sarthua_Vol_05_1970.pdf": 48353437,
        "Sarthua_Vol_06_1970.pdf": 40967162,
        "Sarthua_Vol_07_1970.pdf": 64510811,
        "Sarthua_Vol_08_1970.pdf": 1001503,
        "Sarthua_Vol_09_1970.pdf": 64703896,
        "Sarthua_Vol_10_1970.pdf": 45800453,
        "Sarthua_Vol_11_1970.pdf": 58086541,
        "Sarthua_Vol_11A_1970.pdf": 39566785,
        "Sarthua_Vol_12_1970.pdf": 47479605,
        "Sarthua_Vol_13_1970.pdf": 49792694,
        "Sarthua_Vol_14_1970.pdf": 27383637,
        "Sarthua_Vol_15_1970.pdf": 54683735,
        "Sarthua_Vol_16_1970.pdf": 52692837,
        "Sarthua_Vol_17_1970.pdf": 54421271,
        "Sarthua_Vol_18_1970.pdf": 50662823,
        "Sarthua_Vol_19_1970.pdf": 27911323,
        "Sarthua_Vol_20_1970.pdf": 20408480,
        "Sarthua_Vol_21_1970.pdf": 7944408,
        "Sarthua_Rev_01_1970.pdf": 46061704,
        "Sarthua_Rev_02_1970.pdf": 2855840,
        "Sarthua_Rev_03_1970.pdf": 30568610,
        "Sarthua_Rev_04_1970.pdf": 24570452,
        "Sarthua_Rev_05_1970.pdf": 35272704,
        "Sarthua_Rev_06_1970.pdf": 44960308,
        "Sarthua_Rev_07_1970.pdf": 56195847,
        "Sarthua_Rev_08_1970.pdf": 225419333,
        "Sarthua_Rev_09_1970.pdf": 219616525,
        "Sarthua_cs_01_1911.pdf": 143322712,
        "Sarthua_cs_02_1911.pdf": 147535938
    },

    // Initialize Viewer DOM Listeners
    init: function () {
        const prevBtn = document.getElementById('pdfPrevBtn');
        const nextBtn = document.getElementById('pdfNextBtn');
        const zoomInBtn = document.getElementById('pdfZoomInBtn');
        const zoomOutBtn = document.getElementById('pdfZoomOutBtn');
        const zoomResetBtn = document.getElementById('pdfZoomResetBtn');
        const fitModeBtn = document.getElementById('pdfFitModeBtn');
        const rotateBtn = document.getElementById('pdfRotateBtn');
        const printBtn = document.getElementById('pdfPrintBtn');
        const fullscreenBtn = document.getElementById('pdfFullscreenBtn');
        const closeBtn = document.getElementById('pdfCloseBtn');
        const pageInput = document.getElementById('pdfPageNumInput');
        const modal = document.getElementById('pdfViewerModal');
        const viewport = document.getElementById('pdfViewport');

        // 🔒 Strict Anti-Download / Anti-Copy Protections
        const preventSave = (e) => {
            e.preventDefault();
            return false;
        };

        if (modal) {
            modal.addEventListener('contextmenu', preventSave);
            modal.addEventListener('dragstart', preventSave);
        }
        if (viewport) {
            viewport.addEventListener('contextmenu', preventSave);
            viewport.addEventListener('dragstart', preventSave);
        }

        // Block Ctrl+S, Ctrl+U, etc., and let Ctrl+P trigger single-page official print
        window.addEventListener('keydown', (e) => {
            const isModalOpen = modal && !modal.classList.contains('hidden');
            if (!isModalOpen) return;

            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                e.stopPropagation();
                this.printCurrentView();
                return false;
            }

            if ((e.ctrlKey || e.metaKey) && ['s', 'S', 'u', 'U'].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);

        // Fullscreen changes
        document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));

        // Window resize debounced re-calculation for fit modes
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            if (!this.state.pdfDoc || (modal && modal.classList.contains('hidden'))) return;
            if (this.state.zoomMode === 'fit-width' || this.state.zoomMode === 'fit-page') {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    this.recalculateAndApplyZoom();
                }, 200);
            }
        });

        // Prev Page (Scrolls smoothly to previous page)
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.state.currentPage > 1) {
                    this.scrollToPage(this.state.currentPage - 1);
                }
            });
        }

        // Next Page (Scrolls smoothly to next page)
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.state.currentPage < this.state.totalPages) {
                    this.scrollToPage(this.state.currentPage + 1);
                }
            });
        }

        // Zoom In (+)
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setZoom(this.state.zoomScale * 1.25);
            });
        }

        // Zoom Out (-)
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setZoom(this.state.zoomScale / 1.25);
            });
        }

        // Zoom Reset / Percent Click: Cycle between Fit-Width and 100%
        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.state.zoomMode === 'fit-width') {
                    this.setZoom(1.0);
                } else {
                    this.state.zoomMode = 'fit-width';
                    this.recalculateAndApplyZoom();
                }
            });
        }

        // Fit Mode Toggle (Fit Width vs Fit Page)
        if (fitModeBtn) {
            fitModeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.state.zoomMode === 'fit-width') {
                    this.state.zoomMode = 'fit-page';
                    fitModeBtn.innerHTML = '<i class="fas fa-expand-arrows-alt"></i><span class="pdf-btn-label">पूरा पेज</span>';
                    fitModeBtn.classList.add('active');
                } else {
                    this.state.zoomMode = 'fit-width';
                    fitModeBtn.innerHTML = '<i class="fas fa-arrows-alt-h"></i><span class="pdf-btn-label">चौड़ाई</span>';
                    fitModeBtn.classList.remove('active');
                }
                this.recalculateAndApplyZoom();
            });
        }

        // Rotate 90 deg
        if (rotateBtn) {
            rotateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.rotate();
            });
        }

        // Print Active Page
        if (printBtn) {
            printBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.printCurrentView();
            });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFullscreen();
            });
        }

        // Close
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.close();
            });
        }

        // Page Input Jump
        if (pageInput) {
            pageInput.addEventListener('change', (e) => {
                let val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= this.state.totalPages) {
                    this.scrollToPage(val);
                } else {
                    e.target.value = this.state.currentPage;
                }
            });
            pageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    pageInput.blur();
                }
            });
        }

        // Viewport scroll listener for active page tracking
        if (viewport) {
            viewport.addEventListener('scroll', () => {
                if (this.state.isProgrammaticScroll) return;
                if (this.state.scrollRafId) cancelAnimationFrame(this.state.scrollRafId);
                this.state.scrollRafId = requestAnimationFrame(() => {
                    this.handleViewportScroll();
                });
            }, { passive: true });
        }

        // Setup Touch Gestures (Pinch-to-zoom, Double-tap)
        this.setupTouchAndInteractions(viewport);
    },

    // Setup Touch & Interactive Viewport Handling
    setupTouchAndInteractions: function (viewport) {
        if (!viewport) return;

        viewport.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                // Two fingers: Pinch-to-zoom start
                this.state.touch.isPinching = true;
                this.state.touch.initialDist = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                this.state.touch.initialScale = this.state.zoomScale;
            } else if (e.touches.length === 1) {
                this.state.touch.isPinching = false;
                this.state.touch.startX = e.touches[0].pageX;
                this.state.touch.startY = e.touches[0].pageY;
            }
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            if (this.state.touch.isPinching) {
                this.state.touch.isPinching = false;
                if (this.state.touch.initialDist > 0 && e.changedTouches.length > 0) {
                    const currentDist = Math.hypot(
                        e.changedTouches[0].pageX - (e.touches[0]?.pageX || this.state.touch.startX),
                        e.changedTouches[0].pageY - (e.touches[0]?.pageY || this.state.touch.startY)
                    );
                    const pinchRatio = currentDist > 0 ? (currentDist / this.state.touch.initialDist) : 1;
                    const targetScale = this.state.touch.initialScale * pinchRatio;
                    this.setZoom(targetScale);
                }
            } else if (e.changedTouches.length === 1) {
                const deltaX = Math.abs(e.changedTouches[0].pageX - this.state.touch.startX);
                const deltaY = Math.abs(e.changedTouches[0].pageY - this.state.touch.startY);

                // Double tap: toggle zoom between 1.8x and Fit-Width
                if (deltaX < 12 && deltaY < 12) {
                    const now = Date.now();
                    if (now - this.state.touch.lastTapTime < 320) {
                        if (this.state.zoomScale < 1.35) {
                            this.setZoom(1.8);
                        } else {
                            this.state.zoomMode = 'fit-width';
                            this.recalculateAndApplyZoom();
                        }
                        this.state.touch.lastTapTime = 0;
                    } else {
                        this.state.touch.lastTapTime = now;
                    }
                }
            }
        }, { passive: true });
    },

    // Open PDF Viewer Modal with Continuous Scroll Loading
    open: function (pdfUrl, filename, fileSizeBytes) {
        if (!pdfUrl || pdfUrl === "DOC NOT FOUND") {
            if (typeof AppView !== 'undefined' && AppView.showAlert) {
                AppView.showAlert('यह दस्तावेज़ उपलब्ध नहीं है।', 'error');
            } else {
                alert('यह दस्तावेज़ उपलब्ध नहीं है।');
            }
            return;
        }

        const modal = document.getElementById('pdfViewerModal');
        const titleEl = document.getElementById('pdfViewerTitle');
        const loadingOverlay = document.getElementById('pdfLoadingIndicator');
        const viewport = document.getElementById('pdfViewport');

        if (!modal) return;
        if (titleEl) titleEl.textContent = filename || 'PDF Viewer';

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        // Reset state
        this.cleanup();
        this.state.pdfUrl = pdfUrl;
        this.state.filename = filename || '';
        this.state.currentPage = 1;
        this.state.zoomMode = 'fit-width';
        this.state.rotation = 0;

        // Reset dock indicators
        const totalEl = document.getElementById('pdfTotalPagesCount');
        const pageInput = document.getElementById('pdfPageNumInput');
        if (totalEl) totalEl.textContent = '...';
        if (pageInput) {
            pageInput.value = 1;
            pageInput.max = 1;
        }

        // Resolve stream URL and handle Localhost / Cloudflare Hotlink Protection
        let streamUrl = pdfUrl;
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
        if (isLocalhost && pdfUrl.startsWith('https://docs.gyanu.online/')) {
            if (window.location.port === '8089') {
                streamUrl = `/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;
            } else {
                // If accessed via Live Server (e.g. port 5500) or file://, proxy via active dev_server on port 8089
                streamUrl = `http://localhost:8089/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;
            }
        }

        // Determine exact file size to prevent both Cloudflare 403 HEAD block and 416 Out of Range error
        const exactSize = this.exactFileSizes[filename] || (fileSizeBytes > 100000 ? fileSizeBytes : 0);

        // Byte-Range streaming parameters
        const docParams = {
            url: streamUrl,
            disableRange: false,
            disableStream: true,
            disableAutoFetch: true
        };
        if (exactSize > 0) {
            docParams.length = exactSize;
        }

        pdfjsLib.getDocument(docParams).promise.then(async (pdf) => {
            this.state.pdfDoc = pdf;
            this.state.totalPages = pdf.numPages;

            if (totalEl) totalEl.textContent = pdf.numPages;
            if (pageInput) {
                pageInput.value = 1;
                pageInput.max = pdf.numPages;
            }

            // Fetch Page 1 to inspect base aspect ratio
            const firstPage = await pdf.getPage(1);
            const unscaled = firstPage.getViewport({ scale: 1.0, rotation: 0 });
            this.state.baseWidth = unscaled.width;
            this.state.baseHeight = unscaled.height;
            this.state.isLandscape = unscaled.width > unscaled.height;

            const badge = document.getElementById('pdfDocBadge');
            if (badge) {
                badge.textContent = this.state.isLandscape ? 'रजिस्टर (Landscape)' : 'पोर्ट्रेट';
            }

            // Calculate initial zoom scale
            this.calculateScale();

            // Build all page placeholders for 1..totalPages
            this.buildPageCards();

            // Initialize IntersectionObserver for progressive on-demand page loading
            this.setupObserver();

            if (loadingOverlay) loadingOverlay.classList.add('hidden');

            // Scroll viewport to top and start 5-page lookahead buffer
            if (viewport) viewport.scrollTop = 0;
            this.updateDockState();

            // Immediately render Page 1 and preload next 5 pages in buffer
            this.renderPageCard(1, () => {
                this.preloadBuffer(1);
            });

        }).catch((err) => {
            console.error('PDF load error:', err);
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            let errorMsg = 'PDF लोड करने में समस्या आई।';
            if (window.location.protocol === 'file:') {
                errorMsg = 'Local File (file://) पर CORS ब्लॉक होता है। "python dev_server.py" चलाएं और http://localhost:8089 से खोलें।';
            } else if (err && (err.name === 'MissingPDFException' || String(err).includes('403') || err.status === 403)) {
                if (isLocalhost) {
                    errorMsg = 'Cloudflare Security 403: Localhost पर देखने हेतु "python dev_server.py" (पोर्ट 8089) चालू रखें, या gyanu.online डोमेन से खोलें।';
                } else {
                    errorMsg = 'Cloudflare Security 403: यह फ़ाइल केवल gyanu.online डोमेन से अधिकृत है।';
                }
            } else if (err && (String(err).includes('416') || err.status === 416)) {
                errorMsg = 'Range 416 Error: फ़ाइल का साइज़ अमान्य था। पुनः प्रयास करें।';
            }

            if (typeof AppView !== 'undefined' && AppView.showAlert) {
                AppView.showAlert(errorMsg, 'error');
            } else {
                alert(errorMsg);
            }
            this.close();
        });
    },

    // Calculate Scale based on Viewport & Fit Mode
    calculateScale: function () {
        const viewport = document.getElementById('pdfViewport');
        if (!viewport || !this.state.baseWidth) return;

        const isMobile = window.innerWidth <= 768;
        const padX = isMobile ? 24 : 48;
        const padY = isMobile ? 84 : 110;
        const containerW = Math.max(300, viewport.clientWidth - padX);
        const containerH = Math.max(300, viewport.clientHeight - padY);

        const isRotated90 = (this.state.rotation === 90 || this.state.rotation === 270);
        const naturalW = isRotated90 ? this.state.baseHeight : this.state.baseWidth;
        const naturalH = isRotated90 ? this.state.baseWidth : this.state.baseHeight;

        if (this.state.zoomMode === 'fit-width') {
            let targetW = containerW;
            if (this.state.isLandscape && isMobile) {
                targetW = Math.max(containerW, 680);
            }
            const calcScale = targetW / naturalW;
            this.state.zoomScale = Math.min(4.0, Math.max(0.3, Number(calcScale.toFixed(2))));
        } else if (this.state.zoomMode === 'fit-page') {
            const scaleW = containerW / naturalW;
            const scaleH = containerH / naturalH;
            const calcScale = Math.min(scaleW, scaleH);
            this.state.zoomScale = Math.min(4.0, Math.max(0.3, Number(calcScale.toFixed(2))));
        }

        const zoomText = document.getElementById('pdfZoomPercent');
        if (zoomText) {
            zoomText.textContent = `${Math.round(this.state.zoomScale * 100)}%`;
        }
    },

    // Build Page Card Elements for all Pages (Continuous Vertical Flow)
    buildPageCards: function () {
        const container = document.getElementById('pdfPagesContainer');
        if (!container || !this.state.totalPages) return;

        container.innerHTML = '';

        const isRotated90 = (this.state.rotation === 90 || this.state.rotation === 270);
        const naturalW = isRotated90 ? this.state.baseHeight : this.state.baseWidth;
        const naturalH = isRotated90 ? this.state.baseWidth : this.state.baseHeight;

        const cardWidth = Math.floor(naturalW * this.state.zoomScale);
        const cardHeight = Math.floor(naturalH * this.state.zoomScale);

        const fragment = document.createDocumentFragment();

        for (let p = 1; p <= this.state.totalPages; p++) {
            const card = document.createElement('div');
            card.className = 'pdf-page-card';
            card.id = `pdf-page-${p}`;
            card.dataset.page = p;
            card.style.width = `${cardWidth}px`;
            card.style.height = `${cardHeight}px`;
            card.style.minHeight = `${cardHeight}px`;

            // Page Number Badge at Top-Right
            const badge = document.createElement('div');
            badge.className = 'pdf-page-badge';
            badge.textContent = `पेज ${p} / ${this.state.totalPages}`;

            // Skeleton Placeholder
            const skeleton = document.createElement('div');
            skeleton.className = 'pdf-page-skeleton';
            skeleton.id = `pdf-skeleton-${p}`;
            skeleton.innerHTML = `
                <div class="spinner-mini"></div>
                <span>पेज ${p} लोड हो रहा है...</span>
            `;

            card.appendChild(badge);
            card.appendChild(skeleton);
            fragment.appendChild(card);
        }

        container.appendChild(fragment);
    },

    // Setup Virtualized IntersectionObserver for Continuous Scroll Lazy-Loading
    setupObserver: function () {
        if (this.state.observer) {
            this.state.observer.disconnect();
        }

        const viewport = document.getElementById('pdfViewport');
        if (!viewport) return;

        // RootMargin: preload only the adjacent upcoming page (~250px) as the user scrolls
        const observerOptions = {
            root: viewport,
            rootMargin: '250px 0px 250px 0px',
            threshold: 0.01
        };

        this.state.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const pageNum = parseInt(entry.target.dataset.page, 10);
                if (isNaN(pageNum)) return;

                if (entry.isIntersecting) {
                    // Page is in or near viewport -> Render page canvas
                    this.renderPageCard(pageNum);
                } else {
                    // Page is far away -> Evict distant canvas to preserve RAM on mobile
                    if (Math.abs(pageNum - this.state.currentPage) > 5 &&
                        this.state.renderedPages.size > this.state.maxActiveCanvases) {
                        this.unloadPageCard(pageNum);
                    }
                }
            });
        }, observerOptions);

        // Observe all page cards
        const cards = document.querySelectorAll('.pdf-page-card');
        cards.forEach(card => this.state.observer.observe(card));
    },

    // Render a Single Page inside its Card Container
    renderPageCard: function (pageNum, onComplete) {
        if (!this.state.pdfDoc) return;
        if (this.state.renderedPages.has(pageNum)) {
            if (typeof onComplete === 'function') onComplete();
            return;
        }
        if (this.state.renderingPages.has(pageNum)) return;

        const card = document.getElementById(`pdf-page-${pageNum}`);
        if (!card) return;

        this.state.renderingPages.add(pageNum);

        this.state.pdfDoc.getPage(pageNum).then(page => {
            const viewport = page.getViewport({ scale: this.state.zoomScale, rotation: this.state.rotation });
            const outputScale = Math.min(2.0, window.devicePixelRatio || 1); // Cap at 2 for performance

            // Ensure card matches exact rendered dimensions
            const styledW = Math.floor(viewport.width);
            const styledH = Math.floor(viewport.height);
            card.style.width = `${styledW}px`;
            card.style.height = `${styledH}px`;
            card.style.minHeight = `${styledH}px`;

            // Reuse or create canvas element
            let canvas = card.querySelector('canvas.pdf-page-canvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.className = 'pdf-page-canvas';
                card.appendChild(canvas);

                // Anti-save / Anti-drag on canvas
                canvas.addEventListener('contextmenu', (e) => e.preventDefault());
                canvas.addEventListener('dragstart', (e) => e.preventDefault());
            }

            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = `${styledW}px`;
            canvas.style.height = `${styledH}px`;

            const ctx = canvas.getContext('2d');
            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

            const renderTask = page.render({
                canvasContext: ctx,
                transform: transform,
                viewport: viewport
            });

            this.state.renderTasks[pageNum] = renderTask;

            renderTask.promise.then(() => {
                delete this.state.renderTasks[pageNum];
                this.state.renderingPages.delete(pageNum);
                this.state.renderedPages.add(pageNum);

                // Hide skeleton
                const skeleton = document.getElementById(`pdf-skeleton-${pageNum}`);
                if (skeleton) skeleton.classList.add('hidden');

                // Check and enforce memory limit
                if (this.state.renderedPages.size > this.state.maxActiveCanvases) {
                    this.evictDistantPages();
                }

                if (typeof onComplete === 'function') onComplete();
            }).catch((err) => {
                delete this.state.renderTasks[pageNum];
                this.state.renderingPages.delete(pageNum);
                if (err?.name !== 'RenderingCancelledException') {
                    console.warn(`Render cancelled/failed for page ${pageNum}`);
                }
                if (typeof onComplete === 'function') onComplete();
            });
        }).catch(() => {
            this.state.renderingPages.delete(pageNum);
            if (typeof onComplete === 'function') onComplete();
        });
    },

    // Sequential background preloader to keep 5 pages preloaded ahead
    preloadBuffer: function (currentNum) {
        if (!this.state.pdfDoc) return;
        const targetPage = currentNum || this.state.currentPage;

        // Build priority queue: next 5 pages ahead, then 1-2 pages behind
        const targetQueue = [];
        for (let i = 1; i <= 5; i++) {
            const pAhead = targetPage + i;
            if (pAhead <= this.state.totalPages) targetQueue.push(pAhead);
        }
        for (let i = 1; i <= 2; i++) {
            const pBehind = targetPage - i;
            if (pBehind >= 1) targetQueue.push(pBehind);
        }

        // Find the first unrendered and non-rendering page in the buffer queue
        const nextToRender = targetQueue.find(p => !this.state.renderedPages.has(p) && !this.state.renderingPages.has(p));
        if (nextToRender) {
            setTimeout(() => {
                if (!this.state.pdfDoc) return;
                if (!this.state.renderedPages.has(nextToRender) && !this.state.renderingPages.has(nextToRender)) {
                    this.renderPageCard(nextToRender, () => {
                        // Once rendered, chain to preload the next page in buffer
                        this.preloadBuffer(this.state.currentPage);
                    });
                }
            }, 60);
        }
    },

    // Unload Canvas from Card (Preserves placeholder dimensions and scroll stability)
    unloadPageCard: function (pageNum) {
        if (!this.state.renderedPages.has(pageNum)) return;

        const card = document.getElementById(`pdf-page-${pageNum}`);
        if (!card) return;

        const canvas = card.querySelector('canvas.pdf-page-canvas');
        if (canvas) {
            canvas.width = 1;
            canvas.height = 1;
            canvas.remove();
        }

        const skeleton = document.getElementById(`pdf-skeleton-${pageNum}`);
        if (skeleton) skeleton.classList.remove('hidden');

        this.state.renderedPages.delete(pageNum);
    },

    // Evict Distant Pages to keep RAM bounded on 200-page files while preserving 5-page buffer
    evictDistantPages: function () {
        const pages = Array.from(this.state.renderedPages);
        pages.sort((a, b) => {
            return Math.abs(b - this.state.currentPage) - Math.abs(a - this.state.currentPage);
        });

        while (pages.length > 0 && this.state.renderedPages.size > this.state.maxActiveCanvases) {
            const furthest = pages.shift();
            // Never evict any page within 6 pages of the current page
            if (Math.abs(furthest - this.state.currentPage) > 6) {
                this.unloadPageCard(furthest);
            } else {
                break;
            }
        }
    },

    // Track Visible Page from Viewport Scroll Position
    handleViewportScroll: function () {
        const viewport = document.getElementById('pdfViewport');
        if (!viewport || !this.state.totalPages) return;

        const viewportRect = viewport.getBoundingClientRect();
        const viewportMidY = viewportRect.top + viewportRect.height * 0.35;

        // Find which page is at the reading line
        const cards = document.querySelectorAll('.pdf-page-card');
        let closestPage = this.state.currentPage;
        let minDistance = Infinity;

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Distance from card center to viewport reading line
            const cardMidY = (rect.top + rect.bottom) / 2;
            const dist = Math.abs(cardMidY - viewportMidY);

            if (dist < minDistance) {
                minDistance = dist;
                closestPage = parseInt(card.dataset.page, 10);
            }
        });

        if (closestPage !== this.state.currentPage && closestPage >= 1 && closestPage <= this.state.totalPages) {
            this.state.currentPage = closestPage;
            this.updateDockState();
            // Replenish 5-page lookahead buffer as user scrolls
            this.preloadBuffer(closestPage);
        }
    },

    // Update Bottom Dock Inputs and Buttons
    updateDockState: function () {
        const pageInput = document.getElementById('pdfPageNumInput');
        const prevBtn = document.getElementById('pdfPrevBtn');
        const nextBtn = document.getElementById('pdfNextBtn');

        if (pageInput && document.activeElement !== pageInput) {
            pageInput.value = this.state.currentPage;
        }
        if (prevBtn) prevBtn.disabled = (this.state.currentPage <= 1);
        if (nextBtn) nextBtn.disabled = (this.state.currentPage >= this.state.totalPages);
    },

    // Smoothly Scroll to Specified Page
    scrollToPage: function (pageNum, behavior = 'smooth') {
        if (!this.state.totalPages) return;
        if (pageNum < 1) pageNum = 1;
        if (pageNum > this.state.totalPages) pageNum = this.state.totalPages;

        const card = document.getElementById(`pdf-page-${pageNum}`);
        if (!card) return;

        this.state.currentPage = pageNum;
        this.updateDockState();
        this.preloadBuffer(pageNum);

        this.state.isProgrammaticScroll = true;
        card.scrollIntoView({ behavior: behavior, block: 'start' });

        // Temporarily ignore scroll event updates during smooth animation
        setTimeout(() => {
            this.state.isProgrammaticScroll = false;
        }, 450);
    },

    // Alias for controller backwards compatibility
    renderPage: function (pageNum) {
        if (pageNum && !isNaN(pageNum)) {
            this.scrollToPage(pageNum);
        }
    },

    // Set Zoom with Current Reading Anchor Preservation
    setZoom: function (targetScale) {
        const clampedScale = Math.min(4.0, Math.max(0.3, Number(targetScale.toFixed(2))));
        if (clampedScale === this.state.zoomScale && this.state.zoomMode === 'manual') return;

        this.state.zoomMode = 'manual';
        this.state.zoomScale = clampedScale;

        const fitModeBtn = document.getElementById('pdfFitModeBtn');
        if (fitModeBtn) fitModeBtn.classList.remove('active');

        this.applyZoomToAllCards();
    },

    // Recalculate Zoom for Fit-Width / Fit-Page and Apply
    recalculateAndApplyZoom: function () {
        this.calculateScale();
        this.applyZoomToAllCards();
    },

    // Apply New Scale to All Cards and Re-Render
    applyZoomToAllCards: function () {
        const zoomText = document.getElementById('pdfZoomPercent');
        if (zoomText) {
            zoomText.textContent = `${Math.round(this.state.zoomScale * 100)}%`;
        }

        const isRotated90 = (this.state.rotation === 90 || this.state.rotation === 270);
        const naturalW = isRotated90 ? this.state.baseHeight : this.state.baseWidth;
        const naturalH = isRotated90 ? this.state.baseWidth : this.state.baseHeight;

        const cardWidth = Math.floor(naturalW * this.state.zoomScale);
        const cardHeight = Math.floor(naturalH * this.state.zoomScale);

        // Cancel running render tasks
        Object.keys(this.state.renderTasks).forEach(p => {
            try { this.state.renderTasks[p]?.cancel(); } catch (_) { }
        });
        this.state.renderTasks = {};
        this.state.renderingPages.clear();
        this.state.renderedPages.clear();

        // Update dimensions of all cards
        const cards = document.querySelectorAll('.pdf-page-card');
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
            card.style.height = `${cardHeight}px`;
            card.style.minHeight = `${cardHeight}px`;

            const canvas = card.querySelector('canvas.pdf-page-canvas');
            if (canvas) canvas.remove();

            const skeleton = card.querySelector('.pdf-page-skeleton');
            if (skeleton) skeleton.classList.remove('hidden');
        });

        // Re-align to current reading page smoothly
        this.scrollToPage(this.state.currentPage, 'auto');

        // Trigger observer to re-render pages now in view
        setTimeout(() => {
            this.setupObserver();
        }, 50);
    },

    // Rotate 90 Degrees Clockwise
    rotate: function () {
        this.state.rotation = (this.state.rotation + 90) % 360;
        this.applyZoomToAllCards();
    },

    // Print Active Page with Official Watermark Header & Footer
    printCurrentView: function () {
        const currentCard = document.getElementById(`pdf-page-${this.state.currentPage}`);
        let canvas = currentCard ? currentCard.querySelector('canvas.pdf-page-canvas') : null;

        const doPrint = (canvasEl) => {
            try {
                const dataUrl = canvasEl.toDataURL('image/png');
                const printWin = window.open('', '_blank');
                if (!printWin) {
                    if (typeof AppView !== 'undefined' && AppView.showAlert) {
                        AppView.showAlert('कृपया प्रिंट के लिए पॉपअप विंडो की अनुमति दें।', 'error');
                    }
                    return;
                }

                printWin.document.write(`
                    <!DOCTYPE html>
                    <html lang="hi">
                    <head>
                        <meta charset="UTF-8">
                        <title>प्रिंट - ${this.state.filename || 'सरथुआ भू-अभिलेख'} (पेज ${this.state.currentPage})</title>
                        <style>
                            body { margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; font-family: sans-serif; }
                            .print-header { width: 100%; text-align: center; margin-bottom: 12px; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; }
                            .print-header h2 { margin: 0 0 4px 0; font-size: 16px; color: #1e3a8a; }
                            .print-header p { margin: 0; font-size: 12px; color: #555; }
                            img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
                            .print-footer { margin-top: 15px; font-size: 10px; color: #777; text-align: center; }
                            @media print { body { padding: 0; } img { max-height: 94vh; } }
                        </style>
                    </head>
                    <body>
                        <div class="print-header">
                            <h2>सरथुआ भू-अभिलेख पोर्टल | ग्राम: सरथुआ, थाना: 218, भोजपुर (बिहार)</h2>
                            <p>दस्तावेज़: <strong>${this.state.filename || ''}</strong> | पेज संख्या: <strong>${this.state.currentPage} / ${this.state.totalPages}</strong></p>
                        </div>
                        <img src="${dataUrl}" alt="Land Record Page" />
                        <div class="print-footer">
                            * यह प्रतिलिपि केवल जन-सूचना एवं अध्ययन हेतु है। विधिक प्रमाण हेतु अंचल कार्यालय से प्रमाणित प्रतिलिपि प्राप्त करें।
                        </div>
                    </body>
                    </html>
                `);
                printWin.document.close();
                printWin.focus();
                setTimeout(() => printWin.print(), 500);
            } catch (e) {
                if (typeof AppView !== 'undefined' && AppView.showAlert) {
                    AppView.showAlert('प्रिंट तैयार करने में त्रुटि आई।', 'error');
                }
            }
        };

        if (canvas) {
            doPrint(canvas);
        } else if (this.state.pdfDoc) {
            // Render active page offscreen if not yet loaded
            this.state.pdfDoc.getPage(this.state.currentPage).then(page => {
                const viewport = page.getViewport({ scale: 2.0, rotation: this.state.rotation });
                const offCanvas = document.createElement('canvas');
                offCanvas.width = viewport.width;
                offCanvas.height = viewport.height;
                const ctx = offCanvas.getContext('2d');
                page.render({ canvasContext: ctx, viewport: viewport }).promise.then(() => {
                    doPrint(offCanvas);
                });
            });
        }
    },

    // Toggle Fullscreen Mode
    toggleFullscreen: function () {
        const modal = document.getElementById('pdfViewerModal');
        if (!modal) return;

        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (modal.requestFullscreen) modal.requestFullscreen().catch(() => { });
            else if (modal.webkitRequestFullscreen) modal.webkitRequestFullscreen().catch(() => { });
        } else {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen().catch(() => { });
        }
    },

    handleFullscreenChange: function () {
        const btn = document.getElementById('pdfFullscreenBtn');
        if (!btn) return;
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            btn.innerHTML = '<i class="fas fa-compress"></i>';
            btn.title = 'फुलस्क्रीन से बाहर निकलें (Esc)';
        } else {
            btn.innerHTML = '<i class="fas fa-expand"></i>';
            btn.title = 'फुलस्क्रीन (Fullscreen)';
        }
    },

    // Cleanup resources
    cleanup: function () {
        if (this.state.observer) {
            this.state.observer.disconnect();
            this.state.observer = null;
        }
        if (this.state.scrollRafId) {
            cancelAnimationFrame(this.state.scrollRafId);
            this.state.scrollRafId = null;
        }
        Object.keys(this.state.renderTasks).forEach(p => {
            try { this.state.renderTasks[p]?.cancel(); } catch (_) { }
        });
        this.state.renderTasks = {};
        this.state.renderedPages.clear();
        this.state.renderingPages.clear();

        const container = document.getElementById('pdfPagesContainer');
        if (container) container.innerHTML = '';
    },

    // Close Viewer
    close: function () {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen().catch(() => { });
        }
        const modal = document.getElementById('pdfViewerModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        this.cleanup();
        if (this.state.pdfDoc) {
            try { this.state.pdfDoc.destroy(); } catch (_) { }
            this.state.pdfDoc = null;
        }
    }
};

window.PdfViewerEngine = PdfViewerEngine;
