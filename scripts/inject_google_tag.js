const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const EXCLUDE_FILES = [
    'admin-commandes.html',
    'tableau-de-bord.html',
    'activation.html',
    'reinitialiser-mot-de-passe.html'
];

function getConsentTag() {
    return `<script src="./assets/js/consent-ads.js"></script>`;
}

function processDir() {
    const p = path.join(ROOT, '.');
    const files = fs.readdirSync(p);
    for (const f of files) {
        if (!f.endsWith('.html')) continue;
        if (EXCLUDE_FILES.includes(f)) continue;

        const fp = path.join(p, f);
        let html = fs.readFileSync(fp, 'utf8');
        const tag = getConsentTag();

        let changed = false;

        // Check if already injected
        if (!html.includes('consent-ads.js')) {
            const tawkTag = '<script src="./assets/js/tawk-loader.js"></script>';
            if (html.includes(tawkTag)) {
                html = html.replace(tawkTag, tawkTag + '\n' + tag);
                changed = true;
            } else {
                // If tawk-loader is missing for some reason, append before </body>
                html = html.replace('</body>', tag + '\n</body>');
                changed = true;
            }
        }

        if (changed) {
            fs.writeFileSync(fp, html);
            console.log(`[google-ads] Updated: ${f}`);
        } else {
            console.log(`[google-ads] Already up-to-date: ${f}`);
        }
    }
}

processDir();
console.log('\n[google-ads] Injection complete.');
