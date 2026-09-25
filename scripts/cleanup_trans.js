const fs = require('fs');

const pages = ['cgv.html', 'mentions-legales.html', 'politique-confidentialite.html', 'politique-retour.html'];

for (const p of pages) {
    let html = fs.readFileSync(p, 'utf8');
    
    // Fix double data-i18n="xxx" data-i18n="yyy"
    // e.g., data-i18n="mentions.right_object" data-i18n="mentions.right_objection"
    html = html.replace(/data-i18n="[^"]+"\s+data-i18n="([^"]+)"/g, 'data-i18n="$1"');
    html = html.replace(/data-i18n-html="[^"]+"\s+data-i18n-html="([^"]+)"/g, 'data-i18n-html="$1"');
    
    fs.writeFileSync(p, html, 'utf8');
}

// Remove from excludedPages in audit-i18n.js
let audit = fs.readFileSync('scripts/audit-i18n.js', 'utf8');
audit = audit.replace(/'cgv\.html',\s*/g, '');
audit = audit.replace(/'mentions-legales\.html',\s*/g, '');
audit = audit.replace(/'politique-confidentialite\.html',\s*/g, '');
audit = audit.replace(/'politique-retour\.html',?\s*/g, '');
fs.writeFileSync('scripts/audit-i18n.js', audit, 'utf8');

console.log('Cleaned up duplicates and updated audit script.');
