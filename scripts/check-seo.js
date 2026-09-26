const fs = require('fs');
const pages = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const langs = ['fr', 'en', 'de', 'nl'];

langs.forEach(lang => {
    const seo = JSON.parse(fs.readFileSync('data/seo/' + lang + '.json', 'utf8'));
    pages.forEach(p => {
        if (!seo[p]) {
            console.log(lang + ' is missing ' + p);
        }
    });
});
