const fs = require('fs');
let html = fs.readFileSync('produit.html', 'utf8');

html = html.replace(/<img([^>]*)id="product-img-1"([^>]*)src="https:\/\/placehold.co\/600x600\?text=Photo\+Produit"([^>]*)>/g, '<img$1id="product-img-1"$2src="./assets/images/products/hetre-etuve-palette.jpg"$3>');
html = html.replace(/<img([^>]*)id="product-img-2"([^>]*)src="https:\/\/placehold.co\/600x600\?text=Photo\+Emballage"([^>]*)>/g, '<img$1id="product-img-2"$2src="./assets/images/products/hetre-etuve-emballage.jpg"$3>');

fs.writeFileSync('produit.html', html, 'utf8');
console.log('Replaced placeholders in produit.html.');
