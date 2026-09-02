const fs = require('fs');
const path = require('path');

const dirs = ['.', 'en', 'de', 'nl'];
const filename = 'livraison.html';

dirs.forEach(dir => {
    const filepath = path.join(__dirname, '..', dir, filename);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Specifically target the CGV Logistiques button
    content = content.replace(
        /<a class="inline-flex items-center justify-center h-12 px-8 bg-surface-container-highest\/30 backdrop-blur-sm text-on-tertiary font-label-md text-label-md rounded shadow-sm hover:bg-surface-container-highest\/40 transition-colors duration-200" href="#">\s*<span data-i18n="hero.cta_cgv">Consulter les CGV Logistiques<\/span>\s*<\/a>/,
        '<a class="inline-flex items-center justify-center h-12 px-8 bg-surface-container-highest/30 backdrop-blur-sm text-on-tertiary font-label-md text-label-md rounded shadow-sm hover:bg-surface-container-highest/40 transition-colors duration-200" href="./cgv.html">\n              <span data-i18n="hero.cta_cgv">Consulter les CGV Logistiques</span>\n            </a>'
    );
    
    // Also try a simpler replace if the above exact match fails due to whitespace differences
    content = content.replace(
        /href="#"([^>]*)>\s*<span data-i18n="hero\.cta_cgv"/g,
        'href="./cgv.html"$1>\n<span data-i18n="hero.cta_cgv"'
    );
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated link in ${filepath}`);
});
