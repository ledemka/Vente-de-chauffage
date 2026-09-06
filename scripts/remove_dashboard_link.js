/**
 * remove_dashboard_link.js
 * Removes the static "Mon Tableau de bord" link from the header
 * across all HTML files (now handled by the user dropdown menu).
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langDirs = ['', 'en', 'de', 'nl'];

const targetFiles = [
    'index.html', 'catalogue.html', 'blog.html', 'contact.html',
    'avis-clients.html', 'livraison.html', 'guide-choix.html',
    'mentions-legales.html', 'cgv.html', 'politique-confidentialite.html',
    'politique-retour.html', 'connexion.html', 'inscription.html',
    'panier.html', 'recapitulatif-commande.html', 'confirmation-commande.html',
    'tableau-de-bord.html', 'produit.html', 'devis.html',
];

// Match the static dashboard link in the header (with any relative path)
const DASHBOARD_LINK_REGEX = /<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="[^"]*tableau-de-bord\.html"><span data-i18n="nav\.dashboard">[^<]*<\/span><\/a>/g;

let totalModified = 0;

for (const lang of langDirs) {
    const dir = lang ? path.join(rootDir, lang) : rootDir;

    for (const file of targetFiles) {
        const filePath = path.join(dir, file);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');

        if (DASHBOARD_LINK_REGEX.test(content)) {
            // Reset lastIndex since we tested it above
            DASHBOARD_LINK_REGEX.lastIndex = 0;
            content = content.replace(DASHBOARD_LINK_REGEX, '');
            fs.writeFileSync(filePath, content, 'utf8');
            const displayPath = lang ? `${lang}/${file}` : file;
            console.log(`✓ Removed dashboard link from ${displayPath}`);
            totalModified++;
        }
    }
}

console.log(`\nDone. Updated ${totalModified} file(s).`);
