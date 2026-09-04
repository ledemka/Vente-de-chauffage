const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const searchStr = 'ring-2 ring-inverse-on-surface ring-offset-1 rounded-sm shadow-sm cursor-pointer';
const replaceStr = 'ring-2 ring-inverse-on-surface ring-offset-1 rounded-sm shadow-sm cursor-pointer animate-pulse';

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
        if (file.endsWith('.html')) {
            const filePath = path.join(fullPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            if (content.includes(searchStr) && !content.includes(replaceStr)) {
                content = content.replace(searchStr, replaceStr);
                fs.writeFileSync(filePath, content, 'utf8');
                modifiedCount++;
                console.log(`Updated ${path.join(dir, file)}`);
            }
        }
    }
}

console.log(`Updated ${modifiedCount} files.`);
