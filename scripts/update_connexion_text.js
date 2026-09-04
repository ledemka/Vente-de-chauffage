const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const filePath = path.join(fullPath, 'connexion.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('ESPACE PROFESSIONNEL B2B')) {
            content = content.replace(/ESPACE PROFESSIONNEL B2B/g, 'ESPACE PROFESSIONNEL / PERSONNEL');
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
            console.log(`Updated ${path.join(dir, 'connexion.html')}`);
        }
    }
}

console.log(`Updated ${modifiedCount} files.`);
