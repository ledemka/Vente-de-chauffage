const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['en', 'de', 'nl']; // Only the subdirectories!

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    for (const file of ['catalogue.html', 'produit.html', 'panier.html']) {
        const filePath = path.join(fullPath, file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Replace both single quotes and backticks
            let newContent = content.replace(/fetch\(\s*[`']\.\/data\/products\.json[`']\s*\)/g, 'fetch(`../data/products.json`)');
            
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                modifiedCount++;
                console.log(`Updated ${path.join(dir, file)}`);
            }
        }
    }
}

console.log(`Fixed fetch paths in ${modifiedCount} files.`);
