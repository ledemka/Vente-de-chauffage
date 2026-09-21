"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

const data = {
    "mentions-legales": [
        ["Mentions L\u00e9gales", "mentions.page_title", "Legal Notice", "Impressum", "Wettelijke vermeldingen"],
        ["Derni\u00e8re mise \u00e0 jour", "mentions.last_updated", "Last updated", "Letzte Aktualisierung", "Laatst bijgewerkt"],
        ["1. Informations \u00c9diteur", "mentions.sec1", "1. Publisher Information", "1. Anbieterinformationen", "1. Uitgeversinformatie"],
        ["2. H\u00e9bergement", "mentions.sec2", "2. Hosting", "2. Hosting", "2. Hosting"],
        ["3. Propri\u00e9t\u00e9 Intellectuelle", "mentions.sec3", "3. Intellectual Property", "3. Geistiges Eigentum", "3. Intellectueel eigendom"],
        ["4. Donn\u00e9es Personnelles", "mentions.sec4", "4. Personal Data", "4. Personenbezogene Daten", "4. Persoonsgegevens"],
        ["5. Gestion des Cookies", "mentions.sec5", "5. Cookie Management", "5. Cookie-Verwaltung", "5. Cookiebeheer"],
        ["6. Limitation de Responsabilit\u00e9", "mentions.sec6", "6. Limitation of Liability", "6. Haftungsbeschr\u00e4nkung", "6. Aansprakelijkheidsbeperking"],
        ["Informations \u00c9diteur", "mentions.pub_info", "Publisher Information", "Anbieterinformationen", "Uitgeversinformatie"],
        ["RAISON SOCIALE", "mentions.company_name", "COMPANY NAME", "FIRMENNAME", "BEDRIJFSNAAM"],
        ["CAPITAL SOCIAL", "mentions.share_capital", "SHARE CAPITAL", "STAMMKAPITAL", "MAATSCHAPPELIJK KAPITAAL"],
        ["SI\u00c8GE SOCIAL", "mentions.registered_office", "REGISTERED OFFICE", "SITZ DES UNTERNEHMENS", "MAATSCHAPPELIJKE ZETEL"],
        ["TVA INTRACOMMUNAUTAIRE", "mentions.vat_number", "INTRA-EU VAT NUMBER", "EU-UMSATZSTEUER-ID", "INTRACOMMUNAUTAIR BTW-NUMMER"],
        ["DIRECTEUR DE LA PUBLICATION", "mentions.pub_director", "PUBLICATION DIRECTOR", "VERANTWORTLICHER F\u00dcR DEN INHALT", "DIRECTEUR VAN DE PUBLICATIE"],
        ["CONTACT", "mentions.contact", "CONTACT", "KONTAKT", "CONTACT"],
        ["H\u00e9bergement", "mentions.hosting", "Hosting", "Hosting", "Hosting"],
        ["Propri\u00e9t\u00e9 Intellectuelle", "mentions.ip", "Intellectual Property", "Geistiges Eigentum", "Intellectueel eigendom"],
        ["Marques et Logos", "mentions.trademarks", "Trademarks and Logos", "Marken und Logos", "Merken en logo's"],
        ["Donn\u00e9es Personnelles & RGPD", "mentions.data_gdpr", "Personal Data & GDPR", "Personenbezogene Daten & DSGVO", "Persoonsgegevens & AVG"],
        ["Finalit\u00e9 des donn\u00e9es", "mentions.data_purpose", "Purpose of data processing", "Zweck der Datenverarbeitung", "Doel van de gegevensverwerking"],
        ["Dur\u00e9e de conservation", "mentions.data_retention", "Retention period", "Speicherdauer", "Bewaartermijn"],
        ["Vos droits", "mentions.your_rights", "Your rights", "Ihre Rechte", "Uw rechten"],
        ["Droit d'acc\u00e8s et de rectification de vos donn\u00e9es.", "mentions.right_access", "Right of access and rectification of your data.", "Recht auf Auskunft und Berichtigung Ihrer Daten.", "Recht op inzage en rectificatie van uw gegevens."],
        ["Droit \u00e0 l'effacement (\u00ab droit \u00e0 l'oubli \u00bb) et \u00e0 la limitation du traitement.", "mentions.right_erasure", "Right to erasure (\"right to be forgotten\") and to restriction of processing.", "Recht auf L\u00f6schung (\u201eRecht auf Vergessenwerden\") und auf Einschr\u00e4nkung der Verarbeitung.", "Recht op wissing (\"recht om vergeten te worden\") en op beperking van de verwerking."],
        ["Droit \u00e0 la portabilit\u00e9 de vos donn\u00e9es.", "mentions.right_portability", "Right to portability of your data.", "Recht auf Daten\u00fcbertragbarkeit.", "Recht op overdraagbaarheid van uw gegevens."],
        ["Droit d'opposition au traitement de vos donn\u00e9es pour des motifs l\u00e9gitimes.", "mentions.right_object", "Right to object to the processing of your data on legitimate grounds.", "Recht auf Widerspruch gegen die Verarbeitung Ihrer Daten aus berechtigten Gr\u00fcnden.", "Recht van bezwaar tegen de verwerking van uw gegevens om gegronde redenen."]
    ],
    "politique-confidentialite": [
        ["Protection des donn\u00e9es", "privacy.data_protection", "Data Protection", "Datenschutz", "Gegevensbescherming"],
        ["Politique de Confidentialit\u00e9", "privacy.page_title", "Privacy Policy", "Datenschutzerkl\u00e4rung", "Privacybeleid"],
        ["DERNI\u00c8RE MISE \u00c0 JOUR", "privacy.last_updated", "LAST UPDATED", "LETZTE AKTUALISIERUNG", "LAATST BIJGEWERKT"],
        ["CONFORMIT\u00c9", "privacy.compliance", "COMPLIANCE", "KONFORMIT\u00c4T", "CONFORMITEIT"],
        ["RGPD / EU 2016/679", "privacy.gdpr", "GDPR / EU 2016/679", "DSGVO / EU 2016/679", "AVG / EU 2016/679"],
        ["Sommaire", "privacy.toc", "Table of Contents", "Inhaltsverzeichnis", "Inhoudsopgave"],
        ["1. Collecte des donn\u00e9es", "privacy.sec1", "1. Data Collection", "1. Datenerhebung", "1. Gegevensverzameling"],
        ["2. Utilisation des donn\u00e9es", "privacy.sec2", "2. Use of Data", "2. Datennutzung", "2. Gebruik van gegevens"],
        ["3. Gestion des Cookies", "privacy.sec3", "3. Cookie Management", "3. Cookie-Verwaltung", "3. Cookiebeheer"],
        ["4. Vos droits (RGPD)", "privacy.sec4", "4. Your Rights (GDPR)", "4. Ihre Rechte (DSGVO)", "4. Uw rechten (AVG)"],
        ["Une question ?", "privacy.question", "A question?", "Eine Frage?", "Een vraag?"],
        ["Notre D\u00e9l\u00e9gu\u00e9 \u00e0 la Protection des Donn\u00e9es est \u00e0 votre disposition.", "privacy.dpo", "Our Data Protection Officer is available to assist you.", "Unser Datenschutzbeauftragter steht Ihnen zur Verf\u00fcgung.", "Onze Functionaris voor Gegevensbescherming staat tot uw beschikking."],
        ["Collecte des donn\u00e9es", "privacy.collection", "Data Collection", "Datenerhebung", "Gegevensverzameling"],
        ["Donn\u00e9es professionnelles", "privacy.business_data", "Business Data", "Gesch\u00e4ftsdaten", "Zakelijke gegevens"],
        ["Donn\u00e9es de navigation", "privacy.browsing_data", "Browsing Data", "Navigationsdaten", "Navigatiegegevens"],
        ["Utilisation des donn\u00e9es", "privacy.use_data", "Use of Data", "Datennutzung", "Gebruik van gegevens"],
        ["Ex\u00e9cution du contrat", "privacy.contract", "Contract Performance", "Vertragserf\u00fcllung", "Uitvoering van de overeenkomst"],
        ["Consentement", "privacy.consent", "Consent", "Einwilligung", "Toestemming"],
        ["Int\u00e9r\u00eat l\u00e9gitime", "privacy.legitimate", "Legitimate Interest", "Berechtigtes Interesse", "Gerechtvaardigd belang"],
        ["Gestion des Cookies", "privacy.cookies", "Cookie Management", "Cookie-Verwaltung", "Cookiebeheer"],
        ["Strictement n\u00e9cessaires", "privacy.necessary", "Strictly Necessary", "Unbedingt erforderlich", "Strikt noodzakelijk"],
        ["Toujours actifs", "privacy.active", "Always Active", "Immer aktiv", "Altijd actief"],
        ["Performance & Analytique", "privacy.performance", "Performance & Analytics", "Leistung & Analyse", "Prestaties & Analyse"],
        ["Ciblage & Publicit\u00e9", "privacy.targeting", "Targeting & Advertising", "Targeting & Werbung", "Targeting & Reclame"],
        ["Vos droits (RGPD)", "privacy.rights", "Your Rights (GDPR)", "Ihre Rechte (DSGVO)", "Uw rechten (AVG)"],
        ["Droit d'acc\u00e8s", "privacy.right_access", "Right of Access", "Auskunftsrecht", "Recht op inzage"],
        ["Obtenir la confirmation que vos donn\u00e9es sont trait\u00e9es et en recevoir une copie.", "privacy.right_access_desc", "Obtain confirmation that your data is being processed and receive a copy of it.", "Best\u00e4tigung erhalten, dass Ihre Daten verarbeitet werden, und eine Kopie davon erhalten.", "Bevestiging krijgen dat uw gegevens worden verwerkt en er een kopie van ontvangen."],
        ["Droit de rectification", "privacy.right_rectification", "Right of Rectification", "Recht auf Berichtigung", "Recht op rectificatie"],
        ["Demander la correction d'informations inexactes ou incompl\u00e8tes.", "privacy.right_rectification_desc", "Request the correction of inaccurate or incomplete information.", "Die Berichtigung unrichtiger oder unvollst\u00e4ndiger Informationen beantragen.", "De correctie van onjuiste of onvolledige informatie aanvragen."],
        ["Droit \u00e0 l'effacement", "privacy.right_erasure", "Right to Erasure", "Recht auf L\u00f6schung", "Recht op wissing"],
        ["Exiger la suppression de vos donn\u00e9es (\"droit \u00e0 l'oubli\") dans les limites l\u00e9gales.", "privacy.right_erasure_desc", "Require the deletion of your data (\"right to be forgotten\") within legal limits.", "Die L\u00f6schung Ihrer Daten verlangen (\u201eRecht auf Vergessenwerden\") innerhalb der gesetzlichen Grenzen.", "De verwijdering van uw gegevens eisen (\"recht om vergeten te worden\") binnen de wettelijke grenzen."],
        ["Droit \u00e0 la portabilit\u00e9", "privacy.right_portability", "Right to Portability", "Recht auf Daten\u00fcbertragbarkeit", "Recht op overdraagbaarheid"],
        ["Recevoir vos donn\u00e9es dans un format structur\u00e9 et lisible par machine.", "privacy.right_portability_desc", "Receive your data in a structured, machine-readable format.", "Ihre Daten in einem strukturierten, maschinenlesbaren Format erhalten.", "Uw gegevens ontvangen in een gestructureerd, machineleesbaar formaat."],
        ["Exercer vos droits", "privacy.exercise", "Exercise your rights", "Ihre Rechte aus\u00fcben", "Uw rechten uitoefenen"]
    ],
    "politique-retour": [
        ["L\u00e9gal", "return.legal", "Legal", "Recht", "Juridisch"],
        ["Derni\u00e8re mise \u00e0 jour: 15 Octobre 2023", "return.last_updated", "Last updated: October 15, 2023", "Letzte Aktualisierung: 15. Oktober 2023", "Laatst bijgewerkt: 15 oktober 2023"],
        ["Version: 2.1", "return.version", "Version: 2.1", "Version: 2.1", "Versie: 2.1"],
        ["Sommaire", "return.toc", "Table of Contents", "Inhaltsverzeichnis", "Inhoudsopgave"],
        ["Besoin d'assistance ?", "return.assistance", "Need assistance?", "Ben\u00f6tigen Sie Hilfe?", "Hulp nodig?"],
        ["Conditions G\u00e9n\u00e9rales de Retour", "return.general_cond", "General Return Conditions", "Allgemeine R\u00fcckgabebedingungen", "Algemene Retourvoorwaarden"],
        ["Les produits doivent \u00eatre dans leur emballage d'origine, non ouverts et non endommag\u00e9s (film de palette intact, sacs de granul\u00e9s scell\u00e9s).", "return.cond1", "Products must be in their original packaging, unopened and undamaged (pallet wrap intact, pellet bags sealed).", "Die Produkte m\u00fcssen sich in der Originalverpackung befinden, unge\u00f6ffnet und unbesch\u00e4digt sein (Palettenfolie intakt, Pellets\u00e4cke versiegelt).", "Producten moeten zich in de originele verpakking bevinden, ongeopend en onbeschadigd (palletfolie intact, pelletzakken verzegeld)."],
        ["Le bois ne doit pas avoir \u00e9t\u00e9 expos\u00e9 aux intemp\u00e9ries ou stock\u00e9 dans des conditions inad\u00e9quates modifiant son taux d'humidit\u00e9 initial.", "return.cond2", "The wood must not have been exposed to weather conditions or stored under inadequate conditions altering its initial moisture content.", "Das Holz darf keiner Witterung ausgesetzt oder unter unangemessenen Bedingungen gelagert worden sein, die seinen urspr\u00fcnglichen Feuchtigkeitsgehalt ver\u00e4ndern.", "Het hout mag niet zijn blootgesteld aan weersomstandigheden of zijn opgeslagen onder ongeschikte omstandigheden die het oorspronkelijke vochtgehalte wijzigen."],
        ["Le lot retourn\u00e9 doit correspondre exactement aux num\u00e9ros de lot mentionn\u00e9s sur le bon de livraison.", "return.cond3", "The returned batch must exactly match the batch numbers stated on the delivery note.", "Die zur\u00fcckgesendete Charge muss genau den auf dem Lieferschein angegebenen Chargennummern entsprechen.", "De geretourneerde partij moet exact overeenkomen met de partijnummers vermeld op de leveringsbon."],
        ["Logistique & Transport Inverse", "return.logistics", "Logistics & Reverse Transport", "Logistik & R\u00fccktransport", "Logistiek & Retourtransport"],
        ["Reprise sur site", "return.onsite", "On-site Collection", "Abholung vor Ort", "Ophaling ter plaatse"],
        ["Forfait Reprise Palette", "return.pallet_fee", "Pallet Collection Fee", "Pauschale Palettenabholung", "Vast tarief pallet-ophaling"],
        ["(soit 150.00\u20ac HT)", "return.pallet_price", "(i.e. \u20ac150.00 excl. VAT)", "(d. h. 150,00\u20ac netto)", "(d.w.z. \u20ac150,00 excl. btw)"],
        ["Retour autonome", "return.self_return", "Self-return", "Eigenst\u00e4ndige R\u00fccksendung", "Zelf retourneren"],
        ["Frais de Manutention Quai", "return.dock_fee", "Dock Handling Fee", "Umschlaggeb\u00fchr Rampe", "Kosten laadperronbehandeling"],
        ["(soit 35.00\u20ac HT)", "return.dock_price", "(i.e. \u20ac35.00 excl. VAT)", "(d. h. 35,00\u20ac netto)", "(d.w.z. \u20ac35,00 excl. btw)"],
        ["Processus de Remboursement", "return.refund", "Refund Process", "Erstattungsverfahren", "Terugbetalingsproces"],
        ["1. R\u00e9ception & Inspection", "return.step1", "1. Receipt & Inspection", "1. Eingang & Pr\u00fcfung", "1. Ontvangst & Inspectie"],
        ["2. Validation du dossier", "return.step2", "2. File Validation", "2. Pr\u00fcfung des Vorgangs", "2. Dossiervalidatie"],
        ["3. \u00c9mission du paiement", "return.step3", "3. Payment Issuance", "3. Zahlungsausf\u00fchrung", "3. Uitbetaling"]
    ]
};

function addAttr(html, text, key) {
    const idx = html.indexOf(text);
    if (idx === -1) {
        // console.log("Missing text: ", text.substring(0, 30));
        return html;
    }
    if (html.slice(Math.max(0, idx - 200), idx).includes("data-i18n=\"" + key + "\"")) return html;
    let openTag = idx - 1;
    while (openTag >= 0 && html[openTag] !== "<") openTag--;
    if (openTag < 0) return html;
    let closeTag = openTag + 1;
    while (closeTag < html.length && html[closeTag] !== ">") closeTag++;
    if (closeTag >= html.length) return html;
    return html.slice(0, closeTag) + " data-i18n=\"" + key + "\"" + html.slice(closeTag);
}

function processFile(html, entries, langIdx) {
    // 1. Add data-i18n attrs
    for (const row of entries) {
        html = addAttr(html, row[0], row[1]);
    }
    // 2. Replace FR text with target lang text
    if (langIdx > 0) {
        for (const row of entries) {
            const target = row[langIdx + 1]; // en=2, de=3, nl=4
            if (target && target !== row[0]) {
                html = html.split(row[0]).join(target);
            }
        }
    }
    return html;
}

// 1. Verify Lang Attributes
function checkLang(html, filepath) {
    const langMatch = html.match(/<html[^>]*lang="([^"]+)"/);
    if (langMatch) {
        console.log(`[LANG] ${filepath} -> ${langMatch[1]}`);
    } else {
        console.warn(`[LANG WARNING] Missing lang in ${filepath}`);
    }
}

const langs = ["en", "de", "nl"];

for (const [page, entries] of Object.entries(data)) {
    // Sort entries by length of FR string descending to avoid substring collision
    entries.sort((a, b) => b[0].length - a[0].length);

    // Process FR
    const frPath = path.join(ROOT, page + ".html");
    let frHtml = fs.readFileSync(frPath, "utf8");
    checkLang(frHtml, frPath);
    frHtml = processFile(frHtml, entries, 0);
    fs.writeFileSync(frPath, frHtml, "utf8");
    console.log("[OK] " + page + ".html (FR)");

    // Process EN DE NL
    for (let i = 0; i < langs.length; i++) {
        const fp = path.join(ROOT, langs[i], page + ".html");
        if (!fs.existsSync(fp)) { console.warn("[WARN] Missing: " + fp); continue; }
        let html = fs.readFileSync(fp, "utf8");
        checkLang(html, fp);
        html = processFile(html, entries, i + 1);
        fs.writeFileSync(fp, html, "utf8");
        console.log("[OK] " + langs[i] + "/" + page + ".html");
    }
}

// Update i18n JSON
const i18nDir = path.join(ROOT, "data", "i18n");
const allLangs = ["fr", "en", "de", "nl"];
for (let li = 0; li < allLangs.length; li++) {
    const jsonPath = path.join(i18nDir, allLangs[li] + ".json");
    let json = {};
    if (fs.existsSync(jsonPath)) {
        json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    }
    for (const [page, entries] of Object.entries(data)) {
        const prefix = page === "mentions-legales" ? "mentions" : (page === "politique-confidentialite" ? "privacy" : "return");
        if (!json[prefix]) json[prefix] = {};
        for (const row of entries) {
            const shortKey = row[1].replace(prefix + ".", "");
            json[prefix][shortKey] = li === 0 ? row[0] : row[li + 1];
        }
    }
    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 4), "utf8");
    console.log("[OK] data/i18n/" + allLangs[li] + ".json updated");
}

console.log("\nLot 3b complete.");
