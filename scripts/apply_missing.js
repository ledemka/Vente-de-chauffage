const fs = require('fs');

const missing = require('./trans_missing');

const i18n = {
  fr: JSON.parse(fs.readFileSync('data/i18n/fr.json', 'utf8')),
  en: JSON.parse(fs.readFileSync('data/i18n/en.json', 'utf8')),
  de: JSON.parse(fs.readFileSync('data/i18n/de.json', 'utf8')),
  nl: JSON.parse(fs.readFileSync('data/i18n/nl.json', 'utf8'))
};

// Insert translations into JSON
for (const item of missing) {
  const parts = item.key.split('.');
  const category = parts[0];
  const key = parts[1];
  
  for (const lang of ['fr', 'en', 'de', 'nl']) {
    if (!i18n[lang][category]) {
      i18n[lang][category] = {};
    }
    i18n[lang][category][key] = item[lang];
  }
}

// Write back JSON
for (const lang of ['fr', 'en', 'de', 'nl']) {
  fs.writeFileSync(`data/i18n/${lang}.json`, JSON.stringify(i18n[lang], null, 2), 'utf8');
}

// Update HTML
const files = [...new Set(missing.map(m => m.file))];

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const items = missing.filter(m => m.file === file);
  
  for (const item of items) {
      if (html.includes(`"${item.key}"`)) continue;
      
      let replaced = false;
      
      const case1 = `>${item.fr}<`;
      if (html.includes(case1)) {
         html = html.replace(case1, ` data-i18n="${item.key}">${item.fr}<`);
         replaced = true;
      }
      
      const case2 = `>${item.fr}\n`;
      if (!replaced && html.includes(case2)) {
         html = html.replace(case2, ` data-i18n="${item.key}">${item.fr}\n`);
         replaced = true;
      }
      
      if (!replaced) {
         if (html.includes(item.fr)) {
             const idx = html.indexOf(item.fr);
             if (html[idx - 1] === '>') {
                 html = html.replace(`>${item.fr}`, ` data-i18n="${item.key}">${item.fr}`);
             } else {
                 html = html.replace(item.fr, `<span data-i18n="${item.key}">${item.fr}</span>`);
             }
         }
      }
  }
  fs.writeFileSync(file, html, 'utf8');
}
console.log('Missing translations applied');
