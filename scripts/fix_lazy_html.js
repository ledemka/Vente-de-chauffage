const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let modified = false;

    if (content.includes('product.images[0]') && !content.includes('loading="lazy" decoding="async" src="${product.images[0]}"')) {
        content = content.replace(/<img([^>]*)src="\$\{product\.images\[0\]\}"/g, '<img$1loading="lazy" decoding="async" src="${product.images[0]}"');
        modified = true;
    }

    if (f === 'index.html' || f === 'blog.html' || f === 'catalogue.html' || f === 'guide-choix.html' || f === 'livraison.html') {
        // Find normal img tags
        content = content.replace(/<img(?![^>]*loading=)([^>]*)src="([^"]+)"/g, (match, p1, p2) => {
            if (p2.includes('hero')) {
                return `<img fetchpriority="high"${p1}src="${p2}"`;
            }
            return `<img loading="lazy" decoding="async"${p1}src="${p2}"`;
        });
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(f, content);
    }
});

let cart = fs.readFileSync('assets/js/cart.js', 'utf8');
if (!cart.includes('loading="lazy"')) {
    cart = cart.replace(/<img([^>]*)src="\$\{item\.image\}"/g, '<img$1loading="lazy" decoding="async" src="${item.image}"');
    fs.writeFileSync('assets/js/cart.js', cart);
}
console.log('Lazy loading applied to HTML and JS');
