const fs = require('fs');
function findFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = dir + '/' + file;
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!file.includes('dist') && !file.includes('.git') && !file.includes('node_modules')) {
                results = results.concat(findFiles(filePath));
            }
        } else if (file.endsWith('.html') || file.endsWith('.json')) {
            results.push(filePath);
        }
    });
    return results;
}
const files = findFiles('.');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // HTML files
    if (file.endsWith('.html')) {
        content = content.replace(/<div class="text-body-sm text-on-surface-variant mt-1">soit <span id="unit-price"><\/span> HT\s*<\/div>/g, '');
        content = content.replace(/>Total HT</g, '>Total<');
        content = content.replace(/<div class="text-xs text-on-surface-variant font-normal w-full text-right">soit \$\{p\.wholesale_price\.toFixed\(2\)\} € HT<\/div>/g, '');
        content = content.replace(/Frais de livraison HT/g, 'Frais de livraison');
    }
    
    // JSON files (i18n)
    if (file.endsWith('.json') && file.includes('i18n')) {
        content = content.replace(/ HT/g, '');
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated ' + file);
    }
});
