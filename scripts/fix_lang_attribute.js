const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['en', 'de', 'nl'];

let count = 0;

dirs.forEach(lang => {
    const dirPath = path.join(rootDir, lang);
    if (!fs.existsSync(dirPath)) return;
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
    
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find <html lang="fr" or <html lang='fr' or similar
        const regex = /<html([^>]*)lang=["']fr["']([^>]*)>/g;
        
        if (regex.test(content)) {
            content = content.replace(regex, `<html$1lang="${lang}"$2>`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`[OK] Fixed lang attr in ${lang}/${file}`);
            count++;
        }
    });
});

console.log(`\nFinished fixing ${count} files.`);
