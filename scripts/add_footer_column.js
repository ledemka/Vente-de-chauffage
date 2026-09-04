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
        let modified = false;

        // 1. Change grid-cols-3 to grid-cols-4 in the footer
        const gridRegex = /<footer[^>]*>[\s\S]*?<div class="grid grid-cols-1 md:grid-cols-3([^"]*)">/i;
        if (gridRegex.test(content)) {
            content = content.replace(gridRegex, (match) => {
                return match.replace('md:grid-cols-3', 'md:grid-cols-4');
            });
            modified = true;
        }

        // 2. Insert the new column before COORDONNÉES
        // The COORDONNÉES column starts with: <div class="flex flex-col gap-4"><h4 class="text-label-md font-label-md text-primary-fixed"><span data-i18n="footer.coords_title">
        const coordRegex = /(<div class="flex flex-col gap-4"><h4 class="text-label-md font-label-md text-primary-fixed"><span data-i18n="footer.coords_title">)/i;
        
        if (coordRegex.test(content) && !content.includes('footer.client_space_title')) {
            const newColumn = `<div class="flex flex-col gap-4"><h4 class="text-label-md font-label-md text-primary-fixed"><span data-i18n="footer.client_space_title">ESPACE CLIENT & PANIER</span></h4><nav class="flex flex-col gap-2"><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./panier.html"><span data-i18n="footer.client_link_1">Mon Panier</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./connexion.html"><span data-i18n="footer.client_link_2">Connexion / Inscription</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./livraison.html"><span data-i18n="footer.client_link_3">Suivi de livraison</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./contact.html"><span data-i18n="footer.client_link_4">Service commercial</span></a></nav></div>`;
            
            content = content.replace(coordRegex, newColumn + '$1');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
            console.log(`Updated ${path.join(dir, file)}`);
        }
    }
}

console.log(`Updated ${modifiedCount} HTML files.`);
