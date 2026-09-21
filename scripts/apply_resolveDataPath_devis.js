const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const replaceInFile = (file) => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    const devisRegex = /const dataPath = window\.location\.pathname\.includes\('\/en\/'\)\s*\|\|\s*window\.location\.pathname\.includes\('\/de\/'\)\s*\|\|\s*window\.location\.pathname\.includes\('\/nl\/'\)\s*\?\s*'[^']*'\s*:\s*'[^']*';\s*fetch\(dataPath\)/g;
    
    if (devisRegex.test(content)) {
        content = content.replace(devisRegex, `fetch(window.resolveDataPath('data/products.json'))`);
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
        } else if (file.endsWith('devis.html')) {
            replaceInFile(fullPath);
        }
    }
}

findHtmlFiles(rootDir);
