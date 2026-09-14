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
        "link": "https://docs.gyanu.online/support/Support_EBook_Kaithi.pdf"
    },
    "admin_info": {
        "owner": "Gyanu Kumar",
        "whatsapp": "9006035986"
    },
    "jamabandi_panji": [
        { "sr_no": 1, "volume": "VOL-01", "total_pages": 8, "filename": "Sarthua_Vol_01_1970.pdf", "file_size_mb": 2.14, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_01_1970.pdf" },
        { "sr_no": 2, "volume": "VOL-02", "total_pages": 256, "filename": "Sarthua_Vol_02_1970.pdf", "file_size_mb": 76.54, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_02_1970.pdf" },
        { "sr_no": 3, "volume": "VOL-03", "total_pages": 0, "filename": "DOC NOT FOUND", "file_size_mb": 0, "pdf_link": "DOC NOT FOUND" },
        { "sr_no": 4, "volume": "VOL-04", "total_pages": 193, "filename": "Sarthua_Vol_04_1970.pdf", "file_size_mb": 53.02, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_04_1970.pdf" },
        { "sr_no": 5, "volume": "VOL-05", "total_pages": 167, "filename": "Sarthua_Vol_05_1970.pdf", "file_size_mb": 46.01, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_05_1970.pdf" },
        { "sr_no": 6, "volume": "VOL-06", "total_pages": 151, "filename": "Sarthua_Vol_06_1970.pdf", "file_size_mb": 40.97, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_06_1970.pdf" },
        { "sr_no": 7, "volume": "VOL-07", "total_pages": 211, "filename": "Sarthua_Vol_07_1970.pdf", "file_size_mb": 64.51, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_07_1970.pdf" },
        { "sr_no": 8, "volume": "VOL-08", "total_pages": 4, "filename": "Sarthua_Vol_08_1970.pdf", "file_size_mb": 1, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_08_1970.pdf" },
        { "sr_no": 9, "volume": "VOL-09", "total_pages": 223, "filename": "Sarthua_Vol_09_1970.pdf", "file_size_mb": 64.78, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_09_1970.pdf" },
        { "sr_no": 10, "volume": "VOL-10", "total_pages": 148, "filename": "Sarthua_Vol_10_1970.pdf", "file_size_mb": 45.8, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_10_1970.pdf" },
        { "sr_no": 11, "volume": "VOL-11", "total_pages": 194, "filename": "Sarthua_Vol_11_1970.pdf", "file_size_mb": 58.09, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_11_1970.pdf" },
        { "sr_no": 12, "volume": "VOL-11 (A)", "total_pages": 160, "filename": "Sarthua_Vol_11A_1970.pdf", "file_size_mb": 39.57, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_11A_1970.pdf" },
        { "sr_no": 13, "volume": "VOL-12", "total_pages": 170, "filename": "Sarthua_Vol_12_1970.pdf", "file_size_mb": 47.48, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_12_1970.pdf" },
        { "sr_no": 14, "volume": "VOL-13", "total_pages": 178, "filename": "Sarthua_Vol_13_1970.pdf", "file_size_mb": 49.79, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_13_1970.pdf" },
        { "sr_no": 15, "volume": "VOL-14", "total_pages": 94, "filename": "Sarthua_Vol_14_1970.pdf", "file_size_mb": 27.38, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_14_1970.pdf" },
        { "sr_no": 16, "volume": "VOL-15", "total_pages": 200, "filename": "Sarthua_Vol_15_1970.pdf", "file_size_mb": 54.68, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_15_1970.pdf" },
        { "sr_no": 17, "volume": "VOL-16", "total_pages": 179, "filename": "Sarthua_Vol_16_1970.pdf", "file_size_mb": 52.69, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_16_1970.pdf" },
        { "sr_no": 18, "volume": "VOL-17", "total_pages": 178, "filename": "Sarthua_Vol_17_1970.pdf", "file_size_mb": 54.42, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_17_1970.pdf" },
        { "sr_no": 19, "volume": "VOL-18", "total_pages": 169, "filename": "Sarthua_Vol_18_1970.pdf", "file_size_mb": 50.66, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_18_1970.pdf" },
        { "sr_no": 20, "volume": "VOL-19", "total_pages": 102, "filename": "Sarthua_Vol_19_1970.pdf", "file_size_mb": 27.91, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_19_1970.pdf" },
        { "sr_no": 21, "volume": "VOL-20", "total_pages": 74, "filename": "Sarthua_Vol_20_1970.pdf", "file_size_mb": 20.41, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_20_1970.pdf" },
        { "sr_no": 22, "volume": "VOL-21", "total_pages": 28, "filename": "Sarthua_Vol_21_1970.pdf", "file_size_mb": 7.94, "pdf_link": "https://docs.gyanu.online/jamabandi_panji/Sarthua_Vol_21_1970.pdf" }
    ],
    "revisional_survey": [
        { "sr_no": 1, "register_no": "BOOK-1", "khata_numbers": "1-178", "total_pages": 289, "filename": "Sarthua_Rev_01_1970.pdf", "file_size_mb": 43.09, "pdf_link": "https://docs.gyanu.online/revisional_survey/Sarthua_Rev_01_1970.pdf" },
        { "sr_no": 2, "register_no": "BOOK-2", "khata_numbers": "12-158", "total_pages": 17, "filename": "Sarthua_Rev_02_1970.pdf", "file_size_mb": 2.7, "pdf_link": "https://docs.gyanu.online/revisional_survey/Sarthua_Rev_02_1970.pdf" },
        { "sr_no": 3, "register_no": "BOOK-3", "khata_numbers": "198-400", "total_pages": 165, "filename": "Sarthua_Rev_03_1970.pdf", "file_size_mb": 29.2, "pdf_link": "https://docs.gyanu.online/revisional_survey/Sarthua_Rev_03_1970.pdf" },
        { "sr_no": 4, "register_no": "BOOK-4", "khata_numbers": "331-452", "total_pages": 118, "filename": "Sarthua_Rev_04_1970.pdf", "file_size_mb": 23.04, "pdf_link": "https://docs.gyanu.online/revisional_survey/Sarthua_Rev_04_1970.pdf" },
        { "sr_no": 5, "register_no": "BOOK-5", "khata_numbers": "458-663", "total_pages": 182, "filename": "Sarthua_Rev_05_1970.pdf", "file_size_mb": 33.06, "pdf_link": "https://docs.gyanu.online/revisional_survey/Sarthua_Rev_05_1970.pdf" },
        { "sr_no": 6, "register_no": "BOOK-6", "khata_numbers": "676-896", "total_pages": 238, "filename": "Sarthua_Rev_06_1970.pdf", "file_size_mb": 42.09, "pdf_link": "https://docs.gyanu.online/revisional_survey/Sarthua_Rev_06_1970.pdf" },
        { "sr_no": 7, "register_no": "BOOK-7", "khata_numbers": "712-915", "total_pages": 269, "filename": "Sarthua_Rev_07_1970.pdf", "file_size_mb": 53.06, "pdf_link": "https://docs.gyanu.online/revisional_survey/Sarthua_Rev_07_1970.pdf" },
        { "sr_no": 8, "register_no": "BOOK-8", "khata_numbers": "1-25, 651-915", "total_pages": 376, "filename": "Sarthua_Rev_08_1970.pdf", "file_size_mb": 215, "pdf_link": "https://docs.gyanu.online/revisional_survey/Sarthua_Rev_08_1970.pdf" },
        { "sr_no": 9, "register_no": "BOOK-9", "khata_numbers": "280-617", "total_pages": 385, "filename": "Sarthua_Rev_09_1970.pdf", "file_size_mb": 209.4, "pdf_link": "https://docs.gyanu.online/revisional_survey/Sarthua_Rev_09_1970.pdf" }
    ],
    "cadastral_survey": [
        { "sr_no": 1, "register_no": "BOOK-1", "khata_numbers": "1-188", "total_pages": 408, "filename": "Sarthua_cs_01_1911.pdf", "file_size_mb": 136.7, "pdf_link": "https://docs.gyanu.online/cadastral_survey/Sarthua_cs_01_1911.pdf" },
        { "sr_no": 2, "register_no": "BOOK-2", "khata_numbers": "undefined", "total_pages": 422, "filename": "Sarthua_cs_02_1911.pdf", "file_size_mb": 140.7, "pdf_link": "https://docs.gyanu.online/cadastral_survey/Sarthua_cs_02_1911.pdf" }
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
        theme: 'light',
        fontSizeOffset: 'md'
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
            if (savedTheme) this.state.theme = savedTheme;
            const savedSize = localStorage.getItem('sarthua_font_size');
            if (savedSize) this.state.fontSizeOffset = savedSize;
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
