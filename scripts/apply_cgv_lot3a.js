"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

const entries = [
    ["Juridique &amp; Conformit\u00e9","cgv.legal_label","Legal &amp; Compliance","Recht &amp; Compliance","Juridisch &amp; Compliance"],
    ["Conditions G\u00e9n\u00e9rales de Vente","cgv.page_title","General Terms and Conditions of Sale","Allgemeine Gesch\u00e4ftsbedingungen","Algemene Verkoopvoorwaarden"],
    ["Sommaire","cgv.toc_title","Table of Contents","Inhaltsverzeichnis","Inhoudsopgave"],
    ["Service B2B","cgv.b2b_title","B2B Service","B2B-Service","B2B-service"],
    ["Pour toute question concernant nos conditions de vente en gros, contactez votre charg\u00e9 de compte.","cgv.b2b_desc","For any questions regarding our wholesale terms of sale, please contact your account manager.","Bei Fragen zu unseren Gro\u00dfhandelsbedingungen wenden Sie sich bitte an Ihren Kundenbetreuer.","Voor vragen over onze groothandelsvoorwaarden kunt u contact opnemen met uw accountmanager."],
    ["Article 1 - Objet et Champ d\u2019Application","cgv.art1_title","Article 1 - Purpose and Scope","Artikel 1 - Gegenstand und Anwendungsbereich","Artikel 1 - Doel en toepassingsgebied"],
    ["Les pr\u00e9sentes Conditions G\u00e9n\u00e9rales de Vente (CGV) constituent le socle de la n\u00e9gociation commerciale et sont syst\u00e9matiquement adress\u00e9es ou remises \u00e0 chaque acheteur pour lui permettre de passer commande.","cgv.art1_p1","These General Terms and Conditions of Sale (\u201cGTC\u201d) form the basis of the commercial negotiation and are systematically provided to each buyer to enable them to place an order.","Diese Allgemeinen Gesch\u00e4ftsbedingungen (AGB) bilden die Grundlage der Gesch\u00e4ftsverhandlung und werden jedem K\u00e4ufer systematisch zur Bestellung \u00fcbermittelt.","Deze Algemene Verkoopvoorwaarden vormen de basis van de commerci\u00eble onderhandeling en worden systematisch aan elke koper verstrekt om een bestelling te kunnen plaatsen."],
    ["sotramsbois se r\u00e9serve le droit de d\u00e9roger \u00e0 certaines clauses des pr\u00e9sentes CGV, en fonction des n\u00e9gociations men\u00e9es avec l\u2019acheteur, par l\u2019\u00e9tablissement de Conditions Particuli\u00e8res de Vente.","cgv.art1_info","sotramsbois reserves the right to depart from certain clauses of these GTC, based on negotiations held with the buyer, through the establishment of Special Conditions of Sale.","sotramsbois beh\u00e4lt sich das Recht vor, je nach den mit dem K\u00e4ufer gef\u00fchrten Verhandlungen durch besondere Verkaufsbedingungen von bestimmten Klauseln dieser AGB abzuweichen.","sotramsbois behoudt zich het recht voor om, afhankelijk van de onderhandelingen met de koper, van bepaalde bepalingen van deze voorwaarden af te wijken door middel van bijzondere verkoopvoorwaarden."],
    ["Article 2 - Caract\u00e9ristiques des Produits","cgv.art2_title","Article 2 - Product Characteristics","Artikel 2 - Produkteigenschaften","Artikel 2 - Producteigenschappen"],
    ["Les produits propos\u00e9s \u00e0 la vente sont ceux figurant sur le catalogue B2B de sotramsbois au jour de la consultation. Les caract\u00e9ristiques thermiques et dimensionnelles sont garanties dans les limites des tol\u00e9rances industrielles.","cgv.art2_p1","The products offered for sale are those listed in sotramsbois\u2019s B2B catalogue at the time of consultation. Thermal and dimensional characteristics are guaranteed within standard industrial tolerances.","Die zum Verkauf angebotenen Produkte sind die im B2B-Katalog von sotramsbois zum Zeitpunkt der Einsichtnahme aufgef\u00fchrten. Die thermischen und dimensionalen Eigenschaften werden innerhalb der industrie\u00fcblichen Toleranzen garantiert.","De te koop aangeboden producten zijn die welke op het moment van raadpleging in de B2B-catalogus van sotramsbois staan vermeld. De thermische en dimensionale eigenschappen worden gegarandeerd binnen de gebruikelijke industri\u00eble toleranties."],
    ["TAUX D\u2019HUMIDIT\u00c9 GARANTI","cgv.moisture_label","GUARANTEED MOISTURE CONTENT","GARANTIERTER FEUCHTIGKEITSGEHALT","GEGARANDEERD VOCHTGEHALTE"],
    ["ESSENCES","cgv.species_label","WOOD SPECIES","HOLZARTEN","HOUTSOORTEN"],
    ["Ch\u00eane, H\u00eatre, Charme (Bois Dur 100%)","cgv.species_value","Oak, Beech, Hornbeam (100% Hardwood)","Eiche, Buche, Hainbuche (100% Hartholz)","Eik, Beuk, Haagbeuk (100% hardhout)"],
    ["Les photographies d\u2019illustration du catalogue n\u2019ont qu\u2019une valeur indicative et ne constituent pas un document contractuel. Le bois \u00e9tant un mat\u00e9riau naturel, des variations d\u2019aspect, de couleur ou de fente sont normales et n\u2019affectent en rien le pouvoir calorifique certifi\u00e9.","cgv.art2_p2","Catalogue photographs are for illustrative purposes only and do not constitute a contractual document. As wood is a natural material, variations in appearance, colour or splitting are normal and do not affect the certified calorific value in any way.","Die Abbildungen im Katalog dienen nur zur Veranschaulichung und stellen kein Vertragsdokument dar. Da Holz ein Naturmaterial ist, sind Abweichungen in Aussehen, Farbe oder Ri\u00dfbildung normal und beeintr\u00e4chtigen den zertifizierten Heizwert in keiner Weise.","De illustratieve foto\u2019s in de catalogus zijn louter indicatief en vormen geen contractueel document. Aangezien hout een natuurlijk materiaal is, zijn variaties in uiterlijk, kleur of scheurvorming normaal en hebben deze geen enkele invloed op de gecertificeerde calorische waarde."],
    ["Article 3 - Prix et Commande","cgv.art3_title","Article 3 - Price and Order","Artikel 3 - Preise und Bestellung","Artikel 3 - Prijzen en bestelling"],
    ["Les prix sont stipul\u00e9s Hors Taxes (HT) et hors frais de livraison (D\u00e9part Entrep\u00f4t ou FCA), sauf accord sp\u00e9cifique (DAP). La TVA applicable est celle en vigueur au jour de la commande.","cgv.art3_p1","Prices are stated exclusive of tax (net) and exclusive of delivery costs (Ex Works or FCA), unless otherwise specifically agreed (DAP). The applicable VAT is that in force on the day of the order.","Die Preise verstehen sich netto (ohne Steuern) und ohne Lieferkosten (ab Lager oder FCA), sofern nichts anderes ausdr\u00fccklich vereinbart wurde (DAP). Es gilt die am Bestelltag g\u00fcltige Mehrwertsteuer.","De prijzen zijn exclusief belastingen en exclusief leveringskosten (af fabriek of FCA), tenzij anders specifiek overeengekomen (DAP). De toepasselijke btw is die welke geldt op de dag van bestelling."],
    ["Article 4 - Logistique et Livraison","cgv.art4_title","Article 4 - Logistics and Delivery","Artikel 4 - Logistik und Lieferung","Artikel 4 - Logistiek en levering"],
    ["Compte tenu de la nature pond\u00e9reuse des produits, la logistique ob\u00e9it \u00e0 des r\u00e8gles strictes pour garantir la s\u00e9curit\u00e9 et le respect des d\u00e9lais. Les d\u00e9lais de livraison sont donn\u00e9s \u00e0 titre indicatif et un retard ne saurait justifier l\u2019annulation de la commande ou des p\u00e9nalit\u00e9s.","cgv.art4_p1","Given the heavy nature of the products, logistics are subject to strict rules to ensure safety and adherence to schedules. Delivery times are provided for guidance only, and a delay shall not justify order cancellation or penalties.","Aufgrund der Schwere der Produkte unterliegt die Logistik strengen Regeln zur Gew\u00e4hrleistung von Sicherheit und Termintreue. Die Lieferzeiten sind unverbindlich, und eine Verz\u00f6gerung berechtigt weder zur Stornierung der Bestellung noch zu Vertragsstrafen.","Gezien de zware aard van de producten is de logistiek onderworpen aan strikte regels om de veiligheid en het naleven van de termijnen te waarborgen. De levertermijnen zijn indicatief en een vertraging rechtvaardigt geen annulering van de bestelling of boetes."],
    ["1. CONDITIONNEMENT","cgv.pack_label","1. PACKAGING","1. VERPACKUNG","1. VERPAKKING"],
    ["Palettes film\u00e9es anti-UV","cgv.pack_value","UV-protected shrink-wrapped pallets","UV-gesch\u00fctzte, folierte Paletten","UV-beschermde omwikkelde pallets"],
    ["2. EXP\u00c9DITION","cgv.ship_label","2. SHIPPING","2. VERSAND","2. VERZENDING"],
    ["Camion 19T ou Semi-remorque","cgv.ship_value","19T truck or semi-trailer","19-t-LKW oder Sattelzug","19T-vrachtwagen of oplegger"],
    ["3. D\u00c9CHARGEMENT","cgv.unload_label","3. UNLOADING","3. ENTLADUNG","3. LOSSEN"],
    ["Chariot embarqu\u00e9 requis","cgv.unload_value","On-board forklift required","Bordstapler erforderlich","Boordheftruck vereist"],
    ["CONDITIONS D\u2019ACC\u00c8S OBLIGATOIRES","cgv.access_title","MANDATORY ACCESS CONDITIONS","VERPFLICHTENDE ZUFAHRTSBEDINGUNGEN","VERPLICHTE TOEGANGSVOORWAARDEN"],
    ["L\u2019acheteur doit garantir l\u2019accessibilit\u00e9 du site de livraison aux v\u00e9hicules lourds (jusqu\u2019\u00e0 44 tonnes). En cas d\u2019impossibilit\u00e9 de livraison due \u00e0 un d\u00e9faut d\u2019acc\u00e8s non signal\u00e9, les frais de souffrance et de retour seront int\u00e9gralement factur\u00e9s \u00e0 l\u2019acheteur.","cgv.access_desc","The buyer must guarantee that the delivery site is accessible to heavy vehicles (up to 44 tonnes). Should delivery prove impossible due to an unreported access issue, demurrage and return costs will be charged in full to the buyer.","Der K\u00e4ufer muss die Zufahrt des Lieferorts f\u00fcr Schwerfahrzeuge (bis zu 44 Tonnen) gew\u00e4hrleisten. Ist eine Lieferung aufgrund einer nicht gemeldeten Zufahrtsbeschr\u00e4nkung nicht m\u00f6glich, werden Standgeld und R\u00fcckfahrtkosten vollst\u00e4ndig dem K\u00e4ufer in Rechnung gestellt.","De koper moet de toegankelijkheid van de leveringslocatie voor zware voertuigen (tot 44 ton) garanderen. Indien levering onmogelijk blijkt door een niet-gemelde toegangsbeperking, worden wachttijd- en retourkosten volledig aan de koper doorberekend."],
    ["Article 5 - Modalit\u00e9s de Paiement","cgv.art5_title","Article 5 - Payment Terms","Artikel 5 - Zahlungsbedingungen","Artikel 5 - Betalingsvoorwaarden"],
    ["Sauf accord sp\u00e9cifique consign\u00e9 dans les conditions particuli\u00e8res, le r\u00e8glement s\u2019effectue dans les conditions suivantes :","cgv.art5_p1","Unless otherwise specifically agreed in the special conditions, payment shall be made under the following terms:","Sofern in den besonderen Bedingungen nichts anderes vereinbart wurde, erfolgt die Zahlung zu folgenden Bedingungen:","Tenzij anders specifiek overeengekomen in de bijzondere voorwaarden, vindt de betaling plaats onder de volgende voorwaarden:"],
    ["Article 6 - Absence de Droit de R\u00e9tractation","cgv.art6_title","Article 6 - No Right of Withdrawal","Artikel 6 - Kein Widerrufsrecht","Artikel 6 - Geen herroepingsrecht"],
    ["Conform\u00e9ment aux dispositions du Code de la consommation, le droit de r\u00e9tractation n\u2019est pas applicable aux contrats conclus entre professionnels (B2B) agissant dans le cadre de leur activit\u00e9 commerciale, industrielle, artisanale ou lib\u00e9rale.","cgv.art6_p1","In accordance with the provisions of the French Consumer Code, the right of withdrawal does not apply to contracts concluded between businesses (B2B) acting within the scope of their commercial, industrial, craft or professional activity.","Gem\u00e4\u00df den Bestimmungen des franz\u00f6sischen Verbraucherschutzgesetzes (Code de la consommation) gilt das Widerrufsrecht nicht f\u00fcr Vertr\u00e4ge zwischen Unternehmen (B2B), die im Rahmen ihrer gewerblichen, industriellen, handwerklichen oder freiberuflichen T\u00e4tigkeit handeln.","Overeenkomstig de bepalingen van de Franse Consumentenwet is het herroepingsrecht niet van toepassing op overeenkomsten tussen ondernemingen (B2B) die handelen in het kader van hun commerci\u00eble, industri\u00eble, ambachtelijke of vrije beroepsactiviteit."],
    ["Les produits livr\u00e9s et conformes au bon de livraison ne sont ni repris ni \u00e9chang\u00e9s. En cas de non-conformit\u00e9 av\u00e9r\u00e9e lors de la livraison (vices apparents), l\u2019acheteur doit \u00e9mettre des r\u00e9serves claires et pr\u00e9cises sur le bordereau de transport et les confirmer par lettre recommand\u00e9e avec AR au transporteur dans les 3 jours ouvrables suivant la r\u00e9ception, avec copie \u00e0 sotramsbois.","cgv.art6_p2","Products delivered in conformity with the delivery note are neither returnable nor exchangeable. In the event of proven non-conformity upon delivery (apparent defects), the buyer must record clear and precise reservations on the transport document and confirm them by registered letter with acknowledgement of receipt to the carrier within 3 business days of receipt, with a copy to sotramsbois.","Gelieferte Produkte, die dem Lieferschein entsprechen, werden weder zur\u00fcckgenommen noch umgetauscht. Bei nachweislicher Nichtkonformit\u00e4t bei Lieferung (offensichtliche M\u00e4ngel) muss der K\u00e4ufer klare und pr\u00e4zise Vorbehalte auf dem Frachtdokument vermerken und diese innerhalb von 3 Werktagen nach Erhalt per Einschreiben mit R\u00fcckschein an den Frachtf\u00fchrer best\u00e4tigen, mit Kopie an sotramsbois.","Geleverde producten die conform de leveringsbon zijn, worden niet teruggenomen of geruild. Bij bewezen non-conformiteit bij levering (zichtbare gebreken) moet de koper duidelijke en nauwkeurige voorbehouden vermelden op het vervoersdocument en deze binnen 3 werkdagen na ontvangst per aangetekende brief met ontvangstbevestiging aan de vervoerder bevestigen, met kopie aan sotramsbois."],
];

// Also add plain apostrophe variants (text uses curly quotes or straight depends on file)
// Handle both Unicode curly and straight apostrophes robustly
function addAttr(html, text, key) {
    const idx = html.indexOf(text);
    if (idx === -1) return html;
    if (html.slice(Math.max(0, idx - 200), idx).includes("data-i18n=\"" + key + "\"")) return html;
    let openTag = idx - 1;
    while (openTag >= 0 && html[openTag] !== "<") openTag--;
    if (openTag < 0) return html;
    let closeTag = openTag + 1;
    while (closeTag < html.length && html[closeTag] !== ">") closeTag++;
    if (closeTag >= html.length) return html;
    return html.slice(0, closeTag) + " data-i18n=\"" + key + "\"" + html.slice(closeTag);
}

function processFile(html, langIdx) {
    // Add data-i18n attrs
    for (const row of entries) {
        html = addAttr(html, row[0], row[1]);
    }
    // Replace FR text with target lang text
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

// Process FR
const frPath = path.join(ROOT, "cgv.html");
let frHtml = fs.readFileSync(frPath, "utf8");
frHtml = processFile(frHtml, 0);
fs.writeFileSync(frPath, frHtml, "utf8");
console.log("[OK] cgv.html (FR)");

// Process EN DE NL
const langs = ["en", "de", "nl"];
for (let i = 0; i < langs.length; i++) {
    const fp = path.join(ROOT, langs[i], "cgv.html");
    if (!fs.existsSync(fp)) { console.warn("[WARN] Missing: " + fp); continue; }
    let html = fs.readFileSync(fp, "utf8");
    html = processFile(html, i + 1);
    fs.writeFileSync(fp, html, "utf8");
    console.log("[OK] " + langs[i] + "/cgv.html");
}

// Update i18n JSON
const i18nDir = path.join(ROOT, "data", "i18n");
const allLangs = ["fr", "en", "de", "nl"];
for (let li = 0; li < allLangs.length; li++) {
    const jsonPath = path.join(i18nDir, allLangs[li] + ".json");
    const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    if (!json.cgv) json.cgv = {};
    for (const row of entries) {
        const shortKey = row[1].replace("cgv.", "");
        json.cgv[shortKey] = li === 0 ? row[0] : row[li + 1];
    }
    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 4), "utf8");
    console.log("[OK] data/i18n/" + allLangs[li] + ".json");
}

console.log("\nLot 3a complete.");
