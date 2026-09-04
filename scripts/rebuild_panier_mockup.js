const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const newMainContent = `<div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16">
    <div class="flex items-center gap-2 mb-8">
        <div class="inline-flex items-center gap-2 bg-primary/10 text-primary font-label-md text-label-md uppercase px-3 py-1.5 rounded-full">
            <span class="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span>ESPACE COMMANDE B2B</span>
        </div>
    </div>
    <div class="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <h1 class="text-headline-xl font-headline-xl text-on-surface" data-i18n="cart.title">Panier Professionnel</h1>
        <div class="flex items-center gap-4">
            <span class="text-body-lg text-on-surface font-bold" id="cart-items-count">Articles sélectionnés (0)</span>
            <button onclick="if(confirm('Vider le panier ?')) CartAPI.clear().then(() => CartUI.renderCartPage())" class="text-error hover:text-error/80 text-label-md font-bold flex items-center gap-1 transition-colors">
                <span class="material-symbols-outlined text-[18px]">delete</span>
                Vider le panier
            </button>
        </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div class="lg:col-span-8" id="cart-items-container">
            <div class="animate-pulse flex flex-col gap-4">
                <div class="h-32 bg-surface-dim rounded-xl w-full"></div>
                <div class="h-32 bg-surface-dim rounded-xl w-full"></div>
            </div>
        </div>
        <div class="lg:col-span-4" id="cart-sidebar">
            <div class="animate-pulse flex flex-col gap-4">
                <div class="h-20 bg-surface-dim rounded-xl w-full"></div>
                <div class="h-64 bg-surface-dim rounded-xl w-full"></div>
            </div>
        </div>
    </div>
    
    <div class="mt-8 flex items-center">
        <a href="LINK_CATALOGUE" class="text-primary hover:text-primary-container font-bold flex items-center gap-1 transition-colors">
            <span class="material-symbols-outlined">chevron_left</span>
            Continuer mes achats
        </a>
    </div>
</div>`;

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const filePath = path.join(fullPath, 'panier.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;
        const relPath = dir === '.' ? '.' : '..';
        
        let customContent = newMainContent.replace(/LINK_CATALOGUE/g, `${relPath}/catalogue.html`);

        content = content.replace(mainRegex, (match, p1) => {
            return match.replace(p1, customContent);
        });

        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
    }
}

console.log(`Updated ${modifiedCount} panier pages.`);
