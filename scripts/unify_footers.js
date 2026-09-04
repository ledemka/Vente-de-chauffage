const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const newFooter = `<footer class="w-full bg-inverse-surface text-inverse-on-surface py-16 mt-20"><div class="max-w-[1440px] mx-auto px-margin-desktop"><div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"><div class="flex flex-col gap-4"><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 bg-gradient-to-br from-[#802813] to-[#56423d] rounded-lg flex items-center justify-center text-white shadow-md"><span class="material-symbols-outlined text-[24px]">local_fire_department</span></div><span class="text-headline-md font-headline-md text-inverse-on-surface" data-i18n="site_name">Terre &amp; Feu</span></div><p class="text-body-sm text-outline-variant"><span data-i18n="footer.desc">Solutions professionnelles de biomasse et bois de chauffage haute performance.</span></p></div><div class="flex flex-col gap-4"><h4 class="text-label-md font-label-md text-primary-fixed"><span data-i18n="footer.services_title">PRODUITS &amp; SERVICES</span></h4><nav class="flex flex-col gap-2"><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./catalogue.html?subgroup=1"><span data-i18n="categories.1">Bûches de bois</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./catalogue.html?subgroup=2"><span data-i18n="categories.2">Bûches compressées / briquettes de bois</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./catalogue.html?subgroup=3"><span data-i18n="categories.3">Briquettes</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./catalogue.html?subgroup=4"><span data-i18n="categories.4">Granulés / Pellets</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./catalogue.html?subgroup=5"><span data-i18n="categories.5">Charbon / Allume-feu</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./devis.html"><span data-i18n="nav.quote">Devis</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./livraison.html"><span data-i18n="footer.service_5">Livraison</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./contact.html"><span data-i18n="nav.contact">Contact</span></a></nav></div><div class="flex flex-col gap-4"><h4 class="text-label-md font-label-md text-primary-fixed"><span data-i18n="footer.client_space_title">ESPACE CLIENT &amp; PANIER</span></h4><nav class="flex flex-col gap-2"><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./panier.html"><span data-i18n="footer.client_link_1">Mon Panier</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./connexion.html"><span data-i18n="footer.client_link_2">Connexion / Inscription</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./livraison.html"><span data-i18n="footer.client_link_3">Suivi de livraison</span></a><a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./contact.html"><span data-i18n="footer.client_link_4">Service commercial</span></a></nav></div><div class="flex flex-col gap-4"><h4 class="text-label-md font-label-md text-primary-fixed"><span data-i18n="footer.coords_title">COORDONNÉES</span></h4><div class="text-body-sm text-outline-variant flex flex-col gap-2"><span><span data-i18n="footer.address">[Adresse à compléter par le client]</span></span><span><span data-i18n="footer.phone">[Téléphone à compléter par le client]</span></span><span>Email: [Email à compléter par le client]</span><span><span data-i18n="footer.siret">SIRET: [SIRET à compléter par le client]</span></span></div></div></div><div class="border-t border-outline/30 pt-8 flex flex-col md:flex-row justify-end text-body-sm text-outline-variant"><div class="flex gap-6"><a href="./mentions-legales.html" class="hover:text-primary transition-colors"><span data-i18n="footer.legal">Mentions Légales</span></a><a href="./cgv.html" class="hover:text-primary transition-colors"><span data-i18n="footer.cgv">CGV</span></a><a href="./politique-confidentialite.html" class="hover:text-primary transition-colors"><span data-i18n="footer.privacy">Confidentialité</span></a><a href="./politique-retour.html" class="hover:text-primary transition-colors"><span data-i18n="footer.return_policy">Politique de Retour</span></a></div></div></div></footer>`;

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
        if (!file.endsWith('.html')) continue;
        
        const filePath = path.join(fullPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace existing footer with exactly newFooter
        const newContent = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/i, newFooter);
        
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            modifiedCount++;
        }
    }
}

console.log(`Unified footers across ${modifiedCount} HTML files.`);
