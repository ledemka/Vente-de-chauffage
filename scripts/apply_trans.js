const fs = require('fs');
const cheerio = require('cheerio');

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

const i18n = {
  fr: JSON.parse(fs.readFileSync('data/i18n/fr.json', 'utf8')),
  en: JSON.parse(fs.readFileSync('data/i18n/en.json', 'utf8')),
  de: JSON.parse(fs.readFileSync('data/i18n/de.json', 'utf8')),
  nl: JSON.parse(fs.readFileSync('data/i18n/nl.json', 'utf8'))
};

// Insert translations into JSON
for (const file in mappings) {
  for (const item of mappings[file]) {
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
}

// Write back JSON
for (const lang of ['fr', 'en', 'de', 'nl']) {
  fs.writeFileSync(`data/i18n/${lang}.json`, JSON.stringify(i18n[lang], null, 2), 'utf8');
}

// Update HTML
for (const file in mappings) {
  let html = fs.readFileSync(file, 'utf8');
  
  // Custom manual replacements for precision
  for (const item of mappings[file]) {
    // Avoid double data-i18n
    if (html.includes(`data-i18n="${item.key}"`) || html.includes(`data-i18n-html="${item.key}"`)) continue;
    
    // We try to replace > TEXT < with > TEXT < and inject the attribute in the preceding tag
    // Since this is hard with regex in HTML, we will just use basic string replacement.
    // e.g. replacing `>Text<` by ` data-i18n="key">Text<` ? No, that breaks if there are multiple tags ending with >
    
    // Let's use Cheerio but we must ensure we don't mess up the formatting
    // Cheerio changes formatting (html, head, body wrapper etc)
  }
  
  // Better approach: Cheerio to find exact strings, then string replace in original HTML to preserve format
  const $ = cheerio.load(html, { decodeEntities: false });
  let changes = [];
  
  $('*').each(function() {
    const el = $(this);
    if (el.attr('data-i18n') || el.attr('data-i18n-html')) return;
    
    const text = el.text().trim();
    const htmlContent = el.html() ? el.html().trim() : '';
    
    for (const item of mappings[file]) {
      if (htmlContent === item.fr) {
         // It's HTML
         changes.push({
           original: `>${item.fr}<`,
           replacement: ` data-i18n-html="${item.key}">${item.fr}<`
         });
      } else if (text === item.fr && htmlContent.indexOf('<') === -1) {
         // It's pure text
         changes.push({
           original: `>${item.fr}<`,
           replacement: ` data-i18n="${item.key}">${item.fr}<`
         });
      }
    }
  });
  
  // Apply changes backwards or just sequentially (be careful with duplicates)
  // Actually, standard string replace is safe if the string is long enough, 
  // but for small strings like 'RCS' it might replace multiple things.
  // Let's replace only the first occurrence that matches exactly `>string<`
  for (const change of changes) {
      html = html.replace(change.original, change.replacement);
  }
  
  fs.writeFileSync(file, html, 'utf8');
}

console.log('Translations applied!');
