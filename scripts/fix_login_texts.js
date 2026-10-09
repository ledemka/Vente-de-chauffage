const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const I18N_DIR = path.join(ROOT, "data", "i18n");

// 1. Fix connexion.html
const connexionHtmlPath = path.join(ROOT, "connexion.html");
let connexionHtml = fs.readFileSync(connexionHtmlPath, "utf8");
connexionHtml = connexionHtml.replace(">Connexion B2B</h2>", ">Connexion</h2>");
connexionHtml = connexionHtml.replace(
  ">Email Professionnel</label>",
  ">Email</label>",
);
fs.writeFileSync(connexionHtmlPath, connexionHtml);

// 2. Fix JSON translations
const langs = ["fr", "en", "de", "nl"];

for (const lang of langs) {
  const jsonPath = path.join(I18N_DIR, `${lang}.json`);
  let data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  if (data.login && data.login.form) {
    if (lang === "fr") {
      data.login.form.title = "Connexion";
      data.login.form.email = "Email";
    }
    if (lang === "en") {
      data.login.form.title = "Login";
      data.login.form.email = "Email";
    }
    if (lang === "de") {
      data.login.form.title = "Anmeldung";
      data.login.form.email = "E-Mail";
    }
    if (lang === "nl") {
      data.login.form.title = "Inloggen";
      data.login.form.email = "E-mailadres";
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 4));
}

console.log("Login texts updated.");
