const fs = require('fs');
let content = fs.readFileSync('assets/js/consent-ads.js', 'utf8');

// Task 3: loadGoogleAds
const targetLoad = `    function loadGoogleAds() {
        if (document.getElementById('google-ads-script')) return;
        const script = document.createElement('script');
        script.id = 'google-ads-script';
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID;
        script.async = true;
        document.head.appendChild(script);
        
        gtag('js', new Date());
        gtag('config', GOOGLE_ADS_ID);
    }`;

const replaceLoad = `    function loadGoogleAds() {
        if (document.getElementById('google-ads-script')) return;
        const script = document.createElement('script');
        script.id = 'google-ads-script';
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID;
        script.async = true;
        document.head.appendChild(script);
        
        gtag('js', new Date());
        
        const params = new URLSearchParams(window.location.search);
        params.delete('email');
        params.delete('token');
        params.delete('ref');
        params.delete('password');
        const qs = params.toString();
        const cleanUrl = window.location.origin + window.location.pathname + (qs ? '?' + qs : '');
        
        gtag('config', GOOGLE_ADS_ID, { page_location: cleanUrl });
    }`;

content = content.replace(targetLoad, replaceLoad);
if (content.indexOf("gtag('config', GOOGLE_ADS_ID, { page_location: cleanUrl });") === -1) {
    // try with \r\n
    content = content.replace(targetLoad.replace(/\n/g, '\r\n'), replaceLoad.replace(/\n/g, '\r\n'));
}

// Task 5: checkConversion
const targetCheck = `    function checkConversion() {
        if (window.adsConversionSent) return;
        if (document.body && document.body.dataset.adsConversion) {
            const navEntries = performance.getEntriesByType('navigation');
            const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';
            if (!isReload) {
                gtag('event', 'conversion', { 'send_to': document.body.dataset.adsConversion });
                window.adsConversionSent = true;
            }
        }
    }`;

const replaceCheck = `    function checkConversion() {
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
    }`;

content = content.replace(targetCheck, replaceCheck);
if (content.indexOf("let isDevis = false;") === -1) {
    content = content.replace(targetCheck.replace(/\n/g, '\r\n'), replaceCheck.replace(/\n/g, '\r\n'));
}

// Task 5: applyConsent('denied') -> remove flag
const targetDenied = `        } else {
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
        }`;

const replaceDenied = `        } else {
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
        }`;

content = content.replace(targetDenied, replaceDenied);
if (content.indexOf("try { sessionStorage.removeItem('ads_conv_devis'); } catch(e) {}") === -1) {
    content = content.replace(targetDenied.replace(/\n/g, '\r\n'), replaceDenied.replace(/\n/g, '\r\n'));
}

fs.writeFileSync('assets/js/consent-ads.js', content);
console.log('Fixed consent-ads.js');
