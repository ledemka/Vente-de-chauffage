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

const targetFooter = `<footer class="w-full bg-inverse-surface text-inverse-on-surface py-16 mt-20"><div class="max-w-[1440px] mx-auto px-margin-desktop"><div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"><div class="flex flex-col gap-4"><div class="flex items-center gap-3 mb-2">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-[#802813] to-[#56423d] rounded-lg flex items-center justify-center text-white shadow-md">
                    <span class="material-symbols-outlined text-[24px]">local_fire_department</span>
                </div>
                <span class="text-headline-md font-headline-md text-inverse-on-surface" data-i18n="site_name">Terre & Feu</span>
            </div>
        <span class="text-headline-md font-headline-md">Terre & Feu</span></div><p class="text-body-sm text-outline-variant">Solutions professionnelles de biomasse et bois de chauffage haute performance.</p></div><div class="flex flex-col gap-4"><h4 class="text-label-md font-label-md text-primary-fixed"><span data-i18n="footer.services_title">PRODUITS & SERVICES</span></h4><nav class="flex flex-col gap-2"><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./catalogue.html?subgroup=1"><span data-i18n="footer.service_1">Bûches de bois franc</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./catalogue.html?subgroup=4"><span data-i18n="footer.service_2">Granulés (Pellets)</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./catalogue.html"><span data-i18n="footer.service_3">Bois de cuisson pro</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./devis.html"><span data-i18n="footer.service_4">Tarifs Gros & B2B</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./livraison.html"><span data-i18n="footer.service_5">Livraison</span></a></nav></div><div class="flex flex-col gap-4"><h4 class="text-label-md font-label-md text-primary-fixed"><span data-i18n="footer.coords_title">COORDONNÉES</span></h4><div class="text-body-sm text-outline-variant flex flex-col gap-2"><span><span data-i18n="footer.address">[Adresse à compléter par le client]</span></span><span><span data-i18n="footer.phone">[Téléphone à compléter par le client]</span></span><span>Email: [Email à compléter par le client]</span><span><span data-i18n="footer.siret">SIRET: [SIRET à compléter par le client]</span></span></div></div></div><div class="border-t border-outline/30 pt-8 flex flex-col md:flex-row justify-end text-body-sm text-outline-variant"><div class="flex gap-6"><a href="./mentions-legales.html" class="hover:text-primary transition-colors"><span data-i18n="footer.legal">Mentions Légales</span></a><a href="./cgv.html" class="hover:text-primary transition-colors"><span data-i18n="footer.cgv">CGV</span></a><a href="./politique-confidentialite.html" class="hover:text-primary transition-colors"><span data-i18n="footer.privacy">Confidentialité</span></a><a href="./politique-retour.html" class="hover:text-primary transition-colors"><span data-i18n="footer.return_policy">Politique de Retour</span></a></div></div></div></footer>`;

LANGS.forEach(langDir => {
    PAGES.forEach(page => {
        const filepath = path.join(ROOT_DIR, langDir, page);
        if (fs.existsSync(filepath)) {
            let content = fs.readFileSync(filepath, 'utf8');
            
            // Replace old footer. Finding start of footer to end of footer.
            const footerRegex = /<footer[\s\S]*?<\/footer>/i;
            if (footerRegex.test(content)) {
                content = content.replace(footerRegex, targetFooter);
                fs.writeFileSync(filepath, content, 'utf8');
                console.log(`Updated footer in ${langDir}/${page}`);
            } else {
                console.warn(`No footer found in ${langDir}/${page}`);
            }
        }
    });
});
