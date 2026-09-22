const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const langs = ['fr', 'en', 'de', 'nl'];

for (const l of langs) {
    const filePath = path.join(ROOT, l === 'fr' ? '' : l, 'produit.html');
    if (!fs.existsSync(filePath)) continue;
    
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Remove "Prix Conseillé" label (keep newlines to not mess up formatting too much)
    html = html.replace(/<span class="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1" data-i18n="product.recommended_price">[^<]*<\/span>\n?/g, '');

    // 2. Remove "Prix Grossiste" section
    const wholesaleBlock = `<div class="text-right flex flex-col items-end">
<span class="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-1" data-i18n="product.wholesale_price">Prix Grossiste</span>
<span class="text-body-lg font-data-mono text-on-surface line-through decoration-outline/50"><span id="ppc-price">249.00€ TTC</span></span>
</div>`;
    const wholesaleBlockEN = wholesaleBlock.replace("Prix Grossiste", "Wholesale Price");
    const wholesaleBlockDE = wholesaleBlock.replace("Prix Grossiste", "Großhandelspreis");
    const wholesaleBlockNL = wholesaleBlock.replace("Prix Grossiste", "Groothandelsprijs");

    html = html.replace(wholesaleBlock + '\n', '');
    html = html.replace(wholesaleBlockEN + '\n', '');
    html = html.replace(wholesaleBlockDE + '\n', '');
    html = html.replace(wholesaleBlockNL + '\n', '');

    fs.writeFileSync(filePath, html);
    console.log(`Updated ${filePath}`);
}
