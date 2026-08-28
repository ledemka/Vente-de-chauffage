/**
 * i18n-loader.js
 * Client-side internationalization and SEO loader.
 * Loads translation files from data/i18n/ and SEO data from data/seo/
 * based on the active language and applies them to the DOM.
 */

document.addEventListener('DOMContentLoaded', () => {
    const lang = document.documentElement.lang || 'fr';
    const relPath = lang === 'fr' ? '.' : '..';

    // 1. Load Translations
    fetch(`${relPath}/data/i18n/${lang}.json`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(translations => {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const keys = key.split('.');
                let val = translations;
                for (const k of keys) {
                    if (val) val = val[k];
                }
                if (val) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = val;
                    } else if (el.hasAttribute('data-i18n-html')) {
                        el.innerHTML = val;
                    } else {
                        el.textContent = val;
                    }
                }
            });
            // Fire event indicating translations are loaded
            document.dispatchEvent(new CustomEvent('i18nLoaded', { detail: { lang, translations } }));
        })
        .catch(err => console.error('Error loading translations:', err));

    // 2. Load SEO Metadata
    let pageName = window.location.pathname.split('/').pop() || 'index.html';
    if (!pageName.endsWith('.html')) {
        pageName = 'index.html';
    }
    
    fetch(`${relPath}/data/seo/${lang}.json`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(seo => {
            const pageSeo = seo[pageName];
            if (pageSeo) {
                if (pageSeo.title) document.title = pageSeo.title;
                if (pageSeo.description) {
                    let descMeta = document.querySelector('meta[name="description"]');
                    if (!descMeta) {
                        descMeta = document.createElement('meta');
                        descMeta.name = 'description';
                        document.head.appendChild(descMeta);
                    }
                    descMeta.content = pageSeo.description;
                }
            }
        })
        .catch(err => console.error('Error loading SEO metadata:', err));
});
