"use strict";
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

// Update products.json
const productsFile = path.join(ROOT, 'data', 'products.json');
let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

const speciesMap = {
  "hetre-etuve": { fr: "Hêtre séché au four (< 20% humidité)", en: "Kiln-dried beech (< 20% moisture)", de: "Ofengetrocknete Buche (< 20% Feuchtigkeit)", nl: "Ovengedroogd beukenhout (< 20% vocht)" },
  "hetre-demi-sec": { fr: "Hêtre demi-sec", en: "Semi-dried beech", de: "Halbtrockene Buche", nl: "Halfdroog beukenhout" },
  "chene-etuve": { fr: "Chêne séché au four (< 20% humidité)", en: "Kiln-dried oak (< 20% moisture)", de: "Ofengetrocknete Eiche (< 20% Feuchtigkeit)", nl: "Ovengedroogd eikenhout (< 20% vocht)" },
  "chene-sec-air": { fr: "Chêne séché à l'air libre", en: "Air-dried oak", de: "Lufttrocken gelagerte Eiche", nl: "Luchtgedroogd eikenhout" },
  "melange-essences": { fr: "Mélange d'essences feuillues dures", en: "Blend of hardwood species", de: "Mischung aus Harthölzern", nl: "Mix van hardhoutsoorten" },
  "jour-premium-cylindrique": { fr: "Bois densifié résineux & feuillus", en: "Compressed softwood & hardwood", de: "Verdichtetes Nadel- und Laubholz", nl: "Geperst naald- en loofhout" },
  "nuit-longue-duree": { fr: "Écorces bois densifiées", en: "Compressed wood bark", de: "Verdichtete Holzrinde", nl: "Geperste houtschors" },
  "jour-forte-chaleur-cubique": { fr: "100% Bois dur compressé", en: "100% compressed hardwood", de: "100% verdichtetes Hartholz", nl: "100% geperst hardhout" },
  "pini-kay-compressbee": { fr: "Bois chêne/hêtre extrudé Pini-Kay", en: "Extruded oak/beech Pini-Kay wood", de: "Extrudiertes Eichen-/Buchenholz Pini-Kay", nl: "Geëxtrudeerd eiken-/beukenhout Pini-Kay" },
  "jour-eco-cylindrique": { fr: "Mélange copeaux & sciures compressés", en: "Compressed wood shavings & sawdust blend", de: "Mischung aus verdichteten Holzspänen und Sägemehl", nl: "Mix van geperste houtkrullen en zaagsel" },
  "briquettes-ruf": { fr: "Bois compressé haute pression RUF", en: "High-pressure compressed RUF wood", de: "Hochdruck-verdichtetes RUF-Holz", nl: "Hogedruk geperst RUF-hout" },
  "briquettes-ecorce": { fr: "100% Écorces naturelles compressées", en: "100% compressed natural bark", de: "100% verdichtete Naturrinde", nl: "100% geperste natuurlijke schors" },
  "granules-pellets-premium": { fr: "100% Résineux dépoussiéré", en: "100% dedusted softwood", de: "100% entstaubtes Nadelholz", nl: "100% ontstoft naaldhout" },
  "charbon-bois-morceaux": { fr: "Charbon de bois dépoussiéré", en: "Dedusted lump charcoal", de: "Entstaubte Holzkohle", nl: "Ontstofte houtskool" },
  "allume-feu-laine-bois": { fr: "Fibre de bois & cire végétale", en: "Wood fibre & plant wax", de: "Holzfaser & Pflanzenwachs", nl: "Houtvezel & plantaardige was" },
  "buches-torche-suedoise": { fr: "Bois naturel résineux", en: "Natural softwood", de: "Naturbelassenes Nadelholz", nl: "Natuurlijk naaldhout" }
};

const positioningMap = {
  "Bon prix – sous marché": { fr: "Bon prix – sous marché", en: "Great value – below market", de: "Guter Preis – unter Marktniveau", nl: "Goede prijs – onder marktniveau" },
  "Très bon prix": { fr: "Très bon prix", en: "Excellent value", de: "Sehr guter Preis", nl: "Zeer goede prijs" },
  "Bon prix": { fr: "Bon prix", en: "Good value", de: "Guter Preis", nl: "Goede prijs" }
};

let productsUpdated = 0;
for (let p of products) {
  if (speciesMap[p.id]) {
    p.species_material = speciesMap[p.id];
  }
  
  // positioning could be a string if not updated yet
  let currentPos = typeof p.positioning === 'string' ? p.positioning : p.positioning?.fr;
  if (currentPos && positioningMap[currentPos]) {
    p.positioning = positioningMap[currentPos];
  }
  productsUpdated++;
}

fs.writeFileSync(productsFile, JSON.stringify(products, null, 2) + '\n', 'utf8');
console.log(`[JSON] Updated ${productsUpdated} products.`);

const LANGS = [
  { dir: "",            lang: "fr" },
  { dir: "en",         lang: "en" },
  { dir: "de",         lang: "de" },
  { dir: "nl",         lang: "nl" },
];

function injectHelper(html) {
  if (html.includes('window.getProductField')) return html;
  
  const helperCode = `
                        if (typeof window.getProductField === 'undefined') {
                            window.getProductField = (p, field, forceLang) => {
                                if (!p || !p[field]) return '';
                                const l = forceLang || document.documentElement.lang || 'fr';
                                if (typeof p[field] === 'string') return p[field];
                                return p[field][l] || p[field]['fr'] || '';
                            };
                        }`;
  
  // Inject right after getProductName definition
  if (html.includes("window.getProductName = (p) => {")) {
      // Find the end of getProductName block
      const parts = html.split("window.getProductName = (p) => {");
      const part1 = parts[0] + "window.getProductName = (p) => {";
      const part2 = parts[1];
      // simplistic injection: insert after the closing brace of getProductName
      // It's safer to just inject it in the script block
  }
  
  // Actually, let's just replace the definition of getProductName to include both
  const target = `if (typeof window.getProductName === 'undefined') {`;
  if (html.includes(target)) {
      html = html.split(target).join(helperCode + "\n                        " + target);
  }
  return html;
}

function processHTML(fp, lang) {
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  
  // Inject helper
  html = injectHelper(html);
  
  // Replace p.species_material with getProductField(p, 'species_material')
  html = html.replace(/\$\{p\.species_material\}/g, `\${getProductField(p, 'species_material')}`);
  // Replace p.positioning with getProductField(p, 'positioning')
  html = html.replace(/\$\{p\.positioning\}/g, `\${getProductField(p, 'positioning')}`);
  
  // In produit.html, there's `product.species_material` sometimes used (e.g. document.getElementById)
  html = html.replace(/product\.species_material/g, `getProductField(product, 'species_material')`);
  
  fs.writeFileSync(fp, html, 'utf8');
  console.log(`[HTML] Updated ${fp}`);
}

for (const l of LANGS) {
  const catPath = path.join(ROOT, l.dir, 'catalogue.html');
  const prodPath = path.join(ROOT, l.dir, 'produit.html');
  processHTML(catPath, l.lang);
  processHTML(prodPath, l.lang);
}
