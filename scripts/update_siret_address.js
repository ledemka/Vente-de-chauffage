const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const I18N_DIR = path.join(ROOT_DIR, "data", "i18n");

// Address to replace
const NEW_ADDRESS = "2475 Route de Fumay 08230 Gué-d’Hossus (France)";
const NEW_SIRET = "35387770700029";

// Regex patterns for the old placeholders
const addressRegex1 = /\[Adresse du siège social à compléter\]/gi;
const addressRegex2 = /\[Adresse du siège à compléter\]/gi;

// SIRET/RCS placeholders
const rcsRegex1 = /\[RCS à compléter\]/gi;
const rcsRegex2 = /\[Numéro RCS à compléter\]/gi;
const rcsRegex3 = /\[Company registration number \(RCS\) to be completed\]/gi;
const rcsRegex4 =
  /\[Handelsregisternummer \(RCS\) noch zu vervollständigen\]/gi;
const rcsRegex5 = /\[KvK-\/RCS-nummer nog aan te vullen\]/gi;

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  content = content.replace(addressRegex1, NEW_ADDRESS);
  content = content.replace(addressRegex2, NEW_ADDRESS);

  // Replace RCS placeholders with SIRET
  content = content.replace(rcsRegex1, NEW_SIRET);
  content = content.replace(rcsRegex2, NEW_SIRET);
  content = content.replace(rcsRegex3, NEW_SIRET);
  content = content.replace(rcsRegex4, NEW_SIRET);
  content = content.replace(rcsRegex5, NEW_SIRET);

  // Also handle cases where they have "RCS [Ville RCS à compléter]" and we just want to show SIRET?
  // Let's replace "[Ville RCS à compléter]" with empty or something?
  // Actually the user just gave SIRET. Let's replace "RCS [Ville RCS à compléter]" with "SIRET" if it exists.
  content = content.replace(/RCS \[Ville RCS à compléter\]/gi, "SIRET");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${path.basename(filePath)}`);
  }
}

// 1. Process all HTML files in root
fs.readdirSync(ROOT_DIR).forEach((file) => {
  if (file.endsWith(".html")) {
    processFile(path.join(ROOT_DIR, file));
  }
});

// 2. Process all JSON files in data/i18n
if (fs.existsSync(I18N_DIR)) {
  fs.readdirSync(I18N_DIR).forEach((file) => {
    if (file.endsWith(".json")) {
      processFile(path.join(I18N_DIR, file));
    }
  });
}

// Process missing_legal.json if it exists
processFile(path.join(ROOT_DIR, "missing_legal.json"));
processFile(path.join(ROOT_DIR, "scripts", "simplify_html.js"));
processFile(path.join(ROOT_DIR, "scripts", "simplify_json.js"));

console.log("Update complete.");
