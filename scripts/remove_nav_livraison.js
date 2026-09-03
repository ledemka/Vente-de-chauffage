const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const LANGS = ['.', 'en', 'de', 'nl'];

const PAGES = [
    'index.html',
    'catalogue.html',
    'produit.html',
    'livraison.html',
    'avis-clients.html',
    'guide-choix.html',
    'devis.html',
    'politique-retour.html',
    'blog.html',
    'contact.html',
    'cgv.html',
    'mentions-legales.html',
    'politique-confidentialite.html'
];

LANGS.forEach(langDir => {
    PAGES.forEach(page => {
        const filepath = path.join(ROOT_DIR, langDir, page);
        if (fs.existsSync(filepath)) {
            let content = fs.readFileSync(filepath, 'utf8');

            // Regex to remove the desktop nav link (can be active or inactive)
            const desktopRegex = /<a[^>]*data-i18n="nav\.delivery"[^>]*>.*?<\/a>\s*/g;
            content = content.replace(desktopRegex, '');

            // The mobile nav link is also matched by the above regex since it has data-i18n="nav.delivery"
            
            fs.writeFileSync(filepath, content, 'utf8');
            console.log(`Removed delivery link from ${langDir}/${page}`);
        }
    });
});
