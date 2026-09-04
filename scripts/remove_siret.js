const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
let totalHtml = 0, totalJson = 0;

// 1. Remove SIRET line from all HTML files
const htmlDirs = ['.', 'en', 'de', 'nl'];
for (const dir of htmlDirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.html'));
    for (const file of files) {
        const filePath = path.join(fullPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove the full <span> wrapping the SIRET line in the footer
        const before = content;
        content = content.replace(/<span><span data-i18n="footer\.siret">[^<]*<\/span><\/span>/g, '');
        // Also remove any plain text SIRET references
        content = content.replace(/SIRET\s*:\s*\[SIRET[^\]]*\]/gi, '');
        content = content.replace(/SIRET\s*:\s*[A-Z0-9 ]{9,14}/gi, '');
        
        if (content !== before) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  Cleaned: ${path.join(dir, file)}`);
            totalHtml++;
        }
    }
}
console.log(`\nHTML files cleaned: ${totalHtml}`);

// 2. Remove footer.siret key from all i18n JSON files
const i18nDir = path.join(rootDir, 'data', 'i18n');
if (fs.existsSync(i18nDir)) {
    const jsonFiles = fs.readdirSync(i18nDir).filter(f => f.endsWith('.json'));
    for (const file of jsonFiles) {
        const filePath = path.join(i18nDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (data.footer && data.footer.siret !== undefined) {
            delete data.footer.siret;
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`  Cleaned i18n: ${file}`);
            totalJson++;
        }
    }
}
console.log(`JSON i18n files cleaned: ${totalJson}`);
console.log('\nDone! All SIRET/SIREN references removed.');
