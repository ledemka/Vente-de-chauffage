/**
 * add_favicon.js
 * 
 * Adds the favicon links into the <head> of all HTML files.
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

let totalModified = 0;

for (const lang of langDirs) {
    const dir = lang ? path.join(rootDir, lang) : rootDir;
    const relPath = lang ? '../' : './';
    const svgTag = `<link rel="icon" type="image/svg+xml" href="${relPath}assets/images/favicon.svg">`;
    const icoTag = `<link rel="icon" type="image/x-icon" href="${relPath}assets/images/favicon.ico">`;
    const tags = `\n    ${svgTag}\n    ${icoTag}\n`;

    for (const file of targetFiles) {
        const filePath = path.join(dir, file);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');

        // Check if not already added
        if (!content.includes('favicon.svg')) {
            // Insert just before closing </head>
            content = content.replace('</head>', `${tags}</head>`);
            fs.writeFileSync(filePath, content, 'utf8');
            totalModified++;
            const displayPath = lang ? `${lang}/${file}` : file;
            console.log(`✓ Added favicon to ${displayPath}`);
        }
    }
}

console.log(`\nDone. Updated ${totalModified} file(s).`);
