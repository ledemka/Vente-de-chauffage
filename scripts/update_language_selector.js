/**
 * update_language_selector.js
 *
 * For every HTML file (root + en/ de/ nl/):
 * 1. Replaces the 4 always-visible language flags with a compact dropdown
 * 2. Reorders the header right section: language → account → cart
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

// Language config per page directory
const langConfig = {
    '': {
        code: 'FR',
        name: 'Français',
        activeFlagSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" class="w-5 h-3.5 rounded-sm object-cover"><rect width="3" height="2" fill="#ED2939"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#002395"/></svg>`,
        langs: [
            { code: 'FR', name: 'Français', href: 'BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" class="w-5 h-3.5 rounded-sm object-cover"><rect width="3" height="2" fill="#ED2939"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#002395"/></svg>`, active: true },
            { code: 'EN', name: 'English',  href: 'en/BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="w-5 h-3.5 rounded-sm object-cover"><clipPath id="lang-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="lang-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#lang-s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#lang-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`, active: false },
            { code: 'DE', name: 'Deutsch',  href: 'de/BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" class="w-5 h-3.5 rounded-sm object-cover"><rect width="5" height="3" fill="#000"/><rect width="5" height="2" y="1" fill="#D00"/><rect width="5" height="1" y="2" fill="#FFCE00"/></svg>`, active: false },
            { code: 'NL', name: 'Nederlands', href: 'nl/BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="w-5 h-3.5 rounded-sm object-cover"><rect width="9" height="6" fill="#21468B"/><rect width="9" height="4" fill="#FFF"/><rect width="9" height="2" fill="#AE1C28"/></svg>`, active: false },
        ]
    },
    'en': {
        code: 'EN',
        name: 'English',
        activeFlagSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="w-5 h-3.5 rounded-sm object-cover"><clipPath id="lang-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="lang-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#lang-s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#lang-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`,
        langs: [
            { code: 'FR', name: 'Français', href: '../BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" class="w-5 h-3.5 rounded-sm object-cover"><rect width="3" height="2" fill="#ED2939"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#002395"/></svg>`, active: false },
            { code: 'EN', name: 'English',  href: 'BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="w-5 h-3.5 rounded-sm object-cover"><clipPath id="lang-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="lang-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#lang-s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#lang-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`, active: true },
            { code: 'DE', name: 'Deutsch',  href: '../de/BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" class="w-5 h-3.5 rounded-sm object-cover"><rect width="5" height="3" fill="#000"/><rect width="5" height="2" y="1" fill="#D00"/><rect width="5" height="1" y="2" fill="#FFCE00"/></svg>`, active: false },
            { code: 'NL', name: 'Nederlands', href: '../nl/BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="w-5 h-3.5 rounded-sm object-cover"><rect width="9" height="6" fill="#21468B"/><rect width="9" height="4" fill="#FFF"/><rect width="9" height="2" fill="#AE1C28"/></svg>`, active: false },
        ]
    },
    'de': {
        code: 'DE',
        name: 'Deutsch',
        activeFlagSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" class="w-5 h-3.5 rounded-sm object-cover"><rect width="5" height="3" fill="#000"/><rect width="5" height="2" y="1" fill="#D00"/><rect width="5" height="1" y="2" fill="#FFCE00"/></svg>`,
        langs: [
            { code: 'FR', name: 'Français', href: '../BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" class="w-5 h-3.5 rounded-sm object-cover"><rect width="3" height="2" fill="#ED2939"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#002395"/></svg>`, active: false },
            { code: 'EN', name: 'English',  href: '../en/BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="w-5 h-3.5 rounded-sm object-cover"><clipPath id="lang-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="lang-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#lang-s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#lang-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`, active: false },
            { code: 'DE', name: 'Deutsch',  href: 'BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" class="w-5 h-3.5 rounded-sm object-cover"><rect width="5" height="3" fill="#000"/><rect width="5" height="2" y="1" fill="#D00"/><rect width="5" height="1" y="2" fill="#FFCE00"/></svg>`, active: true },
            { code: 'NL', name: 'Nederlands', href: '../nl/BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="w-5 h-3.5 rounded-sm object-cover"><rect width="9" height="6" fill="#21468B"/><rect width="9" height="4" fill="#FFF"/><rect width="9" height="2" fill="#AE1C28"/></svg>`, active: false },
        ]
    },
    'nl': {
        code: 'NL',
        name: 'Nederlands',
        activeFlagSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="w-5 h-3.5 rounded-sm object-cover"><rect width="9" height="6" fill="#21468B"/><rect width="9" height="4" fill="#FFF"/><rect width="9" height="2" fill="#AE1C28"/></svg>`,
        langs: [
            { code: 'FR', name: 'Français', href: '../BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" class="w-5 h-3.5 rounded-sm object-cover"><rect width="3" height="2" fill="#ED2939"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#002395"/></svg>`, active: false },
            { code: 'EN', name: 'English',  href: '../en/BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="w-5 h-3.5 rounded-sm object-cover"><clipPath id="lang-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="lang-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#lang-s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#lang-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`, active: false },
            { code: 'DE', name: 'Deutsch',  href: '../de/BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" class="w-5 h-3.5 rounded-sm object-cover"><rect width="5" height="3" fill="#000"/><rect width="5" height="2" y="1" fill="#D00"/><rect width="5" height="1" y="2" fill="#FFCE00"/></svg>`, active: false },
            { code: 'NL', name: 'Nederlands', href: 'BASE_PAGE', flag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="w-5 h-3.5 rounded-sm object-cover"><rect width="9" height="6" fill="#21468B"/><rect width="9" height="4" fill="#FFF"/><rect width="9" height="2" fill="#AE1C28"/></svg>`, active: true },
        ]
    }
};

function buildDropdownItems(langs, filename) {
    return langs.map(l => {
        const href = l.href.replace('BASE_PAGE', filename);
        const activeClasses = l.active 
            ? 'bg-surface-container-high text-primary font-semibold' 
            : 'text-on-surface hover:bg-surface-container';
        return `<a href="${href}" class="flex items-center gap-3 px-4 py-2.5 text-body-sm ${activeClasses} transition-colors">${l.flag}<span>${l.name}</span>${l.active ? '<span class="material-symbols-outlined text-[14px] ml-auto">check</span>' : ''}</a>`;
    }).join('\n');
}

function buildLangDropdown(langKey, filename) {
    const cfg = langConfig[langKey];
    const items = buildDropdownItems(cfg.langs, filename);
    return `<div class="relative" id="lang-selector-wrapper">
                    <button id="lang-selector-btn" class="flex items-center gap-1.5 bg-surface-container/20 hover:bg-surface-container/30 border border-inverse-on-surface/20 rounded-full px-2.5 py-1.5 transition-colors cursor-pointer" aria-haspopup="true" aria-expanded="false">
                        ${cfg.activeFlagSvg}
                        <span class="text-inverse-on-surface text-label-md font-label-md">${cfg.code}</span>
                        <span class="material-symbols-outlined text-inverse-on-surface text-[16px]">expand_more</span>
                    </button>
                    <div id="lang-dropdown" class="hidden absolute right-0 top-full mt-2 w-44 bg-surface-container-lowest shadow-md rounded-md overflow-hidden z-[100] border border-outline/10">
${items}
                    </div>
                </div>`;
}

// Regex patterns for the old language selector block (4 flags inline)
const OLD_LANG_SELECTOR_REGEX = /<div class="flex gap-3 items-center">[\s\S]*?<\/div>\s*<div class="flex items-center gap-4">/;

// The old cart+account block order (cart then account)
const OLD_RIGHT_BLOCK_REGEX = /<div class="flex items-center gap-4"><a href="[^"]*panier\.html" class="flex items-center"><span class="material-symbols-outlined text-inverse-on-surface cursor-pointer hover:opacity-80 transition-opacity">shopping_cart<\/span><\/a><div id="user-menu-container" class="flex items-center"><\/div>\s*<\/div><\/div><\/div>/;

let totalModified = 0;

for (const lang of langDirs) {
    const dir = lang ? path.join(rootDir, lang) : rootDir;
    const cfg = langConfig[lang];

    for (const file of targetFiles) {
        const filePath = path.join(dir, file);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Build the new lang dropdown for this page
        const langDropdown = buildLangDropdown(lang, file);

        // Build new right section: [lang dropdown] [account] [cart]
        const newRightSection = `${langDropdown}
                <div id="user-menu-container" class="flex items-center"></div>
                <a href="${lang ? '../' : './'}panier.html" class="flex items-center">
                    <span class="material-symbols-outlined text-inverse-on-surface cursor-pointer hover:opacity-80 transition-opacity">shopping_cart</span>
                </a>
            </div></div></div>`;

        // Step 1: Remove old lang flags block + opening of old right div
        if (OLD_LANG_SELECTOR_REGEX.test(content)) {
            content = content.replace(OLD_LANG_SELECTOR_REGEX, `<div class="flex items-center gap-4">`);
            modified = true;
        }

        // Step 2: Replace old [cart][account] order block with new [lang][account][cart]
        if (OLD_RIGHT_BLOCK_REGEX.test(content)) {
            content = content.replace(OLD_RIGHT_BLOCK_REGEX, newRightSection);
            modified = true;
        }

        // Also add the lang-selector JS if not already present
        const langSelectorScript = `<script src="${lang ? '../' : './'}assets/js/lang-selector.js"></script>`;
        if (!content.includes('lang-selector.js')) {
            content = content.replace('</body>', `${langSelectorScript}\n</body>`);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated ${lang ? lang + '/' : ''}${file}`);
            totalModified++;
        }
    }
}

console.log(`\nDone. Updated ${totalModified} file(s).`);
