const fs = require('fs');

const key = 'hebergement_description';
const category = 'mentions';
const frText = "Le site sotramsbois est hébergé de manière sécurisée et éco-responsable. Les serveurs sont localisés sur le territoire européen, garantissant le respect strict du RGPD.";
const trans = {
  fr: frText,
  en: "The sotramsbois site is hosted in a secure and eco-responsible manner. The servers are located in Europe, ensuring strict compliance with the GDPR.",
  de: "Die sotramsbois-Website wird sicher und umweltfreundlich gehostet. Die Server befinden sich in Europa und gewährleisten die strikte Einhaltung der DSGVO.",
  nl: "De sotramsbois-site wordt veilig en ecologisch verantwoord gehost. De servers bevinden zich in Europa, waardoor strikte naleving van de AVG wordt gegarandeerd."
};

for (const lang of ['fr', 'en', 'de', 'nl']) {
    const file = `data/i18n/${lang}.json`;
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!data[category]) data[category] = {};
    data[category][key] = trans[lang];
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

let html = fs.readFileSync('mentions-legales.html', 'utf8');
html = html.replace(
    `>${frText}<`,
    ` data-i18n="${category}.${key}">${frText}<`
);
fs.writeFileSync('mentions-legales.html', html, 'utf8');

console.log("Translation added and HTML updated.");
