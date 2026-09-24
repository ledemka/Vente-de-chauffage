const fs = require('fs');

let cat = fs.readFileSync('assets/js/catalogue.js', 'utf8');
if (!cat.includes('loading="lazy"')) {
    cat = cat.replace(/<img([^>]*)src="\$\{product\.images\[0\]\}"/g, '<img$1loading="lazy" decoding="async" src="${product.images[0]}"');
    fs.writeFileSync('assets/js/catalogue.js', cat);
    console.log('Patched catalogue.js');
}

let cart = fs.readFileSync('assets/js/cart.js', 'utf8');
if (!cart.includes('loading="lazy"')) {
    cart = cart.replace(/<img([^>]*)src="\$\{item\.image\}"/g, '<img$1loading="lazy" decoding="async" src="${item.image}"');
    fs.writeFileSync('assets/js/cart.js', cart);
    console.log('Patched cart.js');
}

if (fs.existsSync('assets/js/devis.js')) {
    let devis = fs.readFileSync('assets/js/devis.js', 'utf8');
    if (!devis.includes('loading="lazy"')) {
        devis = devis.replace(/<img([^>]*)src="\$\{product\.images\[0\]\}"/g, '<img$1loading="lazy" decoding="async" src="${product.images[0]}"');
        fs.writeFileSync('assets/js/devis.js', devis);
        console.log('Patched devis.js');
    }
}
