const fs = require('fs');

// Fix catalogue.html
let c = fs.readFileSync('catalogue.html', 'utf8');
c = c.replace(/window\.location\.href=\\'\.\/produits\/\\' \+ p\.id \+ \\'\.html\\'/g, "window.location.href=\\'./produits/\\' + \\'${p.id}\\' + \\'.html\\'");
fs.writeFileSync('catalogue.html', c, 'utf8');
console.log("Fixed catalogue.html");

// Fix sync_catalogue_logic.js
let scl = fs.readFileSync('scripts/sync_catalogue_logic.js', 'utf8');
scl = scl.replace(/window\.location\.href='([^']+)' \+ p\.id/g, "window.location.href='$1' + '${p.id}'");
fs.writeFileSync('scripts/sync_catalogue_logic.js', scl, 'utf8');
console.log("Fixed sync_catalogue_logic.js");
