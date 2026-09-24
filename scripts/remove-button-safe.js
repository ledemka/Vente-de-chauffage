const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const file = path.join(__dirname, '../livraison.html');
const content = fs.readFileSync(file, 'utf8');

const $ = cheerio.load(content);
let found = false;

$('button, a').each((_, el) => {
    const text = $(el).text().trim().toUpperCase();
    if (text.includes("TÉLÉCHARGER LE GUIDE D'ACCÈS") || text.includes("TÉLÉCHARGER") || text.includes("GUIDE D'ACCÈS")) {
        $(el).remove();
        found = true;
    }
});

// Since the user said the button was there, let's see if we can find it
if (found) {
    fs.writeFileSync(file, $.html());
    console.log('Button removed safely via Cheerio.');
} else {
    console.log('Button not found using text search. Looking for data-i18n...');
    let found2 = false;
    $('[data-i18n]').each((_, el) => {
        if ($(el).attr('data-i18n').includes('t_l_charger') || $(el).attr('data-i18n').includes('guide')) {
            $(el).closest('button, a').remove();
            found2 = true;
        }
    });
    if (found2) {
        fs.writeFileSync(file, $.html());
        console.log('Button removed using data-i18n search via Cheerio.');
    } else {
        console.log('Button still not found.');
    }
}
