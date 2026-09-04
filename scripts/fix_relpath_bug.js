const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
        if (!file.endsWith('.html')) continue;
        
        const filePath = path.join(fullPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('${relPath}')) {
            content = content.replace(/\$\{relPath\}/g, '.');
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
        }
    }
}

console.log(`Fixed ${modifiedCount} HTML files.`);
