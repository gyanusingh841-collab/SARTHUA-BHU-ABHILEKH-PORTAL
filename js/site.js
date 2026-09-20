/**
 * Sarthua Bhu-Abhilekh Portal - Shared Site Chrome (loaded on every page)
 * Theme toggle, font-size toggle, and Hindi/English language toggle.
 * Kept independent of the record/PDF/map bundles so the home, glossary and
 * services pages don't have to load the heavier data bundles just to toggle
 * the navbar controls.
 */

(function () {
    'use strict';

    // ---- Theme (light/dark) ----
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

    // ---- Font size (A- / A / A+) ----
    function applyFontSize(size) {
        if (size === 'sm' || size === 'lg') {
            document.documentElement.setAttribute('data-font-size', size);
        } else {
            document.documentElement.removeAttribute('data-font-size');
        }
        var btns = document.querySelectorAll('.nav-font-ctrl .font-btn');
        btns.forEach(function (b) { b.classList.remove('active'); });
        if (size === 'sm' && btns[0]) btns[0].classList.add('active');
        else if (size === 'md' && btns[1]) btns[1].classList.add('active');
        else if (size === 'lg' && btns[2]) btns[2].classList.add('active');
    }

    window.adjustFontSize = function (delta) {
        var size = 'md';
        if (delta === -1) size = 'sm';
        else if (delta === 1) size = 'lg';
        applyFontSize(size);
        try { localStorage.setItem('sarthua_font_size', size); } catch (e) { }
    };

    // ---- Hindi / English toggle ----
    // Every translatable text node carries data-en="English text"; the Hindi
    // original is captured into data-hi the first time we touch it.
    function applyLanguage(lang) {
        document.querySelectorAll('[data-en]').forEach(function (el) {
            if (!el.hasAttribute('data-hi')) {
                el.setAttribute('data-hi', el.textContent);
            }
            el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-hi');
        });
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
        var savedTheme = 'light', savedFont = 'md', savedLang = 'hi';
        try {
            savedTheme = localStorage.getItem('sarthua_theme') || 'light';
            savedFont = localStorage.getItem('sarthua_font_size') || 'md';
            savedLang = localStorage.getItem('sarthua_lang') || 'hi';
        } catch (e) { }
        applyTheme(savedTheme);
        applyFontSize(savedFont);
        if (savedLang === 'en') applyLanguage('en');
    });
})();
