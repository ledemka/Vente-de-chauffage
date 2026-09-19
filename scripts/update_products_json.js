const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '..', 'data', 'products.json');
let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

const names = {
    'hetre-etuve': {
        'fr': 'Hêtre étuvé / séché au four',
        'en': 'Kiln-Dried Beech Firewood',
        'de': 'Buchenholz, ofengetrocknet',
        'nl': 'Beukenhout, ovengedroogd'
    },
    'hetre-demi-sec': {
        'fr': 'Hêtre demi-sec',
        'en': 'Semi-Dried Beech Firewood',
        'de': 'Buchenholz, halbtrocken',
        'nl': 'Beukenhout, halfdroog'
    },
    'chene-etuve': {
        'fr': 'Chêne étuvé / séché au four',
        'en': 'Kiln-Dried Oak Firewood',
        'de': 'Eichenholz, ofengetrocknet',
        'nl': 'Eikenhout, ovengedroogd'
    },
    'chene-sec-air': {
        'fr': "Chêne sec à l'air",
        'en': 'Air-Dried Oak Firewood',
        'de': 'Eichenholz, lufttrocken',
        'nl': 'Eikenhout, luchtgedroogd'
    },
    'melange-essences': {
        'fr': "Mélange d'essences séché au four",
        'en': 'Kiln-Dried Mixed Hardwood Firewood',
        'de': 'Laubholzmischung, ofengetrocknet',
        'nl': 'Gemengd hardhout, ovengedroogd'
    },
    'jour-premium-cylindrique': {
        'fr': 'JOUR PREMIUM – Cylindrique',
        'en': 'DAY PREMIUM – Cylindrical Briquette',
        'de': 'TAG PREMIUM – Zylindrisch',
        'nl': 'DAG PREMIUM – Cilindrisch'
    },
    'nuit-longue-duree': {
        'fr': 'NUIT – Longue Durée (Compressée)',
        'en': 'NIGHT – Long-Burning Compressed Log',
        'de': 'NACHT – Langbrenner (Presslinge)',
        'nl': 'NACHT – Langbrandend (Geperst)'
    },
    'jour-forte-chaleur-cubique': {
        'fr': 'JOUR FORTE CHALEUR – Cubique',
        'en': 'DAY HIGH HEAT – Cubic Briquette',
        'de': 'TAG HOCHHITZE – Würfelform',
        'nl': 'DAG HOGE HITTE – Kubusvorm'
    },
    'pini-kay-compressee': {
        'fr': 'Pini Kay (Compressée premium)',
        'en': 'Pini Kay Premium Compressed Briquette',
        'de': 'Pini Kay Premium-Presslinge',
        'nl': 'Pini Kay Premium Perslog'
    },
    'jour-eco-cylindrique': {
        'fr': 'JOUR ECO – Cylindrique',
        'en': 'DAY ECO – Cylindrical Briquette',
        'de': 'TAG ECO – Zylindrisch',
        'nl': 'DAG ECO – Cilindrisch'
    },
    'briquettes-ruf': {
        'fr': 'Briquettes RUF',
        'en': 'RUF Briquettes',
        'de': 'RUF-Briketts',
        'nl': 'RUF-Briketten'
    },
    'briquettes-ecorce': {
        'fr': "Briquettes d'écorce",
        'en': 'Bark Briquettes',
        'de': 'Rindenbriketts',
        'nl': 'Schorsbriketten'
    },
    'granules-pellets-premium': {
        'fr': 'Granulés / Pellets Premium',
        'en': 'Premium Wood Pellets',
        'de': 'Premium-Holzpellets',
        'nl': 'Premium Houtpellets'
    },
    'charbon-bois-morceaux': {
        'fr': 'Charbon de bois en morceaux',
        'en': 'Lump Wood Charcoal',
        'de': 'Holzkohle (stückig)',
        'nl': 'Houtskool (in stukken)'
    },
    'allume-feu-laine-bois': {
        'fr': 'Allume-feu en laine de bois',
        'en': 'Wood Wool Firelighters',
        'de': 'Anzünder aus Holzwolle',
        'nl': 'Aanmaakblokjes van houtwol'
    },
    'buches-torche-suedoise': {
        'fr': 'Bûches de torche suédoise',
        'en': 'Swedish Torch Log',
        'de': 'Schwedenfackel',
        'nl': 'Zweedse Fakkel'
    }
};

products.forEach(p => {
    if (names[p.id]) {
        p.name = names[p.id];
    } else {
        // Fallback for 'pini-kay-compressbee' typo in user prompt vs actual ID
        if (p.id === 'pini-kay-compressbee') {
            p.name = names['pini-kay-compressee'];
        }
        else if (p.id === 'pini-kay-compressee') {
             p.name = names['pini-kay-compressee'];
        } else {
             console.warn("No translation found for: " + p.id);
        }
    }
});

fs.writeFileSync(productsFile, JSON.stringify(products, null, 4));
console.log('Updated products.json');
