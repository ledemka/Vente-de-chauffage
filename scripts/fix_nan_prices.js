const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];
const filesToFix = ['tableau-de-bord.html', 'admin-commandes.html'];

for (const dir of dirs) {
    for (const file of filesToFix) {
        const filePath = path.join(rootDir, dir, file);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');

        const searchStr = `const lineTotal = (item.quantity * item.unit_price).toFixed(2);`;
        
        if (content.includes(searchStr)) {
            const replaceStr = `const puHT = item.unit_price_net_ht !== undefined ? parseFloat(item.unit_price_net_ht) : parseFloat(item.unit_price || 0);
            const puTTC = puHT * 1.20;
            const lineTotal = (item.quantity * puTTC).toFixed(2);`;
            
            content = content.replace(searchStr, replaceStr);
            
            content = content.replace(
                /\$\{parseFloat\(item\.unit_price\)\.toFixed\(2\)\}/g,
                '${puTTC.toFixed(2)}'
            );
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed ${path.join(dir, file)}`);
        } else {
            console.log(`Pattern not found or already fixed in ${path.join(dir, file)}`);
        }
    }
}
