const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const footers = new Map();

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
        if (!file.endsWith('.html')) continue;
        
        const filePath = path.join(fullPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const footerMatch = content.match(/<footer[^>]*>[\s\S]*?<\/footer>/i);
        if (footerMatch) {
            // Normalize footer (remove trailing spaces, standardize newlines)
            const footerHtml = footerMatch[0].replace(/\s+/g, ' ').trim();
            const hash = crypto.createHash('md5').update(footerHtml).digest('hex');
            
            if (!footers.has(hash)) {
                footers.set(hash, { count: 0, files: [], html: footerHtml });
            }
            const data = footers.get(hash);
            data.count++;
            data.files.push(path.join(dir, file));
        }
    }
}

console.log(`Found ${footers.size} distinct footers.`);
let i = 1;
for (const [hash, data] of footers) {
    console.log(`\n--- Footer Variant ${i} (${data.count} files) ---`);
    console.log(`Used in e.g.: ${data.files.slice(0, 3).join(', ')} ...`);
    console.log(data.html);
    i++;
}
