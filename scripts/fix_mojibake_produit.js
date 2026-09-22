"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

const LANG_CONFIGS = {
  en: {
    htmlLang: "en",
    textReplacements: [
      ["Catalogue", "Catalogue"],
      ["Bois de chauffage", "Firewood"],
      ["ESSENCE", "SPECIES"],
      ["LONGUEUR", "LENGTH"],
      ["POUVOIR CALORIFIQUE", "CALORIFIC VALUE"],
      ["POIDS PALETTE", "PALLET WEIGHT"],
      ["DIMENSIONS PALETTE", "PALLET DIMENSIONS"],
      ["CONDITIONNEMENT", "PACKAGING"],
      ["Informations Logistiques", "Logistics Information"],
      ["Livraison par camion plateau b\u00e2ch\u00e9 (max 26 palettes/camion). D\u00e9chargement par chariot \u00e9l\u00e9vateur \u00e0 la charge du client. Possibilit\u00e9 d'enl\u00e8vement sur site.", "Delivery by curtainside truck (max 26 pallets/truck). Unloading by forklift, buyer's responsibility. On-site collection also available."],
      ["Prix Conseill\u00e9", "Recommended Price"],
      ["Prix Grossiste", "Wholesale Price"],
      ["Longueur des B\u00fbches", "Log Length"],
      ["Quantit\u00e9 (Palettes)", "Quantity (Pallets)"],
      ["Remise Volume Appliqu\u00e9e", "Volume Discount Applied"],
      ["Sous-total TTC", "Subtotal (incl. VAT)"],
      ["Remise Volume", "Volume Discount"],
      ["Veuillez s\u00e9lectionner un format ci-dessus avant de commander.", "Please select a format above before ordering."],
      ["Remise maximale atteinte !", "Maximum discount reached!"]
    ]
  },
  de: {
    htmlLang: "de",
    textReplacements: [
      ["Catalogue", "Katalog"],
      ["Bois de chauffage", "Brennholz"],
      ["ESSENCE", "HOLZART"],
      ["LONGUEUR", "L\u00c4NGE"],
      ["POUVOIR CALORIFIQUE", "HEIZWERT"],
      ["POIDS PALETTE", "PALETTENGEWICHT"],
      ["DIMENSIONS PALETTE", "PALETTENABMESSUNGEN"],
      ["CONDITIONNEMENT", "VERPACKUNG"],
      ["Informations Logistiques", "Logistikinformationen"],
      ["Livraison par camion plateau b\u00e2ch\u00e9 (max 26 palettes/camion). D\u00e9chargement par chariot \u00e9l\u00e9vateur \u00e0 la charge du client. Possibilit\u00e9 d'enl\u00e8vement sur site.", "Lieferung per Planensattelzug (max. 26 Paletten/LKW). Entladung per Gabelstapler auf Kosten des Kunden. Selbstabholung vor Ort m\u00f6glich."],
      ["Prix Conseill\u00e9", "Empfohlener Preis"],
      ["Prix Grossiste", "Gro\u00dfhandelspreis"],
      ["Longueur des B\u00fbches", "Scheitl\u00e4nge"],
      ["Quantit\u00e9 (Palettes)", "Menge (Paletten)"],
      ["Remise Volume Appliqu\u00e9e", "Angewandter Mengenrabatt"],
      ["Sous-total TTC", "Zwischensumme (inkl. MwSt)"],
      ["Remise Volume", "Mengenrabatt"],
      ["Veuillez s\u00e9lectionner un format ci-dessus avant de commander.", "Bitte w\u00e4hlen Sie oben ein Format aus, bevor Sie bestellen."],
      ["Remise maximale atteinte !", "Maximaler Rabatt erreicht!"]
    ]
  },
  nl: {
    htmlLang: "nl",
    textReplacements: [
      ["Catalogue", "Catalogus"],
      ["Bois de chauffage", "Brandhout"],
      ["ESSENCE", "HOUTSOORT"],
      ["LONGUEUR", "LENGTE"],
      ["POUVOIR CALORIFIQUE", "CALORISCHE WAARDE"],
      ["POIDS PALETTE", "PALLETGEWICHT"],
      ["DIMENSIONS PALETTE", "PALLETAFMETINGEN"],
      ["CONDITIONNEMENT", "VERPAKKING"],
      ["Informations Logistiques", "Logistieke informatie"],
      ["Livraison par camion plateau b\u00e2ch\u00e9 (max 26 palettes/camion). D\u00e9chargement par chariot \u00e9l\u00e9vateur \u00e0 la charge du client. Possibilit\u00e9 d'enl\u00e8vement sur site.", "Levering per huifopleggercombinatie (max. 26 pallets/vrachtwagen). Lossen met vorkheftruck, voor rekening van de klant. Ophalen ter plaatse ook mogelijk."],
      ["Prix Conseill\u00e9", "Aanbevolen prijs"],
      ["Prix Grossiste", "Groothandelsprijs"],
      ["Longueur des B\u00fbches", "Houtlengte"],
      ["Quantit\u00e9 (Palettes)", "Aantal (Pallets)"],
      ["Remise Volume Appliqu\u00e9e", "Toegepaste volumekorting"],
      ["Sous-total TTC", "Subtotaal (incl. btw)"],
      ["Remise Volume", "Volumekorting"],
      ["Veuillez s\u00e9lectionner un format ci-dessus avant de commander.", "Selecteer hierboven een formaat voordat u bestelt."],
      ["Remise maximale atteinte !", "Maximale korting bereikt!"]
    ]
  }
};

// Read the CLEAN French source (0 mojibake confirmed)
const frSource = fs.readFileSync(path.join(ROOT, "produit.html"), "utf8");

for (const [lang, cfg] of Object.entries(LANG_CONFIGS)) {
  let html = frSource;

  // 1. Fix html lang attribute
  html = html.split('lang="fr"').join('lang="' + cfg.htmlLang + '"');

  // 2. Fix relative URLs for subdirectory context
  html = html.split('href="./').join('href="../');
  html = html.split('src="./').join('src="../');
  // Fix assets that already had ../ (shouldn't double up)
  html = html.split('href="../../').join('href="../');
  html = html.split('src="../../').join('src="../');
  // Self-link for this lang's produit.html
  html = html.split('href="../' + lang + '/produit.html"').join('href="produit.html"');

  // 3. Apply text translations (sort by length desc to avoid substring collision)
  cfg.textReplacements.sort((a, b) => b[0].length - a[0].length);
  for (const [fr, target] of cfg.textReplacements) {
    if (fr !== target) {
      html = html.split(fr).join(target);
    }
  }

  // 4. Write with explicit UTF-8
  const outPath = path.join(ROOT, lang, "produit.html");
  fs.writeFileSync(outPath, html, { encoding: "utf8" });

  // Verify: count replacement chars in bytes
  const buf = fs.readFileSync(outPath);
  let mojibake = 0;
  for (let i = 0; i < buf.length - 2; i++) {
    if (buf[i] === 0xEF && buf[i+1] === 0xBF && buf[i+2] === 0xBD) mojibake++;
  }
  console.log("[" + lang + "] produit.html written. Mojibake: " + mojibake + ". Bytes: " + buf.length);
}

console.log("Done.");
