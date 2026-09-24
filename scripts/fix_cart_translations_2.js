const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../assets/js/cart.js');
let jsContent = fs.readFileSync(jsPath, 'utf8');

// Fix the missing sidebar translation at the end of renderCartPage
jsContent = jsContent.replace(
    '        if(window.i18n) window.i18n.translateDOM(container);\n        if(window.updateCartBadge) window.updateCartBadge();',
    '        if(window.i18n) window.i18n.translateDOM(container);\n        if(window.i18n && sidebar) window.i18n.translateDOM(sidebar);\n        if(window.updateCartBadge) window.updateCartBadge();'
);

// We should also remove the stray one I put at the top just to be clean
jsContent = jsContent.replace(
    '        if(window.i18n && sidebar) window.i18n.translateDOM(sidebar);\n        if(window.updateCartBadge) window.updateCartBadge();',
    '        if(window.updateCartBadge) window.updateCartBadge();'
);


fs.writeFileSync(jsPath, jsContent);

// Add missing translation keys to JSONs
const dir = path.join(__dirname, '../data/i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const extraKeys = {
    'fr': {
        'similar': 'Produits similaires',
        'recommended': 'Produits complémentaires'
    },
    'en': {
        'similar': 'Similar products',
        'recommended': 'Complementary products'
    },
    'de': {
        'similar': 'Ähnliche Produkte',
        'recommended': 'Ergänzende Produkte'
    },
    'nl': {
        'similar': 'Vergelijkbare producten',
        'recommended': 'Aanvullende producten'
    }
};

langs.forEach(lang => {
    let data = JSON.parse(fs.readFileSync(path.join(dir, lang + '.json'), 'utf8'));
    if (!data.cart) data.cart = {};
    for (let k in extraKeys[lang]) {
        data.cart[k] = extraKeys[lang][k];
    }
    fs.writeFileSync(path.join(dir, lang + '.json'), JSON.stringify(data, null, 2));
});

console.log('Fixed cart translations.');
