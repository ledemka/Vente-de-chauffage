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

const i18nData = {
    fr: { service_5: "Livraison", return_policy: "Politique de Retour" },
    en: { service_5: "Delivery", return_policy: "Return Policy" },
    de: { service_5: "Lieferung", return_policy: "Rückgaberecht" },
    nl: { service_5: "Levering", return_policy: "Retourbeleid" }
};

const service4Target = '<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./devis.html"><span data-i18n="footer.service_4">Tarifs Gros & B2B</span></a>';
const service5Link = '<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./livraison.html"><span data-i18n="footer.service_5">Livraison</span></a>';

const privacyTarget = '<a href="./politique-confidentialite.html" class="hover:text-primary transition-colors"><span data-i18n="footer.privacy">Confidentialité</span></a>';
const returnPolicyLink = '<a href="./politique-retour.html" class="hover:text-primary transition-colors"><span data-i18n="footer.return_policy">Politique de Retour</span></a>';

// 1. Update HTML files
LANGS.forEach(langDir => {
    PAGES.forEach(page => {
        const filepath = path.join(ROOT_DIR, langDir, page);
        if (fs.existsSync(filepath)) {
            let content = fs.readFileSync(filepath, 'utf8');
            let updated = false;

            if (content.includes(service4Target) && !content.includes('footer.service_5')) {
                content = content.replace(service4Target, service4Target + service5Link);
                updated = true;
            }
            if (content.includes(privacyTarget) && !content.includes('footer.return_policy')) {
                content = content.replace(privacyTarget, privacyTarget + returnPolicyLink);
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(filepath, content, 'utf8');
                console.log(`Updated footer in ${langDir}/${page}`);
            }
        }
    });
});

// 2. Update i18n JSON
Object.keys(i18nData).forEach(lang => {
    const jsonPath = path.join(ROOT_DIR, 'data', 'i18n', `${lang}.json`);
    if (fs.existsSync(jsonPath)) {
        let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        if (data.footer && !data.footer.service_5) {
            data.footer.service_5 = i18nData[lang].service_5;
            data.footer.return_policy = i18nData[lang].return_policy;
            fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Updated data/i18n/${lang}.json`);
        }
    }
});
