const fs = require('fs');
const missing = require('./trans_missing');

const i18n = {
  fr: JSON.parse(fs.readFileSync('data/i18n/fr.json', 'utf8')),
  en: JSON.parse(fs.readFileSync('data/i18n/en.json', 'utf8')),
  de: JSON.parse(fs.readFileSync('data/i18n/de.json', 'utf8')),
  nl: JSON.parse(fs.readFileSync('data/i18n/nl.json', 'utf8'))
};

// Update HTML safely
const files = [...new Set(missing.map(m => m.file))];

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const items = missing.filter(m => m.file === file);
  
  for (const item of items) {
      if (html.includes(`"${item.key}"`)) continue; // already processed
      
      // We want to replace the text when it's outside of attributes.
      // Easiest safe way: find `>...text...<`
      // Since there might be whitespace, we can use a regex.
      // Escape regex special chars in item.fr
      const escapedFr = item.fr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`>(\\s*)${escapedFr}(\\s*)<`, 'g');
      
      if (regex.test(html)) {
          html = html.replace(regex, `>$1<span data-i18n="${item.key}">${item.fr}</span>$2<`);
      } else {
          // If not found between ><, maybe it's the only text in a line after a tag.
          // e.g. </a> text \n
          const regex2 = new RegExp(`>(\\s*)${escapedFr}(\\s*)`, 'g');
          if (regex2.test(html)) {
              html = html.replace(regex2, `>$1<span data-i18n="${item.key}">${item.fr}</span>$2`);
          } else {
              console.log("Could not find safe replacement for:", item.fr, "in", file);
          }
      }
  }
  fs.writeFileSync(file, html, 'utf8');
}
console.log('Safe missing translations applied');
