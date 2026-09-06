/**
 * sync_headers.js
 *
 * 1. Adds user-menu.js to catalogue.html if missing.
 * 2. Syncs the <header> block of recapitulatif-commande.html to match confirmation-commande.html exactly.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langDirs = ['', 'en', 'de', 'nl'];

function syncCatalogue(lang) {
    const filePath = path.join(rootDir, lang, 'catalogue.html');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    const relPath = lang ? '../' : './';
    const scriptTag = `<script src="${relPath}assets/js/user-menu.js"></script>`;

    if (!content.includes('user-menu.js')) {
        // Insert right before lang-selector.js or </body>
        if (content.includes('lang-selector.js')) {
            content = content.replace(/(<script src="[^"]*lang-selector\.js"><\/script>)/, `${scriptTag}\n$1`);
        } else {
            content = content.replace('</body>', `${scriptTag}\n</body>`);
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Added user-menu.js to ${lang ? lang + '/' : ''}catalogue.html`);
    }
}

function syncRecapHeader(lang) {
    const recapPath = path.join(rootDir, lang, 'recapitulatif-commande.html');
    const confPath = path.join(rootDir, lang, 'confirmation-commande.html');
    
    if (!fs.existsSync(recapPath) || !fs.existsSync(confPath)) return;

    const confContent = fs.readFileSync(confPath, 'utf8');
    let recapContent = fs.readFileSync(recapPath, 'utf8');

    // Extract the header block from confirmation-commande.html
    const headerRegex = /<header[\s\S]*?<\/header>/;
    const match = confContent.match(headerRegex);
    
    if (match) {
        const correctHeader = match[0];
        if (headerRegex.test(recapContent)) {
            recapContent = recapContent.replace(headerRegex, correctHeader);
            fs.writeFileSync(recapPath, recapContent, 'utf8');
            console.log(`✓ Synced header in ${lang ? lang + '/' : ''}recapitulatif-commande.html`);
        }
    }
}

for (const lang of langDirs) {
    syncCatalogue(lang);
    syncRecapHeader(lang);
}

console.log('Done.');
