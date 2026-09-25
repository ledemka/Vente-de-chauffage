const fs = require('fs');
const cheerio = require('cheerio');

const fr = JSON.parse(fs.readFileSync('data/i18n/fr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('data/i18n/en.json', 'utf8'));
const de = JSON.parse(fs.readFileSync('data/i18n/de.json', 'utf8'));
const nl = JSON.parse(fs.readFileSync('data/i18n/nl.json', 'utf8'));

function setKey(category, key, texts) {
    if (!fr[category]) fr[category] = {};
    if (!en[category]) en[category] = {};
    if (!de[category]) de[category] = {};
    if (!nl[category]) nl[category] = {};
    
    fr[category][key] = texts.fr;
    en[category][key] = texts.en;
    de[category][key] = texts.de;
    nl[category][key] = texts.nl;
}

// ==========================================
// 1. MENTIONS LÉGALES
// ==========================================
setKey('mentions', 'sec1_title', {
    fr: '1. Éditeur du site',
    en: '1. Site Publisher',
    de: '1. Website-Herausgeber',
    nl: '1. Uitgever van de site'
});
setKey('mentions', 'sec1_text', {
    fr: "[Raison sociale à compléter], [forme juridique à compléter] au capital de [montant à compléter]€. Siège social : [Adresse du siège à compléter]. RCS [Ville RCS à compléter] [Numéro RCS à compléter]. TVA intracommunautaire : [Numéro de TVA à compléter]. Email : [Email de contact à compléter] — Téléphone : [Téléphone à compléter]<br>Directeur de la publication : [Nom du directeur de la publication à compléter]",
    en: "[Company name to be completed], [legal form to be completed] with a capital of [amount to be completed]€. Registered office: [Head office address to be completed]. RCS [RCS City to be completed] [RCS Number to be completed]. Intra-community VAT: [VAT Number to be completed]. Email: [Contact email to be completed] — Phone: [Phone number to be completed]<br>Publication Director: [Name of publication director to be completed]",
    de: "[Firmenname noch zu ergänzen], [Rechtsform noch zu ergänzen] mit einem Kapital von [Betrag noch zu ergänzen]€. Hauptsitz: [Adresse des Hauptsitzes noch zu ergänzen]. RCS [RCS-Stadt noch zu ergänzen] [RCS-Nummer noch zu ergänzen]. Innergemeinschaftliche MwSt.: [MwSt.-Nummer noch zu ergänzen]. E-Mail: [Kontakt-E-Mail noch zu ergänzen] — Telefon: [Telefonnummer noch zu ergänzen]<br>Publikationsdirektor: [Name des Publikationsdirektors noch zu ergänzen]",
    nl: "[Bedrijfsnaam nog aan te vullen], [rechtsvorm nog aan te vullen] met een kapitaal van [bedrag nog aan te vullen]€. Hoofdkantoor: [Adres hoofdkantoor nog aan te vullen]. RCS [RCS-stad nog aan te vullen] [RCS-nummer nog aan te vullen]. Intracommunautaire btw: [Btw-nummer nog aan te vullen]. E-mail: [Contact e-mail nog aan te vullen] — Telefoon: [Telefoonnummer nog aan te vullen]<br>Publicatiedirecteur: [Naam publicatiedirecteur nog aan te vullen]"
});
setKey('mentions', 'sec2_title', {
    fr: '2. Hébergement',
    en: '2. Hosting',
    de: '2. Hosting',
    nl: '2. Hosting'
});
setKey('mentions', 'sec2_text', {
    fr: "Ce site est hébergé par [Hébergeur à compléter par le client], [Adresse de l'hébergeur à compléter].",
    en: "This site is hosted by [Hosting provider to be completed by the client], [Hosting address to be completed].",
    de: "Diese Website wird gehostet von [Hosting-Anbieter vom Kunden noch zu ergänzen], [Hosting-Adresse noch zu ergänzen].",
    nl: "Deze site wordt gehost door [Hostingprovider in te vullen door de klant], [Hostingadres nog aan te vullen]."
});
setKey('mentions', 'sec3_title', {
    fr: '3. Propriété intellectuelle',
    en: '3. Intellectual Property',
    de: '3. Geistiges Eigentum',
    nl: '3. Intellectueel eigendom'
});
setKey('mentions', 'sec3_text', {
    fr: "Le contenu de ce site (textes, images, logos) est la propriété exclusive de sotramsbois et est protégé par le droit de la propriété intellectuelle. Toute reproduction est interdite sans autorisation préalable.",
    en: "The content of this site (texts, images, logos) is the exclusive property of sotramsbois and is protected by intellectual property law. Any reproduction is prohibited without prior authorization.",
    de: "Der Inhalt dieser Website (Texte, Bilder, Logos) ist das ausschließliche Eigentum von sotramsbois und durch das Gesetz über geistiges Eigentum geschützt. Jede Vervielfältigung ist ohne vorherige Genehmigung untersagt.",
    nl: "De inhoud van deze site (teksten, afbeeldingen, logo's) is het exclusieve eigendom van sotramsbois en wordt beschermd door het intellectueel eigendomsrecht. Elke reproductie is verboden zonder voorafgaande toestemming."
});
setKey('mentions', 'sec4_title', {
    fr: '4. Données personnelles',
    en: '4. Personal Data',
    de: '4. Persönliche Daten',
    nl: '4. Persoonsgegevens'
});
setKey('mentions', 'sec4_text', {
    fr: "Le traitement de vos données personnelles est décrit dans notre <a href=\"./politique-confidentialite.html\" class=\"text-primary hover:underline\">politique de confidentialité</a>.",
    en: "The processing of your personal data is described in our <a href=\"./politique-confidentialite.html\" class=\"text-primary hover:underline\">privacy policy</a>.",
    de: "Die Verarbeitung Ihrer personenbezogenen Daten ist in unserer <a href=\"./politique-confidentialite.html\" class=\"text-primary hover:underline\">Datenschutzerklärung</a> beschrieben.",
    nl: "De verwerking van uw persoonsgegevens wordt beschreven in ons <a href=\"./politique-confidentialite.html\" class=\"text-primary hover:underline\">privacybeleid</a>."
});

// ==========================================
// 2. POLITIQUE DE CONFIDENTIALITE
// ==========================================
setKey('privacy', 'sec1_title', {
    fr: '1. Collecte des données',
    en: '1. Data Collection',
    de: '1. Datenerfassung',
    nl: '1. Gegevensverzameling'
});
setKey('privacy', 'sec1_text', {
    fr: "Nous collectons les informations nécessaires au traitement de vos commandes et devis professionnels : identité (nom, prénom, fonction, entreprise), coordonnées (email, téléphone, adresse de livraison), et données techniques de navigation (adresse IP, type de navigateur).<br><br>Ce site utilise des cookies techniques nécessaires à son fonctionnement (panier, connexion).",
    en: "We collect the information necessary to process your professional orders and quotes: identity (last name, first name, position, company), contact details (email, phone, delivery address), and technical navigation data (IP address, browser type).<br><br>This site uses technical cookies necessary for its operation (cart, login).",
    de: "Wir erfassen die für die Bearbeitung Ihrer professionellen Bestellungen und Angebote erforderlichen Informationen: Identität (Name, Vorname, Position, Unternehmen), Kontaktdaten (E-Mail, Telefon, Lieferadresse) und technische Navigationsdaten (IP-Adresse, Browsertyp).<br><br>Diese Website verwendet technische Cookies, die für ihren Betrieb (Warenkorb, Anmeldung) erforderlich sind.",
    nl: "Wij verzamelen de nodige informatie voor de verwerking van uw professionele bestellingen en offertes: identiteit (achternaam, voornaam, functie, bedrijf), contactgegevens (e-mail, telefoon, afleveradres) en technische navigatiegegevens (IP-adres, browsertype).<br><br>Deze site maakt gebruik van technische cookies die nodig zijn voor de werking ervan (winkelwagen, login)."
});
setKey('privacy', 'sec2_title', {
    fr: '2. Utilisation des données',
    en: '2. Data Usage',
    de: '2. Datennutzung',
    nl: '2. Gegevensgebruik'
});
setKey('privacy', 'sec2_text', {
    fr: "Vos données servent à traiter vos devis et commandes, et à vous contacter dans le cadre de notre relation commerciale. Aucune communication marketing ne vous sera envoyée sans votre consentement explicite.",
    en: "Your data is used to process your quotes and orders, and to contact you as part of our business relationship. No marketing communication will be sent to you without your explicit consent.",
    de: "Ihre Daten dienen der Bearbeitung Ihrer Angebote und Bestellungen sowie der Kontaktaufnahme im Rahmen unserer Geschäftsbeziehung. Ohne Ihre ausdrückliche Zustimmung werden Ihnen keine Marketingmitteilungen gesendet.",
    nl: "Uw gegevens worden gebruikt om uw offertes en bestellingen te verwerken en om contact met u op te nemen in het kader van onze zakelijke relatie. Zonder uw uitdrukkelijke toestemming worden er geen marketingcommunicaties naar u verzonden."
});
setKey('privacy', 'sec3_title', {
    fr: '3. Conservation et sécurité',
    en: '3. Retention and Security',
    de: '3. Aufbewahrung und Sicherheit',
    nl: '3. Bewaring en beveiliging'
});
setKey('privacy', 'sec3_text', {
    fr: "Vos données sont hébergées sur des serveurs situés dans l'Union Européenne et conservées pour la durée nécessaire à la relation commerciale, conformément au RGPD.",
    en: "Your data is hosted on servers located in the European Union and kept for the duration necessary for the commercial relationship, in accordance with the GDPR.",
    de: "Ihre Daten werden auf Servern in der Europäischen Union gehostet und für die für die Geschäftsbeziehung erforderliche Dauer gemäß der DSGVO aufbewahrt.",
    nl: "Uw gegevens worden gehost op servers in de Europese Unie en bewaard voor de duur die nodig is voor de commerciële relatie, in overeenstemming met de AVG."
});
setKey('privacy', 'sec4_title', {
    fr: '4. Vos droits',
    en: '4. Your Rights',
    de: '4. Ihre Rechte',
    nl: '4. Uw rechten'
});
setKey('privacy', 'sec4_text', {
    fr: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données.",
    en: "In accordance with the GDPR, you have the right to access, rectify, delete and port your data.",
    de: "Gemäß der DSGVO haben Sie das Recht auf Auskunft, Berichtigung, Löschung und Übertragbarkeit Ihrer Daten.",
    nl: "In overeenstemming met de AVG heeft u recht op toegang, rectificatie, verwijdering en overdraagbaarheid van uw gegevens."
});
setKey('privacy', 'sec5_title', {
    fr: '5. Contact',
    en: '5. Contact',
    de: '5. Kontakt',
    nl: '5. Contact'
});
setKey('privacy', 'sec5_text', {
    fr: "Pour exercer ces droits, contactez notre Délégué à la Protection des Données : [Email du DPO à compléter].",
    en: "To exercise these rights, contact our Data Protection Officer: [DPO email to be completed].",
    de: "Um diese Rechte auszuüben, kontaktieren Sie unseren Datenschutzbeauftragten: [E-Mail des Datenschutzbeauftragten noch zu ergänzen].",
    nl: "Om deze rechten uit te oefenen, kunt u contact opnemen met onze Functionaris voor Gegevensbescherming: [E-mail DPO nog aan te vullen]."
});

// ==========================================
// 3. CGV
// ==========================================
setKey('cgv', 'sec1_title', {
    fr: '1. Objet',
    en: '1. Object',
    de: '1. Gegenstand',
    nl: '1. Voorwerp'
});
setKey('cgv', 'sec1_text', {
    fr: "Les présentes Conditions Générales de Vente régissent les ventes de bois de chauffage, granulés, briquettes et combustibles biomasse par sotramsbois à des acheteurs professionnels (B2B).",
    en: "These General Conditions of Sale govern the sales of firewood, pellets, briquettes and biomass fuels by sotramsbois to professional buyers (B2B).",
    de: "Diese Allgemeinen Verkaufsbedingungen regeln den Verkauf von Brennholz, Pellets, Briketts und Biomassebrennstoffen durch sotramsbois an professionelle Käufer (B2B).",
    nl: "Deze Algemene Verkoopvoorwaarden regelen de verkoop van brandhout, pellets, briketten en biomassabrandstoffen door sotramsbois aan professionele kopers (B2B)."
});
setKey('cgv', 'sec2_title', {
    fr: '2. Prix et Commande',
    en: '2. Price and Order',
    de: '2. Preis und Bestellung',
    nl: '2. Prijs en Bestelling'
});
setKey('cgv', 'sec2_text', {
    fr: "Les prix affichés sont en euros, hors taxes (HT). Toute commande implique l'acceptation sans réserve des présentes conditions.",
    en: "The prices displayed are in euros, excluding taxes (HT). Any order implies unconditional acceptance of these conditions.",
    de: "Die angezeigten Preise verstehen sich in Euro ohne Steuern (HT). Jede Bestellung impliziert die vorbehaltlose Annahme dieser Bedingungen.",
    nl: "De weergegeven prijzen zijn in euro's, exclusief belastingen (HT). Elke bestelling impliceert de onvoorwaardelijke acceptatie van deze voorwaarden."
});
setKey('cgv', 'sec3_title', {
    fr: '3. Livraison',
    en: '3. Delivery',
    de: '3. Lieferung',
    nl: '3. Levering'
});
setKey('cgv', 'sec3_text', {
    fr: "Les délais de livraison sont fournis à titre indicatif. La livraison nécessite un accès poids-lourd et, selon les sites, un moyen de déchargement (quai ou chariot élévateur) — voir notre page Livraison pour le détail. sotramsbois ne saurait être tenu responsable des retards liés au transporteur.",
    en: "Delivery times are provided as an indication. Delivery requires HGV access and, depending on the sites, a means of unloading (dock or forklift) — see our Delivery page for details. sotramsbois cannot be held responsible for delays linked to the carrier.",
    de: "Lieferzeiten werden als Richtwert angegeben. Die Lieferung erfordert einen LKW-Zugang und je nach Standort eine Entlademöglichkeit (Rampe oder Gabelstapler) — siehe unsere Lieferseite für Details. sotramsbois kann nicht für Verzögerungen durch den Spediteur verantwortlich gemacht werden.",
    nl: "Levertijden worden ter indicatie verstrekt. Levering vereist toegang voor vrachtwagens en, afhankelijk van de locaties, een losmiddel (dock of heftruck) — zie onze Leveringspagina voor details. sotramsbois kan niet verantwoordelijk worden gehouden voor vertragingen in verband met de vervoerder."
});
setKey('cgv', 'sec4_title', {
    fr: '4. Paiement',
    en: '4. Payment',
    de: '4. Zahlung',
    nl: '4. Betaling'
});
setKey('cgv', 'sec4_text', {
    fr: "Le paiement s'effectue par virement bancaire (SEPA), avant expédition, sauf accord contraire.",
    en: "Payment is made by bank transfer (SEPA), before shipment, unless otherwise agreed.",
    de: "Die Zahlung erfolgt per Banküberweisung (SEPA) vor dem Versand, sofern nicht anders vereinbart.",
    nl: "Betaling vindt plaats via bankoverschrijving (SEPA), voor verzending, tenzij anders overeengekomen."
});
setKey('cgv', 'sec5_title', {
    fr: '5. Absence de droit de rétractation',
    en: '5. No right of withdrawal',
    de: '5. Kein Widerrufsrecht',
    nl: '5. Geen herroepingsrecht'
});
setKey('cgv', 'sec5_text', {
    fr: "Conformément à l'article L221-3 du Code de la consommation, les ventes entre professionnels ne bénéficient pas du droit de rétractation applicable aux consommateurs.",
    en: "In accordance with Article L221-3 of the Consumer Code, sales between professionals do not benefit from the right of withdrawal applicable to consumers.",
    de: "Gemäß Artikel L221-3 des Verbraucherschutzgesetzes unterliegen Verkäufe zwischen Gewerbetreibenden nicht dem für Verbraucher geltenden Widerrufsrecht.",
    nl: "In overeenstemming met artikel L221-3 van de consumentenwet, profiteren verkopen tussen professionals niet van het herroepingsrecht dat van toepassing is op consumenten."
});

// ==========================================
// 4. POLITIQUE RETOUR
// ==========================================
setKey('return', 'sec1_title', {
    fr: '1. Conditions générales de retour',
    en: '1. General Return Conditions',
    de: '1. Allgemeine Rückgabebedingungen',
    nl: '1. Algemene retourvoorwaarden'
});
setKey('return', 'sec1_text', {
    fr: "En raison de la nature volumineuse de nos produits (palettes de bois), les retours sont soumis à des conditions spécifiques : produit non ouvert, dans son emballage d'origine, demande effectuée sous [durée à compléter] jours après livraison.",
    en: "Due to the bulky nature of our products (wood pallets), returns are subject to specific conditions: product unopened, in its original packaging, request made within [duration to be completed] days after delivery.",
    de: "Aufgrund der Sperrigkeit unserer Produkte (Holzpaletten) unterliegen Rücksendungen besonderen Bedingungen: Produkt ungeöffnet, in Originalverpackung, Anfrage innerhalb von [Dauer noch zu ergänzen] Tagen nach Lieferung gestellt.",
    nl: "Vanwege de omvang van onze producten (houtpallets), zijn retourzendingen onderworpen aan specifieke voorwaarden: product ongeopend, in de originele verpakking, verzoek ingediend binnen [duur nog aan te vullen] dagen na levering."
});
setKey('return', 'sec2_title', {
    fr: '2. Logistique et frais de retour',
    en: '2. Logistics and Return Costs',
    de: '2. Logistik und Rücksendekosten',
    nl: '2. Logistiek en retourkosten'
});
setKey('return', 'sec2_text', {
    fr: "Le retour peut s'effectuer par reprise sur site ([montant à compléter]€ TTC / palette) ou par vos propres moyens. Les frais de retour sont à la charge du client, sauf produit non conforme.",
    en: "Return can be made by collection on site ([amount to be completed]€ incl. VAT / pallet) or by your own means. Return costs are the responsibility of the customer, except for non-compliant products.",
    de: "Die Rückgabe kann durch Abholung vor Ort ([Betrag noch zu ergänzen]€ inkl. MwSt. / Palette) oder auf eigene Kosten erfolgen. Die Rücksendekosten gehen zu Lasten des Kunden, außer bei nicht konformen Produkten.",
    nl: "Retourneren kan door ophaling op locatie ([bedrag nog aan te vullen]€ incl. btw / pallet) of op eigen gelegenheid. De retourkosten zijn voor rekening van de klant, behalve bij niet-conforme producten."
});
setKey('return', 'sec3_title', {
    fr: '3. Remboursement',
    en: '3. Refund',
    de: '3. Erstattung',
    nl: '3. Terugbetaling'
});
setKey('return', 'sec3_text', {
    fr: "Le remboursement est effectué après contrôle du produit retourné, sous [délai à compléter] jours ouvrés.",
    en: "The refund is made after inspection of the returned product, within [timeframe to be completed] working days.",
    de: "Die Rückerstattung erfolgt nach Prüfung des zurückgesendeten Produkts innerhalb von [Frist noch zu ergänzen] Werktagen.",
    nl: "De terugbetaling vindt plaats na controle van het geretourneerde product, binnen [termijn nog aan te vullen] werkdagen."
});

// Write back JSON
fs.writeFileSync('data/i18n/fr.json', JSON.stringify(fr, null, 2), 'utf8');
fs.writeFileSync('data/i18n/en.json', JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync('data/i18n/de.json', JSON.stringify(de, null, 2), 'utf8');
fs.writeFileSync('data/i18n/nl.json', JSON.stringify(nl, null, 2), 'utf8');
console.log('JSON updated.');
