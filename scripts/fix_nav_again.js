const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LANGS = ['en', 'de', 'nl'];
const PAGES = [
    'index.html', 'catalogue.html', 'produit.html', 'livraison.html', 'avis-clients.html',
    'guide-choix.html', 'devis.html', 'politique-retour.html', 'blog.html', 'contact.html',
    'mentions-legales.html', 'cgv.html', 'politique-confidentialite.html', 'connexion.html',
    'inscription.html', 'activation.html', 'tableau-de-bord.html', 'panier.html',
    'recapitulatif-commande.html', 'confirmation-commande.html', 'merci-contact.html',
    'merci-devis.html', 'merci-inscription.html', 'depots.html'
];

// Fix i18n to normal capitalization
const i18nDir = path.join(ROOT_DIR, 'data/i18n');
const updates = { fr: "Dépôts", en: "Depots", de: "Depots", nl: "Depots" };
for (const lang of ['fr', 'en', 'de', 'nl']) {
    const filePath = path.join(i18nDir, `${lang}.json`);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.nav) data.nav.depots = updates[lang];
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
}

function fixNavAll(filePath, lang) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove any existing depots links to start fresh
    content = content.replace(/\n\s*<a[^>]+data-i18n="nav\.depots"[^>]*>.*?<\/a>/g, '');
    
    // Also remove any rogue spaces/lines if there were double injections on the same line
    content = content.replace(/<a[^>]+data-i18n="nav\.depots"[^>]*>.*?<\/a>/g, '');

    const navText = updates[lang];
    const linkPath = lang === 'fr' ? './depots.html' : `../${lang}/depots.html`;
    const navItemDesktop = `\n                    <a class="text-on-surface-variant hover:text-primary text-label-md font-label-md transition-colors py-3" data-i18n="nav.depots" href="${linkPath}"><span data-i18n="nav.depots">${navText}</span></a>`;
    const navItemMobile = `\n                            <a href="${linkPath}" class="block py-2 text-[#D3C3BE] hover:text-[#D97706]" data-i18n="nav.depots"><span data-i18n="nav.depots">${navText}</span></a>`;

    // Inject in Desktop Nav
    const desktopRegex = /(<nav[^>]*>[\s\S]*?<div[^>]*>[\s\S]*?)(<a[^>]+data-i18n="nav\.guide"[^>]*>[\s\S]*?<\/a>)/;
    if (desktopRegex.test(content)) {
        content = content.replace(desktopRegex, `$1$2${navItemDesktop}`);
    } else {
        console.warn(`Could not find desktop nav.guide in ${filePath}`);
    }

    // Inject in Mobile Drawer Nav
    const mobileRegex = /(<div[^>]+id="mobile-menu-drawer"[^>]*>[\s\S]*?class="space-y-3[^>]*>[\s\S]*?)(<a[^>]+data-i18n="nav\.guide"[^>]*>[\s\S]*?<\/a>)/;
    if (mobileRegex.test(content)) {
        content = content.replace(mobileRegex, `$1$2${navItemMobile}`);
    } else {
        console.warn(`Could not find mobile nav.guide in ${filePath}`);
    }

    fs.writeFileSync(filePath, content);
}

['fr', ...LANGS].forEach(lang => {
    PAGES.forEach(page => {
        const filePath = lang === 'fr' ? path.join(ROOT_DIR, page) : path.join(ROOT_DIR, lang, page);
        fixNavAll(filePath, lang);
    });
});
console.log("Navbar fixed across all files.");
