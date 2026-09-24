const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../data/i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const checkoutDict = {
  'fr': {
    'product': 'Produit',
    'qty': 'Qté',
    'total_ttc': 'Total TTC',
    'discounted': 'remisé',
    'to_be_calculated': 'À calculer',
    'confirm_address': "Confirmer l'adresse",
    'address': 'Adresse',
    'zip': 'Code Postal',
    'city': 'Ville',
    'edit': 'Modifier',
    'confirm': 'Confirmer',
    'address_validated': 'Adresse validée'
  },
  'en': {
    'product': 'Product',
    'qty': 'Qty',
    'total_ttc': 'Total (incl. VAT)',
    'discounted': 'discounted',
    'to_be_calculated': 'To be calculated',
    'confirm_address': 'Confirm address',
    'address': 'Address',
    'zip': 'Zip Code',
    'city': 'City',
    'edit': 'Edit',
    'confirm': 'Confirm',
    'address_validated': 'Address validated'
  },
  'de': {
    'product': 'Produkt',
    'qty': 'Menge',
    'total_ttc': 'Gesamt (inkl. MwSt)',
    'discounted': 'rabattiert',
    'to_be_calculated': 'Wird berechnet',
    'confirm_address': 'Adresse bestätigen',
    'address': 'Adresse',
    'zip': 'Postleitzahl',
    'city': 'Stadt',
    'edit': 'Bearbeiten',
    'confirm': 'Bestätigen',
    'address_validated': 'Adresse bestätigt'
  },
  'nl': {
    'product': 'Product',
    'qty': 'Aantal',
    'total_ttc': 'Totaal (incl. btw)',
    'discounted': 'met korting',
    'to_be_calculated': 'Te berekenen',
    'confirm_address': 'Adres bevestigen',
    'address': 'Adres',
    'zip': 'Postcode',
    'city': 'Stad',
    'edit': 'Bewerken',
    'confirm': 'Bevestigen',
    'address_validated': 'Adres bevestigd'
  }
};

langs.forEach(lang => {
    let data = JSON.parse(fs.readFileSync(path.join(dir, lang + '.json'), 'utf8'));
    data.checkout = checkoutDict[lang];
    fs.writeFileSync(path.join(dir, lang + '.json'), JSON.stringify(data, null, 2));
});
console.log('Checkout translations added to JSON files.');
