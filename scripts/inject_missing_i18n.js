const fs = require('fs');
const path = require('path');

const langs = ['fr', 'en', 'de', 'nl'];

const translations = {
    'product': {
        'origin_tbd': {
            'fr': 'Origine à préciser',
            'en': 'Origin to be specified',
            'de': 'Herkunft wird noch bekannt gegeben',
            'nl': 'Herkomst nog te bepalen'
        }
    },
    'quote': {
        'format_standard': {
            'fr': 'Standard',
            'en': 'Standard',
            'de': 'Standard',
            'nl': 'Standaard'
        }
    }
};

for (const lang of langs) {
    const filePath = path.join(__dirname, '../data/i18n', `${lang}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Inject product.origin_tbd
    if (!data.product) data.product = {};
    data.product.origin_tbd = translations.product.origin_tbd[lang];

    // Inject quote.format_standard
    if (!data.quote) data.quote = {};
    data.quote.format_standard = translations.quote.format_standard[lang];

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

console.log('Injected missing keys to all languages.');
