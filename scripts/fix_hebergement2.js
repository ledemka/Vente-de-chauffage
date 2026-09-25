const fs = require('fs');
let html = fs.readFileSync('mentions-legales.html', 'utf8');
const regex = /(Le site sotramsbois est hébergé de manière sécurisée et éco-responsable[\s\S]*?respect strict du RGPD\.)/;
if (regex.test(html)) {
    html = html.replace(regex, '<span data-i18n="mentions.hebergement_description">$1</span>');
    fs.writeFileSync('mentions-legales.html', html, 'utf8');
    console.log('Replaced via regex.');
} else {
    console.log('Not found via regex.');
}
