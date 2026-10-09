const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const I18N_DIR = path.join(ROOT, "data", "i18n");

// 1. Fix devis.html
const devisHtmlPath = path.join(ROOT, "devis.html");
let devisHtml = fs.readFileSync(devisHtmlPath, "utf8");
devisHtml = devisHtml.replace(
  '<span class="text-primary italic font-serif pr-2">Demande de</span> devis B2B',
  '<span class="text-primary italic font-serif pr-2">Demande de</span> devis',
);
fs.writeFileSync(devisHtmlPath, devisHtml);

// 2. Fix JSON translations
const langs = ["fr", "en", "de", "nl"];

for (const lang of langs) {
  const jsonPath = path.join(I18N_DIR, `${lang}.json`);
  let data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  // Fix quote.title
  if (data.quote && data.quote.title) {
    data.quote.title = data.quote.title
      .replace(" B2B", "")
      .replace(" B2B-", " ")
      .replace("B2B-", "");
  }

  // Fix quote.contact.company
  if (data.quote && data.quote.contact && data.quote.contact.company) {
    if (lang === "fr")
      data.quote.contact.company = "ENTREPRISE / RAISON SOCIALE (Optionnel)";
    if (lang === "en")
      data.quote.contact.company = "COMPANY / BUSINESS NAME (Optional)";
    if (lang === "de")
      data.quote.contact.company = "UNTERNEHMEN / FIRMENNAME (Optional)";
    if (lang === "nl")
      data.quote.contact.company = "BEDRIJF / HANDELSNAAM (Optioneel)";
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 4));
}

console.log("Translations and devis.html updated.");
