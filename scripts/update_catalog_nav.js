const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const files = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));

function getDesktopNavBlock(isCatalog) {
    const activeClass = isCatalog ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary';
    return `<div class="relative group h-full flex items-center" id="nav-catalog-wrapper">
            <a class="flex items-center gap-1.5 h-full ${activeClass} text-label-md font-label-md transition-colors py-3 uppercase tracking-wider" id="nav-catalog-link" data-i18n="nav.catalog" href="./catalogue.html"><span data-i18n="nav.catalog">CATALOGUE</span><span class="material-symbols-outlined text-[18px] transition-transform duration-200" id="nav-catalog-chevron">expand_more</span></a>
            <div id="nav-catalog-dropdown" class="absolute top-full left-0 pt-2 transition-all duration-200 z-[100] min-w-[340px] opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto -translate-y-1 group-hover:translate-y-0">
                <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-2xl p-2 flex flex-col gap-1 backdrop-blur-sm">
                    <a href="./catalogue.html?subgroup=1" data-catalog-subgroup="1" class="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors group/item text-left">
                        <span class="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">forest</span>
                        <div class="flex flex-col">
                            <span class="text-label-md font-label-md text-on-surface group-hover/item:text-primary transition-colors" data-i18n="categories.1">Bûches de bois</span>
                            <span class="text-xs text-on-surface-variant font-normal" data-i18n="catalog_menu.sub_1_desc">Chêne, hêtre, mélanges (20 à 50 cm)</span>
                        </div>
                    </a>
                    <a href="./catalogue.html?subgroup=2" data-catalog-subgroup="2" class="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors group/item text-left">
                        <span class="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">local_fire_department</span>
                        <div class="flex flex-col">
                            <span class="text-label-md font-label-md text-on-surface group-hover/item:text-primary transition-colors" data-i18n="categories.2">Bûches compressées / briquettes de bois</span>
                            <span class="text-xs text-on-surface-variant font-normal" data-i18n="catalog_menu.sub_2_desc">Bûches densifiées jour & nuit, Pini-Kay</span>
                        </div>
                    </a>
                    <a href="./catalogue.html?subgroup=3" data-catalog-subgroup="3" class="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors group/item text-left">
                        <span class="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">view_in_ar</span>
                        <div class="flex flex-col">
                            <span class="text-label-md font-label-md text-on-surface group-hover/item:text-primary transition-colors" data-i18n="categories.3">Briquettes</span>
                            <span class="text-xs text-on-surface-variant font-normal" data-i18n="catalog_menu.sub_3_desc">Briquettes RUF & écorce longue durée</span>
                        </div>
                    </a>
                    <a href="./catalogue.html?subgroup=4" data-catalog-subgroup="4" class="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors group/item text-left">
                        <span class="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">grain</span>
                        <div class="flex flex-col">
                            <span class="text-label-md font-label-md text-on-surface group-hover/item:text-primary transition-colors" data-i18n="categories.4">Granulés / Pellets</span>
                            <span class="text-xs text-on-surface-variant font-normal" data-i18n="catalog_menu.sub_4_desc">Pellets 100% résineux certifiés DINplus</span>
                        </div>
                    </a>
                    <a href="./catalogue.html?subgroup=5" data-catalog-subgroup="5" class="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors group/item text-left">
                        <span class="material-symbols-outlined text-primary text-[22px] mt-0.5 shrink-0">outdoor_grill</span>
                        <div class="flex flex-col">
                            <span class="text-label-md font-label-md text-on-surface group-hover/item:text-primary transition-colors" data-i18n="categories.5">Charbon / Allume-feu / Bûches de torche</span>
                            <span class="text-xs text-on-surface-variant font-normal" data-i18n="catalog_menu.sub_5_desc">Charbon de bois, laine de bois, torches</span>
                        </div>
                    </a>

                </div>
            </div>
        </div>`;
}

function getMobileDrawerBlock(isCatalog) {
    const activeColor = isCatalog ? 'text-[#D97706]' : 'text-[#D3C3BE] hover:text-[#D97706]';
    return `<div class="mobile-catalog-wrapper border-b border-[#504440]/30 py-1">
        <div class="flex items-center justify-between py-1">
            <a href="./catalogue.html" class="block py-1 ${activeColor} uppercase mobile-link flex-1 font-semibold text-sm" data-i18n="nav.catalog"><span data-i18n="nav.catalog">CATALOGUE</span></a>
            <button id="mobile-catalog-expand-btn" type="button" class="text-[#D3C3BE] hover:text-[#D97706] p-1.5 rounded transition-colors cursor-pointer" aria-expanded="false" aria-label="Afficher les catégories">
                <span class="material-symbols-outlined text-[20px] transition-transform duration-200" id="mobile-catalog-chevron">expand_more</span>
            </button>
        </div>
        <div id="mobile-catalog-subcategories" class="hidden pl-3 py-2 flex flex-col gap-2 border-l-2 border-[#D97706]/40 ml-2 mt-1">
            <a href="./catalogue.html?subgroup=1" data-catalog-subgroup="1" class="text-xs text-[#D3C3BE] hover:text-[#D97706] py-1 transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-[#D97706]">forest</span>
                <span data-i18n="categories.1">Bûches de bois</span>
            </a>
            <a href="./catalogue.html?subgroup=2" data-catalog-subgroup="2" class="text-xs text-[#D3C3BE] hover:text-[#D97706] py-1 transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-[#D97706]">local_fire_department</span>
                <span data-i18n="categories.2">Bûches compressées / briquettes de bois</span>
            </a>
            <a href="./catalogue.html?subgroup=3" data-catalog-subgroup="3" class="text-xs text-[#D3C3BE] hover:text-[#D97706] py-1 transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-[#D97706]">view_in_ar</span>
                <span data-i18n="categories.3">Briquettes</span>
            </a>
            <a href="./catalogue.html?subgroup=4" data-catalog-subgroup="4" class="text-xs text-[#D3C3BE] hover:text-[#D97706] py-1 transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-[#D97706]">grain</span>
                <span data-i18n="categories.4">Granulés / Pellets</span>
            </a>
            <a href="./catalogue.html?subgroup=5" data-catalog-subgroup="5" class="text-xs text-[#D3C3BE] hover:text-[#D97706] py-1 transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-[#D97706]">outdoor_grill</span>
                <span data-i18n="categories.5">Charbon / Allume-feu / Bûches de torche</span>
            </a>

        </div>
    </div>`;
}

let count = 0;
files.forEach(f => {
    const filePath = path.join(ROOT_DIR, f);
    let content = fs.readFileSync(filePath, 'utf8');
    const isCatalog = (f === 'catalogue.html');

    // 1. Replace desktop nav block
    const desktopRegex = /<div class="relative group h-full flex items-center"(?: id="nav-catalog-wrapper")?>[\s\S]*?<\/div>\s*<\/div>/;
    if (desktopRegex.test(content)) {
        content = content.replace(desktopRegex, getDesktopNavBlock(isCatalog));
    }

    // 2. Replace mobile drawer catalog link
    const mobileRegex = /(?:<div class="mobile-catalog-wrapper[\s\S]*?<\/div>\s*<\/div>|<a href="\.\/catalogue\.html" class="[^"]*"[^>]*data-i18n="nav\.catalog">[\s\S]*?<\/a>)/;
    if (mobileRegex.test(content)) {
        content = content.replace(mobileRegex, getMobileDrawerBlock(isCatalog));
    }

    // 3. Add catalog-menu.js script tag if not present
    if (!content.includes('catalog-menu.js')) {
        const langSelectorTag = '<script src="./assets/js/lang-selector.js"></script>';
        if (content.includes(langSelectorTag)) {
            content = content.replace(langSelectorTag, langSelectorTag + '\n<script src="./assets/js/catalog-menu.js"></script>');
        } else if (content.includes('</body>')) {
            content = content.replace('</body>', '<script src="./assets/js/catalog-menu.js"></script>\n</body>');
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    count++;
});

console.log(`Updated catalog navigation in ${count} root HTML files.`);
