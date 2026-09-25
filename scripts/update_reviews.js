const fs = require('fs');

const fr = JSON.parse(fs.readFileSync('data/i18n/fr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('data/i18n/en.json', 'utf8'));
const de = JSON.parse(fs.readFileSync('data/i18n/de.json', 'utf8'));
const nl = JSON.parse(fs.readFileSync('data/i18n/nl.json', 'utf8'));

if (!fr.reviews.example) fr.reviews.example = {};
if (!en.reviews.example) en.reviews.example = {};
if (!de.reviews.example) de.reviews.example = {};
if (!nl.reviews.example) nl.reviews.example = {};

const newKeys = {
    "example_warning": {
        fr: "Les témoignages ci-dessous sont des exemples fournis à titre d'illustration, en attendant de vrais avis clients. Ils ne représentent aucune entreprise réelle.",
        en: "The testimonials below are examples provided for illustration purposes, pending real customer reviews. They do not represent any real company.",
        de: "Die unten stehenden Erfahrungsberichte sind Beispiele zur Veranschaulichung, bis echte Kundenbewertungen vorliegen. Sie repräsentieren kein reales Unternehmen.",
        nl: "De onderstaande getuigenissen zijn voorbeelden ter illustratie, in afwachting van echte klantbeoordelingen. Ze vertegenwoordigen geen echt bedrijf."
    },
    "example_badge": {
        fr: "Exemple",
        en: "Example",
        de: "Beispiel",
        nl: "Voorbeeld"
    },
    "hosp1_text": {
        fr: "Le bois sec que nous recevons brûle proprement et régulièrement, un vrai plus pour la cuisson au feu de bois en service continu.",
        en: "The dry wood we receive burns cleanly and evenly, a real plus for wood-fired cooking in continuous service.",
        de: "Das trockene Holz, das wir erhalten, brennt sauber und gleichmäßig, ein echtes Plus für das Kochen auf dem Holzfeuer im Dauerbetrieb.",
        nl: "Het droge hout dat we ontvangen brandt schoon en gelijkmatig, een echt pluspunt voor koken op houtvuur in continubedrijf."
    },
    "hosp1_attr": {
        fr: "Exemple, restaurant gastronomique",
        en: "Example, gastronomic restaurant",
        de: "Beispiel, gastronomisches Restaurant",
        nl: "Voorbeeld, gastronomisch restaurant"
    },
    "hosp2_text": {
        fr: "Les livraisons arrivent à l'heure convenue, ce qui compte quand on gère un stock de cuisine tendu.",
        en: "Deliveries arrive at the agreed time, which matters when managing tight kitchen stock.",
        de: "Lieferungen kommen zur vereinbarten Zeit an, was bei knapper Küchenvorratshaltung wichtig ist.",
        nl: "Leveringen komen op de afgesproken tijd aan, wat belangrijk is bij het beheren van krappe keukenvoorraden."
    },
    "hosp2_attr": {
        fr: "Exemple, restaurant",
        en: "Example, restaurant",
        de: "Beispiel, Restaurant",
        nl: "Voorbeeld, restaurant"
    },
    "ind1_text": {
        fr: "Le pouvoir calorifique constant d'une palette à l'autre facilite le pilotage de notre chaudière biomasse.",
        en: "The constant calorific value from one pallet to another facilitates the control of our biomass boiler.",
        de: "Der konstante Heizwert von Palette zu Palette erleichtert die Steuerung unseres Biomassekessels.",
        nl: "De constante calorische waarde van pallet tot pallet vergemakkelijkt de besturing van onze biomassaketel."
    },
    "ind1_attr": {
        fr: "Exemple, site industriel",
        en: "Example, industrial site",
        de: "Beispiel, Industriestandort",
        nl: "Voorbeeld, industriële site"
    },
    "ind2_text": {
        fr: "Un interlocuteur unique pour les commandes en volume nous fait gagner du temps sur la logistique.",
        en: "A single point of contact for volume orders saves us time on logistics.",
        de: "Ein einziger Ansprechpartner für Volumenbestellungen spart uns Zeit bei der Logistik.",
        nl: "Een enkel aanspreekpunt voor volumebestellingen bespaart ons tijd op logistiek."
    },
    "ind2_attr": {
        fr: "Exemple, unité de production",
        en: "Example, production unit",
        de: "Beispiel, Produktionseinheit",
        nl: "Voorbeeld, productie-eenheid"
    },
    "res1_text": {
        fr: "Des conditions de revente claires et un réapprovisionnement fiable, ce qui simplifie notre gestion de stock.",
        en: "Clear resale conditions and reliable restocking, which simplifies our stock management.",
        de: "Klare Wiederverkaufsbedingungen und zuverlässige Wiederbeschaffung, was unser Bestandsmanagement vereinfacht.",
        nl: "Duidelijke doorverkoopvoorwaarden en betrouwbare bevoorrading, wat ons voorraadbeheer vereenvoudigt."
    },
    "res1_attr": {
        fr: "Exemple, négoce de matériaux",
        en: "Example, materials trading",
        de: "Beispiel, Baustoffhandel",
        nl: "Voorbeeld, materialenhandel"
    },
    "res2_text": {
        fr: "La disponibilité des différents formats nous permet de répondre à une clientèle variée.",
        en: "The availability of different formats allows us to respond to a varied clientele.",
        de: "Die Verfügbarkeit verschiedener Formate ermöglicht es uns, auf eine vielfältige Kundschaft zu reagieren.",
        nl: "De beschikbaarheid van verschillende formaten stelt ons in staat om te reageren op een gevarieerde klantenkring."
    },
    "res2_attr": {
        fr: "Exemple, revendeur",
        en: "Example, reseller",
        de: "Beispiel, Wiederverkäufer",
        nl: "Voorbeeld, wederverkoper"
    }
};

for (const [key, translations] of Object.entries(newKeys)) {
    if (key === 'example_warning' || key === 'example_badge') {
        fr.reviews[key] = translations.fr;
        en.reviews[key] = translations.en;
        de.reviews[key] = translations.de;
        nl.reviews[key] = translations.nl;
    } else {
        fr.reviews.example[key] = translations.fr;
        en.reviews.example[key] = translations.en;
        de.reviews.example[key] = translations.de;
        nl.reviews.example[key] = translations.nl;
    }
}

fs.writeFileSync('data/i18n/fr.json', JSON.stringify(fr, null, 2), 'utf8');
fs.writeFileSync('data/i18n/en.json', JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync('data/i18n/de.json', JSON.stringify(de, null, 2), 'utf8');
fs.writeFileSync('data/i18n/nl.json', JSON.stringify(nl, null, 2), 'utf8');
console.log('JSON updated.');
