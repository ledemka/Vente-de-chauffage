"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

const activationReplacements = {
  en: [
    ["Activation en cours...", "Activating your account..."],
    ["Veuillez patienter pendant que nous v\u00e9rifions votre compte.", "Please wait while we verify your account."],
    ["Compte activ\u00e9 !", "Account activated!"],
    ["Votre compte a \u00e9t\u00e9 activ\u00e9 avec succ\u00e8s.", "Your account has been successfully activated."],
    ["Lien invalide ou expir\u00e9", "Invalid or expired link"],
    ["Ce lien d'activation n'est plus valide.", "This activation link is no longer valid."],
    ["Espace Professionnel B2B", "B2B Professional Space"],
    ["Livraison Palette", "Pallet Delivery"],
    ["Suivi logistique pr\u00e9cis sur toute la France.", "Precise logistics tracking across France."],
    ["Facturation Pro", "Business Invoicing"],
    ["Gestion centralis\u00e9e et bons de livraison d\u00e9mat\u00e9rialis\u00e9s.", "Centralized management and paperless delivery notes."],
    ["Se connecter", "Log in"]
  ],
  de: [
    ["Activation en cours...", "Konto wird aktiviert..."],
    ["Veuillez patienter pendant que nous v\u00e9rifions votre compte.", "Bitte warten Sie, w\u00e4hrend wir Ihr Konto \u00fcberpr\u00fcfen."],
    ["Compte activ\u00e9 !", "Konto aktiviert!"],
    ["Votre compte a \u00e9t\u00e9 activ\u00e9 avec succ\u00e8s.", "Ihr Konto wurde erfolgreich aktiviert."],
    ["Lien invalide ou expir\u00e9", "Ung\u00fcltiger oder abgelaufener Link"],
    ["Ce lien d'activation n'est plus valide.", "Dieser Aktivierungslink ist nicht mehr g\u00fcltig."],
    ["Espace Professionnel B2B", "B2B-Fachbereich"],
    ["Livraison Palette", "Palettenlieferung"],
    ["Suivi logistique pr\u00e9cis sur toute la France.", "Pr\u00e4zise Sendungsverfolgung in ganz Frankreich."],
    ["Facturation Pro", "Gesch\u00e4ftliche Rechnungsstellung"],
    ["Gestion centralis\u00e9e et bons de livraison d\u00e9mat\u00e9rialis\u00e9s.", "Zentralisierte Verwaltung und digitale Lieferscheine."],
    ["Se connecter", "Anmelden"]
  ],
  nl: [
    ["Activation en cours...", "Account wordt geactiveerd..."],
    ["Veuillez patienter pendant que nous v\u00e9rifions votre compte.", "Even geduld terwijl we uw account verifi\u00ebren."],
    ["Compte activ\u00e9 !", "Account geactiveerd!"],
    ["Votre compte a \u00e9t\u00e9 activ\u00e9 avec succ\u00e8s.", "Uw account is succesvol geactiveerd."],
    ["Lien invalide ou expir\u00e9", "Ongeldige of verlopen link"],
    ["Ce lien d'activation n'est plus valide.", "Deze activatielink is niet meer geldig."],
    ["Espace Professionnel B2B", "B2B-professionele ruimte"],
    ["Livraison Palette", "Palletlevering"],
    ["Suivi logistique pr\u00e9cis sur toute la France.", "Nauwkeurige logistieke tracking in heel Frankrijk."],
    ["Facturation Pro", "Zakelijke facturatie"],
    ["Gestion centralis\u00e9e et bons de livraison d\u00e9mat\u00e9rialis\u00e9s.", "Gecentraliseerd beheer en digitale afleverbonnen."],
    ["Se connecter", "Inloggen"]
  ]
};

const frActivation = fs.readFileSync(path.join(ROOT, "activation.html"), "utf8");

for (const [lang, replacements] of Object.entries(activationReplacements)) {
  let html = frActivation;
  html = html.split('lang="fr"').join('lang="' + lang + '"');
  html = html.split('href="./').join('href="../');
  html = html.split('src="./').join('src="../');
  html = html.split('href="../' + lang + '/activation.html"').join('href="activation.html"');

  replacements.sort((a, b) => b[0].length - a[0].length);
  for (const [fr, target] of replacements) {
    if (fr !== target) html = html.split(fr).join(target);
  }

  const outPath = path.join(ROOT, lang, "activation.html");
  fs.writeFileSync(outPath, html, { encoding: "utf8" });

  const buf = fs.readFileSync(outPath);
  let mojibake = 0;
  for (let i = 0; i < buf.length - 2; i++) {
    if (buf[i] === 0xEF && buf[i+1] === 0xBF && buf[i+2] === 0xBD) mojibake++;
  }
  console.log("[" + lang + "] activation.html written. Mojibake: " + mojibake + ". Bytes: " + buf.length);
}

console.log("Done.");
