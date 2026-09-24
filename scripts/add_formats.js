const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../data/i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const formatsDict = {
  'fr': {
    '20 / 30 / 33 / 40 / 50 cm': '20 / 30 / 33 / 40 / 50 cm',
    'Cylindrique': 'Cylindrique',
    'Cylindrique écorce': 'Cylindrique écorce',
    'Cubique': 'Cubique',
    'Octogonal extrudé': 'Octogonal extrudé',
    'Cylindrique standard': 'Cylindrique standard',
    'Pâté rectangulaire RUF': 'Pâté rectangulaire RUF',
    'Rectangulaire écorce': 'Rectangulaire écorce',
    'Granulés 6mm DINplus / ENplus A1': 'Granulés 6mm DINplus / ENplus A1',
    'Gros morceaux qualité restaurant': 'Gros morceaux qualité restaurant',
    'Rouleaux laine de bois': 'Rouleaux laine de bois',
    'Bûche fendue avec mèche intégrée': 'Bûche fendue avec mèche intégrée'
  },
  'en': {
    '20 / 30 / 33 / 40 / 50 cm': '20 / 30 / 33 / 40 / 50 cm',
    'Cylindrique': 'Cylindrical',
    'Cylindrique écorce': 'Cylindrical bark',
    'Cubique': 'Cubic',
    'Octogonal extrudé': 'Extruded octagonal',
    'Cylindrique standard': 'Standard cylindrical',
    'Pâté rectangulaire RUF': 'Rectangular RUF block',
    'Rectangulaire écorce': 'Rectangular bark',
    'Granulés 6mm DINplus / ENplus A1': '6mm Pellets DINplus / ENplus A1',
    'Gros morceaux qualité restaurant': 'Large restaurant-grade lumps',
    'Rouleaux laine de bois': 'Wood wool rolls',
    'Bûche fendue avec mèche intégrée': 'Split log with integrated wick'
  },
  'de': {
    '20 / 30 / 33 / 40 / 50 cm': '20 / 30 / 33 / 40 / 50 cm',
    'Cylindrique': 'Zylindrisch',
    'Cylindrique écorce': 'Zylindrische Rinde',
    'Cubique': 'Kubisch',
    'Octogonal extrudé': 'Extrudiert achteckig',
    'Cylindrique standard': 'Standard zylindrisch',
    'Pâté rectangulaire RUF': 'Rechteckiger RUF-Block',
    'Rectangulaire écorce': 'Rechteckige Rinde',
    'Granulés 6mm DINplus / ENplus A1': '6mm Pellets DINplus / ENplus A1',
    'Gros morceaux qualité restaurant': 'Große Stücke Restaurantqualität',
    'Rouleaux laine de bois': 'Holzwollerollen',
    'Bûche fendue avec mèche intégrée': 'Gespaltenes Holzstück mit integriertem Docht'
  },
  'nl': {
    '20 / 30 / 33 / 40 / 50 cm': '20 / 30 / 33 / 40 / 50 cm',
    'Cylindrique': 'Cilindrisch',
    'Cylindrique écorce': 'Cilindrische schors',
    'Cubique': 'Kubisch',
    'Octogonal extrudé': 'Geëxtrudeerd achthoekig',
    'Cylindrique standard': 'Standaard cilindrisch',
    'Pâté rectangulaire RUF': 'Rechthoekig RUF-blok',
    'Rectangulaire écorce': 'Rechthoekige schors',
    'Granulés 6mm DINplus / ENplus A1': '6mm Pellets DINplus / ENplus A1',
    'Gros morceaux qualité restaurant': 'Grote stukken restaurantkwaliteit',
    'Rouleaux laine de bois': 'Houtwolrollen',
    'Bûche fendue avec mèche intégrée': 'Gekloofd houtblok met geïntegreerde lont'
  }
};

langs.forEach(lang => {
    let data = JSON.parse(fs.readFileSync(path.join(dir, lang + '.json'), 'utf8'));
    
    // Add product.add_to_cart
    if (!data.product) data.product = {};
    if (lang === 'fr') data.product.add_to_cart = 'Ajouter';
    if (lang === 'en') data.product.add_to_cart = 'Add';
    if (lang === 'de') data.product.add_to_cart = 'Hinzufügen';
    if (lang === 'nl') data.product.add_to_cart = 'Toevoegen';
    
    // Add formats
    data.formats = formatsDict[lang];
    
    fs.writeFileSync(path.join(dir, lang + '.json'), JSON.stringify(data, null, 2));
});
