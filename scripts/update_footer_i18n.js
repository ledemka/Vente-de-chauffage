const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '..', 'data', 'i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const newKeys = {
    fr: {
        "footer.client_space_title": "ESPACE CLIENT & PANIER",
        "footer.client_link_1": "Mon Panier",
        "footer.client_link_2": "Connexion / Inscription",
        "footer.client_link_3": "Suivi de livraison",
        "footer.client_link_4": "Service commercial"
    },
    en: {
        "footer.client_space_title": "CUSTOMER AREA & CART",
        "footer.client_link_1": "My Cart",
        "footer.client_link_2": "Login / Register",
        "footer.client_link_3": "Delivery Tracking",
        "footer.client_link_4": "Sales Department"
    },
    de: {
        "footer.client_space_title": "KUNDENBEREICH & WARENKORB",
        "footer.client_link_1": "Mein Warenkorb",
        "footer.client_link_2": "Anmelden / Registrieren",
        "footer.client_link_3": "Lieferverfolgung",
        "footer.client_link_4": "Vertriebsabteilung"
    },
    nl: {
        "footer.client_space_title": "KLANTENZONE & WINKELWAGEN",
        "footer.client_link_1": "Mijn Winkelwagen",
        "footer.client_link_2": "Inloggen / Registreren",
        "footer.client_link_3": "Levering Volgen",
        "footer.client_link_4": "Verkoopafdeling"
    }
};

for (const lang of langs) {
    const file = path.join(i18nDir, `${lang}.json`);
    if (fs.existsSync(file)) {
        let data = JSON.parse(fs.readFileSync(file, 'utf8'));
        Object.assign(data, newKeys[lang]);
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated ${lang}.json`);
    }
}
