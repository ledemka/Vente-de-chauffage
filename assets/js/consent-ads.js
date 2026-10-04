(function() {
    const GOOGLE_ADS_ID = 'AW-18453340840';
    const STORAGE_KEY = 'sotramsbois_consent_v1';
    
    

    const lang = document.documentElement.lang || 'fr';
    
    const texts = {
        fr: {
            text: "Nous utilisons des cookies publicitaires (Google Ads) pour mesurer l'efficacité de nos annonces. Vous pouvez accepter ou refuser, et modifier votre choix à tout moment.",
            accept: "Accepter",
            refuse: "Refuser",
            more: "En savoir plus",
            manage: "Gérer les cookies"
        },
        en: {
            text: "We use advertising cookies (Google Ads) to measure the effectiveness of our ads. You can accept or refuse, and change your choice at any time.",
            accept: "Accept",
            refuse: "Refuse",
            more: "Learn more",
            manage: "Manage cookies"
        },
        de: {
            text: "Wir verwenden Werbe-Cookies (Google Ads), um die Wirksamkeit unserer Anzeigen zu messen. Sie können akzeptieren oder ablehnen und Ihre Auswahl jederzeit ändern.",
            accept: "Akzeptieren",
            refuse: "Ablehnen",
            more: "Mehr erfahren",
            manage: "Cookies verwalten"
        },
        nl: {
            text: "Wij gebruiken advertentiecookies (Google Ads) om de effectiviteit van onze advertenties te meten. U kunt accepteren of weigeren en uw keuze op elk moment wijzigen.",
            accept: "Accepteren",
            refuse: "Weigeren",
            more: "Meer informatie",
            manage: "Cookies beheren"
        }
    };
    
    const t = texts[lang] || texts['fr'];
    
    function getStoredConsent() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);
        } catch (e) {
            // Error reading from localStorage
        }
        return null;
    }
    
    function setStoredConsent(status) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                status: status,
                timestamp: new Date().getTime()
            }));
        } catch (e) {
            // Error writing to localStorage
        }
    }
    
    function checkConversion() {
        if (window.adsConversionSent) return;
        if (document.body && document.body.dataset.adsConversion) {
            let isDevis = false;
            try { isDevis = sessionStorage.getItem('ads_conv_devis') === '1'; } catch(e) {}
            if (isDevis) {
                gtag('event', 'conversion', { 'send_to': document.body.dataset.adsConversion });
                window.adsConversionSent = true;
                try { sessionStorage.removeItem('ads_conv_devis'); } catch(e) {}
            }
        }
    }

    function applyConsent(status, reloadIfDenied = false) {
        setStoredConsent(status);
        
        if (status === 'granted') {
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'denied'
            });
            hideBanner();
            checkConversion();
        } else {
            try { sessionStorage.removeItem('ads_conv_devis'); } catch(e) {}
            gtag('consent', 'update', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied'
            });
            hideBanner();
            if (reloadIfDenied) {
                window.location.reload();
            }
        }
    }
    
    function hideBanner() {
        const banner = document.getElementById('consent-banner');
        if (banner) banner.style.display = 'none';
    }
    
    function showBanner() {
        let banner = document.getElementById('consent-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'consent-banner';
            banner.setAttribute('role', 'dialog');
            
            // Avoid Tailwind dependencies, use inline styles
            banner.style.position = 'fixed';
            banner.style.bottom = '20px';
            banner.style.left = '20px';
            banner.style.maxWidth = '400px';
            banner.style.backgroundColor = '#ffffff';
            banner.style.color = '#333333';
            banner.style.padding = '20px';
            banner.style.borderRadius = '8px';
            banner.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            banner.style.zIndex = '9999'; // Sufficient but typically below Tawk which is very high, but Tawk is bottom right, we are bottom left
            banner.style.fontFamily = 'sans-serif';
            banner.style.fontSize = '14px';
            banner.style.lineHeight = '1.5';
            banner.style.border = '1px solid #e0e0e0';

            // Check if we are in a subfolder (like /en/) for the relative path
            const isSubfolder = window.location.pathname.split('/').filter(Boolean).length > 0 && ['en', 'de', 'nl'].includes(window.location.pathname.split('/').filter(Boolean)[0]);
            let privacyPath = 'politique-confidentialite.html';
            if (isSubfolder || window.location.pathname.includes('/produits/')) {
                // If we are in /en/ or /produits/, adjust accordingly. Wait, the simplest way is to look at how other links work, or just use absolute path to be safe, but prompt says "chemin relatif, valable dans les 4 dossiers de langue".
                // Actually, if we are in /en/, the privacy policy is at /en/politique-confidentialite.html. It's in the same directory!
                // Wait, if we are in /produits/ it's ../politique-confidentialite.html
                // If we are in /en/produits/ it's ../politique-confidentialite.html
                privacyPath = window.location.pathname.includes('/produits/') ? '../politique-confidentialite.html' : 'politique-confidentialite.html';
            }

            banner.innerHTML = `
                <div style="margin-bottom: 15px;">
                    ${t.text} <a href="${privacyPath}" style="color: #802813; text-decoration: underline;">${t.more}</a>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="consent-refuse" style="flex: 1; padding: 10px; cursor: pointer; border: 1px solid #802813; background: transparent; color: #802813; border-radius: 4px; font-weight: bold;">${t.refuse}</button>
                    <button id="consent-accept" style="flex: 1; padding: 10px; cursor: pointer; border: 1px solid #802813; background: #802813; color: #ffffff; border-radius: 4px; font-weight: bold;">${t.accept}</button>
                </div>
            `;
            
            document.body.appendChild(banner);
            
            document.getElementById('consent-accept').addEventListener('click', function() {
                applyConsent('granted');
            });
            
            document.getElementById('consent-refuse').addEventListener('click', function() {
                applyConsent('denied');
            });
        }
        banner.style.display = 'block';
    }
    
    window.openCookieSettings = function(e) {
        if (e) e.preventDefault();
        showBanner();
    };
    
    function injectFooterLink() {
        const footer = document.querySelector('footer');
        if (footer) {
            const btnContainer = document.createElement('div');
            btnContainer.style.textAlign = 'center';
            btnContainer.style.marginTop = '20px';
            btnContainer.style.paddingTop = '20px';
            btnContainer.style.borderTop = '1px solid rgba(255,255,255,0.1)';
            
            const btn = document.createElement('button');
            btn.innerText = t.manage;
            btn.style.background = 'transparent';
            btn.style.border = 'none';
            btn.style.color = 'inherit';
            btn.style.textDecoration = 'underline';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '0.875rem';
            btn.style.opacity = '0.7';
            
            btn.addEventListener('click', function(e) {
                const currentConsent = getStoredConsent();
                if (currentConsent && currentConsent.status === 'granted') {
                    // If user was previously granted and opens settings, they might deny.
                    // We bind the refuse button to also reload the page in this case.
                    window.openCookieSettings(e);
                    // Override the refuse button's behavior for this specific interaction
                    setTimeout(() => {
                        const refuseBtn = document.getElementById('consent-refuse');
                        if(refuseBtn) {
                            const newRefuseBtn = refuseBtn.cloneNode(true);
                            refuseBtn.parentNode.replaceChild(newRefuseBtn, refuseBtn);
                            newRefuseBtn.addEventListener('click', function() {
                                applyConsent('denied', true);
                            });
                        }
                    }, 50);
                } else {
                    window.openCookieSettings(e);
                }
            });
            
            // Hover effects
            btn.addEventListener('mouseover', () => btn.style.opacity = '1');
            btn.addEventListener('mouseout', () => btn.style.opacity = '0.7');
            
            btnContainer.appendChild(btn);
            
            // Insert at the end of the footer content, usually within the max-w container
            const container = footer.querySelector('div.max-w-\\[1440px\\]');
            if (container) {
                container.appendChild(btnContainer);
            } else {
                footer.appendChild(btnContainer);
            }
        }
    }
    
    // Check initial state
    const currentConsent = getStoredConsent();
    if (currentConsent) {
        if (currentConsent.status === 'granted') {
            applyConsent('granted');
        } else {
            // Already denied, do nothing
        }
    } else {
        // Wait for DOM to be ready to show banner
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showBanner);
        } else {
            showBanner();
        }
    }
    
    // Inject footer link
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectFooterLink);
    } else {
        injectFooterLink();
    }
    
})();
