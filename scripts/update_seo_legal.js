const fs = require('fs');
const path = require('path');

const seoDir = path.join(__dirname, '..', 'data', 'seo');
const langs = ['fr', 'en', 'de', 'nl'];

const seoData = {
    fr: {
        "mentions-legales.html": {
            "title": "Mentions Légales | Bois de Chauffage PRO",
            "description": "Informations légales et éditoriales concernant le site Terre & Feu, spécialiste B2B en biomasse et bois de chauffage."
        },
        "cgv.html": {
            "title": "Conditions Générales de Vente B2B | Bois de Chauffage PRO",
            "description": "Consultez nos CGV applicables à la vente en gros de bois de chauffage, pellets et briquettes pour professionnels."
        },
        "politique-confidentialite.html": {
            "title": "Politique de Confidentialité | Bois de Chauffage PRO",
            "description": "En savoir plus sur notre gestion de vos données personnelles, conformément au RGPD pour nos clients B2B."
        }
    },
    en: {
        "mentions-legales.html": {
            "title": "Legal Notice | Bois de Chauffage PRO",
            "description": "Legal and editorial information regarding the Terre & Feu website, B2B specialists in biomass and firewood."
        },
        "cgv.html": {
            "title": "B2B Terms and Conditions of Sale | Bois de Chauffage PRO",
            "description": "View our Terms and Conditions applicable to the wholesale distribution of firewood, pellets, and briquettes for professionals."
        },
        "politique-confidentialite.html": {
            "title": "Privacy Policy | Bois de Chauffage PRO",
            "description": "Learn more about our handling of your personal data in accordance with GDPR regulations for our B2B clients."
        }
    },
    de: {
        "mentions-legales.html": {
            "title": "Impressum | Bois de Chauffage PRO",
            "description": "Rechtliche und redaktionelle Informationen zur Terre & Feu Website, B2B Spezialisten für Biomasse und Brennholz."
        },
        "cgv.html": {
            "title": "Allgemeine Geschäftsbedingungen B2B | Bois de Chauffage PRO",
            "description": "Lesen Sie unsere AGB für den Großhandel mit Brennholz, Pellets und Briketts für gewerbliche Kunden."
        },
        "politique-confidentialite.html": {
            "title": "Datenschutzerklärung | Bois de Chauffage PRO",
            "description": "Erfahren Sie mehr über unseren Umgang mit Ihren personenbezogenen Daten gemäß der DSGVO für unsere B2B-Kunden."
        }
    },
    nl: {
        "mentions-legales.html": {
            "title": "Wettelijke vermeldingen | Bois de Chauffage PRO",
            "description": "Juridische en redactionele informatie betreffende de Terre & Feu website, B2B specialisten in biomassa en brandhout."
        },
        "cgv.html": {
            "title": "Algemene Voorwaarden B2B | Bois de Chauffage PRO",
            "description": "Bekijk onze algemene voorwaarden voor de groothandel in brandhout, pellets en briketten voor professionals."
        },
        "politique-confidentialite.html": {
            "title": "Privacybeleid | Bois de Chauffage PRO",
            "description": "Meer informatie over onze verwerking van uw persoonsgegevens in overeenstemming met de AVG-regelgeving voor onze B2B-klanten."
        }
    }
};

langs.forEach(lang => {
    const file = path.join(seoDir, `${lang}.json`);
    if (fs.existsSync(file)) {
        const currentData = JSON.parse(fs.readFileSync(file, 'utf8'));
        Object.assign(currentData, seoData[lang]);
        fs.writeFileSync(file, JSON.stringify(currentData, null, 2), 'utf8');
        console.log(`Updated ${lang}.json`);
    }
});
