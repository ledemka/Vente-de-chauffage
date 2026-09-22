const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const langs = ['fr', 'en', 'de', 'nl'];

// Old badge HTML (line 572 in tableau-de-bord.html)
const OLD_BADGE = `<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border \${statusInfo.class} uppercase tracking-wide cursor-pointer hover:shadow-md hover:scale-105 transition-transform" onclick="event.stopPropagation(); document.querySelector('#dashboard-status-filters button[data-filter=\${order.status}]').click()">`;

// New badge HTML: read-only, no pointer, no interaction, no stopPropagation
const NEW_BADGE = `<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border \${statusInfo.class} uppercase tracking-wide cursor-default select-none">`;

for (const l of langs) {
    const filePath = path.join(ROOT, l === 'fr' ? '' : l, 'tableau-de-bord.html');
    if (!fs.existsSync(filePath)) continue;

    let html = fs.readFileSync(filePath, 'utf8');

    if (html.includes(OLD_BADGE)) {
        html = html.replace(OLD_BADGE, NEW_BADGE);
        fs.writeFileSync(filePath, html);
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`Pattern not found in ${filePath} — trying raw replace...`);
        // Fallback: regex approach
        const regex = /class="inline-flex items-center gap-1\.5 px-3 py-1 rounded-full text-\[11px\] font-bold border \$\{statusInfo\.class\} uppercase tracking-wide cursor-pointer hover:shadow-md hover:scale-105 transition-transform" onclick="event\.stopPropagation\(\); document\.querySelector\('#dashboard-status-filters button\[data-filter=\$\{order\.status\}\]'\)\.click\(\)"/g;
        const replacement = `class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border \${statusInfo.class} uppercase tracking-wide cursor-default select-none"`;
        html = html.replace(regex, replacement);
        fs.writeFileSync(filePath, html);
        console.log(`Regex-updated ${filePath}`);
    }
}
console.log('Done');
