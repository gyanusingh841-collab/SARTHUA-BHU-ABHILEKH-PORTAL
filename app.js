// Modern Land Records Portal JavaScript

// Data from the provided JSON
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
        "link": "https://1drv.ms/b/c/98cca50e3110828e/EWrev9st8N1Mqz73a9DVcJcBRYd3vZh5yQvYXwG3tenBZw"
    },
    "admin_info": {
        "owner": "Gyanu Kumar",
        "whatsapp": "9006035986"
    },
    "jamabandi_panji": [
        { "sr_no": 1, "volume": "VOL-01", "total_pages": 8, "filename": "Sarthua_Vol_01_1970.pdf", "file_size_mb": 2.14, "pdf_link": "https://sarthua-docs.gyanusingh841.workers.dev/jamabandi_panji/Sarthua_Vol_01_1970.pdf" },
        { "sr_no": 2, "volume": "VOL-02", "total_pages": 256, "filename": "Sarthua_Vol_02_1970.pdf", "file_size_mb": 76.54, "pdf_link": "https://sarthua-docs.gyanusingh841.workers.dev/jamabandi_panji/Sarthua_Vol_02_1970.pdf" },
        { "sr_no": 3, "volume": "VOL-03", "total_pages": 0, "filename": "DOC NOT FOUND", "file_size_mb": 0, "pdf_link": "DOC NOT FOUND" },
        { "sr_no": 4, "volume": "VOL-04", "total_pages": 193, "filename": "Sarthua_Vol_04_1970.pdf", "file_size_mb": 53.02, "pdf_link": "https://sarthua-docs.gyanusingh841.workers.dev/jamabandi_panji/Sarthua_Vol_04_1970.pdf" },
        { "sr_no": 5, "volume": "VOL-05", "total_pages": 167, "filename": "Sarthua_Vol_05_1970.pdf", "file_size_mb": 46.01, "pdf_link": "https://sarthua-docs.gyanusingh841.workers.dev/jamabandi_panji/Sarthua_Vol_05_1970.pdf" },
        { "sr_no": 6, "volume": "VOL-06", "total_pages": 151, "filename": "Sarthua_Vol_06_1970.pdf", "file_size_mb": 40.97, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/ERx5RtK91T1IvIVtw3-MQ8QBIUWZIZGkyr2BTYTFJtkq_g" },
        { "sr_no": 7, "volume": "VOL-07", "total_pages": 211, "filename": "Sarthua_Vol_07_1970.pdf", "file_size_mb": 64.51, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EdGco6yoRNpAl36HKe51ZdEBIKSdOMfYiMBYCqIH9bZlQQ" },
        { "sr_no": 8, "volume": "VOL-08", "total_pages": 4, "filename": "Sarthua_Vol_08_1970.pdf", "file_size_mb": 1, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/Ecc3jRWKx3NAioBHPLtWi10BiPUvm2EtFshxIntl13Zbmw" },
        { "sr_no": 9, "volume": "VOL-09", "total_pages": 223, "filename": "Sarthua_Vol_09_1970.pdf", "file_size_mb": 64.78, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/ETOoEjTkQ0RPlmpYG_y_rkIBC_P3e4EvMUntOz1JDgAXIg" },
        { "sr_no": 10, "volume": "VOL-10", "total_pages": 148, "filename": "Sarthua_Vol_10_1970.pdf", "file_size_mb": 45.8, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EQ6L71F6qR1BrjDCD3KqiFcB9uPnT-GVyJJRBUB184bh-Q" },
        { "sr_no": 11, "volume": "VOL-11", "total_pages": 194, "filename": "Sarthua_Vol_11_1970.pdf", "file_size_mb": 58.09, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EXwVhFOHsnxOiSGfjhQEq6sBf5reYZ-VTYL7jQHw-T3fAA" },
        { "sr_no": 12, "volume": "VOL-11 (A)", "total_pages": 160, "filename": "Sarthua_Vol_11A_1970.pdf", "file_size_mb": 39.57, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EQ6AY6j-FfJBr5-Jd8gYoDgBDcMf_l67lnQ6DZNjBp55Cg" },
        { "sr_no": 13, "volume": "VOL-12", "total_pages": 170, "filename": "Sarthua_Vol_12_1970.pdf", "file_size_mb": 47.48, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EXl_IUZpuRdPjwaBDqeT2-sBWwibYbwalOsdZLGuIN5QYw" },
        { "sr_no": 14, "volume": "VOL-13", "total_pages": 178, "filename": "Sarthua_Vol_13_1970.pdf", "file_size_mb": 49.79, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EXJkrf4R-NFOt0Ch_MMPDsYB0fM8LQs0oaS_rItow4-oIQ" },
        { "sr_no": 15, "volume": "VOL-14", "total_pages": 94, "filename": "Sarthua_Vol_14_1970.pdf", "file_size_mb": 27.38, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EVKIZIrXjW9DuKFzSOaD5FUBJmGHut2S_R-Mm23yUyU_Tw" },
        { "sr_no": 16, "volume": "VOL-15", "total_pages": 200, "filename": "Sarthua_Vol_15_1970.pdf", "file_size_mb": 54.68, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/ER4S6-gPeNtPlpXcU6YnUGUBO88STXOPCpiGJ4eqMNs6pA" },
        { "sr_no": 17, "volume": "VOL-16", "total_pages": 179, "filename": "Sarthua_Vol_16_1970.pdf", "file_size_mb": 52.69, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/ERIIrEcfuhlIm_vEtzW1tiQB6IY2rNICq2H9CLL9zEUfmw" },
        { "sr_no": 18, "volume": "VOL-17", "total_pages": 178, "filename": "Sarthua_Vol_17_1970.pdf", "file_size_mb": 54.42, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EbwFVwOSLlZHq8f4wl0V7uYBxmfu_2YQ8wjwKEzX2HNJ2g" },
        { "sr_no": 19, "volume": "VOL-18", "total_pages": 169, "filename": "Sarthua_Vol_18_1970.pdf", "file_size_mb": 50.66, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EZIJJmjo9ulAjlN56k74lSMB88V84jNlEhwYkIo780ypfA" },
        { "sr_no": 20, "volume": "VOL-19", "total_pages": 102, "filename": "Sarthua_Vol_19_1970.pdf", "file_size_mb": 27.91, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EfLKC0ep8CVIgWg6ZTQ4DBgBZwDw1u2PqImaZeX1im1Plg" },
        { "sr_no": 21, "volume": "VOL-20", "total_pages": 74, "filename": "Sarthua_Vol_20_1970.pdf", "file_size_mb": 20.41, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EbYUW6WF1eVChgxKYe0h1dABAOyYhi-CnyTefkAhrQi8KA" },
        { "sr_no": 22, "volume": "VOL-21", "total_pages": 28, "filename": "Sarthua_Vol_21_1970.pdf", "file_size_mb": 7.94, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/Ed0EYwBnpw9Pgp8HodYVbKcB3lthprxypBtzXlf4MxWtFg" }
    ],
    "revisional_survey": [
        { "sr_no": 1, "register_no": "BOOK-1", "khata_numbers": "1-178", "total_pages": 289, "filename": "Sarthua_Rev_01_1970.pdf", "file_size_mb": 43.09, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EaPG1i6Rki5Ar7_vFUHVZr0BDgxeazZG1k9wt6JgJY4mrw" },
        { "sr_no": 2, "register_no": "BOOK-2", "khata_numbers": "12-158", "total_pages": 17, "filename": "Sarthua_Rev_02_1970.pdf", "file_size_mb": 2.7, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EVYXRMCs5TNAhho-WZeKkB8BmGipwOo7DkUUgC03IAAXlg" },
        { "sr_no": 3, "register_no": "BOOK-3", "khata_numbers": "198-400", "total_pages": 165, "filename": "Sarthua_Rev_03_1970.pdf", "file_size_mb": 29.2, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EcRGb_jkMrJDvCCmksiIrLkBT9DS-A0Dql3GpCFr4cFg9Q" },
        { "sr_no": 4, "register_no": "BOOK-4", "khata_numbers": "331-452", "total_pages": 118, "filename": "Sarthua_Rev_04_1970.pdf", "file_size_mb": 23.04, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EbsKyFPUtsRHqYi1nHwerckBGyScJxGjCY2RjT5-nuc5YA" },
        { "sr_no": 5, "register_no": "BOOK-5", "khata_numbers": "458-663", "total_pages": 182, "filename": "Sarthua_Rev_05_1970.pdf", "file_size_mb": 33.06, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EQqrW00Fjj1Fk9f4VXntOCMBoox1aZKLFDDjBiWloWf1kg" },
        { "sr_no": 6, "register_no": "BOOK-6", "khata_numbers": "676-896", "total_pages": 238, "filename": "Sarthua_Rev_06_1970.pdf", "file_size_mb": 42.09, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EX7ISBrtUANPhFYRotlPaxEBy7jrUD0tu25sb4ySaaMWGw" },
        { "sr_no": 7, "register_no": "BOOK-7", "khata_numbers": "712-915", "total_pages": 269, "filename": "Sarthua_Rev_07_1970.pdf", "file_size_mb": 53.06, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EZrnoNB7S7VDkeUFRIdC544BvLEz1k19fedBTTMOpS2-Ew" },
        { "sr_no": 8, "register_no": "BOOK-8", "khata_numbers": "1-25, 651-915", "total_pages": 376, "filename": "Sarthua_Rev_08_1970.pdf", "file_size_mb": 215, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EUQpNHc9oC1Kr_fhoEjrPCcBCllFxxFxBKRp-e1fFUp05A" },
        { "sr_no": 9, "register_no": "BOOK-9", "khata_numbers": "280-617", "total_pages": 385, "filename": "Sarthua_Rev_09_1970.pdf", "file_size_mb": 209.4, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EWksH2lQfNlAgxndytToPrcBdbHiPFxyZsd6lfh1gF-nmw" }
    ],
    "cadastral_survey": [
        { "sr_no": 1, "register_no": "BOOK-1", "khata_numbers": "1-188", "total_pages": 408, "filename": "Sarthua_cs_01_1911.pdf", "file_size_mb": 136.7, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EfWtGVQRFxpLl09-b9M8MLwBMYxQTcIk-tgjYT6whasGMg" },
        { "sr_no": 2, "register_no": "BOOK-2", "khata_numbers": "undefined", "total_pages": 422, "filename": "Sarthua_cs_02_1911.pdf", "file_size_mb": 140.7, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EbwNrjQBiIVJiypfj0LQHGQB9Nj3PSLOojY9tS80AzDL4Q" }
    ],
    "contact_services": [
        { "सेवा कोड": "SRV001", "सेवा का नाम": "मूल प्रति का अनुरोध", "सेवा विवरण": "गांव के भू-अभिलेख की मूल प्रति प्राप्त करने के लिए", "संपर्क विधि": "WhatsApp", "मोबाइल नंबर": "+91 9006035986", "WhatsApp लिंक": "https://wa.me/919006035986?text=नमस्कार! मैं सरथुआ गांव के भू-अभिलेख की मूल प्रति चाहता हूं।", "समय सीमा": "तत्काल", "शुल्क": "निःशुल्क", "उपलब्धता": "सुबह 9 से शाम 6 बजे तक", "प्राथमिकता स्तर": "उच्च" },
        { "सेवा कोड": "SRV002", "सेवा का नाम": "खतियान की प्रतिलिपि", "सेवा विवरण": "विशिष्ट खाता संख्या की खतियान की फोटोकॉपी", "संपर्क विधि": "WhatsApp", "मोबाइल नंबर": "+91 9006035986", "WhatsApp लिंक": "https://wa.me/919006035986?text=नमस्कार! मुझे खतियान की प्रतिलिपि चाहिए।", "समय सीमा": "1 दिन", "शुल्क": "निःशुल्क", "उपलब्धता": "सुबह 9 से शाम 6 बजे तक", "प्राथमिकता स्तर": "मध्यम" },
        { "सेवा कोड": "SRV003", "सेवा का नाम": "तकनीकी सहायता", "सेवा विवरण": "डिजिटल फाइल एक्सेस में तकनीकी समस्या", "संपर्क विधि": "WhatsApp", "मोबाइल नंबर": "+91 9006035986", "WhatsApp लिंक": "https://wa.me/919006035986?text=नमस्कार! मुझे तकनीकी सहायता चाहिए।", "समय सीमा": "तत्काल", "शुल्क": "निःशुल्क", "उपलब्धता": "सुबह 9 से शाम 6 बजे तक", "प्राथमिकता स्तर": "उच्च" }
    ],
    "statistics": {
        "total_jamabandi_volumes": 22,
        "total_revisional_books": 9,
        "total_cadastral_books": 2,
        "total_pdf_size_mb": 1813.83,
        "total_pages": 5956
    }
};

// Global variables
let currentData = [];
let filteredData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    calculateAndDisplayStats();
    populateJamabandiTable();
    populateRevisionalTable();
    populateCadastralTable();

    // Show default tab
    showTab('jamabandi');

    // Add search functionality
    setupSearch();

    // Setup PDF viewer controls
    setupPdfViewerControls();

    // Initialize UI/UX Accessibility, Date, and Theme
    initAccessibilityAndTheme();
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchRecords();
            }
        });
    }
}

// Calculate and display statistics
function calculateAndDisplayStats() {
    const stats = calculateStats();

    document.getElementById('totalVolumes').textContent = stats.totalVolumes;
    document.getElementById('totalPages').textContent = stats.totalPages.toLocaleString('hi-IN');
    document.getElementById('totalSize').textContent = formatFileSize(stats.totalSize);
}

function calculateStats() {
    let totalVolumes = 0;
    let totalPages = 0;
    let totalSize = 0;

    // Count Jamabandi
    portalData.jamabandi_panji.forEach(item => {
        if (item.pdf_link !== "DOC NOT FOUND") {
            totalVolumes++;
            totalPages += item.total_pages;
            totalSize += item.file_size_mb;
        }
    });

    // Count Revisional
    portalData.revisional_survey.forEach(item => {
        totalVolumes++;
        totalPages += item.total_pages;
        totalSize += item.file_size_mb;
    });

    // Count Cadastral
    portalData.cadastral_survey.forEach(item => {
        totalVolumes++;
        totalPages += item.total_pages;
        totalSize += item.file_size_mb;
    });

    return {
        totalVolumes,
        totalPages,
        totalSize
    };
}

// Format file size
function formatFileSize(sizeInMB) {
    if (sizeInMB >= 1024) {
        return (sizeInMB / 1024).toFixed(1) + ' GB';
    }
    return sizeInMB.toFixed(1) + ' MB';
}

// Tab functionality
function showTab(tabName, evt) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.modern-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab content
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Add active class to clicked button
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
        // For programmatic calls, find the button by onclick attribute
        document.querySelectorAll('.modern-tab-btn').forEach(btn => {
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabName)) {
                btn.classList.add('active');
            }
        });
    }
}

// Populate Jamabandi table
function populateJamabandiTable() {
    const tbody = document.getElementById('jamabandi-tbody');
    let html = '';

    portalData.jamabandi_panji.forEach(item => {
        const isAvailable = item.pdf_link !== "DOC NOT FOUND";
        const statusClass = isAvailable ? 'status-available' : 'status-not-found';
        const statusText = isAvailable ? 'उपलब्ध' : 'दस्तावेज़ उपलब्ध नहीं';
        const fileSizeDisplay = isAvailable ? `${item.file_size_mb} MB` : '-';
        const pagesDisplay = isAvailable ? item.total_pages : '-';

        html += `
            <tr>
                <td><strong>${item.sr_no}</strong></td>
                <td>
                    <div style="font-weight: 600; margin-bottom: 4px;">${item.volume}</div>
                    <div class="${statusClass}">${statusText}</div>
                </td>
                <td>${pagesDisplay}</td>
                <td>${fileSizeDisplay}</td>
                <td>
                    <div class="action-buttons">
                        ${createActionButtons(item)}
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Populate Revisional table
function populateRevisionalTable() {
    const tbody = document.getElementById('revisional-tbody');
    let html = '';

    portalData.revisional_survey.forEach(item => {
        html += `
            <tr>
                <td><strong>${item.sr_no}</strong></td>
                <td><span style="font-weight: 600;">${item.register_no}</span></td>
                <td>${item.khata_numbers}</td>
                <td>${item.total_pages}</td>
                <td>${item.file_size_mb} MB</td>
                <td>
                    <div class="action-buttons">
                        ${createActionButtons(item)}
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Populate Cadastral table
function populateCadastralTable() {
    const tbody = document.getElementById('cadastral-tbody');
    let html = '';

    portalData.cadastral_survey.forEach(item => {
        const khataDisplay = item.khata_numbers === "undefined" ? "विवरण उपलब्ध नहीं" : item.khata_numbers;

        html += `
            <tr>
                <td><strong>${item.sr_no}</strong></td>
                <td><span style="font-weight: 600;">${item.register_no}</span></td>
                <td>${khataDisplay}</td>
                <td>${item.total_pages}</td>
                <td>${item.file_size_mb} MB</td>
                <td>
                    <div class="action-buttons">
                        ${createActionButtons(item)}
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Create action buttons for table rows - ONLY VIEW BUTTONS
function createActionButtons(item) {
    const isAvailable = item.pdf_link && item.pdf_link !== "DOC NOT FOUND";

    if (!isAvailable) {
        return `
            <button class="btn btn--disabled" disabled>
                <i class="fas fa-ban"></i>
                दस्तावेज़ उपलब्ध नहीं
            </button>
        `;
    }

    const fileSizeBytes = Math.round((item.file_size_mb || 0) * 1024 * 1024);
    return `
        <button class="btn btn--view" onclick="viewPDF('${item.pdf_link}', '${item.filename}', ${fileSizeBytes})">
            <i class="fas fa-eye"></i>
            PDF देखें
        </button>
    `;
}

// Configure PDF.js Worker
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

// PDF Viewer State Management
const pdfState = {
    pdfDoc: null,
    currentPage: 1,
    totalPages: 0,
    zoomScale: 0.5,
    rotation: 0, // 0, 90, 180, 270 degrees
    preRenderedCanvases: {}, // Offscreen canvases pre-rendered in background
    isRendering: false,
    currentRenderTask: null,
    pageNumPending: null,
    pdfUrl: '',
    filename: ''
};

// View PDF function - Opens embedded PDF.js Viewer for S3/Direct PDF links
function viewPDF(pdfLink, filename, fileSizeBytes) {
    if (!pdfLink || pdfLink === "DOC NOT FOUND") {
        showAlert('यह दस्तावेज़ उपलब्ध नहीं है।', 'error');
        return;
    }

    const isDirectPdf = pdfLink.toLowerCase().includes('.pdf') || pdfLink.includes('amazonaws.com') || pdfLink.includes('workers.dev');
    const isOneDrive = pdfLink.includes('1drv.ms') || pdfLink.includes('onedrive');

    if (isOneDrive) {
        // OneDrive links do not support CORS/Range requests directly; open in new tab
        showAlert('OneDrive PDF नए टैब में खोला जा रहा है...', 'info');
        window.open(pdfLink, '_blank');
        return;
    }

    // Open embedded PDF.js viewer modal for Cloudflare / S3 direct PDF links
    openPdfModal(pdfLink, filename, fileSizeBytes);
}

// Open PDF Viewer Modal & Stream PDF via Range Requests
function openPdfModal(pdfUrl, filename, fileSizeBytes) {
    const modal = document.getElementById('pdfViewerModal');
    const titleEl = document.getElementById('pdfViewerTitle');
    const loadingOverlay = document.getElementById('pdfLoadingIndicator');

    if (!modal) return;

    titleEl.textContent = filename || 'PDF Viewer';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Show loading indicator
    loadingOverlay.classList.remove('hidden');

    // Reset state
    if (pdfState.currentRenderTask) {
        pdfState.currentRenderTask.cancel();
        pdfState.currentRenderTask = null;
    }
    pdfState.pdfUrl = pdfUrl;
    pdfState.filename = filename;
    pdfState.currentPage = 1;
    pdfState.zoomScale = 0.5;
    pdfState.rotation = 0;
    pdfState.preRenderedCanvases = {};
    pdfState.isRendering = false;
    pdfState.pageNumPending = null;

    // Load PDF using PDF.js Byte-Range Request Streaming (Strict On-Demand Chunks)
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
        pdfState.pdfDoc = pdf;
        pdfState.totalPages = pdf.numPages;

        document.getElementById('pdfTotalPagesCount').textContent = pdf.numPages;
        document.getElementById('pdfPageNumInput').value = 1;
        document.getElementById('pdfPageNumInput').max = pdf.numPages;

        loadingOverlay.classList.add('hidden');
        renderPdfPage(pdfState.currentPage);
    }).catch(error => {
        loadingOverlay.classList.add('hidden');

        // Check if running on local file:// protocol
        if (window.location.protocol === 'file:') {
            showAlert('Local File Protocol (file://) par S3 PDF CORS block hota hai. Live Server se index.html open karein.', 'error');
        } else {
            showAlert('PDF लोड करने में समस्या (S3 CORS setup check karein)।', 'error');
        }
        closePdfModal();
    });
}

// Render PDF Page onto HTML5 Canvas with Offscreen Double-Buffering (No White Screen Flash)
function renderPdfPage(pageNum) {
    if (!pdfState.pdfDoc) return;

    // Sanitize target page number
    if (pageNum < 1) pageNum = 1;
    if (pageNum > pdfState.totalPages) pageNum = pdfState.totalPages;
    pdfState.currentPage = pageNum;

    // Update UI controls immediately so inputs & button states reflect user action right away
    const pageInput = document.getElementById('pdfPageNumInput');
    const zoomText = document.getElementById('pdfZoomPercent');
    const prevBtn = document.getElementById('pdfPrevBtn');
    const nextBtn = document.getElementById('pdfNextBtn');

    if (pageInput) pageInput.value = pageNum;
    if (zoomText) zoomText.textContent = `${Math.round(pdfState.zoomScale * 100)}%`;
    if (prevBtn) prevBtn.disabled = (pageNum <= 1);
    if (nextBtn) nextBtn.disabled = (pageNum >= pdfState.totalPages);

    const canvas = document.getElementById('pdfRenderCanvas');
    if (!canvas) return;

    // 🚀 1. Check if page is ALREADY pre-rendered in offscreen buffer!
    const cached = pdfState.preRenderedCanvases[pageNum];
    if (cached && cached.zoomScale === pdfState.zoomScale && cached.rotation === pdfState.rotation) {
        // INSTANT 0-MS DISPLAY: Copy pre-rendered image to visible canvas in 1 frame (No Network & No White Flash!)
        canvas.width = cached.width;
        canvas.height = cached.height;
        canvas.style.width = cached.styleWidth;
        canvas.style.height = cached.styleHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(cached.canvas, 0, 0);

        // Preload next pages in background
        schedulePreloadCanvases(pageNum);
        return;
    }

    // 2. If not yet pre-rendered, render with Double Buffering to eliminate white flash
    if (pdfState.isRendering) {
        pdfState.pageNumPending = pageNum;
        if (pdfState.currentRenderTask) {
            pdfState.currentRenderTask.cancel();
            pdfState.currentRenderTask = null;
        }
        return;
    }

    pdfState.isRendering = true;

    pdfState.pdfDoc.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: pdfState.zoomScale, rotation: pdfState.rotation });
        const outputScale = window.devicePixelRatio || 1;

        // Render onto off-screen scratch canvas first (User still sees previous page, NO white screen flash!)
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
        pdfState.currentRenderTask = renderTask;

        const handleRenderFinish = () => {
            pdfState.isRendering = false;
            pdfState.currentRenderTask = null;

            // Swap off-screen canvas to visible canvas in 1 single frame!
            canvas.width = offCanvas.width;
            canvas.height = offCanvas.height;
            canvas.style.width = Math.floor(viewport.width) + "px";
            canvas.style.height = Math.floor(viewport.height) + "px";
            const mainCtx = canvas.getContext('2d');
            mainCtx.drawImage(offCanvas, 0, 0);

            // Save in cache
            pdfState.preRenderedCanvases[pageNum] = {
                canvas: offCanvas,
                width: offCanvas.width,
                height: offCanvas.height,
                styleWidth: canvas.style.width,
                styleHeight: canvas.style.height,
                zoomScale: pdfState.zoomScale,
                rotation: pdfState.rotation
            };

            // Pre-render adjacent 2-3 pages in background
            schedulePreloadCanvases(pageNum);

            // Render queued page if any
            if (pdfState.pageNumPending !== null) {
                const nextPending = pdfState.pageNumPending;
                pdfState.pageNumPending = null;
                renderPdfPage(nextPending);
            }
        };

        renderTask.promise.then(() => {
            handleRenderFinish();
        }).catch(err => {
            if (err && err.name === 'RenderingCancelledException') {
                handleRenderFinish();
            } else {
                handleRenderFinish();
            }
        });
    }).catch(() => {
        pdfState.isRendering = false;
        pdfState.currentRenderTask = null;

        if (pdfState.pageNumPending !== null) {
            const nextPending = pdfState.pageNumPending;
            pdfState.pageNumPending = null;
            renderPdfPage(nextPending);
        }
    });
}

// Close PDF Viewer Modal
function closePdfModal() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => { });
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    const modal = document.getElementById('pdfViewerModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    if (pdfState.pdfDoc) {
        pdfState.pdfDoc.destroy();
        pdfState.pdfDoc = null;
    }
    pdfState.preRenderedCanvases = {};
}

// Pre-render adjacent pages onto offscreen canvases in background
function schedulePreloadCanvases(currentNum) {
    if (!pdfState.pdfDoc) return;

    // Rolling window buffer: Next 2 pages and previous 1 page
    const queue = [currentNum + 1, currentNum + 2, currentNum - 1];

    queue.forEach(p => {
        if (p >= 1 && p <= pdfState.totalPages && !pdfState.preRenderedCanvases[p]) {
            setTimeout(() => {
                if (!pdfState.pdfDoc || pdfState.preRenderedCanvases[p]) return;

                pdfState.pdfDoc.getPage(p).then(pageObj => {
                    const viewport = pageObj.getViewport({ scale: pdfState.zoomScale, rotation: pdfState.rotation });
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
                        pdfState.preRenderedCanvases[p] = {
                            canvas: offCanvas,
                            width: offCanvas.width,
                            height: offCanvas.height,
                            styleWidth: Math.floor(viewport.width) + "px",
                            styleHeight: Math.floor(viewport.height) + "px",
                            zoomScale: pdfState.zoomScale,
                            rotation: pdfState.rotation
                        };
                    }).catch(() => { });
                }).catch(() => { });
            }, 60);
        }
    });

    // Prune distant canvases to keep memory light (< 15 MB)
    const cachedKeys = Object.keys(pdfState.preRenderedCanvases);
    if (cachedKeys.length > 5) {
        cachedKeys.forEach(k => {
            const pageInt = parseInt(k, 10);
            if (Math.abs(pageInt - currentNum) > 3) {
                delete pdfState.preRenderedCanvases[k];
            }
        });
    }
}

// Fullscreen API Toggle
function togglePdfFullscreen() {
    const modal = document.getElementById('pdfViewerModal');
    if (!modal) return;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (modal.requestFullscreen) {
            modal.requestFullscreen().catch(() => { });
        } else if (modal.webkitRequestFullscreen) {
            modal.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => { });
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

function handleFullscreenChange() {
    const btn = document.getElementById('pdfFullscreenBtn');
    if (!btn) return;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        btn.innerHTML = '<i class="fas fa-compress"></i>';
        btn.title = 'फुलस्क्रीन से बाहर निकलें (Esc)';
    } else {
        btn.innerHTML = '<i class="fas fa-expand"></i>';
        btn.title = 'फुलस्क्रीन (Fullscreen)';
    }
}

// Setup PDF Viewer Event Listeners
function setupPdfViewerControls() {
    const prevBtn = document.getElementById('pdfPrevBtn');
    const nextBtn = document.getElementById('pdfNextBtn');
    const zoomInBtn = document.getElementById('pdfZoomInBtn');
    const zoomOutBtn = document.getElementById('pdfZoomOutBtn');
    const fullscreenBtn = document.getElementById('pdfFullscreenBtn');
    const closeBtn = document.getElementById('pdfCloseBtn');
    const pageInput = document.getElementById('pdfPageNumInput');
    const modal = document.getElementById('pdfViewerModal');

    // Block right-click context menu on PDF viewer modal to prevent file/canvas save
    if (modal) {
        modal.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Fullscreen listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (pdfState.currentPage > 1) {
                renderPdfPage(pdfState.currentPage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (pdfState.currentPage < pdfState.totalPages) {
                renderPdfPage(pdfState.currentPage + 1);
            }
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (pdfState.zoomScale < 3.0) {
                pdfState.zoomScale += 0.25;
                renderPdfPage(pdfState.currentPage);
            }
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (pdfState.zoomScale > 0.25) {
                pdfState.zoomScale -= 0.25;
                renderPdfPage(pdfState.currentPage);
            }
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            togglePdfFullscreen();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closePdfModal();
        });
    }

    if (pageInput) {
        pageInput.addEventListener('change', (e) => {
            let val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= 1 && val <= pdfState.totalPages) {
                renderPdfPage(val);
            } else {
                e.target.value = pdfState.currentPage;
            }
        });

        pageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                let val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= pdfState.totalPages) {
                    renderPdfPage(val);
                } else {
                    e.target.value = pdfState.currentPage;
                }
            }
        });
    }

    const rotateBtn = document.getElementById('pdfRotateBtn');
    const printBtn = document.getElementById('pdfPrintBtn');

    if (rotateBtn) {
        rotateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pdfState.rotation = (pdfState.rotation + 90) % 360;
            renderPdfPage(pdfState.currentPage);
        });
    }

    if (printBtn) {
        printBtn.addEventListener('click', (e) => {
            e.preventDefault();
            printPdfCurrentView();
        });
    }
}

// Print Current PDF Page Canvas View
function printPdfCurrentView() {
    const canvas = document.getElementById('pdfRenderCanvas');
    if (!canvas) return;

    try {
        const dataUrl = canvas.toDataURL('image/png');
        const printWin = window.open('', '_blank');
        if (!printWin) {
            showAlert('कृपया प्रिंट के लिए पॉपअप विंडो की अनुमति दें।', 'error');
            return;
        }

        printWin.document.write(`
            <!DOCTYPE html>
            <html lang="hi">
            <head>
                <meta charset="UTF-8">
                <title>प्रिंट - ${pdfState.filename || 'सरथुआ भू-अभिलेख'} (पेज ${pdfState.currentPage})</title>
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        font-family: system-ui, -apple-system, sans-serif;
                    }
                    .print-header {
                        width: 100%;
                        text-align: center;
                        margin-bottom: 12px;
                        padding-bottom: 8px;
                        border-bottom: 2px solid #333;
                    }
                    .print-header h2 { margin: 0 0 4px 0; font-size: 16px; color: #1e3a8a; }
                    .print-header p { margin: 0; font-size: 12px; color: #555; }
                    img {
                        max-width: 100%;
                        height: auto;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    }
                    .print-footer {
                        margin-top: 15px;
                        font-size: 10px;
                        color: #777;
                        text-align: center;
                    }
                    @media print {
                        body { padding: 0; }
                        .print-header { border-bottom: 1px solid #666; }
                        img { box-shadow: none; max-height: 95vh; }
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    <h2>सरथुआ भू-अभिलेख पोर्टल | ग्राम: सरथुआ, थाना: 218, भोजपुर (बिहार)</h2>
                    <p>दस्तावेज़: <strong>${pdfState.filename || ''}</strong> | पेज संख्या: <strong>${pdfState.currentPage} / ${pdfState.totalPages}</strong></p>
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
        setTimeout(() => {
            printWin.print();
        }, 500);
    } catch (err) {
        showAlert('प्रिंट तैयार करने में त्रुटि आई।', 'error');
    }
}

// Alert function for better user feedback
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert--${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#dc2626' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;

    const icon = type === 'success' ? 'fas fa-check-circle' : type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
    alert.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(alert);

    // Auto remove after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// Modal functions
function showLoadingModal() {
    document.getElementById('loadingModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideLoadingModal() {
    document.getElementById('loadingModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Helper: Check if searched Khata number falls within range strings (e.g. "1-178", "1-25, 651-915")
function isKhataMatch(cleanSearch, khataRangeStr) {
    if (!khataRangeStr || khataRangeStr === "undefined") return false;

    // Substring match
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
}

// Update count badge on tab button
function updateTabBadge(badgeId, count) {
    const badge = document.getElementById(badgeId);
    if (!badge) return;
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
}

// Enhanced smart search functionality with range parsing
function searchRecords() {
    const searchInput = document.getElementById('searchInput');
    const rawTerm = searchInput.value.trim();

    if (!rawTerm) {
        showAlert('कृपया खोज के लिए कुछ टाइप करें (जैसे: खाता संख्या या वॉल्यूम)।', 'info');
        return;
    }

    const termLower = rawTerm.toLowerCase();
    // Strip common Hindi & English query words: e.g. "खाता 50", "vol 2", "book 1"
    const cleanNum = rawTerm.replace(/^(खाता|खतियान|वॉल्यूम|किताब|रजिस्टर|vol|volume|book|khata|no|नं|नंबर)\s*[-:]?\s*/i, '').trim();

    // Clear previous highlights
    clearSearchHighlights();

    // Search in Jamabandi
    const jamabandiResults = portalData.jamabandi_panji.filter(item =>
        item.volume.toLowerCase().includes(termLower) ||
        (cleanNum && item.volume.toLowerCase().includes(cleanNum.toLowerCase())) ||
        (cleanNum && item.sr_no.toString() === cleanNum) ||
        item.filename.toLowerCase().includes(termLower)
    );

    // Search in Revisional
    const revisionalResults = portalData.revisional_survey.filter(item =>
        item.register_no.toLowerCase().includes(termLower) ||
        (cleanNum && item.register_no.toLowerCase().includes(cleanNum.toLowerCase())) ||
        (cleanNum && item.sr_no.toString() === cleanNum) ||
        (cleanNum && isKhataMatch(cleanNum, item.khata_numbers)) ||
        item.khata_numbers.toLowerCase().includes(termLower) ||
        item.filename.toLowerCase().includes(termLower)
    );

    // Search in Cadastral
    const cadastralResults = portalData.cadastral_survey.filter(item =>
        item.register_no.toLowerCase().includes(termLower) ||
        (cleanNum && item.register_no.toLowerCase().includes(cleanNum.toLowerCase())) ||
        (cleanNum && item.sr_no.toString() === cleanNum) ||
        (cleanNum && isKhataMatch(cleanNum, item.khata_numbers)) ||
        (item.khata_numbers !== "undefined" && item.khata_numbers.toLowerCase().includes(termLower)) ||
        item.filename.toLowerCase().includes(termLower)
    );

    const totalFound = jamabandiResults.length + revisionalResults.length + cadastralResults.length;

    // Update tab badges with count of matches in each tab
    updateTabBadge('jamabandi-badge', jamabandiResults.length);
    updateTabBadge('revisional-badge', revisionalResults.length);
    updateTabBadge('cadastral-badge', cadastralResults.length);

    if (totalFound > 0) {
        // Highlight in all matching tables
        if (jamabandiResults.length > 0) {
            highlightSearchResults('jamabandi', jamabandiResults);
        }
        if (revisionalResults.length > 0) {
            highlightSearchResults('revisional', revisionalResults);
        }
        if (cadastralResults.length > 0) {
            highlightSearchResults('cadastral', cadastralResults);
        }

        // Switch to the first tab that has results
        if (jamabandiResults.length > 0) {
            showTab('jamabandi');
        } else if (revisionalResults.length > 0) {
            showTab('revisional');
        } else if (cadastralResults.length > 0) {
            showTab('cadastral');
        }

        showAlert(`${totalFound} रिकॉर्ड मिले "${rawTerm}" के लिए`, 'success');
    } else {
        showAlert('कोई रिकॉर्ड नहीं मिला। कृपया अन्य खाता संख्या या वॉल्यूम डालकर खोजें।', 'error');
    }
}

// Clear search highlights and badges
function clearSearchHighlights() {
    document.querySelectorAll('.modern-table tr').forEach(row => {
        row.style.background = '';
        row.style.border = '';
    });

    updateTabBadge('jamabandi-badge', 0);
    updateTabBadge('revisional-badge', 0);
    updateTabBadge('cadastral-badge', 0);
}

// Highlight search results with modern styling
function highlightSearchResults(tabType, results) {
    const tbody = document.getElementById(tabType + '-tbody');
    if (!tbody) return;
    const rows = tbody.getElementsByTagName('tr');

    // Highlight matching rows with modern style
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
}

// Add smooth animations for better UX
function addLoadingEffects() {
    // Add loading effect to buttons when clicked
    document.addEventListener('click', function (e) {
        if (e.target.matches('.btn--view')) {
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    });
}

// Initialize loading effects
document.addEventListener('DOMContentLoaded', function () {
    addLoadingEffects();
});

// Make functions globally available
window.showTab = showTab;
window.viewPDF = viewPDF;
window.searchRecords = searchRecords;

// Add keyboard shortcuts for better accessibility and PDF navigation
document.addEventListener('keydown', function (e) {
    const pdfModal = document.getElementById('pdfViewerModal');
    const isPdfOpen = pdfModal && !pdfModal.classList.contains('hidden');

    if (isPdfOpen) {
        if (e.key === 'Escape') {
            closePdfModal();
        } else if (e.key === 'ArrowLeft') {
            if (pdfState.currentPage > 1) {
                renderPdfPage(pdfState.currentPage - 1);
            }
        } else if (e.key === 'ArrowRight') {
            if (pdfState.currentPage < pdfState.totalPages) {
                renderPdfPage(pdfState.currentPage + 1);
            }
        }
        return;
    }

    // Ctrl/Cmd + F to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    // Escape to clear search
    if (e.key === 'Escape') {
        clearSearchHighlights();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
    }
});

// Add responsive table handling
window.addEventListener('resize', function () {
    // Handle table responsiveness on window resize
    const tables = document.querySelectorAll('.modern-table');
    tables.forEach(table => {
        const container = table.closest('.table-responsive');
        if (container.scrollWidth > container.clientWidth) {
            table.style.fontSize = '12px';
        } else {
            table.style.fontSize = '';
        }
    });
});

// Performance optimization - lazy loading for large tables
function optimizeTableRendering() {
    const tables = document.querySelectorAll('.modern-table tbody');

    tables.forEach(tbody => {
        const rows = tbody.children;
        if (rows.length > 20) {
            // Show only first 20 rows initially
            for (let i = 20; i < rows.length; i++) {
                rows[i].style.display = 'none';
            }

            // Add "Load More" functionality if needed
            addLoadMoreButton(tbody);
        }
    });
}

function addLoadMoreButton(tbody) {
    const hiddenRows = Array.from(tbody.children).filter(row => row.style.display === 'none');

    if (hiddenRows.length > 0) {
        const loadMoreRow = document.createElement('tr');
        loadMoreRow.innerHTML = `
            <td colspan="100%" style="text-align: center; padding: 20px;">
                <button class="btn btn--secondary" onclick="loadMoreRows(this)">
                    <i class="fas fa-chevron-down"></i>
                    और दिखाएं (${hiddenRows.length} शेष)
                </button>
            </td>
        `;
        tbody.appendChild(loadMoreRow);
    }
}

function loadMoreRows(button) {
    const tbody = button.closest('tbody');
    const hiddenRows = Array.from(tbody.children).filter(row => row.style.display === 'none' && !row.querySelector('button'));

    // Show next 10 rows
    const rowsToShow = hiddenRows.slice(0, 10);
    rowsToShow.forEach(row => row.style.display = '');

    // Update button text
    const remainingRows = hiddenRows.length - rowsToShow.length;
    if (remainingRows > 0) {
        button.innerHTML = `<i class="fas fa-chevron-down"></i> और दिखाएं (${remainingRows} शेष)`;
    } else {
        button.closest('tr').remove();
    }
}

// Make loadMoreRows globally available
window.loadMoreRows = loadMoreRows;

// ==========================================================================
// PROFESSIONAL UI/UX & ACCESSIBILITY ENHANCEMENTS
// ==========================================================================

// 1. Accessibility & Theme Initialization
function initAccessibilityAndTheme() {
    // Restore Saved Theme
    const savedTheme = localStorage.getItem('sarthua_theme') || 'light';
    applyTheme(savedTheme);

    // Restore Saved Font Size
    const savedFontSize = localStorage.getItem('sarthua_font_size') || 'md';
    applyFontSize(savedFontSize);

    // Display Hindi Date
    updateLiveDateDisplay();

    // Global Escape Key Handler for Modals
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeRequestModal();
            closeGlossaryModal();
        }
    });
}

function updateLiveDateDisplay() {
    const liveDateEl = document.getElementById('liveDateText');
    if (!liveDateEl) return;
    try {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const hindiDate = now.toLocaleDateString('hi-IN', options);
        liveDateEl.innerHTML = `<i class="far fa-calendar-alt"></i> ${hindiDate} | मौजा: सरथुआ (थाना 218)`;
    } catch (e) {
        // Fallback
    }
}

// 2. Font Size Scaling
function adjustFontSize(delta) {
    let newSize = 'md';
    if (delta === -1) newSize = 'sm';
    else if (delta === 1) newSize = 'lg';
    applyFontSize(newSize);
    localStorage.setItem('sarthua_font_size', newSize);
}

function applyFontSize(size) {
    if (size === 'sm') {
        document.documentElement.setAttribute('data-font-size', 'sm');
    } else if (size === 'lg') {
        document.documentElement.setAttribute('data-font-size', 'lg');
    } else {
        document.documentElement.removeAttribute('data-font-size');
    }

    // Update active button indicator
    const fontBtns = document.querySelectorAll('.font-zoom-ctrl .font-btn');
    fontBtns.forEach(btn => btn.classList.remove('active'));
    if (size === 'sm' && fontBtns[0]) fontBtns[0].classList.add('active');
    else if (size === 'md' && fontBtns[1]) fontBtns[1].classList.add('active');
    else if (size === 'lg' && fontBtns[2]) fontBtns[2].classList.add('active');
}

// 3. Theme Toggle (Dark / Light)
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('sarthua_theme', newTheme);
}

function applyTheme(theme) {
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
}

// 4. Voice Search (Web Speech API)
let speechRecognition = null;
function startVoiceSearch() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
        alert('आपके ब्राउज़र में वॉइस सर्च समर्थित नहीं है। कृपया गूगल क्रोम (Google Chrome) या माइक्रोसॉफ्ट एज (Edge) का उपयोग करें।');
        return;
    }

    const micBtn = document.getElementById('voiceSearchBtn');
    const searchInput = document.getElementById('searchInput');

    if (speechRecognition) {
        try { speechRecognition.stop(); } catch (e) {}
        speechRecognition = null;
        if (micBtn) micBtn.classList.remove('listening');
        return;
    }

    speechRecognition = new SpeechRec();
    speechRecognition.lang = 'hi-IN';
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;

    if (micBtn) micBtn.classList.add('listening');

    speechRecognition.onstart = function () {
        if (searchInput) searchInput.placeholder = '🎙️ बोलिए... (उदा. खाता 50 या VOL-02)';
    };

    speechRecognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        if (searchInput) {
            searchInput.value = transcript.trim();
            handleSearchInputChange(searchInput);
            searchRecords();
        }
    };

    speechRecognition.onerror = function (event) {
        console.warn('Voice search error:', event.error);
        if (micBtn) micBtn.classList.remove('listening');
        if (searchInput) searchInput.placeholder = 'खाता संख्या (उदा. 50), वॉल्यूम (VOL-01), या बुक खोजें...';
        speechRecognition = null;
    };

    speechRecognition.onend = function () {
        if (micBtn) micBtn.classList.remove('listening');
        if (searchInput) searchInput.placeholder = 'खाता संख्या (उदा. 50), वॉल्यूम (VOL-01), या बुक खोजें...';
        speechRecognition = null;
    };

    try {
        speechRecognition.start();
    } catch (err) {
        console.error('Speech recognition start failed:', err);
        if (micBtn) micBtn.classList.remove('listening');
    }
}

// 5. Search Input Helpers & Quick Chips
function handleSearchInputChange(input) {
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) {
        clearBtn.style.display = input.value.trim() ? 'block' : 'none';
    }
}

function clearSearchInput() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    if (clearBtn) clearBtn.style.display = 'none';
    searchRecords();
}

function applyQuickSearch(term) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = term;
        handleSearchInputChange(searchInput);
        searchRecords();
        // Smooth scroll down to records table
        const nav = document.querySelector('.modern-tab-nav');
        if (nav) nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 6. Interactive WhatsApp Request Modal
function openRequestModal(serviceName) {
    const modal = document.getElementById('requestModal');
    const serviceInput = document.getElementById('reqServiceType');
    if (serviceInput) serviceInput.value = serviceName || 'भू-अभिलेख दस्तावेज़ अनुरोध';
    if (modal) modal.classList.remove('hidden');
}

function closeRequestModal() {
    const modal = document.getElementById('requestModal');
    if (modal) modal.classList.add('hidden');
}

function handleRequestSubmit(event) {
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
    closeRequestModal();
}

// 7. Revenue Glossary Modal
function openGlossaryModal() {
    const modal = document.getElementById('glossaryModal');
    if (modal) modal.classList.remove('hidden');
}

function closeGlossaryModal() {
    const modal = document.getElementById('glossaryModal');
    if (modal) modal.classList.add('hidden');
}

// Expose globally for inline event handlers
window.adjustFontSize = adjustFontSize;
window.toggleTheme = toggleTheme;
window.startVoiceSearch = startVoiceSearch;
window.handleSearchInputChange = handleSearchInputChange;
window.clearSearchInput = clearSearchInput;
window.applyQuickSearch = applyQuickSearch;
window.openRequestModal = openRequestModal;
window.closeRequestModal = closeRequestModal;
window.handleRequestSubmit = handleRequestSubmit;
window.openGlossaryModal = openGlossaryModal;
window.closeGlossaryModal = closeGlossaryModal;