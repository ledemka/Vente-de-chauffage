const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const searchStr = '<div class="flex items-center gap-4"><span class="material-symbols-outlined text-inverse-on-surface cursor-pointer">shopping_cart</span><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div>';
const replaceStr = '<div class="flex items-center gap-4"><a href="./panier.html" class="flex items-center"><span class="material-symbols-outlined text-inverse-on-surface cursor-pointer hover:opacity-80 transition-opacity">shopping_cart</span></a><a href="./connexion.html" class="flex items-center"><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-80 transition-opacity"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></a></div>';

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
        if (file.endsWith('.html')) {
            const filePath = path.join(fullPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            if (content.includes(searchStr)) {
                content = content.replace(searchStr, replaceStr);
                fs.writeFileSync(filePath, content, 'utf8');
                modifiedCount++;
                console.log(`Updated ${path.join(dir, file)}`);
            }
        }
    }
}

console.log(`Updated ${modifiedCount} files.`);
