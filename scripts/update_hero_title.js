const fs = require('fs');

const langs = ['fr','en','de','nl'];
const titles = {
    fr: "Grossiste en Bois de Chauffage & Pellets B2B<br><span class='fs-3'>L'Exigence Thermique au Service des Professionnels</span>",
    en: "Wholesale Firewood & Wood Pellets Supplier<br><span class='fs-3'>Thermal Excellence for Professionals</span>",
    de: "Brennholz & Holzpellets Großhandel<br><span class='fs-3'>Thermische Exzellenz für Profis</span>",
    nl: "Brandhout & Houtpellets Groothandel<br><span class='fs-3'>Thermische Uitmuntendheid voor Professionals</span>"
};

langs.forEach(l => {
    const file = './data/i18n/'+l+'.json';
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!data.hero) data.hero = {};
    data.hero.title_html = titles[l];
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
});
console.log('Updated H1s in i18n files.');
