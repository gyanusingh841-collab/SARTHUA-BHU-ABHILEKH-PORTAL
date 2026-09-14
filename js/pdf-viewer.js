/**
 * Sarthua Bhu-Abhilekh Portal - Modern Slim PDF Streaming & Reader Engine
 * Range-request streaming via Cloudflare R2 / Worker with offscreen canvas double-buffering.
 * Mobile-first touch gestures (pinch-zoom, double-tap), landscape auto-fit, and strict anti-download protection.
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
        preRenderedCanvases: {},
        isRendering: false,
        currentRenderTask: null,
        pageNumPending: null,
        pdfUrl: '',
        filename: '',
        isLandscape: false,
        touch: {
            initialDist: 0,
            initialScale: 1.0,
            isPinching: false,
            startX: 0,
            startY: 0,
            lastTapTime: 0
        }
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
        const fullscreenBtn = document.getElementById('pdfFullscreenBtn');
        const closeBtn = document.getElementById('pdfCloseBtn');
        const pageInput = document.getElementById('pdfPageNumInput');
        const modal = document.getElementById('pdfViewerModal');
        const viewport = document.getElementById('pdfViewport');
        const canvas = document.getElementById('pdfRenderCanvas');

        // 🔒 Strict Anti-Download / Anti-Copy / Anti-Save Protections
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
        if (canvas) {
            canvas.addEventListener('contextmenu', preventSave);
            canvas.addEventListener('dragstart', preventSave);
        }

        // Block Ctrl+S, Ctrl+P, Ctrl+U, etc. keyboard shortcuts when viewer is active
        window.addEventListener('keydown', (e) => {
            const isModalOpen = modal && !modal.classList.contains('hidden');
            if (!isModalOpen) return;

            if ((e.ctrlKey || e.metaKey) && ['s', 'S', 'p', 'P', 'u', 'U'].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);

        // Fullscreen changes
        document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));

        // Window resize debounced re-render for fit modes
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            if (!this.state.pdfDoc || (modal && modal.classList.contains('hidden'))) return;
            if (this.state.zoomMode === 'fit-width' || this.state.zoomMode === 'fit-page') {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    this.state.preRenderedCanvases = {};
                    this.renderPage(this.state.currentPage);
                }, 200);
            }
        });

        // Prev Page
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.state.currentPage > 1) {
                    this.renderPage(this.state.currentPage - 1);
                }
            });
        }

        // Next Page
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.state.currentPage < this.state.totalPages) {
                    this.renderPage(this.state.currentPage + 1);
                }
            });
        }

        // Zoom In (+) with smooth stepping and center preservation
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setZoom(this.state.zoomScale * 1.25);
            });
        }

        // Zoom Out (-) with smooth stepping and center preservation
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
                    this.state.preRenderedCanvases = {};
                    this.renderPage(this.state.currentPage);
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
                this.state.preRenderedCanvases = {};
                this.renderPage(this.state.currentPage);
            });
        }

        // Rotate 90 deg
        if (rotateBtn) {
            rotateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.state.rotation = (this.state.rotation + 90) % 360;
                this.state.preRenderedCanvases = {};
                this.renderPage(this.state.currentPage);
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

        // Page Input
        if (pageInput) {
            pageInput.addEventListener('change', (e) => {
                let val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= this.state.totalPages) {
                    this.renderPage(val);
                } else {
                    e.target.value = this.state.currentPage;
                }
            });
        }

        // Setup Touch Gestures (Pinch-to-zoom, Double-tap)
        this.setupTouchAndInteractions(viewport);
    },

    // Set Zoom with Scroll Position & Focus Point Preservation
    setZoom: function (targetScale, focusXRatio = 0.5, focusYRatio = 0.5) {
        const clampedScale = Math.min(4.0, Math.max(0.3, Number(targetScale.toFixed(2))));
        if (clampedScale === this.state.zoomScale && this.state.zoomMode === 'manual') return;

        const viewportEl = document.getElementById('pdfViewport');
        let focusX = 0.5, focusY = 0.5;
        if (viewportEl && viewportEl.scrollWidth > 0) {
            focusX = (viewportEl.scrollLeft + viewportEl.clientWidth * focusXRatio) / viewportEl.scrollWidth;
            focusY = (viewportEl.scrollTop + viewportEl.clientHeight * focusYRatio) / viewportEl.scrollHeight;
        }

        this.state.zoomMode = 'manual';
        this.state.zoomScale = clampedScale;
        this.state.preRenderedCanvases = {};

        this.renderPage(this.state.currentPage, () => {
            // Restore scroll focus seamlessly so content doesn't jump
            if (viewportEl && viewportEl.scrollWidth > 0) {
                viewportEl.scrollLeft = Math.round((focusX * viewportEl.scrollWidth) - (viewportEl.clientWidth * focusXRatio));
                viewportEl.scrollTop = Math.round((focusY * viewportEl.scrollHeight) - (viewportEl.clientHeight * focusYRatio));
            }
        });
    },

    // Touch & Interactive Viewport Handling
    setupTouchAndInteractions: function (viewport) {
        if (!viewport) return;
        const canvasWrapper = document.getElementById('pdfCanvasWrapper');

        // Touch gestures (Pinch-to-zoom, Double-tap)
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

        viewport.addEventListener('touchmove', (e) => {
            if (this.state.touch.isPinching && e.touches.length === 2 && canvasWrapper) {
                const currentDist = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                if (this.state.touch.initialDist > 0) {
                    const pinchRatio = currentDist / this.state.touch.initialDist;
                    canvasWrapper.style.transform = `scale(${pinchRatio})`;
                }
            }
        }, { passive: true });

        viewport.addEventListener('touchend', (e) => {
            if (this.state.touch.isPinching) {
                this.state.touch.isPinching = false;
                if (canvasWrapper) {
                    canvasWrapper.style.transform = 'none';
                }
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

                // If it was a tap (not a scroll gesture)
                if (deltaX < 12 && deltaY < 12) {
                    const now = Date.now();
                    if (now - this.state.touch.lastTapTime < 320) {
                        // Double tap: toggle zoom between 1.8x and Fit-Width
                        if (this.state.zoomScale < 1.35) {
                            const rect = viewport.getBoundingClientRect();
                            const tapXRatio = (e.changedTouches[0].clientX - rect.left) / (rect.width || 1);
                            const tapYRatio = (e.changedTouches[0].clientY - rect.top) / (rect.height || 1);
                            this.setZoom(1.8, tapXRatio, tapYRatio);
                        } else {
                            this.state.zoomMode = 'fit-width';
                            this.state.preRenderedCanvases = {};
                            this.renderPage(this.state.currentPage);
                        }
                        this.state.touch.lastTapTime = 0;
                    } else {
                        this.state.touch.lastTapTime = now;
                    }
                }
            }
        }, { passive: true });
    },

    // Open PDF Viewer Modal
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

        if (!modal) return;
        if (titleEl) titleEl.textContent = filename || 'PDF Viewer';

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        // Reset state
        if (this.state.currentRenderTask) {
            this.state.currentRenderTask.cancel();
            this.state.currentRenderTask = null;
        }
        this.state.pdfUrl = pdfUrl;
        this.state.filename = filename || '';
        this.state.currentPage = 1;
        this.state.zoomMode = 'fit-width';
        this.state.rotation = 0;
        this.state.preRenderedCanvases = {};
        this.state.isRendering = false;
        this.state.pageNumPending = null;

        // Byte-Range streaming parameters
        const docParams = {
            url: pdfUrl,
            disableRange: false,
            disableStream: true,
            disableAutoFetch: true
        };
        if (fileSizeBytes && fileSizeBytes > 0) {
            docParams.length = fileSizeBytes;
        }

        pdfjsLib.getDocument(docParams).promise.then(pdf => {
            this.state.pdfDoc = pdf;
            this.state.totalPages = pdf.numPages;

            const totalEl = document.getElementById('pdfTotalPagesCount');
            const pageInput = document.getElementById('pdfPageNumInput');
            if (totalEl) totalEl.textContent = pdf.numPages;
            if (pageInput) {
                pageInput.value = 1;
                pageInput.max = pdf.numPages;
            }

            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            this.renderPage(this.state.currentPage);
        }).catch(() => {
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            const errorMsg = (window.location.protocol === 'file:')
                ? 'Local File (file://) पर S3 PDF CORS ब्लॉक होता है। Live Server या Web Hosting से खोलें।'
                : 'PDF लोड करने में समस्या आई।';

            if (typeof AppView !== 'undefined' && AppView.showAlert) {
                AppView.showAlert(errorMsg, 'error');
            } else {
                alert(errorMsg);
            }
            this.close();
        });
    },

    // Render Target Page with Offscreen Double-Buffering & Smart Scale Calculation
    renderPage: function (pageNum, onRenderComplete) {
        if (!this.state.pdfDoc) return;

        if (pageNum < 1) pageNum = 1;
        if (pageNum > this.state.totalPages) pageNum = this.state.totalPages;
        this.state.currentPage = pageNum;

        const pageInput = document.getElementById('pdfPageNumInput');
        const prevBtn = document.getElementById('pdfPrevBtn');
        const nextBtn = document.getElementById('pdfNextBtn');
        const zoomText = document.getElementById('pdfZoomPercent');

        if (pageInput) pageInput.value = pageNum;
        if (prevBtn) prevBtn.disabled = (pageNum <= 1);
        if (nextBtn) nextBtn.disabled = (pageNum >= this.state.totalPages);

        const canvas = document.getElementById('pdfRenderCanvas');
        if (!canvas) return;

        // Fetch page to calculate natural aspect ratio & scale
        this.state.pdfDoc.getPage(pageNum).then(page => {
            const unscaled = page.getViewport({ scale: 1.0, rotation: this.state.rotation });
            this.state.isLandscape = unscaled.width > unscaled.height;

            // Update badge
            const badge = document.getElementById('pdfDocBadge');
            if (badge) {
                badge.textContent = this.state.isLandscape ? 'रजिस्टर (Landscape)' : 'पोर्ट्रेट';
            }

            // Calculate Scale if in Fit Mode
            const viewportEl = document.getElementById('pdfViewport');
            const isMobile = window.innerWidth <= 768;
            const containerW = viewportEl ? (viewportEl.clientWidth - (isMobile ? 24 : 48)) : window.innerWidth;
            const containerH = viewportEl ? (viewportEl.clientHeight - (isMobile ? 84 : 110)) : window.innerHeight;

            if (this.state.zoomMode === 'fit-width') {
                let targetW = containerW;
                // For wide landscape land registers on mobile: ensure line length is readable without being microscopic!
                if (this.state.isLandscape && isMobile) {
                    targetW = Math.max(containerW, 680);
                }
                const calcScale = targetW / unscaled.width;
                this.state.zoomScale = Number(calcScale.toFixed(2));
            } else if (this.state.zoomMode === 'fit-page') {
                const scaleW = containerW / unscaled.width;
                const scaleH = containerH / unscaled.height;
                const calcScale = Math.min(scaleW, scaleH);
                this.state.zoomScale = Number(calcScale.toFixed(2));
            }

            if (zoomText) {
                zoomText.textContent = `${Math.round(this.state.zoomScale * 100)}%`;
            }

            // Check Offscreen Buffer Cache
            const cached = this.state.preRenderedCanvases[pageNum];
            if (cached && cached.zoomScale === this.state.zoomScale && cached.rotation === this.state.rotation) {
                canvas.width = cached.width;
                canvas.height = cached.height;
                canvas.style.width = cached.styleWidth;
                canvas.style.height = cached.styleHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(cached.canvas, 0, 0);
                this.schedulePreloadCanvases(pageNum);
                if (typeof onRenderComplete === 'function') onRenderComplete();
                return;
            }

            // Offscreen Double-Buffering Render Task
            if (this.state.isRendering) {
                this.state.pageNumPending = pageNum;
                if (this.state.currentRenderTask) {
                    this.state.currentRenderTask.cancel();
                    this.state.currentRenderTask = null;
                }
                return;
            }

            this.state.isRendering = true;

            const viewport = page.getViewport({ scale: this.state.zoomScale, rotation: this.state.rotation });
            const outputScale = window.devicePixelRatio || 1;

            const offCanvas = document.createElement('canvas');
            offCanvas.width = Math.floor(viewport.width * outputScale);
            offCanvas.height = Math.floor(viewport.height * outputScale);
            const offCtx = offCanvas.getContext('2d');

            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
            const renderContext = {
                canvasContext: offCtx,
                transform: transform,
                viewport: viewport
            };

            const renderTask = page.render(renderContext);
            this.state.currentRenderTask = renderTask;

            const handleFinish = () => {
                this.state.isRendering = false;
                this.state.currentRenderTask = null;

                // Swap offscreen canvas onto visible canvas in 1 frame
                canvas.width = offCanvas.width;
                canvas.height = offCanvas.height;
                canvas.style.width = Math.floor(viewport.width) + "px";
                canvas.style.height = Math.floor(viewport.height) + "px";
                const mainCtx = canvas.getContext('2d');
                mainCtx.drawImage(offCanvas, 0, 0);

                // Cache in memory
                this.state.preRenderedCanvases[pageNum] = {
                    canvas: offCanvas,
                    width: offCanvas.width,
                    height: offCanvas.height,
                    styleWidth: canvas.style.width,
                    styleHeight: canvas.style.height,
                    zoomScale: this.state.zoomScale,
                    rotation: this.state.rotation
                };

                this.schedulePreloadCanvases(pageNum);

                if (typeof onRenderComplete === 'function') onRenderComplete();

                if (this.state.pageNumPending !== null) {
                    const nextPending = this.state.pageNumPending;
                    this.state.pageNumPending = null;
                    this.renderPage(nextPending);
                }
            };

            renderTask.promise.then(handleFinish).catch(handleFinish);
        }).catch(() => {
            this.state.isRendering = false;
            this.state.currentRenderTask = null;
        });
    },

    // Background Offscreen Canvas Pre-Rendering
    schedulePreloadCanvases: function (currentNum) {
        if (!this.state.pdfDoc) return;
        const queue = [currentNum + 1, currentNum - 1];

        queue.forEach(p => {
            if (p >= 1 && p <= this.state.totalPages && !this.state.preRenderedCanvases[p]) {
                setTimeout(() => {
                    if (!this.state.pdfDoc || this.state.preRenderedCanvases[p]) return;

                    this.state.pdfDoc.getPage(p).then(pageObj => {
                        const viewport = pageObj.getViewport({ scale: this.state.zoomScale, rotation: this.state.rotation });
                        const outputScale = window.devicePixelRatio || 1;
                        const offCanvas = document.createElement('canvas');
                        offCanvas.width = Math.floor(viewport.width * outputScale);
                        offCanvas.height = Math.floor(viewport.height * outputScale);
                        const offCtx = offCanvas.getContext('2d');

                        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
                        const task = pageObj.render({
                            canvasContext: offCtx,
                            transform: transform,
                            viewport: viewport
                        });

                        task.promise.then(() => {
                            this.state.preRenderedCanvases[p] = {
                                canvas: offCanvas,
                                width: offCanvas.width,
                                height: offCanvas.height,
                                styleWidth: Math.floor(viewport.width) + "px",
                                styleHeight: Math.floor(viewport.height) + "px",
                                zoomScale: this.state.zoomScale,
                                rotation: this.state.rotation
                            };
                        }).catch(() => { });
                    }).catch(() => { });
                }, 80);
            }
        });

        // Prune distant canvases to conserve mobile RAM
        const cachedKeys = Object.keys(this.state.preRenderedCanvases);
        if (cachedKeys.length > 4) {
            cachedKeys.forEach(k => {
                const pageInt = parseInt(k, 10);
                if (Math.abs(pageInt - currentNum) > 2) {
                    delete this.state.preRenderedCanvases[k];
                }
            });
        }
    },

    // Fullscreen Toggle
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
        if (this.state.pdfDoc) {
            this.state.pdfDoc.destroy();
            this.state.pdfDoc = null;
        }
        this.state.preRenderedCanvases = {};
    }
};

window.PdfViewerEngine = PdfViewerEngine;
