const fs = require('fs');
const path = require('path');

// 1. catalogue.html
let cat = fs.readFileSync('catalogue.html', 'utf8');
// Find where images are generated for products.
// It's in the JS template: `<img id="prod-img-\${product.id}" src="\${resolveAssetPath(product.image_product)}"`
cat = cat.replace(/<img([^>]+)id="prod-img-\$\{product\.id\}"([^>]*)>/g, '<img$1id="prod-img-${product.id}"$2 loading="lazy" decoding="async">');
fs.writeFileSync('catalogue.html', cat, 'utf8');

// 2. assets/js/cart.js
let cart = fs.readFileSync('assets/js/cart.js', 'utf8');
// Replace img tags to have lazy and async
cart = cart.replace(/<img\s+src="([^"]+)"\s+alt="([^"]+)"\s+class="([^"]+)">/g, '<img src="$1" alt="$2" class="$3" loading="lazy" decoding="async">');
fs.writeFileSync('assets/js/cart.js', cart, 'utf8');

// 3. blog.html
let blog = fs.readFileSync('blog.html', 'utf8');
// The JS generates articles: `<img src="\${article.image}"`
blog = blog.replace(/<img src="\$\{article\.image\}" alt="\$\{article\.title\}" class="([^"]+)">/g, '<img src="${article.image}" alt="${article.title}" class="$1" loading="lazy" decoding="async">');
fs.writeFileSync('blog.html', blog, 'utf8');

console.log('Lazy loading added.');
