const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const langs = ['fr', 'en', 'de', 'nl'];

for (const l of langs) {
    const filePath = path.join(ROOT, l === 'fr' ? '' : l, 'produit.html');
    if (!fs.existsSync(filePath)) continue;
    
    let html = fs.readFileSync(filePath, 'utf8');

    // Remove "Prix Grossiste" section using regex
    const regexGrossiste = /<div class="text-right flex flex-col items-end">\s*<span[^>]*data-i18n="product\.wholesale_price"[^>]*>[\s\S]*?<\/span>\s*<span class="text-body-lg font-data-mono text-on-surface line-through decoration-outline\/50"><span id="ppc-price">[^<]*<\/span><\/span>\s*<\/div>/g;
    html = html.replace(regexGrossiste, '');

    fs.writeFileSync(filePath, html);
    console.log(`Updated ${filePath}`);
}
