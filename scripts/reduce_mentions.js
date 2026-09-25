const fs = require('fs');

const frText = "Siège social : [Adresse du siège à compléter]. Email : [Email de contact à compléter] — Téléphone : [Téléphone à compléter].";
const texts = {
    fr: frText,
    en: "Registered office: [Head office address to be completed]. Email: [Contact email to be completed] — Phone: [Phone number to be completed].",
    de: "Hauptsitz: [Adresse des Hauptsitzes noch zu ergänzen]. E-Mail: [Kontakt-E-Mail noch zu ergänzen] — Telefon: [Telefonnummer noch zu ergänzen].",
    nl: "Hoofdkantoor: [Adres hoofdkantoor nog aan te vullen]. E-mail: [Contact e-mail nog aan te vullen] — Telefoon: [Telefoonnummer nog aan te vullen]."
};

for (const lang of ['fr', 'en', 'de', 'nl']) {
    const file = `data/i18n/${lang}.json`;
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.mentions.sec1_text = texts[lang];
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

let html = fs.readFileSync('mentions-legales.html', 'utf8');
// The original text to replace
const oldTextRegex = /\[Raison sociale à compléter\][\s\S]*?\[Nom du directeur de la publication à compléter\]/;
if (oldTextRegex.test(html)) {
    html = html.replace(oldTextRegex, frText);
    fs.writeFileSync('mentions-legales.html', html, 'utf8');
    console.log("HTML and JSON updated.");
} else {
    console.log("Could not find the original text in mentions-legales.html");
}
