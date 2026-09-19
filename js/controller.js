/**
 * Sarthua Bhu-Abhilekh Portal - Application Controller
 * Handles user interactions, search routing, events, and coordinates Model and View.
 */

const AppController = {
    speechRecognition: null,

    // Initialize application on DOM ready
    init: function () {
        // 1. Initialize Model state from LocalStorage
        AppModel.init();

        // 2. Initialize View & PDF Viewer
        AppView.init();
        PdfViewerEngine.init();

        // 3. Apply Theme & Accessibility preferences immediately
        AppView.applyTheme(AppModel.state.theme || 'light');
        AppView.applyFontSize(AppModel.state.fontSizeOffset || 'md');

        // 4. Render Initial Tables only if not already pre-rendered
        const jamabandiTbody = document.getElementById('jamabandi-tbody');
        if (!jamabandiTbody || jamabandiTbody.children.length === 0) {
            AppView.renderJamabandiTable(AppModel.data.jamabandi, '');
        }
        const revisionalTbody = document.getElementById('revisional-tbody');
        if (!revisionalTbody || revisionalTbody.children.length === 0) {
            AppView.renderRevisionalTable(AppModel.data.revisional, '');
        }
        const cadastralTbody = document.getElementById('cadastral-tbody');
        if (!cadastralTbody || cadastralTbody.children.length === 0) {
            AppView.renderCadastralTable(AppModel.data.cadastral, '');
        }

        // 5. Setup Event Listeners
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
    },

    // Setup DOM Listeners
    setupEventListeners: function () {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // Real-time debounced or instant search
            let debounceTimer = null;
            searchInput.addEventListener('input', (e) => {
                this.handleSearchInputChange(e.target);
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 200);
            });

            // Enter key trigger
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    clearTimeout(debounceTimer);
                    this.performSearch(e.target.value);
                }
            });
        }
    },

    // Global Keyboard Shortcuts
    setupKeyboardShortcuts: function () {
        document.addEventListener('keydown', (e) => {
            const pdfModal = document.getElementById('pdfViewerModal');
            const isPdfOpen = pdfModal && !pdfModal.classList.contains('hidden');

            // Escape key closes open modals
            if (e.key === 'Escape') {
                if (isPdfOpen) {
                    PdfViewerEngine.close();
                    return;
                }
                AppView.closeRequestModal();
                AppView.closeGlossaryModal();
                return;
            }

            // Keyboard navigation inside PDF Viewer
            if (isPdfOpen) {
                if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                    e.preventDefault();
                    if (PdfViewerEngine.state.currentPage < PdfViewerEngine.state.totalPages) {
                        PdfViewerEngine.renderPage(PdfViewerEngine.state.currentPage + 1);
                    }
                } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                    e.preventDefault();
                    if (PdfViewerEngine.state.currentPage > 1) {
                        PdfViewerEngine.renderPage(PdfViewerEngine.state.currentPage - 1);
                    }
                } else if (e.key === '+' || e.key === '=') {
                    e.preventDefault();
                    PdfViewerEngine.setZoom(PdfViewerEngine.state.zoomScale + 0.25);
                } else if (e.key === '-' || e.key === '_') {
                    e.preventDefault();
                    PdfViewerEngine.setZoom(PdfViewerEngine.state.zoomScale - 0.25);
                } else if (e.key.toLowerCase() === 'r') {
                    e.preventDefault();
                    PdfViewerEngine.rotate();
                } else if (e.key.toLowerCase() === 'f') {
                    e.preventDefault();
                    document.getElementById('pdfFitModeBtn')?.click();
                }
                return;
            }

            // Global '/' or Ctrl+F shortcut to jump to search bar
            if ((e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
                ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
        });
    },

    // Tab Navigation
    switchTab: function (tabName, evt) {
        AppModel.state.currentTab = tabName;
        AppView.updateTabUI(tabName, evt);
    },

    // Search Execution
    performSearch: function (rawQuery) {
        const query = (rawQuery || '').trim();
        AppModel.state.searchQuery = query;

        // Perform multi-criteria search in Model
        const jamabandiResults = AppModel.searchRecords(query, 'jamabandi');
        const revisionalResults = AppModel.searchRecords(query, 'revisional');
        const cadastralResults = AppModel.searchRecords(query, 'cadastral');

        // Render matching records in View
        AppView.renderJamabandiTable(jamabandiResults, query);
        AppView.renderRevisionalTable(revisionalResults, query);
        AppView.renderCadastralTable(cadastralResults, query);

        // Update badge counters
        AppView.updateBadges(
            jamabandiResults.length,
            revisionalResults.length,
            cadastralResults.length,
            query.length > 0
        );

        // Ensure clear button visibility matches query state
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) {
            clearBtn.style.display = query ? 'block' : 'none';
        }
    },

    // Search Input Helper
    handleSearchInputChange: function (input) {
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) {
            clearBtn.style.display = input.value.trim() ? 'block' : 'none';
        }
    },

    // Clear Search Input
    clearSearch: function () {
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearchBtn');
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
        this.performSearch('');
    },

    // Apply Quick Filter Chip
    applyQuickSearch: function (term) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = term;
            this.handleSearchInputChange(searchInput);
            this.performSearch(term);

            // Smooth scroll down to table
            const nav = document.querySelector('.modern-tab-nav');
            if (nav) {
                nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    },

    // Voice Search via Web Speech API
    startVoiceSearch: function () {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
            AppView.showAlert('आपके ब्राउज़र में वॉइस सर्च समर्थित नहीं है। कृपया गूगल क्रोम (Chrome) या एज (Edge) का उपयोग करें।', 'error');
            return;
        }

        const micBtn = document.getElementById('voiceSearchBtn');
        const searchInput = document.getElementById('searchInput');

        if (this.speechRecognition) {
            try { this.speechRecognition.stop(); } catch (e) { }
            this.speechRecognition = null;
            if (micBtn) micBtn.classList.remove('listening');
            return;
        }

        this.speechRecognition = new SpeechRec();
        this.speechRecognition.lang = 'hi-IN';
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = false;

        if (micBtn) micBtn.classList.add('listening');

        this.speechRecognition.onstart = () => {
            if (searchInput) searchInput.placeholder = '🎙️ बोलिए... (उदा. खाता 50 या VOL-02)';
        };

        this.speechRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (searchInput) {
                searchInput.value = transcript.trim();
                this.handleSearchInputChange(searchInput);
                this.performSearch(transcript.trim());
            }
        };

        this.speechRecognition.onerror = (event) => {
            console.warn('Voice search error:', event.error);
            if (micBtn) micBtn.classList.remove('listening');
            if (searchInput) searchInput.placeholder = 'खाता संख्या (उदा. 50), वॉल्यूम (VOL-01), या बुक खोजें...';
            this.speechRecognition = null;
        };

        this.speechRecognition.onend = () => {
            if (micBtn) micBtn.classList.remove('listening');
            if (searchInput) searchInput.placeholder = 'खाता संख्या (उदा. 50), वॉल्यूम (VOL-01), या बुक खोजें...';
            this.speechRecognition = null;
        };

        try {
            this.speechRecognition.start();
        } catch (err) {
            console.error('Speech recognition start failed:', err);
            if (micBtn) micBtn.classList.remove('listening');
        }
    },

    // Font Resize Handler
    handleFontSize: function (delta) {
        let newSize = 'md';
        if (delta === -1) newSize = 'sm';
        else if (delta === 1) newSize = 'lg';

        AppModel.state.fontSizeOffset = newSize;
        AppView.applyFontSize(newSize);
        try {
            localStorage.setItem('sarthua_font_size', newSize);
        } catch (e) { }
    },

    // Theme Toggle Handler
    handleThemeToggle: function () {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        AppModel.state.theme = newTheme;
        AppView.applyTheme(newTheme);
        try {
            localStorage.setItem('sarthua_theme', newTheme);
        } catch (e) { }
    },

    // Interactive WhatsApp Document Request Submission
    handleRequestSubmit: function (event) {
        event.preventDefault();
        const service = document.getElementById('reqServiceType')?.value || '';
        const name = document.getElementById('reqFullName')?.value.trim() || '';
        const phone = document.getElementById('reqPhone')?.value.trim() || '';
        const khata = document.getElementById('reqKhata')?.value.trim() || 'उल्लेखित नहीं';
        const volume = document.getElementById('reqVolume')?.value.trim() || 'उल्लेखित नहीं';
        const remarks = document.getElementById('reqRemarks')?.value.trim() || 'कोई नहीं';

        const message = `*सरथुआ भू-अभिलेख पोर्टल - सेवा अनुरोध*\n` +
            `--------------------------------\n` +
            `📌 *सेवा:* ${service}\n` +
            `👤 *आवेदक का नाम:* ${name}\n` +
            `📞 *मोबाइल नंबर:* ${phone}\n` +
            `📜 *खाता/खेसरा:* ${khata}\n` +
            `📚 *वॉल्यूम/रजिस्टर:* ${volume}\n` +
            `💬 *विशेष विवरण:* ${remarks}\n` +
            `--------------------------------\n` +
            `_मौजा: सरथुआ, थाना: 218, भोजपुर_`;

        const waUrl = `https://wa.me/919006035986?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
        AppView.closeRequestModal();
        AppView.showAlert('अनुरोध WhatsApp पर प्रेषित किया जा रहा है।', 'success');
    },

    // PDF View Action with Cloudflare Turnstile Challenge Protection
    viewPDF: function (url, filename, size) {
        if (!TurnstileSecurity.isVerified()) {
            TurnstileSecurity.requestVerification(url, filename, size);
            return;
        }
        PdfViewerEngine.open(url, filename, size);
    }
};

// ==========================================================================
// Cloudflare Turnstile 1st-Time Security Challenge Engine
// ==========================================================================
const TurnstileSecurity = {
    // 💡 Cloudflare Turnstile Production Sitekey
    siteKey: '0x4AAAAAAE1YZgLnOa6zSIiq',
    widgetId: null,
    pendingAction: null,

    getActiveSiteKey: function () {
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        // Cloudflare official test sitekey (always passes) for localhost
        return isLocal ? '1x00000000000000000000AA' : this.siteKey;
    },

    isVerified: function () {
        return sessionStorage.getItem('cf_turnstile_verified') === 'true';
    },

    setVerified: function () {
        sessionStorage.setItem('cf_turnstile_verified', 'true');
    },

    requestVerification: function (url, filename, size) {
        this.pendingAction = { url, filename, size };
        const modal = document.getElementById('cfTurnstileModal');
        if (!modal) {
            PdfViewerEngine.open(url, filename, size);
            return;
        }

        const statusEl = document.getElementById('cfTurnstileStatus');
        if (statusEl) {
            statusEl.innerHTML = '<i class="fas fa-shield-alt text-cyan"></i> सुरक्षा सत्यापन एवं बॉट फिल्टर सक्रिय है...';
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        this.renderWidget();
    },

    renderWidget: function () {
        const container = document.getElementById('cfTurnstileWidget');
        if (!container) return;

        // Wait if Turnstile library is not yet loaded (load on-demand)
        if (typeof turnstile === 'undefined') {
            if (!this._scriptLoading) {
                this._scriptLoading = true;
                const script = document.createElement('script');
                script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    this._scriptLoading = false;
                    this.renderWidget();
                };
                script.onerror = () => {
                    this._scriptLoading = false;
                };
                document.head.appendChild(script);
            }
            const statusEl = document.getElementById('cfTurnstileStatus');
            if (statusEl) statusEl.innerHTML = '<i class="fas fa-spinner fa-spin text-cyan"></i> Cloudflare Edge Security लोड हो रहा है...';
            setTimeout(() => this.renderWidget(), 300);
            return;
        }

        // Reset if already rendered
        if (this.widgetId !== null) {
            try {
                turnstile.reset(this.widgetId);
            } catch (e) { }
            return;
        }

        try {
            this.widgetId = turnstile.render(container, {
                sitekey: this.getActiveSiteKey(),
                theme: 'dark',
                callback: (token) => {
                    if (token && typeof token === 'string' && token.length > 5) {
                        this.handleSuccess(token);
                    }
                },
                'error-callback': () => {
                    const statusEl = document.getElementById('cfTurnstileStatus');
                    if (statusEl) {
                        statusEl.innerHTML = '<span style="color:#ef4444;"><i class="fas fa-exclamation-triangle"></i> सुरक्षा सत्यापन विफल। <button onclick="TurnstileSecurity.retry()" class="cf-retry-btn"><i class="fas fa-redo"></i> पुनः प्रयास करें</button></span>';
                    }
                }
            });
        } catch (e) {
            console.error('Turnstile render error:', e);
            const statusEl = document.getElementById('cfTurnstileStatus');
            if (statusEl) {
                statusEl.innerHTML = '<span style="color:#ef4444;"><i class="fas fa-shield-alt"></i> सुरक्षा सत्यापन अनिवार्य है। <button onclick="TurnstileSecurity.retry()" class="cf-retry-btn"><i class="fas fa-redo"></i> लोड करें</button></span>';
            }
        }
    },

    retry: function () {
        const statusEl = document.getElementById('cfTurnstileStatus');
        if (statusEl) {
            statusEl.innerHTML = '<i class="fas fa-spinner fa-spin text-cyan"></i> सुरक्षा सत्यापन पुनः कनेक्ट हो रहा है...';
        }
        if (this.widgetId !== null && typeof turnstile !== 'undefined') {
            try {
                turnstile.reset(this.widgetId);
                return;
            } catch (e) { }
        }
        this.widgetId = null;
        this.renderWidget();
    },

    handleSuccess: function (token) {
        if (!token || typeof token !== 'string') return;
        this.setVerified();
        const statusEl = document.getElementById('cfTurnstileStatus');
        if (statusEl) {
            statusEl.innerHTML = '<span style="color:#22c55e; font-weight:600;"><i class="fas fa-check-circle"></i> सुरक्षा सत्यापन सफल! एन्क्रिप्टेड दस्तावेज़ लोड हो रहा है...</span>';
        }

        setTimeout(() => {
            const action = this.pendingAction;
            this.closeModal();
            if (action) {
                PdfViewerEngine.open(action.url, action.filename, action.size);
            }
        }, 550);
    },

    closeModal: function () {
        const modal = document.getElementById('cfTurnstileModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        this.pendingAction = null;
    }
};

// Global Exposes for HTML inline onclick and form handlers
window.TurnstileSecurity = TurnstileSecurity;
window.closeCfChallengeModal = function () { TurnstileSecurity.closeModal(); };
window.AppController = AppController;
window.showTab = function (tabName, evt) { AppController.switchTab(tabName, evt); };
window.searchRecords = function () {
    const q = document.getElementById('searchInput')?.value || '';
    AppController.performSearch(q);
};
window.handleSearchInputChange = function (input) { AppController.handleSearchInputChange(input); };
window.clearSearchInput = function () { AppController.clearSearch(); };
window.applyQuickSearch = function (term) { AppController.applyQuickSearch(term); };
window.startVoiceSearch = function () { AppController.startVoiceSearch(); };
window.openRequestModal = function (service) { AppView.openRequestModal(service); };
window.closeRequestModal = function () { AppView.closeRequestModal(); };
window.openGlossaryModal = function () { AppView.openGlossaryModal(); };
window.closeGlossaryModal = function () { AppView.closeGlossaryModal(); };
window.adjustFontSize = function (delta) { AppController.handleFontSize(delta); };
window.toggleTheme = function () { AppController.handleThemeToggle(); };
window.handleRequestSubmit = function (e) { AppController.handleRequestSubmit(e); };
window.viewPDF = function (url, filename, size) { AppController.viewPDF(url, filename, size); };
window.closePdfModal = function () { PdfViewerEngine.close(); };
window.showAlert = function (msg, type) { AppView.showAlert(msg, type); };

// Initialize App when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AppController.init());
} else {
    AppController.init();
}
