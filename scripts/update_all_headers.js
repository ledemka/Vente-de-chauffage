/**
 * update_all_headers.js
 * 
 * For EVERY HTML file in root + en/ de/ nl/:
 * 1. Add <script src="./assets/js/auth.js"> in <head> if not already present
 * 2. Add <script src="./assets/js/user-menu.js"> before </body> if not present
 * 3. Replace the static person icon link with <div id="user-menu-container"></div>
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langDirs = ['', 'en', 'de', 'nl'];

// All HTML files that need updating
const targetFiles = [
    'index.html',
    'catalogue.html',
    'blog.html',
    'contact.html',
    'avis-clients.html',
    'livraison.html',
    'guide-choix.html',
    'mentions-legales.html',
    'cgv.html',
    'politique-confidentialite.html',
    'politique-retour.html',
    // Auth / account pages also need the menu
    'connexion.html',
    'inscription.html',
    'panier.html',
    'recapitulatif-commande.html',
    'confirmation-commande.html',
    'tableau-de-bord.html',
    'produit.html',
    'devis.html',
];

// Pattern matching the static person icon link (varies slightly page to page)
// We look for the <a href="...connexion.html"...> wrapping the person icon
const PERSON_LINK_REGEX = /<a href="[^"]*connexion\.html" class="flex items-center"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"><span class="material-symbols-outlined text-on-primary text-\[18px\]">person<\/span><\/div><\/a>/g;

const USER_MENU_PLACEHOLDER = `<div id="user-menu-container" class="flex items-center"></div>`;

let totalModified = 0;

for (const lang of langDirs) {
    const dir = lang ? path.join(rootDir, lang) : rootDir;
    const relPath = lang ? '..' : '.';
    const assetBase = lang ? '../assets/js' : './assets/js';

    // Script tags to inject
    const authScriptTag = `<script src="${assetBase}/auth.js"></script>`;
    const userMenuScriptTag = `<script src="${assetBase}/user-menu.js"></script>`;

    for (const file of targetFiles) {
        const filePath = path.join(dir, file);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 1. Add auth.js in <head> if not already there
        if (!content.includes('/auth.js')) {
            // Insert before </head> or before the tailwind config script
            if (content.includes('</head>')) {
                content = content.replace('</head>', `${authScriptTag}\n</head>`);
            } else {
                // Fallback: insert right after the cart.js script tag if present
                const cartJsTag = content.match(/<script src="[^"]*cart\.js"><\/script>/);
                if (cartJsTag) {
                    content = content.replace(cartJsTag[0], cartJsTag[0] + '\n' + authScriptTag);
                }
            }
            modified = true;
        }

        // 2. Add user-menu.js before </body> if not already there
        if (!content.includes('/user-menu.js')) {
            if (content.includes('</body>')) {
                content = content.replace('</body>', `${userMenuScriptTag}\n</body>`);
            }
            modified = true;
        }

        // 3. Replace static person icon with dynamic placeholder
        if (PERSON_LINK_REGEX.test(content)) {
            content = content.replace(PERSON_LINK_REGEX, USER_MENU_PLACEHOLDER);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            const displayPath = lang ? `${lang}/${file}` : file;
            console.log(`✓ Updated ${displayPath}`);
            totalModified++;
        }
    }
}

console.log(`\nDone. Updated ${totalModified} file(s).`);
