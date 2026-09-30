const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('dist-production') && !file.includes('.git') && !file.includes('.agent')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.html')) results.push(file);
        }
    });
    return results;
}
const files = walk('./');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/<span data-i18n="footer\.phone">.*?<\/span>/g, '<span data-i18n="footer.phone">Téléphone : 0974309229</span>');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log('Updated HTML fallback in ' + file);
    }
});
