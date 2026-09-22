"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

// Exact 5 fixes: [old_html_snippet, new_html_snippet, translated_text_per_lang]
// We operate on ALL 4 cgv.html variants (root=FR, en, de, nl) + dist-production copies

const LANGS = [
  { dir: "",            lang: "fr" },
  { dir: "en",         lang: "en" },
  { dir: "de",         lang: "de" },
  { dir: "nl",         lang: "nl" },
];

// Translations for text content in EN/DE/NL (from the i18n JSON)
const translations = {
  art1_title: {
    fr: "Article 1 - Objet et Champ d'Application",
    en: "Article 1 - Purpose and Scope",
    de: "Artikel 1 - Gegenstand und Anwendungsbereich",
    nl: "Artikel 1 - Doel en toepassingsgebied",
  },
  art1_info: {
    fr: "sotramsbois se r\u00e9serve le droit de d\u00e9roger \u00e0 certaines clauses des pr\u00e9sentes CGV, en fonction des n\u00e9gociations men\u00e9es avec l'acheteur, par l'\u00e9tablissement de Conditions Particuli\u00e8res de Vente.",
    en: "sotramsbois reserves the right to depart from certain clauses of these GTC, based on negotiations held with the buyer, through the establishment of Special Conditions of Sale.",
    de: "sotramsbois beh\u00e4lt sich das Recht vor, je nach den mit dem K\u00e4ufer gef\u00fchrten Verhandlungen durch besondere Verkaufsbedingungen von bestimmten Klauseln dieser AGB abzuweichen.",
    nl: "sotramsbois behoudt zich het recht voor om, afhankelijk van de onderhandelingen met de koper, van bepaalde bepalingen van deze voorwaarden af te wijken door middel van bijzondere verkoopvoorwaarden.",
  },
  art2_p2: {
    fr: "Les photographies d'illustration du catalogue n'ont qu'une valeur indicative et ne constituent pas un document contractuel. Le bois \u00e9tant un mat\u00e9riau naturel, des variations d'aspect, de couleur ou de fente sont normales et n'affectent en rien le pouvoir calorifique certifi\u00e9.",
    en: "Catalogue illustration photographs are for indicative purposes only and do not constitute a contractual document. As wood is a natural material, variations in appearance, colour or grain are normal and do not affect the certified calorific value in any way.",
    de: "Die Abbildungen im Katalog haben nur informativen Charakter und stellen kein vertragliches Dokument dar. Da Holz ein nat\u00fcrliches Material ist, sind Variationen in Aussehen, Farbe oder Maserung normal und beeintr\u00e4chtigen den zertifizierten Heizwert in keiner Weise.",
    nl: "De illustratiefoto's in de catalogus zijn uitsluitend indicatief en vormen geen contractueel document. Aangezien hout een natuurlijk materiaal is, zijn variaties in uiterlijk, kleur of nerf normaal en doen op geen enkele manier afbreuk aan de gecertificeerde calorische waarde.",
  },
  art4_p1: {
    fr: "Compte tenu de la nature pond\u00e9reuse des produits, la logistique ob\u00e9it \u00e0 des r\u00e8gles strictes pour garantir la s\u00e9curit\u00e9 et le respect des d\u00e9lais. Les d\u00e9lais de livraison sont donn\u00e9s \u00e0 titre indicatif et un retard ne saurait justifier l'annulation de la commande ou des p\u00e9nalit\u00e9s.",
    en: "Given the heavy nature of the products, logistics follow strict rules to guarantee safety and compliance with deadlines. Delivery times are given as an indication and a delay cannot justify the cancellation of the order or penalties.",
    de: "Aufgrund der schweren Beschaffenheit der Produkte unterliegt die Logistik strengen Regeln, um Sicherheit und Termintreue zu gew\u00e4hrleisten. Lieferzeiten sind unverbindlich; eine Verz\u00f6gerung rechtfertigt weder die Stornierung der Bestellung noch Vertragsstrafen.",
    nl: "Gezien de zware aard van de producten volgt de logistiek strikte regels om de veiligheid en de naleving van de deadlines te garanderen. Levertijden zijn indicatief; vertraging rechtvaardigt noch annulering van de bestelling noch boetes.",
  },
  access_desc: {
    fr: "L'acheteur doit garantir l'accessibilit\u00e9 du site de livraison aux v\u00e9hicules lourds (jusqu'\u00e0 44 tonnes). En cas d'impossibilit\u00e9 de livraison due \u00e0 un d\u00e9faut d'acc\u00e8s non signal\u00e9, les frais de souffrance et de retour seront int\u00e9gralement factur\u00e9s \u00e0 l'acheteur.",
    en: "The buyer must guarantee that the delivery site is accessible to heavy vehicles (up to 44 tonnes). Should delivery prove impossible due to an unreported access issue, demurrage and return costs will be charged in full to the buyer.",
    de: "Der K\u00e4ufer muss die Zufahrt des Lieferorts f\u00fcr Schwerfahrzeuge (bis zu 44 Tonnen) gew\u00e4hrleisten. Ist eine Lieferung aufgrund einer nicht gemeldeten Zufahrtsbeschr\u00e4nkung nicht m\u00f6glich, werden Standgeld und R\u00fcckfahrtkosten vollst\u00e4ndig dem K\u00e4ufer in Rechnung gestellt.",
    nl: "De koper moet de toegankelijkheid van de leveringslocatie voor zware voertuigen (tot 44 ton) garanderen. Indien levering onmogelijk blijkt door een niet-gemelde toegangsbeperking, worden wachttijd- en retourkosten volledig aan de koper doorberekend.",
  },
};

// For each lang, apply the 5 fixes
function fix(langObj) {
  const fp = path.join(ROOT, langObj.dir, "cgv.html");
  if (!fs.existsSync(fp)) { console.warn("[SKIP] " + fp); return; }
  let html = fs.readFileSync(fp, "utf8");
  const l = langObj.lang;

  // 1. h2 Article 1 — add data-i18n="cgv.art1_title" and translate text
  const oldH2 = '<h2 class="font-headline-lg text-headline-lg text-on-surface">' + translations.art1_title.fr + "</h2>";
  const newH2 = '<h2 class="font-headline-lg text-headline-lg text-on-surface" data-i18n="cgv.art1_title">' + translations.art1_title[l] + "</h2>";
  if (html.includes(oldH2)) {
    html = html.split(oldH2).join(newH2);
    console.log("[" + l + "] Fixed art1_title h2");
  } else {
    // Maybe already has translated text but still no data-i18n
    const translatedH2 = '<h2 class="font-headline-lg text-headline-lg text-on-surface">' + translations.art1_title[l] + "</h2>";
    const translatedNewH2 = '<h2 class="font-headline-lg text-headline-lg text-on-surface" data-i18n="cgv.art1_title">' + translations.art1_title[l] + "</h2>";
    if (html.includes(translatedH2)) {
      html = html.split(translatedH2).join(translatedNewH2);
      console.log("[" + l + "] Fixed art1_title h2 (already translated)");
    } else {
      console.warn("[" + l + "] art1_title h2 not found");
    }
  }

  // 2. <p> art1_info (inside the info box) — add data-i18n and translate
  const oldP1info = '<p class="font-body-sm text-body-sm text-on-surface">' + translations.art1_info.fr + "</p>";
  const newP1info = '<p class="font-body-sm text-body-sm text-on-surface" data-i18n="cgv.art1_info">' + translations.art1_info[l] + "</p>";
  if (html.includes(oldP1info)) {
    html = html.split(oldP1info).join(newP1info);
    console.log("[" + l + "] Fixed art1_info");
  } else {
    const translatedOld = '<p class="font-body-sm text-body-sm text-on-surface">' + translations.art1_info[l] + "</p>";
    const translatedNew = '<p class="font-body-sm text-body-sm text-on-surface" data-i18n="cgv.art1_info">' + translations.art1_info[l] + "</p>";
    if (html.includes(translatedOld)) {
      html = html.split(translatedOld).join(translatedNew);
      console.log("[" + l + "] Fixed art1_info (already translated)");
    } else {
      console.warn("[" + l + "] art1_info not found");
    }
  }

  // 3. <p class="mt-4"> art2_p2
  const oldP2p2 = '<p class="mt-4">' + translations.art2_p2.fr + "</p>";
  const newP2p2 = '<p class="mt-4" data-i18n="cgv.art2_p2">' + translations.art2_p2[l] + "</p>";
  if (html.includes(oldP2p2)) {
    html = html.split(oldP2p2).join(newP2p2);
    console.log("[" + l + "] Fixed art2_p2");
  } else {
    const translatedOld = '<p class="mt-4">' + translations.art2_p2[l] + "</p>";
    const translatedNew = '<p class="mt-4" data-i18n="cgv.art2_p2">' + translations.art2_p2[l] + "</p>";
    if (html.includes(translatedOld)) {
      html = html.split(translatedOld).join(translatedNew);
      console.log("[" + l + "] Fixed art2_p2 (already translated)");
    } else {
      console.warn("[" + l + "] art2_p2 not found");
    }
  }

  // 4. <p> art4_p1
  const oldP4p1 = "<p>" + translations.art4_p1.fr + "</p>";
  const newP4p1 = '<p data-i18n="cgv.art4_p1">' + translations.art4_p1[l] + "</p>";
  if (html.includes(oldP4p1)) {
    html = html.split(oldP4p1).join(newP4p1);
    console.log("[" + l + "] Fixed art4_p1");
  } else {
    const translatedOld = "<p>" + translations.art4_p1[l] + "</p>";
    const translatedNew = '<p data-i18n="cgv.art4_p1">' + translations.art4_p1[l] + "</p>";
    if (html.includes(translatedOld)) {
      html = html.split(translatedOld).join(translatedNew);
      console.log("[" + l + "] Fixed art4_p1 (already translated)");
    } else {
      console.warn("[" + l + "] art4_p1 not found");
    }
  }

  // 5. <p class="font-body-sm text-body-sm"> access_desc
  const oldAccess = '<p class="font-body-sm text-body-sm">' + translations.access_desc.fr + "</p>";
  const newAccess = '<p class="font-body-sm text-body-sm" data-i18n="cgv.access_desc">' + translations.access_desc[l] + "</p>";
  if (html.includes(oldAccess)) {
    html = html.split(oldAccess).join(newAccess);
    console.log("[" + l + "] Fixed access_desc");
  } else {
    const translatedOld = '<p class="font-body-sm text-body-sm">' + translations.access_desc[l] + "</p>";
    const translatedNew = '<p class="font-body-sm text-body-sm" data-i18n="cgv.access_desc">' + translations.access_desc[l] + "</p>";
    if (html.includes(translatedOld)) {
      html = html.split(translatedOld).join(translatedNew);
      console.log("[" + l + "] Fixed access_desc (already translated)");
    } else {
      console.warn("[" + l + "] access_desc not found");
    }
  }

  fs.writeFileSync(fp, html, "utf8");
}

// Fix all 4 lang versions
for (const langObj of LANGS) {
  fix(langObj);
}

console.log("\nAll done.");
