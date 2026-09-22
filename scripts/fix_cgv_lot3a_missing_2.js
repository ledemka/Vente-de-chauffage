"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

const LANGS = [
  { dir: "",            lang: "fr" },
  { dir: "en",         lang: "en" },
  { dir: "de",         lang: "de" },
  { dir: "nl",         lang: "nl" },
];

const translations = {
  art5_p1: {
    fr: "Sauf accord sp\u00e9cifique consign\u00e9 dans les conditions particuli\u00e8res, le r\u00e8glement s'effectue dans les conditions suivantes :",
    en: "Unless otherwise specifically agreed in the special conditions, payment shall be made under the following terms:",
    de: "Sofern in den besonderen Bedingungen nichts anderes vereinbart wurde, erfolgt die Zahlung zu folgenden Bedingungen:",
    nl: "Tenzij anders specifiek overeengekomen in de bijzondere voorwaarden, vindt de betaling plaats onder de volgende voorwaarden:",
  },
  art6_p1: {
    fr: "Conform\u00e9ment aux dispositions du Code de la consommation, le droit de r\u00e9tractation n'est pas applicable aux contrats conclus entre professionnels (B2B) agissant dans le cadre de leur activit\u00e9 commerciale, industrielle, artisanale ou lib\u00e9rale.",
    en: "In accordance with the provisions of the Consumer Code, the right of withdrawal is not applicable to contracts concluded between professionals (B2B) acting in the course of their commercial, industrial, craft or liberal activity.",
    de: "Gem\u00e4\u00df den Bestimmungen des Verbraucherschutzgesetzes ist das Widerrufsrecht nicht auf Vertr\u00e4ge anwendbar, die zwischen Gewerbetreibenden (B2B) geschlossen werden, die im Rahmen ihrer gewerblichen, industriellen, handwerklichen oder freiberuflichen T\u00e4tigkeit handeln.",
    nl: "Overeenkomstig de bepalingen van de Consumentenwet is het herroepingsrecht niet van toepassing op overeenkomsten gesloten tussen professionals (B2B) die handelen in de uitoefening van hun commerci\u00eble, industri\u00eble, ambachtelijke of vrije beroepsactiviteit.",
  },
  art6_p2: {
    fr: "Les produits livr\u00e9s et conformes au bon de livraison ne sont ni repris ni \u00e9chang\u00e9s. En cas de non-conformit\u00e9 av\u00e9r\u00e9e lors de la livraison (vices apparents), l'acheteur doit \u00e9mettre des r\u00e9serves claires et pr\u00e9cises sur le bordereau de transport et les confirmer par lettre recommand\u00e9e avec AR au transporteur dans les 3 jours ouvrables suivant la r\u00e9ception, avec copie \u00e0 sotramsbois.",
    en: "Products delivered and conforming to the delivery note are neither returnable nor exchangeable. In the event of proven non-conformity upon delivery (apparent defects), the buyer must state clear and precise reservations on the transport document and confirm them by registered letter with acknowledgment of receipt to the carrier within 3 working days following receipt, with a copy to sotramsbois.",
    de: "Gelieferte und dem Lieferschein entsprechende Produkte werden weder zur\u00fcckgenommen noch umgetauscht. Im Falle einer nachgewiesenen Nichtkonformit\u00e4t bei der Lieferung (offensichtliche M\u00e4ngel) muss der K\u00e4ufer klare und pr\u00e4zise Vorbehalte auf dem Frachtbrief vermerken und diese innerhalb von 3 Werktagen nach Erhalt per Einschreiben mit R\u00fcckschein an den Spediteur best\u00e4tigen, mit einer Kopie an sotramsbois.",
    nl: "Geleverde en aan de afleverbon beantwoordende producten worden niet teruggenomen of geruild. In geval van bewezen non-conformiteit bij de levering (zichtbare gebreken), moet de koper duidelijke en nauwkeurige voorbehouden maken op de vrachtbrief en deze binnen 3 werkdagen na ontvangst per aangetekende brief met ontvangstbevestiging aan de vervoerder bevestigen, met een kopie aan sotramsbois.",
  }
};

function fix(langObj) {
  const fp = path.join(ROOT, langObj.dir, "cgv.html");
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, "utf8");
  const l = langObj.lang;

  // 1. art5_p1
  const old5 = "<p>" + translations.art5_p1.fr + "</p>";
  const new5 = '<p data-i18n="cgv.art5_p1">' + translations.art5_p1[l] + "</p>";
  if (html.includes(old5)) {
    html = html.split(old5).join(new5);
    console.log("[" + l + "] Fixed art5_p1");
  } else {
    const translatedOld = "<p>" + translations.art5_p1[l] + "</p>";
    if (html.includes(translatedOld)) {
      html = html.split(translatedOld).join(new5);
      console.log("[" + l + "] Fixed art5_p1 (already translated)");
    }
  }

  // 2. art6_p1
  const old6_1 = "<p>" + translations.art6_p1.fr + "</p>";
  const new6_1 = '<p data-i18n="cgv.art6_p1">' + translations.art6_p1[l] + "</p>";
  if (html.includes(old6_1)) {
    html = html.split(old6_1).join(new6_1);
    console.log("[" + l + "] Fixed art6_p1");
  } else {
    const translatedOld = "<p>" + translations.art6_p1[l] + "</p>";
    if (html.includes(translatedOld)) {
      html = html.split(translatedOld).join(new6_1);
      console.log("[" + l + "] Fixed art6_p1 (already translated)");
    }
  }

  // 3. art6_p2
  const old6_2 = "<p>" + translations.art6_p2.fr + "</p>";
  const new6_2 = '<p data-i18n="cgv.art6_p2">' + translations.art6_p2[l] + "</p>";
  if (html.includes(old6_2)) {
    html = html.split(old6_2).join(new6_2);
    console.log("[" + l + "] Fixed art6_p2");
  } else {
    const translatedOld = "<p>" + translations.art6_p2[l] + "</p>";
    if (html.includes(translatedOld)) {
      html = html.split(translatedOld).join(new6_2);
      console.log("[" + l + "] Fixed art6_p2 (already translated)");
    }
  }

  fs.writeFileSync(fp, html, "utf8");
}

for (const langObj of LANGS) {
  fix(langObj);
}
console.log("Done fixing 3 items.");
