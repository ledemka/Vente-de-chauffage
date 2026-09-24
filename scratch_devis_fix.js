const fs = require('fs');

let d = fs.readFileSync('devis.html', 'utf8');

// 1. Qty input clamping
d = d.replace(/if \(e\.target\.value < 1\) e\.target\.value = 1;/, 
    'let v = parseInt(e.target.value); if (isNaN(v) || v < 1) e.target.value = 1; else if (v > 999) e.target.value = 999;');

// 2. updateFormatAndRecap() listener and translations
// Currently it does:
// updateRecapFormatText();
// selectFmt.addEventListener('change', updateRecapFormatText);
// Let's replace the listener attachment with a cleaner approach and add translateDOM
d = d.replace(/selectFmt\.addEventListener\('change',\s*updateRecapFormatText\);/g, '');
d = d.replace(/const updateRecapFormatText = \(\) => {[\s\S]*?};/, 
    `const updateRecapFormatText = () => {
                recapFormat.textContent = selectFmt.value || (product.prices_by_length ? (window.i18n ? window.i18n.t('quote.length_to_choose', 'Longueur à choisir') : 'Longueur à choisir') : (window.i18n ? window.i18n.t('quote.format_standard', 'Standard') : (product.format || 'Standard')));
            };`);

// Add the single event listener outside updateFormatAndRecap
if (!d.includes(`selectFmt.addEventListener('change', () => {`)) {
    d = d.replace(/function updateFormatAndRecap\(\) {/, 
        `selectFmt.addEventListener('change', () => {
            const pid = selectProd.value;
            const product = allProducts.find(p => p.id === pid);
            if (!product) return;
            recapFormat.textContent = selectFmt.value || (product.prices_by_length ? (window.i18n ? window.i18n.t('quote.length_to_choose', 'Longueur à choisir') : 'Longueur à choisir') : (window.i18n ? window.i18n.t('quote.format_standard', 'Standard') : (product.format || 'Standard')));
        });\n\n        function updateFormatAndRecap() {`);
}

// Add translateDOM
d = d.replace(/selectFmt\.value = fmt;\s*}/, 
    `selectFmt.value = fmt;
            }
            if (window.i18n) window.i18n.translateDOM(selectFmt);`);
            
// Rebuild on i18nLoaded
if (!d.includes(`window.addEventListener('i18nLoaded'`)) {
    d = d.replace(/document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*{/, 
        `document.addEventListener('DOMContentLoaded', () => {
        window.addEventListener('i18nLoaded', () => {
             updateFormatAndRecap();
        });`);
}

fs.writeFileSync('devis.html', d);
