const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../data/i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const extraDict = {
  'fr': {
    'shipping_calculating': 'Calcul en cours...',
    'distance': 'Distance de livraison'
  },
  'en': {
    'shipping_calculating': 'Calculating...',
    'distance': 'Delivery distance'
  },
  'de': {
    'shipping_calculating': 'Wird berechnet...',
    'distance': 'Lieferentfernung'
  },
  'nl': {
    'shipping_calculating': 'Bezig met berekenen...',
    'distance': 'Leveringsafstand'
  }
};

langs.forEach(lang => {
    let data = JSON.parse(fs.readFileSync(path.join(dir, lang + '.json'), 'utf8'));
    if (!data.checkout) data.checkout = {};
    for (let k in extraDict[lang]) {
        data.checkout[k] = extraDict[lang][k];
    }
    fs.writeFileSync(path.join(dir, lang + '.json'), JSON.stringify(data, null, 2));
});
console.log('Added missing distance and calculation translations to JSON.');
