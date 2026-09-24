/**
 * Sarthua Bhu-Abhilekh Portal - Shared Site Chrome (loaded on every page)
 * Theme (follows the OS until the user picks one) and Hindi/English toggle.
 * Kept independent of the record/PDF/map bundles so the home, glossary and
 * services pages don't have to load the heavier data bundles just to toggle
 * the navbar controls.
 */

(function () {
    'use strict';

    // ---- Theme (light/dark) ----
    // No saved choice -> follow the system setting (and keep following it live).
    // Clicking the toggle saves an explicit choice, which then always wins.
    var systemDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function savedTheme() {
        try {
            var t = localStorage.getItem('sarthua_theme');
            if (t === 'light' || t === 'dark') return t;
        } catch (e) { }
        return null;
    }

    function resolvedTheme() {
        return savedTheme() || (systemDark && systemDark.matches ? 'dark' : 'light');
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        var icon = document.getElementById('themeIcon');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
                icon.style.color = '#f59e0b';
            } else {
                icon.className = 'fas fa-moon';
                icon.style.color = '';
            }
        }
    }

    window.toggleTheme = function () {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('sarthua_theme', next); } catch (e) { }
    };

    // ---- Hindi / English toggle ----
    // Every translatable text node carries data-en="English text"; the Hindi
    // original is captured into data-hi the first time we touch it.
    function applyLanguage(lang) {
        var elements = document.querySelectorAll('[data-en]');
        var total = elements.length;
        var batch = [];
        
        // Pass 1: Read and initialize data-hi
        for (var i = 0; i < total; i++) {
            var el = elements[i];
            var hi = el.getAttribute('data-hi');
            if (hi === null) {
                hi = el.textContent;
                el.setAttribute('data-hi', hi);
            }
            var targetText = lang === 'en' ? el.getAttribute('data-en') : hi;
            if (targetText && el.textContent !== targetText) {
                batch.push({ node: el, text: targetText });
            }
        }
        
        // Pass 2: Batch DOM text mutations
        for (var j = 0; j < batch.length; j++) {
            batch[j].node.textContent = batch[j].text;
        }

        document.documentElement.setAttribute('lang', lang);
        var btn = document.getElementById('langToggleBtn');
        if (btn) btn.textContent = lang === 'en' ? 'हिं' : 'EN';
        var input = document.getElementById('searchInput');
        if (input) {
            if (!input.hasAttribute('data-ph-hi')) input.setAttribute('data-ph-hi', input.placeholder);
            if (input.hasAttribute('data-ph-en')) {
                input.placeholder = lang === 'en' ? input.getAttribute('data-ph-en') : input.getAttribute('data-ph-hi');
            }
        }
    }

    window.toggleLanguage = function () {
        var current = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'hi';
        var next = current === 'en' ? 'hi' : 'en';
        applyLanguage(next);
        try { localStorage.setItem('sarthua_lang', next); } catch (e) { }
    };

    // ---- Boot ----
    document.addEventListener('DOMContentLoaded', function () {
        var savedLang = 'hi';
        try {
            savedLang = localStorage.getItem('sarthua_lang') || 'hi';
            localStorage.removeItem('sarthua_font_size'); // retired A-/A/A+ control
        } catch (e) { }
        applyTheme(resolvedTheme());
        if (savedLang === 'en') applyLanguage('en');

        if (systemDark) {
            var onSystemChange = function () {
                if (!savedTheme()) applyTheme(resolvedTheme());
            };
            if (systemDark.addEventListener) systemDark.addEventListener('change', onSystemChange);
            else if (systemDark.addListener) systemDark.addListener(onSystemChange);
        }

        var yearEl = document.getElementById('copyrightYear');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    });

    // ---- PWA Service Worker & Install Prompt ----
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
    }

    var deferredInstallPrompt = null;
    var isStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredInstallPrompt = e;

        if (isStandalone || sessionStorage.getItem('pwa_banner_dismissed') === '1') {
            return;
        }

        setTimeout(function () {
            if (document.getElementById('pwaInstallBanner')) return;

            var banner = document.createElement('div');
            banner.id = 'pwaInstallBanner';
            banner.className = 'pwa-install-banner';
            banner.innerHTML = 
                '<div class="pwa-install-icon"><img src="/favicon.svg" width="42" height="42" alt="सरथुआ ऐप लोगो"></div>' +
                '<div class="pwa-install-info">' +
                    '<strong>सरथुआ ऐप इंस्टॉल करें</strong>' +
                    '<span>बिना सर्च किए सीधे होमस्क्रीन से खोलें</span>' +
                '</div>' +
                '<button id="pwaInstallBtn" class="pwa-btn-install">इंस्टॉल</button>' +
                '<button id="pwaDismissBtn" class="pwa-btn-dismiss" title="हटाएं">&times;</button>';

            document.body.appendChild(banner);

            var installBtn = document.getElementById('pwaInstallBtn');
            var dismissBtn = document.getElementById('pwaDismissBtn');

            if (installBtn) {
                installBtn.addEventListener('click', function () {
                    if (deferredInstallPrompt) {
                        deferredInstallPrompt.prompt();
                        deferredInstallPrompt.userChoice.then(function (choice) {
                            if (choice.outcome === 'accepted') {
                                banner.remove();
                            }
                            deferredInstallPrompt = null;
                        });
                    }
                });
            }

            if (dismissBtn) {
                dismissBtn.addEventListener('click', function () {
                    banner.remove();
                    try { sessionStorage.setItem('pwa_banner_dismissed', '1'); } catch (err) {}
                });
            }
        }, 2000);
    });

    window.addEventListener('appinstalled', function () {
        var banner = document.getElementById('pwaInstallBanner');
        if (banner) banner.remove();
        deferredInstallPrompt = null;
    });
})();
