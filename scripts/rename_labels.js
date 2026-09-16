const fs = require('fs');
const files = [
    'produit.html',
    'en/produit.html',
    'de/produit.html',
    'nl/produit.html'
];
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/Prix Public Conseillé/g, 'Prix Grossiste');
    content = content.replace(/Tarif Unitaire \(Palette\)/g, 'Prix Conseillé');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
});
