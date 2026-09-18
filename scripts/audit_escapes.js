const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

// Files to check and fix
const files = [
    'tableau-de-bord.html',
    path.join('en', 'tableau-de-bord.html'),
    path.join('de', 'tableau-de-bord.html'),
    path.join('nl', 'tableau-de-bord.html'),
    path.join('dist-production', 'en', 'tableau-de-bord.html'),
    path.join('dist-production', 'de', 'tableau-de-bord.html'),
    path.join('dist-production', 'nl', 'tableau-de-bord.html'),
    path.join('dist-production', 'tableau-de-bord.html'),
    'admin-commandes.html',
];

files.forEach(f => {
    const fp = path.join(root, f);
    if (!fs.existsSync(fp)) {
        console.log('MISSING: ' + f);
        return;
    }
    let txt = fs.readFileSync(fp, 'utf8');
    const bt = (txt.match(/\\`/g) || []).length;
    const ip = (txt.match(/\\\$\{/g) || []).length;
    console.log(f + ' -> backtick_escapes=' + bt + ', interp_escapes=' + ip);
});
