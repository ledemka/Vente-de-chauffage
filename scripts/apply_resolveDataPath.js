const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const replaceInFile = (file) => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. cart.js - Replace fallback logic with single clean fetch
    if (file.endsWith('cart.js')) {
        const cartRegex = /const res = await fetch\(['"`]\/data\/products\.json\?v=\['"`] \+ Date\.now\(\)\);[\s\S]*?if\(!res\.ok\) \{[\s\S]*?const res2 = await fetch\(['"`]\.\.\/data\/products\.json\?v=\['"`] \+ Date\.now\(\)\);[\s\S]*?this\.products = await res2\.json\(\);[\s\S]*?\} else \{[\s\S]*?this\.products = await res\.json\(\);[\s\S]*?\}/g;
        
        const newCartLogic = `const res = await fetch(window.resolveDataPath('data/products.json?v=' + Date.now()));
                if(!res.ok) throw new Error("Could not load products");
                this.products = await res.json();`;
        
        if (cartRegex.test(content)) {
            content = content.replace(cartRegex, newCartLogic);
            changed = true;
        }
    }

    // 2. HTML Files - Replace standard fetch calls
    if (file.endsWith('.html')) {
        // Replace fetch('./data/products.json') and fetch('../data/products.json') variants
        const regex1 = /fetch\(\s*['"`]\.?\.\/data\/products\.json\?v=['"`]\s*\+\s*Date\.now\(\)\s*\)/g;
        if (regex1.test(content)) {
            content = content.replace(regex1, `fetch(window.resolveDataPath('data/products.json?v=' + Date.now()))`);
            changed = true;
        }
        
        const regex2 = /fetch\(\s*['"`]\.?\.\/data\/products\.json['"`]\s*\)/g;
        if (regex2.test(content)) {
            content = content.replace(regex2, `fetch(window.resolveDataPath('data/products.json'))`);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`[OK] Updated ${file}`);
    }
}

const findHtmlFiles = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (['en', 'de', 'nl'].includes(file)) {
                findHtmlFiles(fullPath);
            }
        } else if (file.endsWith('.html')) {
            replaceInFile(fullPath);
        }
    }
}

findHtmlFiles(rootDir);
replaceInFile(path.join(rootDir, 'assets', 'js', 'cart.js'));
