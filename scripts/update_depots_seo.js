const fs = require('fs');
const path = require('path');

const seoData = {
    'fr': {
        "title": "Réseau d'approvisionnement bois de chauffage en Europe | sotramsbois",
        "description": "Grossiste bois de chauffage implanté dans 8 pays et 24 villes d'Europe : Pologne, Lettonie, Lituanie, Roumanie, Tchéquie, Croatie, Bosnie, France. Sécurisez votre approvisionnement B2B."
    },
    'en': {
        "title": "Firewood Wholesale Sourcing Network Across Europe | sotramsbois",
        "description": "B2B firewood supplier network spanning 8 countries and 24 cities in Europe — Poland, Latvia, Lithuania, Romania, Czechia, Croatia, Bosnia, France. Reliable bulk firewood sourcing."
    },
    'de': {
        "title": "Brennholz-Beschaffungsnetzwerk in Europa | sotramsbois",
        "description": "Brennholz-Großhändler mit Standorten in 8 Ländern und 24 Städten Europas — Polen, Lettland, Litauen, Rumänien, Tschechien, Kroatien, Bosnien, Frankreich. Zuverlässige B2B-Beschaffung."
    },
    'nl': {
        "title": "Brandhout inkoopnetwerk in heel Europa | sotramsbois",
        "description": "Groothandel brandhout met vestigingen in 8 landen en 24 steden in Europa — Polen, Letland, Litouwen, Roemenië, Tsjechië, Kroatië, Bosnië, Frankrijk. Betrouwbare B2B-bevoorrading."
    }
};

const langs = ['fr', 'en', 'de', 'nl'];

langs.forEach(lang => {
    const p = path.join(__dirname, '..', 'data', 'seo', lang + '.json');
    if (fs.existsSync(p)) {
        const data = JSON.parse(fs.readFileSync(p, 'utf8'));
        data['depots.html'] = seoData[lang];
        fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
        console.log(`Updated ${lang}.json`);
    }
});
