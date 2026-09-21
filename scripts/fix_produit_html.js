/**
 * fix_produit_html.js
 * Injects the length-selector-container into translated produit.html files if missing.
 */
const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, '..');

const langs = ['en', 'de', 'nl'];

const translations = {
    'en': 'Log Length',
    'de': 'Scheitlänge',
    'nl': 'Houtblok Lengte'
};

langs.forEach(lang => {
    const filePath = path.join(rootDir, lang, 'produit.html');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('id="length-selector-container"')) {
        const insertionPoint = '<!-- Interactive Quantity Selector & Discount Widget -->\n<div class="flex flex-col gap-4">\n';
        
        // Let's normalize line endings first for regex to work predictably
        const eol = content.includes('\r\n') ? '\r\n' : '\n';
        content = content.replace(/\r\n/g, '\n');

        const block = `<div class="flex flex-col gap-4" id="length-selector-container" style="display: none;">
<label class="text-label-md font-label-md text-on-surface uppercase tracking-wider">${translations[lang]}</label>
<div class="flex gap-2 flex-wrap" id="length-options">
</div>
</div>\n`;

        // We replace the insertion point with itself + the new block
        const targetStr = '<!-- Interactive Quantity Selector & Discount Widget -->\n<div class="flex flex-col gap-4">\n';
        
        if (content.includes(targetStr)) {
            content = content.replace(targetStr, targetStr + block);
            console.log(`[OK] Injected length selector into ${lang}/produit.html`);
            
            // Restore line endings
            if (eol === '\r\n') {
                content = content.replace(/\n/g, '\r\n');
            }
            fs.writeFileSync(filePath, content, 'utf8');
        } else {
            console.log(`[WARN] Could not find insertion point in ${lang}/produit.html`);
        }
    } else {
        console.log(`[INFO] ${lang}/produit.html already has length-selector-container`);
    }
});
