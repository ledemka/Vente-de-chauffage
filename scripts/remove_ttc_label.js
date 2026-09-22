const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const langs = ['fr', 'en', 'de', 'nl'];

for (const l of langs) {
    const filePath = path.join(ROOT, l === 'fr' ? '' : l, 'produit.html');
    if (!fs.existsSync(filePath)) continue;
    
    let html = fs.readFileSync(filePath, 'utf8');

    // Remove the TTC span next to unit-price-ttc
    const regexTTC = /<span class="text-body-sm text-on-surface-variant">TTC<\/span>\s*/g;
    html = html.replace(regexTTC, '');

    fs.writeFileSync(filePath, html);
    console.log(`Updated ${filePath}`);
}
