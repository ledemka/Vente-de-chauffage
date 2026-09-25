const fs = require('fs');

const cgv = require('./trans_cgv');
const mentions = require('./trans_mentions');
const privacy = require('./trans_privacy');
const returns = require('./trans_return');

const mappings = {
  'cgv.html': cgv,
  'mentions-legales.html': mentions,
  'politique-confidentialite.html': privacy,
  'politique-retour.html': returns
};

for (const file in mappings) {
  let html = fs.readFileSync(file, 'utf8');
  
  for (const item of mappings[file]) {
      // Avoid doing it twice
      if (html.includes(`"${item.key}"`)) continue;
      
      // We look for the text in the HTML.
      // Sometimes it's wrapped in a tag: >TEXT<
      // Sometimes it's floating text: </strong> TEXT</span>
      // We can do a string replace, but to add data-i18n, we might need to wrap it in a span if it's not already the only content of a tag.
      
      let replaced = false;
      
      // Case 1: >TEXT<
      const case1 = `>${item.fr}<`;
      if (html.includes(case1)) {
         html = html.replace(case1, ` data-i18n="${item.key}">${item.fr}<`);
         replaced = true;
      }
      
      // Case 2: >TEXT\n
      const case2 = `>${item.fr}\n`;
      if (!replaced && html.includes(case2)) {
         html = html.replace(case2, ` data-i18n="${item.key}">${item.fr}\n`);
         replaced = true;
      }
      
      // Case 3: floating text like </strong> TEXT</span>
      // Example: </strong> La commande...</span>
      if (!replaced) {
         // We can just find the exact text and replace it with <span data-i18n="key">text</span>
         // But we must be careful not to double wrap if we already did something.
         // Let's just do a direct string replace if it's found
         if (html.includes(item.fr)) {
             // check if it's immediately following a >
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
console.log('Fixed translations');
