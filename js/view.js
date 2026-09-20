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

    // Accessibility Text Resizing (A- / A / A+)
    applyFontSize: function (size) {
        if (size === 'sm') {
            document.documentElement.setAttribute('data-font-size', 'sm');
        } else if (size === 'lg') {
            document.documentElement.setAttribute('data-font-size', 'lg');
        } else {
            document.documentElement.removeAttribute('data-font-size');
        }

        const fontBtns = document.querySelectorAll('.nav-font-ctrl .font-btn');
        fontBtns.forEach(btn => btn.classList.remove('active'));
        if (size === 'sm' && fontBtns[0]) fontBtns[0].classList.add('active');
        else if (size === 'md' && fontBtns[1]) fontBtns[1].classList.add('active');
        else if (size === 'lg' && fontBtns[2]) fontBtns[2].classList.add('active');
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
