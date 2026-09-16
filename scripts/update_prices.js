const fs = require('fs');

// 1. Update products.json
const file = 'data/products.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));
data.forEach(p => {
    // Round to 2 decimal places for HT
    p.wholesale_price = Math.round((p.wholesale_price / 1.2) * 100) / 100;
    p.recommended_price = Math.round((p.recommended_price / 1.2) * 100) / 100;
});
fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
console.log('Updated products.json');

// 2. Update produit.html (all versions) to multiply recommended_price by 1.2
const htmlFiles = [
    'produit.html',
    'en/produit.html',
    'de/produit.html',
    'nl/produit.html'
];
htmlFiles.forEach(hf => {
    let content = fs.readFileSync(hf, 'utf8');
    content = content.replace(
        /document\.getElementById\('ppc-price'\)\.textContent = product\.recommended_price \+ ' € TTC';/g,
        "document.getElementById('ppc-price').textContent = (product.recommended_price * 1.2).toFixed(2) + ' € TTC';"
    );
    fs.writeFileSync(hf, content, 'utf8');
    console.log('Updated ' + hf);
});
