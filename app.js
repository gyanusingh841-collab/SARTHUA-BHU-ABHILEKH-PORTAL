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
    {"sr_no": 1, "volume": "VOL-01", "total_pages": 8, "filename": "Sarthua_Vol_01_1970.pdf", "file_size_mb": 2.14, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/ETRT3WhTS5VAvcBqzz6ZGxYBFUokqi4QjQcjHdMQzSQ03A?e=pkOTlT"},
    {"sr_no": 2, "volume": "VOL-02", "total_pages": 256, "filename": "Sarthua_Vol_02_1970.pdf", "file_size_mb": 76.54, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/Ec9WR6LBDf1EtM7QZ1oG3loB3WvV-6NyTP9F5bekQ_k-tw"},
    {"sr_no": 3, "volume": "VOL-03", "total_pages": 0, "filename": "DOC NOT FOUND", "file_size_mb": 0, "pdf_link": "DOC NOT FOUND"},
    {"sr_no": 4, "volume": "VOL-04", "total_pages": 193, "filename": "Sarthua_Vol_04_1970.pdf", "file_size_mb": 53.02, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EbAR5IkBVY1EuWN8iJdvw1cBLe5HAKFu1BaALznSC94b9w"},
    {"sr_no": 5, "volume": "VOL-05", "total_pages": 167, "filename": "Sarthua_Vol_05_1970.pdf", "file_size_mb": 46.01, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EaHd1b7E-RBEugZbBo_tnJAB2stWXfayJVacgRqAVLz6lw"},
    {"sr_no": 6, "volume": "VOL-06", "total_pages": 151, "filename": "Sarthua_Vol_06_1970.pdf", "file_size_mb": 40.97, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/ERx5RtK91T1IvIVtw3-MQ8QBIUWZIZGkyr2BTYTFJtkq_g"},
    {"sr_no": 7, "volume": "VOL-07", "total_pages": 211, "filename": "Sarthua_Vol_07_1970.pdf", "file_size_mb": 64.51, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EdGco6yoRNpAl36HKe51ZdEBIKSdOMfYiMBYCqIH9bZlQQ"},
    {"sr_no": 8, "volume": "VOL-08", "total_pages": 4, "filename": "Sarthua_Vol_08_1970.pdf", "file_size_mb": 1, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/Ecc3jRWKx3NAioBHPLtWi10BiPUvm2EtFshxIntl13Zbmw"},
    {"sr_no": 9, "volume": "VOL-09", "total_pages": 223, "filename": "Sarthua_Vol_09_1970.pdf", "file_size_mb": 64.78, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/ETOoEjTkQ0RPlmpYG_y_rkIBC_P3e4EvMUntOz1JDgAXIg"},
    {"sr_no": 10, "volume": "VOL-10", "total_pages": 148, "filename": "Sarthua_Vol_10_1970.pdf", "file_size_mb": 45.8, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EQ6L71F6qR1BrjDCD3KqiFcB9uPnT-GVyJJRBUB184bh-Q"},
    {"sr_no": 11, "volume": "VOL-11", "total_pages": 194, "filename": "Sarthua_Vol_11_1970.pdf", "file_size_mb": 58.09, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EXwVhFOHsnxOiSGfjhQEq6sBf5reYZ-VTYL7jQHw-T3fAA"},
    {"sr_no": 12, "volume": "VOL-11 (A)", "total_pages": 160, "filename": "Sarthua_Vol_11A_1970.pdf", "file_size_mb": 39.57, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EQ6AY6j-FfJBr5-Jd8gYoDgBDcMf_l67lnQ6DZNjBp55Cg"},
    {"sr_no": 13, "volume": "VOL-12", "total_pages": 170, "filename": "Sarthua_Vol_12_1970.pdf", "file_size_mb": 47.48, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EXl_IUZpuRdPjwaBDqeT2-sBWwibYbwalOsdZLGuIN5QYw"},
    {"sr_no": 14, "volume": "VOL-13", "total_pages": 178, "filename": "Sarthua_Vol_13_1970.pdf", "file_size_mb": 49.79, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EXJkrf4R-NFOt0Ch_MMPDsYB0fM8LQs0oaS_rItow4-oIQ"},
    {"sr_no": 15, "volume": "VOL-14", "total_pages": 94, "filename": "Sarthua_Vol_14_1970.pdf", "file_size_mb": 27.38, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EVKIZIrXjW9DuKFzSOaD5FUBJmGHut2S_R-Mm23yUyU_Tw"},
    {"sr_no": 16, "volume": "VOL-15", "total_pages": 200, "filename": "Sarthua_Vol_15_1970.pdf", "file_size_mb": 54.68, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/ER4S6-gPeNtPlpXcU6YnUGUBO88STXOPCpiGJ4eqMNs6pA"},
    {"sr_no": 17, "volume": "VOL-16", "total_pages": 179, "filename": "Sarthua_Vol_16_1970.pdf", "file_size_mb": 52.69, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/ERIIrEcfuhlIm_vEtzW1tiQB6IY2rNICq2H9CLL9zEUfmw"},
    {"sr_no": 18, "volume": "VOL-17", "total_pages": 178, "filename": "Sarthua_Vol_17_1970.pdf", "file_size_mb": 54.42, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EbwFVwOSLlZHq8f4wl0V7uYBxmfu_2YQ8wjwKEzX2HNJ2g"},
    {"sr_no": 19, "volume": "VOL-18", "total_pages": 169, "filename": "Sarthua_Vol_18_1970.pdf", "file_size_mb": 50.66, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EZIJJmjo9ulAjlN56k74lSMB88V84jNlEhwYkIo780ypfA"},
    {"sr_no": 20, "volume": "VOL-19", "total_pages": 102, "filename": "Sarthua_Vol_19_1970.pdf", "file_size_mb": 27.91, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EfLKC0ep8CVIgWg6ZTQ4DBgBZwDw1u2PqImaZeX1im1Plg"},
    {"sr_no": 21, "volume": "VOL-20", "total_pages": 74, "filename": "Sarthua_Vol_20_1970.pdf", "file_size_mb": 20.41, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EbYUW6WF1eVChgxKYe0h1dABAOyYhi-CnyTefkAhrQi8KA"},
    {"sr_no": 22, "volume": "VOL-21", "total_pages": 28, "filename": "Sarthua_Vol_21_1970.pdf", "file_size_mb": 7.94, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/Ed0EYwBnpw9Pgp8HodYVbKcB3lthprxypBtzXlf4MxWtFg"}
  ],
  "revisional_survey": [
    {"sr_no": 1, "register_no": "BOOK-1", "khata_numbers": "1-178", "total_pages": 289, "filename": "Sarthua_Rev_01_1970.pdf", "file_size_mb": 43.09, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EaPG1i6Rki5Ar7_vFUHVZr0BDgxeazZG1k9wt6JgJY4mrw"},
    {"sr_no": 2, "register_no": "BOOK-2", "khata_numbers": "12-158", "total_pages": 17, "filename": "Sarthua_Rev_02_1970.pdf", "file_size_mb": 2.7, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EVYXRMCs5TNAhho-WZeKkB8BmGipwOo7DkUUgC03IAAXlg"},
    {"sr_no": 3, "register_no": "BOOK-3", "khata_numbers": "198-400", "total_pages": 165, "filename": "Sarthua_Rev_03_1970.pdf", "file_size_mb": 29.2, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EcRGb_jkMrJDvCCmksiIrLkBT9DS-A0Dql3GpCFr4cFg9Q"},
    {"sr_no": 4, "register_no": "BOOK-4", "khata_numbers": "331-452", "total_pages": 118, "filename": "Sarthua_Rev_04_1970.pdf", "file_size_mb": 23.04, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EbsKyFPUtsRHqYi1nHwerckBGyScJxGjCY2RjT5-nuc5YA"},
    {"sr_no": 5, "register_no": "BOOK-5", "khata_numbers": "458-663", "total_pages": 182, "filename": "Sarthua_Rev_05_1970.pdf", "file_size_mb": 33.06, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EQqrW00Fjj1Fk9f4VXntOCMBoox1aZKLFDDjBiWloWf1kg"},
    {"sr_no": 6, "register_no": "BOOK-6", "khata_numbers": "676-896", "total_pages": 238, "filename": "Sarthua_Rev_06_1970.pdf", "file_size_mb": 42.09, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EX7ISBrtUANPhFYRotlPaxEBy7jrUD0tu25sb4ySaaMWGw"},
    {"sr_no": 7, "register_no": "BOOK-7", "khata_numbers": "712-915", "total_pages": 269, "filename": "Sarthua_Rev_07_1970.pdf", "file_size_mb": 53.06, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EZrnoNB7S7VDkeUFRIdC544BvLEz1k19fedBTTMOpS2-Ew"},
    {"sr_no": 8, "register_no": "BOOK-8", "khata_numbers": "1-25, 651-915", "total_pages": 376, "filename": "Sarthua_Rev_08_1970.pdf", "file_size_mb": 215, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EUQpNHc9oC1Kr_fhoEjrPCcBCllFxxFxBKRp-e1fFUp05A"},
    {"sr_no": 9, "register_no": "BOOK-9", "khata_numbers": "280-617", "total_pages": 385, "filename": "Sarthua_Rev_09_1970.pdf", "file_size_mb": 209.4, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EWksH2lQfNlAgxndytToPrcBdbHiPFxyZsd6lfh1gF-nmw"}
  ],
  "cadastral_survey": [
    {"sr_no": 1, "register_no": "BOOK-1", "khata_numbers": "1-188", "total_pages": 408, "filename": "Sarthua_cs_01_1911.pdf", "file_size_mb": 136.7, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EfWtGVQRFxpLl09-b9M8MLwBMYxQTcIk-tgjYT6whasGMg"},
    {"sr_no": 2, "register_no": "BOOK-2", "khata_numbers": "undefined", "total_pages": 422, "filename": "Sarthua_cs_02_1911.pdf", "file_size_mb": 140.7, "pdf_link": "https://1drv.ms/b/c/98cca50e3110828e/EbwNrjQBiIVJiypfj0LQHGQB9Nj3PSLOojY9tS80AzDL4Q"}
  ],
  "contact_services": [
    {"सेवा कोड": "SRV001", "सेवा का नाम": "मूल प्रति का अनुरोध", "सेवा विवरण": "गांव के भू-अभिलेख की मूल प्रति प्राप्त करने के लिए", "संपर्क विधि": "WhatsApp", "मोबाइल नंबर": "+91 9006035986", "WhatsApp लिंक": "https://wa.me/919006035986?text=नमस्कार! मैं सरथुआ गांव के भू-अभिलेख की मूल प्रति चाहता हूं।", "समय सीमा": "तत्काल", "शुल्क": "निःशुल्क", "उपलब्धता": "सुबह 9 से शाम 6 बजे तक", "प्राथमिकता स्तर": "उच्च"},
    {"सेवा कोड": "SRV002", "सेवा का नाम": "खतियान की प्रतिलिपि", "सेवा विवरण": "विशिष्ट खाता संख्या की खतियान की फोटोकॉपी", "संपर्क विधि": "WhatsApp", "मोबाइल नंबर": "+91 9006035986", "WhatsApp लिंक": "https://wa.me/919006035986?text=नमस्कार! मुझे खतियान की प्रतिलिपि चाहिए।", "समय सीमा": "1 दिन", "शुल्क": "निःशुल्क", "उपलब्धता": "सुबह 9 से शाम 6 बजे तक", "प्राथमिकता स्तर": "मध्यम"},
    {"सेवा कोड": "SRV003", "सेवा का नाम": "तकनीकी सहायता", "सेवा विवरण": "डिजिटल फाइल एक्सेस में तकनीकी समस्या", "संपर्क विधि": "WhatsApp", "मोबाइल नंबर": "+91 9006035986", "WhatsApp लिंक": "https://wa.me/919006035986?text=नमस्कार! मुझे तकनीकी सहायता चाहिए।", "समय सीमा": "तत्काल", "शुल्क": "निःशुल्क", "उपलब्धता": "सुबह 9 से शाम 6 बजे तक", "प्राथमिकता स्तर": "उच्च"}
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
document.addEventListener('DOMContentLoaded', function() {
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
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
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
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.modern-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    if (event && event.target) {
        const clickedBtn = event.target.closest('.modern-tab-btn');
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }
    } else {
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
    
    return `
        <button class="btn btn--view" onclick="viewPDF('${item.pdf_link}', '${item.filename}')">
            <i class="fas fa-eye"></i>
            PDF देखें
        </button>
    `;
}

// View PDF function - ONLY VIEWING, NO DOWNLOAD
function viewPDF(pdfLink, filename) {
    if (!pdfLink || pdfLink === "DOC NOT FOUND") {
        showAlert('यह दस्तावेज़ उपलब्ध नहीं है।', 'error');
        return;
    }
    
    showLoadingModal();
    
    // Small delay to show loading animation
    setTimeout(() => {
        window.open(pdfLink, '_blank');
        hideLoadingModal();
        
        // Show success message
        showAlert('PDF नए टैब में खुल रहा है...', 'success');
    }, 800);
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

// Enhanced search functionality
function searchRecords() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        showAlert('कृपया खोज के लिए कुछ टाइप करें।', 'info');
        return;
    }
    
    // Clear previous highlights
    clearSearchHighlights();
    
    // Search across all data types
    let foundResults = false;
    let totalFound = 0;
    
    // Search in Jamabandi
    const jamabandiResults = portalData.jamabandi_panji.filter(item => 
        item.volume.toLowerCase().includes(searchTerm) ||
        item.sr_no.toString().includes(searchTerm) ||
        item.filename.toLowerCase().includes(searchTerm)
    );
    
    // Search in Revisional
    const revisionalResults = portalData.revisional_survey.filter(item => 
        item.register_no.toLowerCase().includes(searchTerm) ||
        item.khata_numbers.toLowerCase().includes(searchTerm) ||
        item.sr_no.toString().includes(searchTerm) ||
        item.filename.toLowerCase().includes(searchTerm)
    );
    
    // Search in Cadastral
    const cadastralResults = portalData.cadastral_survey.filter(item => 
        item.register_no.toLowerCase().includes(searchTerm) ||
        (item.khata_numbers !== "undefined" && item.khata_numbers.toLowerCase().includes(searchTerm)) ||
        item.sr_no.toString().includes(searchTerm) ||
        item.filename.toLowerCase().includes(searchTerm)
    );
    
    // Show results with priority
    if (jamabandiResults.length > 0) {
        highlightSearchResults('jamabandi', jamabandiResults);
        showTab('jamabandi');
        foundResults = true;
        totalFound += jamabandiResults.length;
    } else if (revisionalResults.length > 0) {
        highlightSearchResults('revisional', revisionalResults);
        showTab('revisional');
        foundResults = true;
        totalFound += revisionalResults.length;
    } else if (cadastralResults.length > 0) {
        highlightSearchResults('cadastral', cadastralResults);
        showTab('cadastral');
        foundResults = true;
        totalFound += cadastralResults.length;
    }
    
    if (foundResults) {
        showAlert(`${totalFound} परिणाम मिले "${searchTerm}" के लिए`, 'success');
    } else {
        showAlert('कोई परिणाम नहीं मिला। कृपया अन्य खोज शब्द का प्रयास करें।', 'error');
    }
}

// Clear search highlights
function clearSearchHighlights() {
    document.querySelectorAll('.modern-table tr').forEach(row => {
        row.style.background = '';
        row.style.border = '';
    });
}

// Highlight search results with modern styling
function highlightSearchResults(tabType, results) {
    const tbody = document.getElementById(tabType + '-tbody');
    const rows = tbody.getElementsByTagName('tr');
    
    // Reset all row highlights
    Array.from(rows).forEach(row => {
        row.style.background = '';
        row.style.border = '';
    });
    
    // Highlight matching rows with modern style
    results.forEach(result => {
        const targetRow = Array.from(rows).find(row => 
            row.cells[0].textContent.trim() == result.sr_no.toString()
        );
        if (targetRow) {
            targetRow.style.background = 'linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(5, 150, 105, 0.1))';
            targetRow.style.border = '2px solid rgba(30, 64, 175, 0.3)';
            targetRow.style.borderRadius = '8px';
            targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Add smooth animations for better UX
function addLoadingEffects() {
    // Add loading effect to buttons when clicked
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn--view')) {
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    });
}

// Initialize loading effects
document.addEventListener('DOMContentLoaded', function() {
    addLoadingEffects();
});

// Make functions globally available
window.showTab = showTab;
window.viewPDF = viewPDF;
window.searchRecords = searchRecords;

// Add keyboard shortcuts for better accessibility
document.addEventListener('keydown', function(e) {
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
window.addEventListener('resize', function() {
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