/**
 * Sarthua Bhu-Abhilekh Portal - PDF Streaming & Viewer Engine
 * Range-request streaming via Cloudflare R2 / Worker with offscreen canvas double-buffering.
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
        zoomScale: 0.5,
        rotation: 0,
        preRenderedCanvases: {},
        isRendering: false,
        currentRenderTask: null,
        pageNumPending: null,
        pdfUrl: '',
        filename: ''
    },

    // Initialize Viewer DOM Listeners
    init: function () {
        const prevBtn = document.getElementById('pdfPrevBtn');
        const nextBtn = document.getElementById('pdfNextBtn');
        const zoomInBtn = document.getElementById('pdfZoomInBtn');
        const zoomOutBtn = document.getElementById('pdfZoomOutBtn');
        const fullscreenBtn = document.getElementById('pdfFullscreenBtn');
        const closeBtn = document.getElementById('pdfCloseBtn');
        const pageInput = document.getElementById('pdfPageNumInput');
        const rotateBtn = document.getElementById('pdfRotateBtn');
        const printBtn = document.getElementById('pdfPrintBtn');
        const modal = document.getElementById('pdfViewerModal');

        // Prevent right click save in viewer
        if (modal) {
            modal.addEventListener('contextmenu', (e) => e.preventDefault());
        }

        // Fullscreen changes
        document.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.state.currentPage > 1) {
                    this.renderPage(this.state.currentPage - 1);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.state.currentPage < this.state.totalPages) {
                    this.renderPage(this.state.currentPage + 1);
                }
            });
        }

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.state.zoomScale < 3.0) {
                    this.state.zoomScale += 0.25;
                    this.renderPage(this.state.currentPage);
                }
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.state.zoomScale > 0.25) {
                    this.state.zoomScale -= 0.25;
                    this.renderPage(this.state.currentPage);
                }
            });
        }

        if (rotateBtn) {
            rotateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.state.rotation = (this.state.rotation + 90) % 360;
                this.renderPage(this.state.currentPage);
            });
        }

        if (printBtn) {
            printBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.printCurrentView();
            });
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFullscreen();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.close();
            });
        }

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
    },

    // Open PDF Viewer Modal
    open: function (pdfUrl, filename, fileSizeBytes) {
        if (!pdfUrl || pdfUrl === "DOC NOT FOUND") {
            AppView.showAlert('यह दस्तावेज़ उपलब्ध नहीं है।', 'error');
            return;
        }

        // If OneDrive, open externally as OneDrive blocks browser Range / CORS headers
        if (pdfUrl.includes('1drv.ms') || pdfUrl.includes('onedrive')) {
            AppView.showAlert('OneDrive PDF नए टैब में खोला जा रहा है...', 'info');
            window.open(pdfUrl, '_blank');
            return;
        }

        const modal = document.getElementById('pdfViewerModal');
        const titleEl = document.getElementById('pdfViewerTitle');
        const loadingOverlay = document.getElementById('pdfLoadingIndicator');

        if (!modal) return;
        titleEl.textContent = filename || 'PDF Viewer';
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        loadingOverlay.classList.remove('hidden');

        // Reset state
        if (this.state.currentRenderTask) {
            this.state.currentRenderTask.cancel();
            this.state.currentRenderTask = null;
        }
        this.state.pdfUrl = pdfUrl;
        this.state.filename = filename;
        this.state.currentPage = 1;
        this.state.zoomScale = 0.5;
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

            document.getElementById('pdfTotalPagesCount').textContent = pdf.numPages;
            document.getElementById('pdfPageNumInput').value = 1;
            document.getElementById('pdfPageNumInput').max = pdf.numPages;

            loadingOverlay.classList.add('hidden');
            this.renderPage(this.state.currentPage);
        }).catch(() => {
            loadingOverlay.classList.add('hidden');
            if (window.location.protocol === 'file:') {
                AppView.showAlert('Local File (file://) पर S3 PDF CORS ब्लॉक होता है। Live Server या Web Hosting से खोलें।', 'error');
            } else {
                AppView.showAlert('PDF लोड करने में समस्या आई।', 'error');
            }
            this.close();
        });
    },

    // Render Target Page with Offscreen Double-Buffering (0 Latency & Zero Flicker)
    renderPage: function (pageNum) {
        if (!this.state.pdfDoc) return;

        if (pageNum < 1) pageNum = 1;
        if (pageNum > this.state.totalPages) pageNum = this.state.totalPages;
        this.state.currentPage = pageNum;

        // Immediate UI updates
        const pageInput = document.getElementById('pdfPageNumInput');
        const zoomText = document.getElementById('pdfZoomPercent');
        const prevBtn = document.getElementById('pdfPrevBtn');
        const nextBtn = document.getElementById('pdfNextBtn');

        if (pageInput) pageInput.value = pageNum;
        if (zoomText) zoomText.textContent = `${Math.round(this.state.zoomScale * 100)}%`;
        if (prevBtn) prevBtn.disabled = (pageNum <= 1);
        if (nextBtn) nextBtn.disabled = (pageNum >= this.state.totalPages);

        const canvas = document.getElementById('pdfRenderCanvas');
        if (!canvas) return;

        // 🚀 1. Check Offscreen Buffer Cache
        const cached = this.state.preRenderedCanvases[pageNum];
        if (cached && cached.zoomScale === this.state.zoomScale && cached.rotation === this.state.rotation) {
            canvas.width = cached.width;
            canvas.height = cached.height;
            canvas.style.width = cached.styleWidth;
            canvas.style.height = cached.styleHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(cached.canvas, 0, 0);

            this.schedulePreloadCanvases(pageNum);
            return;
        }

        // 2. Offscreen Scratch Canvas Double Buffering
        if (this.state.isRendering) {
            this.state.pageNumPending = pageNum;
            if (this.state.currentRenderTask) {
                this.state.currentRenderTask.cancel();
                this.state.currentRenderTask = null;
            }
            return;
        }

        this.state.isRendering = true;

        this.state.pdfDoc.getPage(pageNum).then(page => {
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
        const queue = [currentNum + 1, currentNum + 2, currentNum - 1];

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
                }, 60);
            }
        });

        // Prune distant canvases
        const cachedKeys = Object.keys(this.state.preRenderedCanvases);
        if (cachedKeys.length > 5) {
            cachedKeys.forEach(k => {
                const pageInt = parseInt(k, 10);
                if (Math.abs(pageInt - currentNum) > 3) {
                    delete this.state.preRenderedCanvases[k];
                }
            });
        }
    },

    // Print Current View
    printCurrentView: function () {
        const canvas = document.getElementById('pdfRenderCanvas');
        if (!canvas) return;

        try {
            const dataUrl = canvas.toDataURL('image/png');
            const printWin = window.open('', '_blank');
            if (!printWin) {
                AppView.showAlert('कृपया प्रिंट के लिए पॉपअप विंडो की अनुमति दें।', 'error');
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
                        .print-header { width: 100%; text-align: center; margin-bottom: 12px; border-bottom: 2px solid #333; padding-bottom: 8px; }
                        .print-header h2 { margin: 0 0 4px 0; font-size: 16px; color: #1e3a8a; }
                        .print-header p { margin: 0; font-size: 12px; color: #555; }
                        img { max-width: 100%; height: auto; }
                        .print-footer { margin-top: 15px; font-size: 10px; color: #777; text-align: center; }
                        @media print { body { padding: 0; } img { max-height: 95vh; } }
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
            AppView.showAlert('प्रिंट तैयार करने में त्रुटि आई।', 'error');
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
