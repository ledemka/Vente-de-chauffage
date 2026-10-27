const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

const allFiles = [];

function collectProductFiles(baseDir) {
    if (fs.existsSync(path.join(baseDir, 'produit.html'))) {
        allFiles.push(path.join(baseDir, 'produit.html'));
    }
    const rootProduits = path.join(baseDir, 'produits');
    if (fs.existsSync(rootProduits)) {
        fs.readdirSync(rootProduits).filter(f => f.endsWith('.html')).forEach(f => {
            allFiles.push(path.join(rootProduits, f));
        });
    }
    ['en', 'de', 'nl'].forEach(lang => {
        const langProd = path.join(baseDir, lang, 'produit.html');
        if (fs.existsSync(langProd)) allFiles.push(langProd);
        const langProduits = path.join(baseDir, lang, 'produits');
        if (fs.existsSync(langProduits)) {
            fs.readdirSync(langProduits).filter(f => f.endsWith('.html')).forEach(f => {
                allFiles.push(path.join(langProduits, f));
            });
        }
    });
}

collectProductFiles(rootDir);
collectProductFiles(path.join(rootDir, 'dist-production'));

let errorsCount = 0;

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const matches = [...content.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
    matches.forEach((m, idx) => {
        const attr = m[1];
        const code = m[2];
        if (attr.includes('src=') || attr.includes('application/ld+json')) {
            return;
        }
        try {
            new vm.Script(code, { filename: path.relative(rootDir, file) + ` [script ${idx+1}]` });
        } catch (e) {
            console.error(`SYNTAX ERROR in ${path.relative(rootDir, file)} script #${idx+1}:`, e.message);
            errorsCount++;
        }
    });
});

if (errorsCount === 0) {
    console.log(`SUCCESS: ALL ${allFiles.length} files (workspace + dist-production) passed JavaScript syntax validation without errors!`);
} else {
    console.error(`Total errors: ${errorsCount}`);
    process.exit(1);
}
