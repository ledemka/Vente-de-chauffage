const fs = require('fs');
const auditPath = 'scripts/audit-i18n.js';
let content = fs.readFileSync(auditPath, 'utf8');

if (!content.includes('allowlist')) {
    content = content.replace(
        "const en = JSON.parse(fs.readFileSync(path.join(i18nDir, 'en.json'), 'utf8'));",
        `const en = JSON.parse(fs.readFileSync(path.join(i18nDir, 'en.json'), 'utf8'));
const allowlistPath = path.join(__dirname, 'i18n-allowlist.json');
const allowlist = fs.existsSync(allowlistPath) ? JSON.parse(fs.readFileSync(allowlistPath, 'utf8')) : {};`
    );
    
    content = content.replace(
        "if (v === frVal) {",
        `if (v === frVal) {
                    if (allowlist[fullKey] && allowlist[fullKey].includes(lang)) {
                        return; // Allowed exact match
                    }`
    );
    fs.writeFileSync(auditPath, content);
    console.log('Patched audit-i18n.js');
}

// Generate the allowlist
const keys = [
    "nav.contact", "footer.contact", "auth.email", "devis.contact",
    "produit.format", "produit.dimensions", "produit.industrie", "produit.gastronomie",
    "dashboard.profile.email", "dashboard.orders.date", "dashboard.orders.total",
    "dashboard.orders.action", "blog.article_1_date", "blog.article_2_date",
    "blog.article_3_date", "cart.total", "checkout.email", "checkout.total_ttc",
    "contact.email", "contact.contact"
];

// Let's run the old audit to get the exact identical keys and build the allowlist
