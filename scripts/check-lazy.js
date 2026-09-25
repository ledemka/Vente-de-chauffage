const fs = require('fs');

console.log('catalogue.html lazy:', fs.readFileSync('catalogue.html', 'utf8').includes('loading="lazy"'));
console.log('cart.js lazy:', fs.readFileSync('assets/js/cart.js', 'utf8').includes('loading="lazy"'));
console.log('blog.html lazy:', fs.readFileSync('blog.html', 'utf8').includes('loading="lazy"'));
