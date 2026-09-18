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

    // Helper to dynamically load cart.js if missing on page
    const ensureCartAPI = () => {
        if (typeof CartAPI !== 'undefined') return Promise.resolve(window.CartAPI);
        return new Promise((resolve) => {
            const inSubdir = /^\/(en|de|nl)\//.test(window.location.pathname);
            const scriptPath = inSubdir ? '../assets/js/cart.js' : './assets/js/cart.js';
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = () => resolve(window.CartAPI);
            script.onerror = () => resolve(null);
            document.head.appendChild(script);
        });
    };

    // 3. Cart Badge Logic
    const updateCartBadge = async () => {
        try {
            if (typeof CartAPI === 'undefined') {
                await ensureCartAPI();
            }
            if (typeof CartAPI === 'undefined') return;
            const res = await CartAPI.get();
            if (!res || !res.success) return;
            const items = res.items || [];
            const count = items.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
            
            const cartLinks = Array.from(document.querySelectorAll('a')).filter(a => a.getAttribute('href') && a.getAttribute('href').includes('panier.html'));
            if (cartLinks.length > 0) {
                const headerCartLink = cartLinks.find(a => a.innerHTML.includes('shopping_cart')) || cartLinks[0];
                if (headerCartLink) {
                    headerCartLink.classList.add('relative');
                    let badge = headerCartLink.querySelector('#cart-badge') || document.getElementById('cart-badge');
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.id = 'cart-badge';
                        badge.className = 'absolute -top-1.5 -right-2.5 bg-[#802813] text-white text-[11px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center z-10 shadow-sm pointer-events-none';
                        headerCartLink.appendChild(badge);
                    }
                    if (count > 0) {
                        badge.textContent = count > 99 ? '99+' : count;
                        badge.style.display = 'flex';
                    } else {
                        badge.style.display = 'none';
                    }
                }
            }
        } catch(e) {
            console.error('Cart badge error:', e);
        }
    };
    
    updateCartBadge();
    window.updateCartBadge = updateCartBadge;

});
