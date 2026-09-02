const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '..', 'data', 'i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const blogTranslations = {
    fr: {
        "article_1_title": "Optimisation du Stockage Hivernal : Maintenir un Taux d'Humidité Inférieur à 15%",
        "article_2_title": "L'Avenir du Pellet Industriel",
        "article_3_title": "Quel bois choisir pour la cuisson professionnelle ?",
        "article_4_title": "Anticiper les ruptures d'approvisionnement",
        "article_5_title": "Décryptage : La norme ISO 17225-2"
    },
    en: {
        "article_1_title": "Optimizing Winter Storage: Maintaining Moisture Levels Below 15%",
        "article_2_title": "The Future of Industrial Wood Pellets",
        "article_3_title": "Which Wood to Choose for Professional Cooking?",
        "article_4_title": "Anticipating Supply Chain Disruptions",
        "article_5_title": "Decoding the ISO 17225-2 Standard"
    },
    de: {
        "article_1_title": "Optimierung der Winterlagerung: Feuchtigkeitsgehalt unter 15% halten",
        "article_2_title": "Die Zukunft von Industrie-Holzpellets",
        "article_3_title": "Welches Holz für professionelles Kochen?",
        "article_4_title": "Lieferengpässe antizipieren und vermeiden",
        "article_5_title": "Entschlüsselung der Norm ISO 17225-2"
    },
    nl: {
        "article_1_title": "Winteropslag Optimaliseren: Vochtgehalte Onder 15% Houden",
        "article_2_title": "De Toekomst van Industriële Houtpellets",
        "article_3_title": "Welk Hout Kiezen voor Professioneel Koken?",
        "article_4_title": "Anticiperen op Leveringsonderbrekingen",
        "article_5_title": "Ontcijfering van de ISO 17225-2 Norm"
    }
};

const catTranslations = {
    fr: {
        "1": "Bûches de bois",
        "2": "Bûches compressées / briquettes de bois",
        "3": "Briquettes",
        "4": "Granulés / Pellets",
        "5": "Charbon / Allume-feu / Bûches de torche"
    },
    en: {
        "1": "Firewood Logs",
        "2": "Compressed Logs / Wood Briquettes",
        "3": "Briquettes",
        "4": "Wood Pellets",
        "5": "Charcoal / Firestarters / Torch Logs"
    },
    de: {
        "1": "Brennholzscheite",
        "2": "Pressholz / Holzbriketts",
        "3": "Briketts",
        "4": "Holzpellets",
        "5": "Holzkohle / Anzünder / Fackeln"
    },
    nl: {
        "1": "Brandhout",
        "2": "Geperst Hout / Houtbriketten",
        "3": "Briketten",
        "4": "Houtpellets",
        "5": "Houtskool / Aanmaakblokjes / Fakkels"
    }
};

langs.forEach(lang => {
    const file = path.join(i18nDir, `${lang}.json`);
    if (fs.existsSync(file)) {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        
        if (!data.blog) data.blog = {};
        Object.assign(data.blog, blogTranslations[lang]);
        
        if (!data.categories) data.categories = {};
        Object.assign(data.categories, catTranslations[lang]);
        
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated i18n/${lang}.json`);
    }
});
