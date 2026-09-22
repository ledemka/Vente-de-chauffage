const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const langs = ['fr', 'en', 'de', 'nl'];

for (const l of langs) {
    const filePath = path.join(ROOT, l === 'fr' ? '' : l, 'produit.html');
    if (!fs.existsSync(filePath)) continue;
    
    let html = fs.readFileSync(filePath, 'utf8');

    // Remove the line: document.getElementById('ppc-price').textContent = ...
    const regex = /document\.getElementById\('ppc-price'\)\.textContent\s*=[^;]+;/g;
    html = html.replace(regex, '// Removed ppc-price update');

    fs.writeFileSync(filePath, html);
    console.log(`Updated ${filePath}`);
}
