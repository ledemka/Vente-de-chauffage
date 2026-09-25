const fs = require('fs');

let cart = fs.readFileSync('assets/js/cart.js', 'utf8');
cart = cart.replace(/<img src="\$\{imgPrefix\}\$\{prod\.image_product\}" class="([^"]+)" alt="">/g, '<img src="${imgPrefix}${prod.image_product}" class="$1" alt="" loading="lazy" decoding="async">');
cart = cart.replace(/<img src="\$\{imgPrefix\}\$\{p\.image_product\}" class="([^"]+)" alt="">/g, '<img src="${imgPrefix}${p.image_product}" class="$1" alt="" loading="lazy" decoding="async">');
fs.writeFileSync('assets/js/cart.js', cart, 'utf8');

console.log('Fixed cart.js lazy loading.');
