const fs = require('fs');
const files = [
    'produit.html', 'catalogue.html', 'assets/js/cart.js',
    'en/produit.html', 'en/catalogue.html',
    'de/produit.html', 'de/catalogue.html',
    'nl/produit.html', 'nl/catalogue.html'
];
files.forEach(f => {
    if (fs.existsSync(f)) {
        let content = fs.readFileSync(f, 'utf8');
        content = content.replace(/fetch\(['"`](\.\.?\/data\/products\.json)['"`]\)/g, "fetch('$1?v=' + Date.now())");
        fs.writeFileSync(f, content);
        console.log('Fixed ' + f);
    }
});
