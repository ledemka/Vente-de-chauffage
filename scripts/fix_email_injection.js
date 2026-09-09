const fs = require('fs');
const path = require('path');

const fileMap = [
    { file: 'merci-inscription.html', i18nKey: 'merci.inscription_body' },
    { file: 'merci-contact.html',     i18nKey: 'merci.contact_body' },
    { file: 'merci-devis.html',       i18nKey: 'merci.devis_body' },
    { file: 'confirmation-commande.html', i18nKey: 'confirmation.msg2' },
];

for (const { file, i18nKey } of fileMap) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) { console.log('MISSING:', file); continue; }

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the entire <script> block that handles email injection
    const oldScriptRegex = /<script>\s*document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*const urlParams[\s\S]*?\}\s*\}\);\s*<\/script>/;

    const [section, bodyKey] = i18nKey.split('.');
    const newScript = `<script>
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    if (email) {
        // Use i18nLoaded event to inject email after translations are applied
        document.addEventListener('i18nLoaded', (e) => {
            const el = document.getElementById('main-body-text');
            if (el) {
                const tpl = e.detail.translations?.['${section}']?.['${bodyKey}'] || el.textContent;
                el.innerHTML = tpl.replace('{{email}}', '<strong>' + email + '</strong>');
            }
            const notice = document.getElementById('spam-notice-container');
            if (notice) notice.classList.remove('hidden');
        });
    }
});
</script>`;

    content = content.replace(oldScriptRegex, newScript);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', file);
}
console.log('Done.');
