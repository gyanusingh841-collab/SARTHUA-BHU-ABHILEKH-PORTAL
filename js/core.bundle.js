// Sarthua Bhu-Abhilekh Portal - Core Bundle (Model + View + PDF Viewer + Controller)
// Used on: jamabandi.html, revisional-survey.html, cadastral-survey.html, services.html

// --- model.js ---
/**
 * Sarthua Bhu-Abhilekh Portal - Model Layer (M)
 * Responsible for data storage, state management, calculations, and search logic.
 */

// Global Portal Data Store
const portalData = {
    "village_info": {
        "name": "सरथुआ",
        "district": "भोजपुर",
        "block": "उदवंतनगर",
        "state": "बिहार",
        "thana_no": "218"
    },
    "support_ebook": {
        "title": "Support E-Book - Katthi to Devnagri",
        "link": "https://docs.sarthua.in/support/Support_EBook_Kaithi.pdf"
    },
    "admin_info": {
        "owner": "Gyanu Kumar",
        "whatsapp": "9006035986"
    },
    "jamabandi_panji": [
        { "sr_no": 1, "volume": "VOL-01", "total_pages": 8, "filename": "Sarthua_Vol_01_1970.pdf", "file_size_mb": 2.14, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_01_1970.pdf" },
        { "sr_no": 2, "volume": "VOL-02", "total_pages": 256, "filename": "Sarthua_Vol_02_1970.pdf", "file_size_mb": 76.54, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_02_1970.pdf" },
        { "sr_no": 3, "volume": "VOL-03", "total_pages": 0, "filename": "DOC NOT FOUND", "file_size_mb": 0, "pdf_link": "DOC NOT FOUND" },
        { "sr_no": 4, "volume": "VOL-04", "total_pages": 193, "filename": "Sarthua_Vol_04_1970.pdf", "file_size_mb": 53.02, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_04_1970.pdf" },
        { "sr_no": 5, "volume": "VOL-05", "total_pages": 167, "filename": "Sarthua_Vol_05_1970.pdf", "file_size_mb": 46.01, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_05_1970.pdf" },
        { "sr_no": 6, "volume": "VOL-06", "total_pages": 151, "filename": "Sarthua_Vol_06_1970.pdf", "file_size_mb": 40.97, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_06_1970.pdf" },
        { "sr_no": 7, "volume": "VOL-07", "total_pages": 211, "filename": "Sarthua_Vol_07_1970.pdf", "file_size_mb": 64.51, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_07_1970.pdf" },
        { "sr_no": 8, "volume": "VOL-08", "total_pages": 4, "filename": "Sarthua_Vol_08_1970.pdf", "file_size_mb": 1, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_08_1970.pdf" },
        { "sr_no": 9, "volume": "VOL-09", "total_pages": 223, "filename": "Sarthua_Vol_09_1970.pdf", "file_size_mb": 64.78, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_09_1970.pdf" },
        { "sr_no": 10, "volume": "VOL-10", "total_pages": 148, "filename": "Sarthua_Vol_10_1970.pdf", "file_size_mb": 45.8, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_10_1970.pdf" },
        { "sr_no": 11, "volume": "VOL-11", "total_pages": 194, "filename": "Sarthua_Vol_11_1970.pdf", "file_size_mb": 58.09, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_11_1970.pdf" },
        { "sr_no": 12, "volume": "VOL-11 (A)", "total_pages": 160, "filename": "Sarthua_Vol_11A_1970.pdf", "file_size_mb": 39.57, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_11A_1970.pdf" },
        { "sr_no": 13, "volume": "VOL-12", "total_pages": 170, "filename": "Sarthua_Vol_12_1970.pdf", "file_size_mb": 47.48, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_12_1970.pdf" },
        { "sr_no": 14, "volume": "VOL-13", "total_pages": 178, "filename": "Sarthua_Vol_13_1970.pdf", "file_size_mb": 49.79, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_13_1970.pdf" },
        { "sr_no": 15, "volume": "VOL-14", "total_pages": 94, "filename": "Sarthua_Vol_14_1970.pdf", "file_size_mb": 27.38, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_14_1970.pdf" },
        { "sr_no": 16, "volume": "VOL-15", "total_pages": 200, "filename": "Sarthua_Vol_15_1970.pdf", "file_size_mb": 54.68, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_15_1970.pdf" },
        { "sr_no": 17, "volume": "VOL-16", "total_pages": 179, "filename": "Sarthua_Vol_16_1970.pdf", "file_size_mb": 52.69, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_16_1970.pdf" },
        { "sr_no": 18, "volume": "VOL-17", "total_pages": 178, "filename": "Sarthua_Vol_17_1970.pdf", "file_size_mb": 54.42, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_17_1970.pdf" },
        { "sr_no": 19, "volume": "VOL-18", "total_pages": 169, "filename": "Sarthua_Vol_18_1970.pdf", "file_size_mb": 50.66, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_18_1970.pdf" },
        { "sr_no": 20, "volume": "VOL-19", "total_pages": 102, "filename": "Sarthua_Vol_19_1970.pdf", "file_size_mb": 27.91, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_19_1970.pdf" },
        { "sr_no": 21, "volume": "VOL-20", "total_pages": 74, "filename": "Sarthua_Vol_20_1970.pdf", "file_size_mb": 20.41, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_20_1970.pdf" },
        { "sr_no": 22, "volume": "VOL-21", "total_pages": 28, "filename": "Sarthua_Vol_21_1970.pdf", "file_size_mb": 7.94, "pdf_link": "https://docs.sarthua.in/jamabandi_panji/Sarthua_Vol_21_1970.pdf" }
    ],
    "revisional_survey": [
        { "sr_no": 1, "register_no": "BOOK-1", "khata_numbers": "1-178", "total_pages": 289, "filename": "Sarthua_Rev_01_1970.pdf", "file_size_mb": 43.09, "pdf_link": "https://docs.sarthua.in/revisional_survey/Sarthua_Rev_01_1970.pdf" },
        { "sr_no": 2, "register_no": "BOOK-2", "khata_numbers": "12-158", "total_pages": 17, "filename": "Sarthua_Rev_02_1970.pdf", "file_size_mb": 2.7, "pdf_link": "https://docs.sarthua.in/revisional_survey/Sarthua_Rev_02_1970.pdf" },
        { "sr_no": 3, "register_no": "BOOK-3", "khata_numbers": "198-400", "total_pages": 165, "filename": "Sarthua_Rev_03_1970.pdf", "file_size_mb": 29.2, "pdf_link": "https://docs.sarthua.in/revisional_survey/Sarthua_Rev_03_1970.pdf" },
        { "sr_no": 4, "register_no": "BOOK-4", "khata_numbers": "331-452", "total_pages": 118, "filename": "Sarthua_Rev_04_1970.pdf", "file_size_mb": 23.04, "pdf_link": "https://docs.sarthua.in/revisional_survey/Sarthua_Rev_04_1970.pdf" },
        { "sr_no": 5, "register_no": "BOOK-5", "khata_numbers": "458-663", "total_pages": 182, "filename": "Sarthua_Rev_05_1970.pdf", "file_size_mb": 33.06, "pdf_link": "https://docs.sarthua.in/revisional_survey/Sarthua_Rev_05_1970.pdf" },
        { "sr_no": 6, "register_no": "BOOK-6", "khata_numbers": "676-896", "total_pages": 238, "filename": "Sarthua_Rev_06_1970.pdf", "file_size_mb": 42.09, "pdf_link": "https://docs.sarthua.in/revisional_survey/Sarthua_Rev_06_1970.pdf" },
        { "sr_no": 7, "register_no": "BOOK-7", "khata_numbers": "712-915", "total_pages": 269, "filename": "Sarthua_Rev_07_1970.pdf", "file_size_mb": 53.06, "pdf_link": "https://docs.sarthua.in/revisional_survey/Sarthua_Rev_07_1970.pdf" },
        { "sr_no": 8, "register_no": "BOOK-8", "khata_numbers": "1-25, 651-915", "total_pages": 376, "filename": "Sarthua_Rev_08_1970.pdf", "file_size_mb": 215, "pdf_link": "https://docs.sarthua.in/revisional_survey/Sarthua_Rev_08_1970.pdf" },
        { "sr_no": 9, "register_no": "BOOK-9", "khata_numbers": "280-617", "total_pages": 385, "filename": "Sarthua_Rev_09_1970.pdf", "file_size_mb": 209.4, "pdf_link": "https://docs.sarthua.in/revisional_survey/Sarthua_Rev_09_1970.pdf" }
    ],
    "cadastral_survey": [
        { "sr_no": 1, "register_no": "BOOK-1", "khata_numbers": "1-188", "total_pages": 408, "filename": "Sarthua_cs_01_1911.pdf", "file_size_mb": 136.7, "pdf_link": "https://docs.sarthua.in/cadastral_survey/Sarthua_cs_01_1911.pdf" },
        { "sr_no": 2, "register_no": "BOOK-2", "khata_numbers": "undefined", "total_pages": 422, "filename": "Sarthua_cs_02_1911.pdf", "file_size_mb": 140.7, "pdf_link": "https://docs.sarthua.in/cadastral_survey/Sarthua_cs_02_1911.pdf" }
    ],
    "contact_services": [
        { "सेवा कोड": "SRV001", "सेवा का नाम": "मूल प्रति का अनुरोध", "सेवा विवरण": "गांव के भू-अभिलेख की मूल प्रति प्राप्त करने के लिए", "संपर्क विधि": "WhatsApp", "मोबाइल नंबर": "+91 9006035986", "WhatsApp लिंक": "https://wa.me/919006035986?text=नमस्कार! मैं सरथुआ गांव के भू-अभिलेख की मूल प्रति चाहता हूं।", "समय सीमा": "तत्काल", "शुल्क": "निःशुल्क", "उपलब्धता": "24/7", "प्राथमिकता स्तर": "उच्च" },
        { "सेवा कोड": "SRV002", "सेवा का नाम": "खतियान की प्रतिलिपि", "सेवा विवरण": "विशिष्ट खाता संख्या की खतियान की फोटोकॉपी", "संपर्क विधि": "WhatsApp", "मोबाइल नंबर": "+91 9006035986", "WhatsApp लिंक": "https://wa.me/919006035986?text=नमस्कार! मुझे खतियान की प्रतिलिपि चाहिए।", "समय सीमा": "1 दिन", "शुल्क": "निःशुल्क", "उपलब्धता": "24/7", "प्राथमिकता स्तर": "मध्यम" },
        { "सेवा कोड": "SRV003", "सेवा का नाम": "तकनीकी सहायता", "सेवा विवरण": "डिजिटल फाइल एक्सेस में तकनीकी समस्या", "संपर्क विधि": "WhatsApp", "मोबाइल नंबर": "+91 9006035986", "WhatsApp लिंक": "https://wa.me/919006035986?text=नमस्कार! मुझे तकनीकी सहायता चाहिए।", "समय सीमा": "तत्काल", "शुल्क": "निःशुल्क", "उपलब्धता": "24/7", "प्राथमिकता स्तर": "उच्च" }
    ]
};

// Aliases for clean semantic access across MVC layers
portalData.jamabandi = portalData.jamabandi_panji;
portalData.revisional = portalData.revisional_survey;
portalData.cadastral = portalData.cadastral_survey;

// Application Model State & Methods
const AppModel = {
    data: portalData,
    state: {
        currentTab: 'jamabandi',
        searchQuery: '',
        theme: 'light'
    },
    searchResults: {
        jamabandi: [],
        revisional: [],
        cadastral: []
    },

    // Initialize state from LocalStorage
    init: function () {
        try {
            const savedTheme = localStorage.getItem('sarthua_theme');
            if (savedTheme === 'light' || savedTheme === 'dark') this.state.theme = savedTheme;
            else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) this.state.theme = 'dark';
        } catch (e) { }
        return this.state;
    },

    // Get statistics wrapper
    getStats: function () {
        return this.calculateStats();
    },

    // Calculate dynamic dashboard statistics
    calculateStats: function () {
        let totalVolumes = 0;
        let totalPages = 0;
        let totalSize = 0;

        this.data.jamabandi_panji.forEach(item => {
            if (item.pdf_link !== "DOC NOT FOUND") {
                totalVolumes++;
                totalPages += item.total_pages;
                totalSize += item.file_size_mb;
            }
        });

        this.data.revisional_survey.forEach(item => {
            totalVolumes++;
            totalPages += item.total_pages;
            totalSize += item.file_size_mb;
        });

        this.data.cadastral_survey.forEach(item => {
            totalVolumes++;
            totalPages += item.total_pages;
            totalSize += item.file_size_mb;
        });

        return {
            totalVolumes,
            totalPages,
            totalSizeFormatted: totalSize >= 1024 ? (totalSize / 1024).toFixed(1) + ' GB' : totalSize.toFixed(1) + ' MB'
        };
    },

    // Smart Khata Multi-Range Parser (e.g. "50" matches "1-178" and "1-25, 651-915")
    isKhataMatch: function (cleanSearch, khataRangeStr) {
        if (!khataRangeStr || khataRangeStr === "undefined") return false;

        // Direct Substring match
        if (khataRangeStr.toLowerCase().includes(cleanSearch.toLowerCase())) {
            return true;
        }

        const searchNum = parseInt(cleanSearch, 10);
        if (isNaN(searchNum)) return false;

        // Comma-separated segments e.g. "1-25, 651-915"
        const segments = khataRangeStr.split(',');
        for (const segment of segments) {
            const trimmed = segment.trim();
            if (trimmed.includes('-')) {
                const parts = trimmed.split('-');
                const start = parseInt(parts[0].trim(), 10);
                const end = parseInt(parts[1].trim(), 10);
                if (!isNaN(start) && !isNaN(end)) {
                    if (searchNum >= Math.min(start, end) && searchNum <= Math.max(start, end)) {
                        return true;
                    }
                }
            } else {
                const single = parseInt(trimmed, 10);
                if (!isNaN(single) && single === searchNum) {
                    return true;
                }
            }
        }
        return false;
    },

    // Filter all datasets by raw query term (optional category filter)
    searchRecords: function (rawTerm, category) {
        this.searchQuery = rawTerm ? rawTerm.trim() : '';
        if (!this.searchQuery) {
            if (category && this.data[category]) {
                return this.data[category];
            }
            this.searchResults = {
                jamabandi: this.data.jamabandi,
                revisional: this.data.revisional,
                cadastral: this.data.cadastral
            };
            return { totalFound: 0, results: this.searchResults };
        }

        const termLower = this.searchQuery.toLowerCase();
        const cleanNum = this.searchQuery.replace(/^(खाता|खतियान|वॉल्यूम|किताब|रजिस्टर|vol|volume|book|khata|no|नं|नंबर)\s*[-:]?\s*/i, '').trim();

        // 1. Search in Jamabandi
        const jamabandiResults = this.data.jamabandi_panji.filter(item =>
            item.volume.toLowerCase().includes(termLower) ||
            (cleanNum && item.volume.toLowerCase().includes(cleanNum.toLowerCase())) ||
            (cleanNum && item.sr_no.toString() === cleanNum) ||
            item.filename.toLowerCase().includes(termLower)
        );

        // 2. Search in Revisional
        const revisionalResults = this.data.revisional_survey.filter(item =>
            item.register_no.toLowerCase().includes(termLower) ||
            (cleanNum && item.register_no.toLowerCase().includes(cleanNum.toLowerCase())) ||
            (cleanNum && item.sr_no.toString() === cleanNum) ||
            (cleanNum && this.isKhataMatch(cleanNum, item.khata_numbers)) ||
            item.khata_numbers.toLowerCase().includes(termLower) ||
            item.filename.toLowerCase().includes(termLower)
        );

        // 3. Search in Cadastral
        const cadastralResults = this.data.cadastral_survey.filter(item =>
            item.register_no.toLowerCase().includes(termLower) ||
            (cleanNum && item.register_no.toLowerCase().includes(cleanNum.toLowerCase())) ||
            (cleanNum && item.sr_no.toString() === cleanNum) ||
            (cleanNum && this.isKhataMatch(cleanNum, item.khata_numbers)) ||
            (item.khata_numbers !== "undefined" && item.khata_numbers.toLowerCase().includes(termLower)) ||
            item.filename.toLowerCase().includes(termLower)
        );

        this.searchResults = {
            jamabandi: jamabandiResults,
            revisional: revisionalResults,
            cadastral: cadastralResults
        };

        if (category && this.searchResults[category]) {
            return this.searchResults[category];
        }

        const totalFound = jamabandiResults.length + revisionalResults.length + cadastralResults.length;
        return { totalFound, results: this.searchResults };
    }
};

// Make globally accessible
window.portalData = portalData;
window.AppModel = AppModel;


// --- view.js ---
/**
 * Sarthua Bhu-Abhilekh Portal - View Layer (V)
 * Responsible for DOM updates, rendering tables, accessibility controls, and modal UI.
 */

const AppView = {
    // Initialize View
    init: function () {
        this.renderLiveDate();
    },

    // Render Jamabandi Table
    renderJamabandiTable: function (items, searchQuery) {
        const tbody = document.getElementById('jamabandi-tbody');
        if (!tbody) return;

        if (!items || items.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="table-empty-state">
                        <i class="fas fa-search"></i>
                        <p>कोई जमाबंदी अभिलेख नहीं मिला${searchQuery ? ` ("${searchQuery}")` : ''}</p>
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        items.forEach(item => {
            const hasPages = item.total_pages && item.total_pages !== "0" && item.total_pages !== 0;
            const hasSize = item.file_size_mb && item.file_size_mb !== "0" && item.file_size_mb !== "0 MB";

            html += `
                <tr>
                    <td class="col-sr"><span class="sr-badge">${String(item.sr_no).padStart(2, '0')}</span></td>
                    <td class="col-vol"><span class="vol-badge"><i class="fas fa-folder"></i> ${item.volume}</span></td>
                    <td class="col-pages">
                        ${hasPages ? `<span class="page-pill"><i class="far fa-file-lines"></i> ${item.total_pages} <small>पेज</small></span>` : `<span class="meta-muted">—</span>`}
                    </td>
                    <td class="col-size">
                        ${hasSize ? `<span class="size-pill">${item.file_size_mb} MB</span>` : `<span class="meta-muted">—</span>`}
                    </td>
                    <td class="col-action text-right">
                        <div class="action-buttons">
                            ${this.createActionButtons(item)}
                        </div>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    // Render Revisional Table
    renderRevisionalTable: function (items, searchQuery) {
        const tbody = document.getElementById('revisional-tbody');
        if (!tbody) return;

        if (!items || items.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="table-empty-state">
                        <i class="fas fa-search"></i>
                        <p>कोई रिविजनल अभिलेख नहीं मिला${searchQuery ? ` ("${searchQuery}")` : ''}</p>
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        items.forEach(item => {
            const hasPages = item.total_pages && item.total_pages !== "0" && item.total_pages !== 0;
            const hasSize = item.file_size_mb && item.file_size_mb !== "0" && item.file_size_mb !== "0 MB";

            html += `
                <tr>
                    <td class="col-sr"><span class="sr-badge">${String(item.sr_no).padStart(2, '0')}</span></td>
                    <td class="col-vol"><span class="vol-badge vol-badge--revisional"><i class="fas fa-book"></i> ${item.register_no}</span></td>
                    <td class="col-khata"><span class="khata-badge">${item.khata_numbers}</span></td>
                    <td class="col-pages">
                        ${hasPages ? `<span class="page-pill"><i class="far fa-file-lines"></i> ${item.total_pages} <small>पेज</small></span>` : `<span class="meta-muted">—</span>`}
                    </td>
                    <td class="col-size">
                        ${hasSize ? `<span class="size-pill">${item.file_size_mb} MB</span>` : `<span class="meta-muted">—</span>`}
                    </td>
                    <td class="col-action text-right">
                        <div class="action-buttons">
                            ${this.createActionButtons(item)}
                        </div>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    // Render Cadastral Table
    renderCadastralTable: function (items, searchQuery) {
        const tbody = document.getElementById('cadastral-tbody');
        if (!tbody) return;

        if (!items || items.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="table-empty-state">
                        <i class="fas fa-search"></i>
                        <p>कोई कैडस्ट्रल अभिलेख नहीं मिला${searchQuery ? ` ("${searchQuery}")` : ''}</p>
                    </td>
                </tr>
            `;
            return;
        }

        let html = '';
        items.forEach(item => {
            const khataDisplay = (item.khata_numbers === "undefined" || !item.khata_numbers) ? "अभिलेख उपलब्ध" : item.khata_numbers;
            const hasPages = item.total_pages && item.total_pages !== "0" && item.total_pages !== 0;
            const hasSize = item.file_size_mb && item.file_size_mb !== "0" && item.file_size_mb !== "0 MB";

            html += `
                <tr>
                    <td class="col-sr"><span class="sr-badge">${String(item.sr_no).padStart(2, '0')}</span></td>
                    <td class="col-vol"><span class="vol-badge vol-badge--cadastral"><i class="fas fa-landmark"></i> ${item.register_no}</span></td>
                    <td class="col-khata"><span class="khata-badge">${khataDisplay}</span></td>
                    <td class="col-pages">
                        ${hasPages ? `<span class="page-pill"><i class="far fa-file-lines"></i> ${item.total_pages} <small>पेज</small></span>` : `<span class="meta-muted">—</span>`}
                    </td>
                    <td class="col-size">
                        ${hasSize ? `<span class="size-pill">${item.file_size_mb} MB</span>` : `<span class="meta-muted">—</span>`}
                    </td>
                    <td class="col-action text-right">
                        <div class="action-buttons">
                            ${this.createActionButtons(item)}
                        </div>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    // Action button generator (View PDF)
    createActionButtons: function (item) {
        const isAvailable = item.pdf_link && item.pdf_link !== "DOC NOT FOUND";
        if (!isAvailable) {
            return `
                <span class="btn-status-pill btn-status-pill--unavailable" title="यह दस्तावेज़ डिजिटलीकरण प्रक्रिया में है">
                    <i class="far fa-clock"></i> <span>अप्राप्य</span>
                </span>
            `;
        }

        const fileSizeBytes = Math.round((item.file_size_mb || 0) * 1024 * 1024);
        return `
            <button class="btn-action-view" onclick="AppController.viewPDF('${item.pdf_link}', '${item.filename}', ${fileSizeBytes})" title="दस्तावेज़ सीधे पोर्टल में देखें">
                <i class="fas fa-eye"></i> <span>PDF देखें</span>
            </button>
        `;
    },

    // Update Tab Badges Helper
    updateBadges: function (jamabandiCount, revisionalCount, cadastralCount, isSearching) {
        if (!isSearching) {
            this.updateTabBadge('jamabandi-badge', 0);
            this.updateTabBadge('revisional-badge', 0);
            this.updateTabBadge('cadastral-badge', 0);
            return;
        }
        this.updateTabBadge('jamabandi-badge', jamabandiCount);
        this.updateTabBadge('revisional-badge', revisionalCount);
        this.updateTabBadge('cadastral-badge', cadastralCount);
    },

    // Update Tab UI Helper (alias for switchTab)
    updateTabUI: function (tabName, evt) {
        this.switchTab(tabName, evt);
    },

    // Update Tab Badges Single
    updateTabBadge: function (badgeId, count) {
        const badge = document.getElementById(badgeId);
        if (!badge) return;
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    },

    // Highlight search matches in tables
    highlightSearchResults: function (tabType, results) {
        const tbody = document.getElementById(tabType + '-tbody');
        if (!tbody) return;
        const rows = tbody.getElementsByTagName('tr');

        results.forEach(result => {
            const targetRow = Array.from(rows).find(row =>
                row.cells[0] && row.cells[0].textContent.trim() == result.sr_no.toString()
            );
            if (targetRow) {
                targetRow.style.background = 'linear-gradient(135deg, rgba(30, 64, 175, 0.12), rgba(5, 150, 105, 0.12))';
                targetRow.style.border = '2px solid rgba(30, 64, 175, 0.4)';
                targetRow.style.borderRadius = '8px';
                targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    },

    // Clear search highlights
    clearSearchHighlights: function () {
        document.querySelectorAll('.modern-table tr').forEach(row => {
            row.style.background = '';
            row.style.border = '';
        });
        this.updateTabBadge('jamabandi-badge', 0);
        this.updateTabBadge('revisional-badge', 0);
        this.updateTabBadge('cadastral-badge', 0);
    },

    // Display Statistics in Micro-Stats Strip
    renderStats: function (stats) {
        const volEl = document.getElementById('totalVolumes');
        const pageEl = document.getElementById('totalPages');
        const sizeEl = document.getElementById('totalSize');

        if (volEl) volEl.textContent = stats.totalVolumes;
        if (pageEl) pageEl.textContent = stats.totalPages.toLocaleString('hi-IN');
        if (sizeEl) sizeEl.textContent = stats.totalSizeFormatted;
    },

    // Tab Switching
    switchTab: function (tabName, evt) {
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.modern-tab-btn').forEach(btn => btn.classList.remove('active'));

        const targetTab = document.getElementById(tabName);
        if (targetTab) targetTab.classList.add('active');

        const currentEvt = evt || (typeof event !== 'undefined' ? event : null);
        let buttonActivated = false;

        if (currentEvt && currentEvt.target && typeof currentEvt.target.closest === 'function') {
            const clickedBtn = currentEvt.target.closest('.modern-tab-btn');
            if (clickedBtn) {
                clickedBtn.classList.add('active');
                buttonActivated = true;
            }
        }

        if (!buttonActivated) {
            document.querySelectorAll('.modern-tab-btn').forEach(btn => {
                if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabName)) {
                    btn.classList.add('active');
                }
            });
        }

        // Initialize / Invalidate Leaflet Map when switching to Bhu-Naksha Tab
        if (tabName === 'bhunaksha') {
            setTimeout(() => {
                if (window.SarthuaMapViewer) {
                    SarthuaMapViewer.init();
                    if (SarthuaMapViewer.map) {
                        SarthuaMapViewer.map.invalidateSize();
                    }
                }
            }, 80);
        }
    },

    // Theme (Dark / Light)
    applyTheme: function (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
                themeIcon.style.color = '#f59e0b';
            } else {
                themeIcon.className = 'fas fa-moon';
                themeIcon.style.color = '';
            }
        }
    },

    // Live Regional Date
    renderLiveDate: function () {
        const liveDateEl = document.getElementById('liveDateText');
        if (!liveDateEl) return;
        try {
            const now = new Date();
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const hindiDate = now.toLocaleDateString('hi-IN', options);
            liveDateEl.innerHTML = `<i class="far fa-calendar-alt"></i> ${hindiDate} | मौजा: सरथुआ (थाना 218)`;
        } catch (e) { }
    },

    // Toast Alert Notification
    showAlert: function (message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert--${type}`;
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#dc2626' : '#3b82f6'};
            color: white;
            padding: 14px 22px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease-out;
            max-width: 320px;
        `;
        const icon = type === 'success' ? 'fas fa-check-circle' : type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
        alert.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (alert.parentNode) alert.parentNode.removeChild(alert);
            }, 300);
        }, 3000);
    },

    // WhatsApp Request Modal
    openRequestModal: function (serviceName) {
        const modal = document.getElementById('requestModal');
        const serviceInput = document.getElementById('reqServiceType');
        if (serviceInput) serviceInput.value = serviceName || 'भू-अभिलेख दस्तावेज़ अनुरोध';
        if (modal) modal.classList.remove('hidden');
    },

    closeRequestModal: function () {
        const modal = document.getElementById('requestModal');
        if (modal) modal.classList.add('hidden');
    },

    // Glossary Modal
    openGlossaryModal: function () {
        const modal = document.getElementById('glossaryModal');
        if (modal) modal.classList.remove('hidden');
    },

    closeGlossaryModal: function () {
        const modal = document.getElementById('glossaryModal');
        if (modal) modal.classList.add('hidden');
    }
};

// Make globally accessible
window.AppView = AppView;


// --- pdf-viewer.js ---
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
    pdfjsLib.GlobalWorkerOptions.workerSrc = './js/pdf.worker.min.js';
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
        maxActiveCanvases: 10, // Optimal RAM limit while holding 2-page lookahead buffer (3 pages total)
        bufferAheadCount: 2,   // Preload 2 pages ahead of current visible page (total 3 pages active window)
        pdfUrl: '',
        filename: '',
        observer: null,
        scrollRafId: null,
        isProgrammaticScroll: false,
        isZooming: false,
        zoomDebounceTimer: null,
        lastScrollY: 0,
        uiHideTimer: null,
        isUiHidden: false,
        floatingPillTimer: null,
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

        // Zoom Reset / Percent Click: Cycle through comfortable zoom presets
        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const currentPct = Math.round(this.state.zoomScale * 100);
                if (currentPct < 120) {
                    this.setZoom(1.35);
                } else if (currentPct < 165) {
                    this.setZoom(1.8);
                } else if (currentPct < 220) {
                    this.setZoom(2.5);
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

        // Viewport scroll listener for active page tracking, auto-hide, & progress bar
        if (viewport) {
            viewport.addEventListener('scroll', () => {
                if (this.state.isProgrammaticScroll) return;

                const currentScrollY = viewport.scrollTop;
                const scrollDelta = currentScrollY - this.state.lastScrollY;

                // Downward scroll: Auto-hide floating dock and topbar
                if (scrollDelta > 16 && currentScrollY > 70) {
                    this.hideUI();
                    this.flashFloatingPagePill();
                }
                // Upward scroll: Bring controls back smoothly
                else if (scrollDelta < -16) {
                    this.showUI();
                }

                this.state.lastScrollY = currentScrollY;

                if (this.state.scrollRafId) cancelAnimationFrame(this.state.scrollRafId);
                this.state.scrollRafId = requestAnimationFrame(() => {
                    this.handleViewportScroll();
                    this.updateReadingProgress();
                });
            }, { passive: true });
        }

        // Setup Auto-Hide & Modern Controls
        this.setupAutoHideAndProgress(viewport, modal);

        // Setup Touch Gestures (Pinch-to-zoom, Double-tap)
        this.setupTouchAndInteractions(viewport);
    },

    // Setup Smart Auto-Hide Controls & Quick Interaction Listeners
    setupAutoHideAndProgress: function (viewport, modal) {
        if (!viewport) return;

        const bottomDock = document.getElementById('pdfBottomDock');
        const scrollTopBtn = document.getElementById('pdfScrollTopBtn');

        // Scroll to Top FAB Button
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.scrollToPage(1);
                this.showUI();
            });
        }

        // Tap/click viewport to toggle UI (when not clicking card controls)
        viewport.addEventListener('click', (e) => {
            if (e.target.closest('button, input, select, a, .pdf-dock-capsule, .pdf-fab-scroll-top')) return;
            if (this.state.isUiHidden) {
                this.showUI();
            } else {
                this.hideUI();
            }
        });

        // Hover / touch over dock pauses auto-hide timer
        if (bottomDock) {
            bottomDock.addEventListener('mouseenter', () => {
                if (this.state.uiHideTimer) clearTimeout(this.state.uiHideTimer);
            });
            bottomDock.addEventListener('mouseleave', () => {
                this.scheduleAutoHide(2500);
            });
            bottomDock.addEventListener('touchstart', () => {
                if (this.state.uiHideTimer) clearTimeout(this.state.uiHideTimer);
            }, { passive: true });
        }

        // Desktop mouse movement near top/bottom edges shows UI
        if (modal) {
            modal.addEventListener('mousemove', (e) => {
                if (e.clientY < 55 || e.clientY > window.innerHeight - 75) {
                    if (this.state.isUiHidden) this.showUI();
                }
            });
        }
    },

    showUI: function () {
        const container = document.querySelector('.pdf-modal-container');
        if (container) container.classList.remove('pdf-ui-autohide');
        this.state.isUiHidden = false;

        const pill = document.getElementById('pdfFloatingPagePill');
        if (pill) pill.classList.add('hidden');

        this.scheduleAutoHide(4500);
    },

    hideUI: function () {
        const container = document.querySelector('.pdf-modal-container');
        if (!container || this.state.isUiHidden) return;

        // Don't auto-hide if user is actively typing in page input
        const pageInput = document.getElementById('pdfPageNumInput');
        if (pageInput && document.activeElement === pageInput) return;

        container.classList.add('pdf-ui-autohide');
        this.state.isUiHidden = true;
    },

    scheduleAutoHide: function (delay = 4500) {
        if (this.state.uiHideTimer) clearTimeout(this.state.uiHideTimer);
        this.state.uiHideTimer = setTimeout(() => {
            if (this.state.pdfDoc && !this.state.isUiHidden) {
                this.hideUI();
            }
        }, delay);
    },

    flashFloatingPagePill: function () {
        if (!this.state.isUiHidden) return;
        const pill = document.getElementById('pdfFloatingPagePill');
        const text = document.getElementById('pdfFloatingPageText');
        if (!pill || !text) return;

        text.textContent = `पेज ${this.state.currentPage} / ${this.state.totalPages}`;
        pill.classList.remove('hidden');

        if (this.state.floatingPillTimer) clearTimeout(this.state.floatingPillTimer);
        this.state.floatingPillTimer = setTimeout(() => {
            pill.classList.add('hidden');
        }, 1800);
    },

    updateReadingProgress: function () {
        const viewport = document.getElementById('pdfViewport');
        const bar = document.getElementById('pdfProgressBar');
        const fab = document.getElementById('pdfScrollTopBtn');
        if (!viewport || !bar) return;

        const maxScroll = viewport.scrollHeight - viewport.clientHeight;
        const progress = maxScroll > 0 ? (viewport.scrollTop / maxScroll) * 100 : 0;
        bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;

        if (fab) {
            if (viewport.scrollTop > 600) {
                fab.classList.remove('hidden');
            } else {
                fab.classList.add('hidden');
            }
        }
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

    _pdfJsLoadingPromise: null,

    // On-Demand PDF.js Library Loader (Zero Unused JS on Initial Page Load)
    loadPdfJsLib: function () {
        if (typeof pdfjsLib !== 'undefined') return Promise.resolve();
        if (this._pdfJsLoadingPromise) return this._pdfJsLoadingPromise;

        this._pdfJsLoadingPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = './js/pdf.min.js';
            script.onload = () => {
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = './js/pdf.worker.min.js';
                }
                resolve();
            };
            script.onerror = (err) => {
                this._pdfJsLoadingPromise = null;
                reject(err);
            };
            document.head.appendChild(script);
        });
        return this._pdfJsLoadingPromise;
    },

    // Open PDF Viewer Modal with Continuous Scroll Loading
    open: async function (pdfUrl, filename, fileSizeBytes) {
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

        // Dynamically load PDF.js if not yet loaded (eliminates unused initial JS on mobile)
        if (typeof pdfjsLib === 'undefined') {
            try {
                await this.loadPdfJsLib();
            } catch (err) {
                console.error('[PdfViewerEngine] PDF.js failed to load on-demand:', err);
                if (loadingOverlay) loadingOverlay.classList.add('hidden');
                if (typeof AppView !== 'undefined' && AppView.showAlert) {
                    AppView.showAlert('PDF.js लाइब्रेरी लोड नहीं हो सकी। कृपया इंटरनेट कनेक्शन जांचें।', 'error');
                }
                return;
            }
        }

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

        // Stream PDF directly from Cloudflare R2 / Custom Domain
        const streamUrl = pdfUrl;

        // Determine exact file size to optimize byte-range requests
        const exactSize = this.exactFileSizes[filename] || (fileSizeBytes > 100000 ? fileSizeBytes : 0);

        // Byte-Range streaming parameters
        const docParams = {
            url: streamUrl,
            disableRange: false,
            disableStream: true,
            disableAutoFetch: true,
            rangeChunkSize: 262144 // 256 KB optimal chunk size (replaces 64 KB, reducing round-trips by ~4x)
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

            this.calculateScale();

            // Build all page placeholders for 1..totalPages
            this.buildPageCards();

            // Attach IntersectionObserver for lazy on-demand rendering
            this.setupObserver();

            // Hide loading overlay
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            if (viewport) viewport.scrollTop = 0;

            // Sync dock controls state
            this.updateDockState();

            // Immediately render Page 1 and preload next 2 pages in buffer (total 3 pages initially: 1, 2, 3)
            this.renderPageCard(1, () => {
                this.preloadBuffer(1);
            });

            this.showUI();
            this.updateReadingProgress();

        }).catch((err) => {
            console.error('PDF load error:', err);
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
            let errorMsg = 'PDF लोड करने में समस्या आई।';
            if (window.location.protocol === 'file:') {
                errorMsg = 'Local File (file://) पर ब्राउज़र सुरक्षा (CORS) लागू होती है। कृपया लाइव वेब सर्वर या sarthua.in से खोलें।';
            } else if (err && (err.name === 'MissingPDFException' || String(err).includes('403') || err.status === 403)) {
                errorMsg = 'दस्तावेज़ लोड करने की अनुमति नहीं मिली (403)। कृपया sarthua.in से पुनः प्रयास करें।';
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
                    // Ignore transient IntersectionObserver callbacks during active zoom debounce
                    if (this.state.isZooming) return;
                    // Page is in or near viewport -> Render page canvas
                    this.renderPageCard(pageNum);
                } else {
                    // Page is far away -> Evict distant canvas to preserve RAM on mobile
                    if (Math.abs(pageNum - this.state.currentPage) > 4 &&
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

    // Render a Single Page inside its Card Container (Zero-Flicker Double-Buffered)
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
            const outputScale = Math.min(2.0, window.devicePixelRatio || 1); // Cap at 2 for mobile GPU performance

            // Ensure card matches exact rendered dimensions
            const styledW = Math.floor(viewport.width);
            const styledH = Math.floor(viewport.height);
            card.style.width = `${styledW}px`;
            card.style.height = `${styledH}px`;
            card.style.minHeight = `${styledH}px`;

            // Prepare fresh offscreen canvas for rendering so existing canvas remains visible without blanking
            const newCanvas = document.createElement('canvas');
            newCanvas.className = 'pdf-page-canvas';
            newCanvas.width = Math.floor(viewport.width * outputScale);
            newCanvas.height = Math.floor(viewport.height * outputScale);
            newCanvas.style.width = `${styledW}px`;
            newCanvas.style.height = `${styledH}px`;

            // Anti-save / Anti-drag protection
            newCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
            newCanvas.addEventListener('dragstart', (e) => e.preventDefault());

            const ctx = newCanvas.getContext('2d');
            // Fill opaque white background so canvas never shows transparent/grey flash
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

            const renderTask = page.render({
                canvasContext: ctx,
                transform: transform,
                viewport: viewport
            });

            this.state.renderTasks[pageNum] = renderTask;

            renderTask.promise.then(() => {
                // If this render task was cancelled or superseded by a newer zoom, discard it
                if (this.state.renderTasks[pageNum] !== renderTask) return;

                delete this.state.renderTasks[pageNum];
                this.state.renderingPages.delete(pageNum);
                this.state.renderedPages.add(pageNum);

                // Atomic Canvas Swap: replace existing canvas or append new (0ms gap, ZERO flicker!)
                const existingCanvas = card.querySelector('canvas.pdf-page-canvas');
                if (existingCanvas) {
                    existingCanvas.replaceWith(newCanvas);
                } else {
                    card.appendChild(newCanvas);
                }

                // Hide skeleton placeholder
                const skeleton = document.getElementById(`pdf-skeleton-${pageNum}`);
                if (skeleton) skeleton.classList.add('hidden');

                // Check and enforce memory limit
                if (this.state.renderedPages.size > this.state.maxActiveCanvases) {
                    this.evictDistantPages();
                }

                if (typeof onComplete === 'function') onComplete();
            }).catch((err) => {
                if (this.state.renderTasks[pageNum] === renderTask) {
                    delete this.state.renderTasks[pageNum];
                }
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

    // Sequential background preloader to keep 2 pages preloaded ahead (3 pages total with active view)
    preloadBuffer: function (currentNum) {
        if (!this.state.pdfDoc) return;
        const targetPage = currentNum || this.state.currentPage;

        // Build priority queue: next 2 pages ahead (total 3 pages with current), then 1 page behind
        const targetQueue = [];
        const aheadLimit = this.state.bufferAheadCount || 2;
        for (let i = 1; i <= aheadLimit; i++) {
            const pAhead = targetPage + i;
            if (pAhead <= this.state.totalPages) targetQueue.push(pAhead);
        }
        const pBehind = targetPage - 1;
        if (pBehind >= 1) targetQueue.push(pBehind);

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
            }, 50);
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
            // Never evict any page within 4 pages of the current page
            if (Math.abs(furthest - this.state.currentPage) > 4) {
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
        if (this.state.isProgrammaticScroll) return;

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

    // Apply New Scale to All Cards and Re-Render (Zero-Flicker Double Buffering)
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

        // 1. Calculate relative reading center inside current card before resizing
        const viewport = document.getElementById('pdfViewport');
        const activeCard = document.getElementById(`pdf-page-${this.state.currentPage}`);
        let relCenterY = 0.5;
        let relCenterX = 0.5;
        if (viewport && activeCard && activeCard.offsetHeight > 0 && activeCard.offsetWidth > 0) {
            const viewportCenterY = viewport.scrollTop + viewport.clientHeight / 2;
            const viewportCenterX = viewport.scrollLeft + viewport.clientWidth / 2;
            relCenterY = (viewportCenterY - activeCard.offsetTop) / activeCard.offsetHeight;
            relCenterX = (viewportCenterX - activeCard.offsetLeft) / activeCard.offsetWidth;
        }

        // 2. Cancel pending PDF.js render tasks
        if (this.state.renderTasks) {
            Object.keys(this.state.renderTasks).forEach(p => {
                try { this.state.renderTasks[p]?.cancel(); } catch (_) { }
            });
        }
        this.state.renderTasks = {};
        this.state.renderingPages.clear();
        this.state.renderedPages.clear();

        // 3. Resize all cards AND existing canvases instantly via GPU CSS without removing them (Zero-Flicker)
        const cards = document.querySelectorAll('.pdf-page-card');
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
            card.style.height = `${cardHeight}px`;
            card.style.minHeight = `${cardHeight}px`;

            const canvas = card.querySelector('canvas.pdf-page-canvas');
            if (canvas) {
                // Instantly scale existing canvas via CSS - NO white screen, NO skeleton flash!
                canvas.style.width = `${cardWidth}px`;
                canvas.style.height = `${cardHeight}px`;
            }
        });

        // 4. Seamlessly restore reading center position (Zero Scroll Jump)
        if (viewport && activeCard) {
            this.state.isProgrammaticScroll = true;
            viewport.scrollTop = (activeCard.offsetTop + relCenterY * cardHeight) - (viewport.clientHeight / 2);
            viewport.scrollLeft = (activeCard.offsetLeft + relCenterX * cardWidth) - (viewport.clientWidth / 2);
            requestAnimationFrame(() => {
                this.state.isProgrammaticScroll = false;
            });
        }

        // 5. Debounce sharp re-rendering of visible cards so rapid zoom clicks don't thrash PDF.js
        if (this.state.zoomDebounceTimer) clearTimeout(this.state.zoomDebounceTimer);
        this.state.isZooming = true;
        this.state.zoomDebounceTimer = setTimeout(() => {
            this.state.isZooming = false;
            // Re-render current page and nearby buffer at crystal-clear resolution
            this.renderPageCard(this.state.currentPage, () => {
                this.preloadBuffer(this.state.currentPage);
            });
        }, 120);
    },

    // Rotate 90 Degrees Clockwise
    rotate: function () {
        this.state.rotation = (this.state.rotation + 90) % 360;
        // On rotation, canvas aspect ratio flips so clear cards
        const cards = document.querySelectorAll('.pdf-page-card');
        cards.forEach(card => {
            const canvas = card.querySelector('canvas.pdf-page-canvas');
            if (canvas) canvas.remove();
            const skeleton = card.querySelector('.pdf-page-skeleton');
            if (skeleton) skeleton.classList.remove('hidden');
        });
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
        if (this.state.renderTasks) {
            Object.keys(this.state.renderTasks).forEach(p => {
                try { this.state.renderTasks[p]?.cancel(); } catch (_) { }
            });
        }
        this.state.renderTasks = {};
        this.state.renderedPages.clear();
        this.state.renderingPages.clear();

        if (this.state.uiHideTimer) {
            clearTimeout(this.state.uiHideTimer);
            this.state.uiHideTimer = null;
        }
        if (this.state.floatingPillTimer) {
            clearTimeout(this.state.floatingPillTimer);
            this.state.floatingPillTimer = null;
        }
        this.state.isUiHidden = false;

        const containerModal = document.querySelector('.pdf-modal-container');
        if (containerModal) containerModal.classList.remove('pdf-ui-autohide');

        const bar = document.getElementById('pdfProgressBar');
        if (bar) bar.style.width = '0%';

        const fab = document.getElementById('pdfScrollTopBtn');
        if (fab) fab.classList.add('hidden');

        const pill = document.getElementById('pdfFloatingPagePill');
        if (pill) pill.classList.add('hidden');

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


// --- controller.js ---
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

        // 6. Run a search if the URL carries one (?q=...), used by the sitelinks searchbox
        const q = new URLSearchParams(window.location.search).get('q');
        if (q) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = q;
                this.handleSearchInputChange(searchInput);
            }
            this.performSearch(q);
        }
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

    // PDF View Action
    viewPDF: function (url, filename, size) {
        PdfViewerEngine.open(url, filename, size);
    }
};

// Global Exposes for HTML inline onclick and form handlers
window.AppController = AppController;
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
