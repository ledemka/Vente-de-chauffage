const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'products.json');
let raw = fs.readFileSync(filePath, 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1);
}
const products = JSON.parse(raw);

// Section 2: Prix des produits vendus à prix fixe (prix de référence exacts, sans TVA ni conversion)
const fixedReferencePrices = {
    'charbon-bois-morceaux': 200,
    'allume-feu-laine-bois': 180,
    'granules-pellets-premium': 185,
    'buches-torche-suedoise': 224,
    'briquettes-ruf': 188,
    'briquettes-ecorce': 198,
    'nuit-longue-duree': 260,
    'jour-premium-cylindrique': 270,
    'jour-forte-chaleur-cubique': 260,
    'pini-kay-compressbee': 270,
    'jour-eco-cylindrique': 200
};

// Section 3: Produits dont le prix dépend de la longueur des bûches
const lengthReferencePrices = {
    'hetre-etuve': { '20': 220, '30': 212, '33': 204, '40': 196, '50': 190 },
    'hetre-demi-sec': { '20': 170, '30': 165, '33': 160, '40': 155, '50': 150 },
    'chene-etuve': { '20': 224, '30': 218, '33': 208, '40': 200, '50': 194 },
    'chene-sec-air': { '20': 218, '30': 212, '33': 202, '40': 198, '50': 186 },
    'melange-essences': { '20': 222, '30': 216, '33': 206, '40': 202, '50': 190 }
};

// Section 4: Conditionnements associés aux formats
const packagingByLength = {
    '20': {
        fr: '1 700 à 2 000 bûches',
        en: '1,700 to 2,000 logs',
        de: '1.700 bis 2.000 Scheite',
        nl: '1.700 tot 2.000 blokken'
    },
    '30': {
        fr: '1 350 à 1 600 bûches',
        en: '1,350 to 1,600 logs',
        de: '1.350 bis 1.600 Scheite',
        nl: '1.350 tot 1.600 blokken'
    },
    '33': {
        fr: '1 250 à 1 400 bûches',
        en: '1,250 to 1,400 logs',
        de: '1.250 bis 1.400 Scheite',
        nl: '1.250 tot 1.400 blokken'
    },
    '40': {
        fr: '1 050 à 1 200 bûches',
        en: '1,050 to 1,200 logs',
        de: '1.050 bis 1.200 Scheite',
        nl: '1.050 tot 1.200 blokken'
    },
    '50': {
        fr: '900 à 1 000 bûches',
        en: '900 to 1,000 logs',
        de: '900 bis 1.000 Scheite',
        nl: '900 tot 1.000 blokken'
    }
};

products.forEach(p => {
    if (fixedReferencePrices[p.id] !== undefined) {
        p.wholesale_price = fixedReferencePrices[p.id];
        console.log(`[Fixed] ${p.id}: ${p.wholesale_price.toFixed(2)} €`);
    } else if (lengthReferencePrices[p.id] !== undefined) {
        p.prices_by_length = lengthReferencePrices[p.id];
        p.packaging_by_length = packagingByLength;
        delete p.wholesale_price;
        console.log(`[ByLength] ${p.id}:`, JSON.stringify(p.prices_by_length));
    } else {
        console.log(`[Untouched] ${p.id}: ${p.wholesale_price}`);
    }
});

fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
console.log('Successfully updated data/products.json');
