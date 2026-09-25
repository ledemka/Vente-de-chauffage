const fs = require('fs');

const langs = ['fr', 'en', 'de', 'nl'];

for (const lang of langs) {
    const path = `data/i18n/${lang}.json`;
    if (!fs.existsSync(path)) continue;
    
    let content = fs.readFileSync(path, 'utf8');
    const data = JSON.parse(content);
    
    data.nav.faq = "FAQ";
    data.nav.blog = "BLOG";
    
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
}
console.log('Fixed translations for FAQ and BLOG in nav');
