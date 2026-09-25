const fs = require('fs');

let c = fs.readFileSync('catalogue.html', 'utf8');

c = c.replace(/`\$\{basePath\}produit\.html\?id=\$\{productId\}&length=\$\{selectedFormat\}`/g, '`${basePath}produits/${productId}.html?length=${selectedFormat}`');

c = c.replace(/`window\.location\.href='\.\/produit\.html\?id=\$\{p\.id\}'`/g, '`window.location.href=\\\'./produits/${p.id}.html\\\'`');

fs.writeFileSync('catalogue.html', c, 'utf8');

console.log('Fixed catalogue.html');
