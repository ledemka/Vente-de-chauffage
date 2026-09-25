const fs = require('fs');

const langs = ['en', 'de', 'nl'];

const translations = {
  en: {
    format: "FORMAT",
    unit_pallet: "UNIT / PALLET",
    weight: "PALLET WEIGHT",
    price: "WHOLESALE PRICE / PALLET",
    currency: "€ incl. VAT"
  },
  de: {
    format: "FORMAT",
    unit_pallet: "EINHEIT / PALETTE",
    weight: "PALETTENGEWICHT",
    price: "GROSSPREIS / PALETTE",
    currency: "€ inkl. MwSt."
  },
  nl: {
    format: "FORMAAT",
    unit_pallet: "EENHEID / PALLET",
    weight: "PALLETGEWICHT",
    price: "GROOTHANDELSPRIJS / PALLET",
    currency: "€ incl. btw"
  }
};

for (const lang of langs) {
  const path = `data/i18n/${lang}.json`;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    
    if (!data.catalog) data.catalog = {};
    if (!data.catalog.table) data.catalog.table = {};
    
    // Check missing fields and add them
    for (const [key, value] of Object.entries(translations[lang])) {
      if (!data.catalog.table[key]) {
        data.catalog.table[key] = value;
        console.log(`Added catalog.table.${key} to ${lang}.json`);
      }
    }
    
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  }
}

// Add these to i18n-allowlist if they trigger audit errors
const allowlistPath = 'scripts/i18n-allowlist.json';
if (fs.existsSync(allowlistPath)) {
  const allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
  allowlist['catalog.table.format'] = ['en', 'de', 'nl'];
  fs.writeFileSync(allowlistPath, JSON.stringify(allowlist, null, 2), 'utf8');
}

console.log('Translations updated.');
