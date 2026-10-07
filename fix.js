const fs = require('fs');

// Fix article.html
let a = fs.readFileSync('article.html', 'utf8');
a = a.replace(/<meta name="robots" content="noindex, follow">\r?\n?\s*/g, '');
fs.writeFileSync('article.html', a, 'utf8');
console.log("Fixed article.html");

// Fix catalogue.html
let c = fs.readFileSync('catalogue.html', 'utf8');
// Target: `window.location.href=\'./produits/${p.id}.html\'`
// Replace: `window.location.href=\'./produits/\' + p.id + \'.html\'`
c = c.replace(/window\.location\.href=\\'\.\/produits\/\$\{p\.id\}\.html\\'/g, "window.location.href=\\'./produits/\\' + p.id + \\'.html\\'");
fs.writeFileSync('catalogue.html', c, 'utf8');
console.log("Fixed catalogue.html");

// Fix sync_catalogue_logic.js to prevent it from regenerating the old code!
let scl = fs.readFileSync('scripts/sync_catalogue_logic.js', 'utf8');
scl = scl.replace("window.location.href='../${lang}/produit.html?id=${p.id}'", "window.location.href='../${lang}/produit.html?id=' + p.id");
fs.writeFileSync('scripts/sync_catalogue_logic.js', scl, 'utf8');
console.log("Fixed sync_catalogue_logic.js");
