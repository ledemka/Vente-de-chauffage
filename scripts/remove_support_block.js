const fs = require('fs');
const path = require('path');

// Supprime le bloc "Assistance Directe" (support_agent) dans devis.html
// Le bloc est : <div class="hidden md:flex ... border-primary"> ... </div>
// suivi de </div> (fermeture du flex parent)

const BLOCK_RE = /<div class="hidden md:flex flex-col gap-4 min-w-\[280px\] bg-surface-container p-6 rounded-xl border-l-4 border-primary">[\s\S]*?<\/div>\s*\r?\n<\/div>/g;

const ROOT = path.resolve(__dirname, '..');

let updated = 0;
for (const f of fs.readdirSync(ROOT)) {
    if (!f.endsWith('.html')) continue;
    const fp = path.join(ROOT, f);
    let content = fs.readFileSync(fp, 'utf8');
    if (!content.includes('support_agent')) continue;
    const before = content;
    content = content.replace(BLOCK_RE, '</div>');
    if (content !== before) {
        fs.writeFileSync(fp, content, 'utf8');
        console.log('Updated: ' + f);
        updated++;
    }
}

console.log(`Done. ${updated} file(s) modified.`);
