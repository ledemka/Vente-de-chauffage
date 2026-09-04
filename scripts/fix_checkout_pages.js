const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];
const pages = ['connexion.html', 'inscription.html', 'panier.html', 'recapitulatif-commande.html', 'confirmation-commande.html'];

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    for (const page of pages) {
        const filePath = path.join(fullPath, page);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // FIX 1: Navigation highlight
            // The active contact link looks like: <a class="text-primary font-bold border-b-2 border-primary text-label-md font-label-md transition-colors py-3" data-i18n="nav.contact" href="./panier.html">
            // Or something similar. We need to replace it with the inactive version.
            const activeContactRegex = /<a[^>]*class="[^"]*text-primary font-bold border-b-2 border-primary[^"]*"[^>]*data-i18n="nav.contact"[^>]*>([\s\S]*?)<\/a>/gi;
            
            const relPath = dir === '.' ? '.' : '..';
            const inactiveContactLink = '<a class="text-on-surface-variant hover:text-primary text-label-md font-label-md transition-colors py-3" data-i18n="nav.contact" href="' + relPath + '/contact.html">$1</a>';
            
            if (activeContactRegex.test(content)) {
                content = content.replace(activeContactRegex, inactiveContactLink);
                modified = true;
            }
            
            // Also check mobile menu highlight if any
            const activeMobileContactRegex = /<a[^>]*class="block py-2 text-\[\#D97706\]"[^>]*data-i18n="nav.contact"[^>]*>([\s\S]*?)<\/a>/gi;
            const inactiveMobileContactLink = '<a href="' + relPath + '/contact.html" class="block py-2 text-[#D3C3BE] hover:text-[#D97706]" data-i18n="nav.contact">$1</a>';
            if (activeMobileContactRegex.test(content)) {
                content = content.replace(activeMobileContactRegex, inactiveMobileContactLink);
                modified = true;
            }

            // FIX 2: inscription.html cards
            if (page === 'inscription.html') {
                const advantagesRegex = /<div class="flex flex-col gap-6">[\s\S]*?<\/div>(\s*<div class="mt-8)/i;
                if (advantagesRegex.test(content)) {
                    const newCards = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div class="bg-surface-container-highest p-6 rounded-xl border border-outline/10 shadow-sm flex flex-col gap-2">
                    <span class="material-symbols-outlined text-primary text-[32px] mb-2">star</span>
                    <h3 class="text-headline-md font-headline-md text-on-surface">Abonnement sans engagement</h3>
                    <p class="text-body-sm text-on-surface-variant">Accédez librement à notre catalogue B2B et commandez à votre rythme.</p>
                </div>
                <div class="bg-surface-container-highest p-6 rounded-xl border border-outline/10 shadow-sm flex flex-col gap-2">
                    <span class="material-symbols-outlined text-primary text-[32px] mb-2">trending_down</span>
                    <h3 class="text-headline-md font-headline-md text-on-surface">Tarifs préférentiels HT</h3>
                    <p class="text-body-sm text-on-surface-variant">Visualisation immédiate des remises quantitatives.</p>
                </div>
                <div class="bg-surface-container-highest p-6 rounded-xl border border-outline/10 shadow-sm flex flex-col gap-2 md:col-span-2">
                    <span class="material-symbols-outlined text-primary text-[32px] mb-2">support_agent</span>
                    <h3 class="text-headline-md font-headline-md text-on-surface">Conseiller dédié</h3>
                    <p class="text-body-sm text-on-surface-variant">Un interlocuteur unique pour le suivi de vos commandes et contrats annuels.</p>
                </div>
            </div>$1`;
                    content = content.replace(advantagesRegex, newCards);
                    modified = true;
                }
                
                // Make sure right side has shadow-md and no other weird spacing
                const formCardRegex = /<div class="w-full bg-surface-container p-8 md:p-10 rounded-2xl shadow-md border border-outline\/10">/;
                if (!formCardRegex.test(content)) {
                    content = content.replace(/<div class="w-full max-w-2xl bg-surface-container[^>]*>/, '<div class="w-full bg-surface-container p-8 md:p-10 rounded-2xl shadow-md border border-outline/10">');
                    modified = true;
                }
            }
            
            // FIX 3: Panier page structure check
            if (page === 'panier.html') {
                if (!content.includes('id="cart-sidebar"')) {
                    console.log('Panier does not have cart-sidebar! Running rebuild_panier_mockup.js instead for this file.');
                }
            }

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Fixed ${path.join(dir, page)}`);
            }
        }
    }
}
