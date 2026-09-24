const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../data/i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const extraDict = {
  'fr': {
    'payment_method': 'Mode de paiement',
    'bank_transfer': 'Virement Bancaire (SEPA)',
    'cgv': 'conditions générales de vente'
  },
  'en': {
    'payment_method': 'Payment method',
    'bank_transfer': 'Bank Transfer (SEPA)',
    'cgv': 'terms and conditions'
  },
  'de': {
    'payment_method': 'Zahlungsmethode',
    'bank_transfer': 'Banküberweisung (SEPA)',
    'cgv': 'Allgemeine Geschäftsbedingungen'
  },
  'nl': {
    'payment_method': 'Betaalmethode',
    'bank_transfer': 'Bankoverschrijving (SEPA)',
    'cgv': 'algemene voorwaarden'
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
console.log('Added missing checkout translations to JSON.');
