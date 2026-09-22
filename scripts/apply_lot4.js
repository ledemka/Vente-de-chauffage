"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

const translations = {
    produit: [
        ["Catalogue", "product.catalog", "Catalogue", "Katalog", "Catalogus"],
        ["Bois de chauffage", "product.firewood", "Firewood", "Brennholz", "Brandhout"],
        ["ESSENCE", "product.species", "SPECIES", "HOLZART", "HOUTSOORT"],
        ["LONGUEUR", "product.length", "LENGTH", "L\u00c4NGE", "LENGTE"],
        ["POUVOIR CALORIFIQUE", "product.calorific", "CALORIFIC VALUE", "HEIZWERT", "CALORISCHE WAARDE"],
        ["POIDS PALETTE", "product.pallet_weight", "PALLET WEIGHT", "PALETTENGEWICHT", "PALLETGEWICHT"],
        ["VOLUME", "product.volume", "VOLUME", "VOLUMEN", "VOLUME"],
        ["DIMENSIONS PALETTE", "product.pallet_dimensions", "PALLET DIMENSIONS", "PALETTENABMESSUNGEN", "PALLETAFMETINGEN"],
        ["CONDITIONNEMENT", "product.packaging", "PACKAGING", "VERPACKUNG", "VERPAKKING"],
        ["Informations Logistiques", "product.logistics_info", "Logistics Information", "Logistikinformationen", "Logistieke informatie"],
        ["Livraison par camion plateau b\u00e2ch\u00e9 (max 26 palettes/camion). D\u00e9chargement par chariot \u00e9l\u00e9vateur \u00e0 la charge du client. Possibilit\u00e9 d'enl\u00e8vement sur site.", "product.delivery_desc", "Delivery by curtainside truck (max 26 pallets/truck). Unloading by forklift, buyer's responsibility. On-site collection also available.", "Lieferung per Planensattelzug (max. 26 Paletten/LKW). Entladung per Gabelstapler auf Kosten des Kunden. Selbstabholung vor Ort m\u00f6glich.", "Levering per huifopleggercombinatie (max. 26 pallets/vrachtwagen). Lossen met vorkheftruck, voor rekening van de klant. Ophalen ter plaatse ook mogelijk."],
        ["Prix Conseill\u00e9", "product.recommended_price", "Recommended Price", "Empfohlener Preis", "Aanbevolen prijs"],
        ["Prix Grossiste", "product.wholesale_price", "Wholesale Price", "Gro\u00dfhandelspreis", "Groothandelsprijs"],
        ["Longueur des B\u00fbches", "product.log_length", "Log Length", "Scheitl\u00e4nge", "Houtlengte"],
        ["Quantit\u00e9 (Palettes)", "product.quantity_pallets", "Quantity (Pallets)", "Menge (Paletten)", "Aantal (Pallets)"],
        ["Remise Volume Appliqu\u00e9e", "product.discount_applied", "Volume Discount Applied", "Angewandter Mengenrabatt", "Toegepaste volumekorting"],
        ["Sous-total TTC", "product.subtotal", "Subtotal (incl. VAT)", "Zwischensumme (inkl. MwSt)", "Subtotaal (incl. btw)"],
        ["Remise Volume", "product.discount", "Volume Discount", "Mengenrabatt", "Volumekorting"],
        ["Total", "product.total", "Total", "Gesamt", "Totaal"],
        ["Veuillez s\u00e9lectionner un format ci-dessus avant de commander.", "product.select_format", "Please select a format above before ordering.", "Bitte w\u00e4hlen Sie oben ein Format aus, bevor Sie bestellen.", "Selecteer hierboven een formaat voordat u bestelt."],
        ["Remise maximale atteinte !", "product.max_discount", "Maximum discount reached!", "Maximaler Rabatt erreicht!", "Maximale korting bereikt!"]
    ],
    panier: [
        ["ESPACE COMMANDE", "cart.order_area", "ORDER AREA", "BESTELLBEREICH", "BESTELGEBIED"],
        ["Articles s\u00e9lectionn\u00e9s (0)", "cart.selected_items", "Selected items (0)", "Ausgew\u00e4hlte Artikel (0)", "Geselecteerde artikelen (0)"]
    ],
    "recapitulatif-commande": [
        ["Veuillez effectuer une demande de devis sur mesure.", "checkout.custom_quote", "Please submit a custom quote request.", "Bitte stellen Sie eine individuelle Angebotsanfrage.", "Dien een offerteaanvraag op maat in."],
        ["Faire une demande de devis", "checkout.request_quote", "Request a Quote", "Angebot anfordern", "Offerte aanvragen"],
        ["conditions g\u00e9n\u00e9rales de vente", "checkout.cgv", "terms and conditions of sale", "Allgemeinen Gesch\u00e4ftsbedingungen", "algemene verkoopvoorwaarden"],
        ["Virement Bancaire (SEPA)", "checkout.bank_transfer", "Bank Transfer (SEPA)", "Bank\u00fcberweisung (SEPA)", "Bankoverschrijving (SEPA)"],
        ["Frais de livraison", "checkout.delivery_fee", "Delivery Fee", "Lieferkosten", "Verzendkosten"],
        ["\u00c0 calculer", "checkout.to_be_calculated", "To be calculated", "Wird berechnet", "Te berekenen"]
    ],
    "confirmation-commande": [
        ["En attente de virement", "confirm.awaiting_transfer", "Awaiting bank transfer", "\u00dcberweisung ausstehend", "In afwachting van overschrijving"],
        ["Rappel Virement", "confirm.transfer_reminder", "Bank Transfer Reminder", "Erinnerung \u00dcberweisung", "Herinnering overschrijving"],
        ["Veuillez effectuer votre virement sur le compte suivant :", "confirm.transfer_instruction", "Please make your bank transfer to the following account:", "Bitte \u00fcberweisen Sie auf folgendes Konto:", "Gelieve uw overschrijving te doen naar de volgende rekening:"],
        ["B\u00e9n\u00e9ficiaire :", "confirm.beneficiary", "Beneficiary:", "Empf\u00e4nger:", "Begunstigde:"],
        ["Banque :", "confirm.bank", "Bank:", "Bank:", "Bank:"],
        ["IBAN :", "confirm.iban", "IBAN:", "IBAN:", "IBAN:"],
        ["BIC :", "confirm.bic", "BIC:", "BIC:", "BIC:"],
        ["R\u00e9f\u00e9rence :", "confirm.reference", "Reference:", "Referenz:", "Referentie:"],
        ["Votre num\u00e9ro de commande", "confirm.order_number", "Your order number", "Ihre Bestellnummer", "Uw bestelnummer"],
        ["Votre commande sera valid\u00e9e et exp\u00e9di\u00e9e d\u00e8s r\u00e9ception de votre virement.", "confirm.order_shipped", "Your order will be confirmed and shipped upon receipt of your bank transfer.", "Ihre Bestellung wird nach Zahlungseingang best\u00e4tigt und versendet.", "Uw bestelling wordt bevestigd en verzonden zodra uw overschrijving is ontvangen."]
    ],
    activation: [
        ["Activation en cours...", "activation.activating", "Activating your account...", "Konto wird aktiviert...", "Account wordt geactiveerd..."],
        ["Veuillez patienter pendant que nous v\u00e9rifions votre compte.", "activation.wait", "Please wait while we verify your account.", "Bitte warten Sie, w\u00e4hrend wir Ihr Konto \u00fcberpr\u00fcfen.", "Even geduld terwijl we uw account verifi\u00ebren."],
        ["Compte activ\u00e9 !", "activation.success", "Account activated!", "Konto aktiviert!", "Account geactiveerd!"],
        ["Votre compte a \u00e9t\u00e9 activ\u00e9 avec succ\u00e8s.", "activation.success_desc", "Your account has been successfully activated.", "Ihr Konto wurde erfolgreich aktiviert.", "Uw account is succesvol geactiveerd."],
        ["Lien invalide ou expir\u00e9", "activation.invalid", "Invalid or expired link", "Ung\u00fcltiger oder abgelaufener Link", "Ongeldige of verlopen link"],
        ["Ce lien d'activation n'est plus valide.", "activation.invalid_desc", "This activation link is no longer valid.", "Dieser Aktivierungslink ist nicht mehr g\u00fcltig.", "Deze activatielink is niet meer geldig."]
    ],
    "tableau-de-bord": [
        ["Chargement...", "dashboard.loading", "Loading...", "Wird geladen...", "Laden..."]
    ],
    "admin-commandes": [
        ["Chargement...", "dashboard.loading", "Loading...", "Wird geladen...", "Laden..."]
    ]
};

const reusedKeys = [
    ["Espace Professionnel B2B", "login.benefits.title"],
    ["Livraison Palette", "login.benefits.delivery_title"],
    ["Suivi logistique pr\u00e9cis sur toute la France.", "login.benefits.delivery_desc"],
    ["Facturation Pro", "login.benefits.invoice_title"],
    ["Gestion centralis\u00e9e et bons de livraison d\u00e9mat\u00e9rialis\u00e9s.", "login.benefits.invoice_desc"],
    ["Se connecter", "login.form.submit"]
];

function addAttr(html, text, key) {
    let idx = 0;
    while (true) {
        idx = html.indexOf(text, idx);
        if (idx === -1) break;
        const before = html.slice(Math.max(0, idx - 200), idx);
        if (before.includes("data-i18n=\"" + key + "\"")) {
            idx += text.length;
            continue;
        }
        let openTag = idx - 1;
        while (openTag >= 0 && html[openTag] !== "<") openTag--;
        if (openTag >= 0) {
            let closeTag = openTag + 1;
            while (closeTag < html.length && html[closeTag] !== ">") closeTag++;
            if (closeTag < html.length) {
                const tagContent = html.slice(openTag, closeTag);
                if (!tagContent.includes("data-i18n=")) {
                    html = html.slice(0, closeTag) + " data-i18n=\"" + key + "\"" + html.slice(closeTag);
                    idx += (" data-i18n=\"" + key + "\"").length;
                }
            }
        }
        idx += text.length;
    }
    return html;
}

function processFile(page, entries, langIdx) {
    const lDir = langIdx === 0 ? "" : ["en", "de", "nl"][langIdx - 1];
    const fp = path.join(ROOT, lDir, page + ".html");
    if (!fs.existsSync(fp)) {
        console.warn(`[WARNING] File not found: ${fp}`);
        return;
    }
    
    let html = fs.readFileSync(fp, "utf8");
    
    entries.sort((a, b) => b[0].length - a[0].length);
    
    const langMatch = html.match(/<html[^>]*lang="([^"]+)"/);
    if (langMatch) {
        console.log(`[LANG] ${fp} -> ${langMatch[1]}`);
    } else {
        console.warn(`[LANG WARNING] Missing lang in ${fp}`);
    }

    for (const row of entries) {
        html = addAttr(html, row[0], row[1]);
    }
    
    if (langIdx > 0) {
        for (const row of entries) {
            const target = row[langIdx + 1];
            if (target && target !== row[0]) {
                html = html.split(row[0]).join(target);
            }
        }
    }
    
    if (page === "activation") {
        const langName = langIdx === 0 ? "fr" : lDir;
        const jsonPath = path.join(ROOT, "data", "i18n", langName + ".json");
        let dict = {};
        if (fs.existsSync(jsonPath)) {
            dict = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
        }
        
        for (const [frText, keyPath] of reusedKeys) {
            html = addAttr(html, frText, keyPath);
            if (langIdx > 0) {
                let target = null;
                if (keyPath === "login.benefits.title") target = dict.login?.benefits?.title;
                else if (keyPath === "login.benefits.delivery_title") target = dict.login?.benefits?.delivery_title;
                else if (keyPath === "login.benefits.delivery_desc") target = dict.login?.benefits?.delivery_desc;
                else if (keyPath === "login.benefits.invoice_title") target = dict.login?.benefits?.invoice_title;
                else if (keyPath === "login.benefits.invoice_desc") target = dict.login?.benefits?.invoice_desc;
                else if (keyPath === "login.form.submit") target = dict.login?.form?.submit;
                
                if (target && target !== frText) {
                    html = html.split(frText).join(target);
                }
            }
        }
    }
    
    fs.writeFileSync(fp, html, "utf8");
    console.log(`[OK] ${lDir || "fr"}/${page}.html`);
}

for (const [page, entries] of Object.entries(translations)) {
    for (let i = 0; i < 4; i++) {
        processFile(page, entries, i);
    }
}

const i18nDir = path.join(ROOT, "data", "i18n");
const allLangs = ["fr", "en", "de", "nl"];
for (let li = 0; li < allLangs.length; li++) {
    const jsonPath = path.join(i18nDir, allLangs[li] + ".json");
    let json = {};
    if (fs.existsSync(jsonPath)) {
        json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    }
    
    for (const [page, entries] of Object.entries(translations)) {
        let prefix = page.replace(".html", "");
        if (prefix === "recapitulatif-commande") prefix = "checkout";
        else if (prefix === "confirmation-commande") prefix = "confirm";
        
        if (!json[prefix]) json[prefix] = {};
        for (const row of entries) {
            const shortKey = row[1].replace(prefix + ".", "");
            if (row[1].startsWith(prefix + ".")) {
                json[prefix][shortKey] = li === 0 ? row[0] : row[li + 1];
            } else {
                const parts = row[1].split(".");
                const rootKey = parts[0];
                const subKey = parts[1];
                if (!json[rootKey]) json[rootKey] = {};
                json[rootKey][subKey] = li === 0 ? row[0] : row[li + 1];
            }
        }
    }
    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 4), "utf8");
    console.log(`[OK] data/i18n/${allLangs[li]}.json updated`);
}

console.log("Lot 4 complete.");
