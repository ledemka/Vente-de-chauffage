/**
 * fix_script_order.js
 * Ensures auth.js is always loaded BEFORE cart.js in all pages that load both.
 * cart.js now depends on AuthAPI exported by auth.js.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langDirs = ['', 'en', 'de', 'nl'];

const targetFiles = [
    'panier.html', 'connexion.html', 'inscription.html',
    'recapitulatif-commande.html', 'confirmation-commande.html',
    'tableau-de-bord.html', 'produit.html',
];

let totalFixed = 0;

for (const lang of langDirs) {
    const dir = lang ? path.join(rootDir, lang) : rootDir;

    for (const file of targetFiles) {
        const filePath = path.join(dir, file);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');

        const authPos = content.indexOf('auth.js');
        const cartPos = content.indexOf('cart.js');

        // Only fix if cart.js exists AND auth.js either missing or comes after cart.js
        const needsFix = cartPos > 0 && (authPos < 0 || authPos > cartPos);

        if (!needsFix) continue;

        const relPath = lang ? '../' : './';
        const authScriptTag = `<script src="${relPath}assets/js/auth.js"></script>`;
        const cartScriptTagPattern = new RegExp(`<script src="${relPath.replace('.', '\\.')}assets/js/cart\\.js"><\\/script>`);

        // Remove existing auth.js tag if it's already there (will re-insert before cart.js)
        const authScriptTagPattern = new RegExp(`<script src="${relPath.replace('.', '\\.')}assets/js/auth\\.js"><\\/script>\\n?`);
        content = content.replace(authScriptTagPattern, '');

        // Insert auth.js immediately before cart.js
        content = content.replace(cartScriptTagPattern, (match) => {
            return `${authScriptTag}\n${match}`;
        });

        fs.writeFileSync(filePath, content, 'utf8');
        const displayPath = lang ? `${lang}/${file}` : file;
        console.log(`✓ Fixed load order in ${displayPath}`);
        totalFixed++;
    }
}

console.log(`\nDone. Fixed ${totalFixed} file(s).`);
