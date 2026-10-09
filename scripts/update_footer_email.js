const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const I18N_DIR = path.join(ROOT_DIR, "data", "i18n");

const NEW_ADDRESS = "2475 Route de Fumay 08230 Gué-d’Hossus (France)";
const NEW_EMAIL = "contact@sotramsbois.com";

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  // Update Footer Address
  content = content.replace(
    /\[Adresse à compléter par le client\]/gi,
    NEW_ADDRESS,
  );

  // Update Emails
  content = content.replace(/\[Email de contact à compléter\]/gi, NEW_EMAIL);
  content = content.replace(/\[Email du DPO à compléter\]/gi, NEW_EMAIL);

  // Clean up empty phone tags for a better presentation
  content = content.replace(/— Téléphone : \[Téléphone à compléter\]\.?/gi, "");
  content = content.replace(/\[Téléphone à compléter par le client\]/gi, "");
  content = content.replace(/\[Téléphone à compléter\]/gi, "");

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

console.log("Emails and footer updated.");
