const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
        if (!file.endsWith('.html')) continue;
        
        const filePath = path.join(fullPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const relPath = dir === '.' ? '.' : '..';
        
        // Find the PRODUITS & SERVICES column
        const servicesRegex = /(<h4[^>]*><span[^>]*data-i18n="footer\.services_title"[^>]*>.*?<\/span><\/h4>\s*<nav[^>]*>)([\s\S]*?)(<\/nav>)/i;
        
        if (servicesRegex.test(content)) {
            const newNavContent = `
<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="\${relPath}/catalogue.html?subgroup=1"><span data-i18n="categories.1">Bûches de bois</span></a>
<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="\${relPath}/catalogue.html?subgroup=2"><span data-i18n="categories.2">Bûches compressées / briquettes de bois</span></a>
<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="\${relPath}/catalogue.html?subgroup=3"><span data-i18n="categories.3">Briquettes</span></a>
<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="\${relPath}/catalogue.html?subgroup=4"><span data-i18n="categories.4">Granulés / Pellets</span></a>
<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="\${relPath}/catalogue.html?subgroup=5"><span data-i18n="categories.5">Charbon / Allume-feu</span></a>
<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="\${relPath}/devis.html"><span data-i18n="nav.quote">Devis</span></a>
<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="\${relPath}/livraison.html"><span data-i18n="footer.service_5">Livraison</span></a>
<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="\${relPath}/contact.html"><span data-i18n="nav.contact">Contact</span></a>`;

            // Clean up the new content (remove newlines and keep it tight like original or leave formatting)
            const cleanNav = newNavContent.replace(/>\s+</g, '><').replace(/\n/g, '');
            
            content = content.replace(servicesRegex, `$1${cleanNav}$3`);
            
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
        }
    }
}

console.log(`Updated ${modifiedCount} HTML files.`);
