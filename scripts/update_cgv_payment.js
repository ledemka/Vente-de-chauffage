const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const LANGS = ['.', 'en', 'de', 'nl'];

const replacementHTML = `<div class="flex-1 bg-surface-container p-5 rounded-lg shadow-sm">
<h6 class="font-label-md text-label-md text-on-surface mb-2" data-i18n="cgv.payment_method_title">MODE DE PAIEMENT</h6>
<p class="font-body-sm text-body-sm" data-i18n="cgv.payment_method_desc">Le règlement s'effectue <strong>exclusivement par virement bancaire</strong>. Aucun autre moyen de paiement (carte bancaire, chèque, prélèvement SEPA) n'est accepté.</p>
</div>
<div class="flex-1 bg-surface-container p-5 rounded-lg shadow-sm">
<h6 class="font-label-md text-label-md text-on-surface mb-2" data-i18n="cgv.payment_terms_title">DÉLAIS DE PAIEMENT</h6>
<p class="font-body-sm text-body-sm" data-i18n="cgv.payment_terms_desc">Selon les modalités convenues avec votre chargé de compte.</p>
</div>`;

LANGS.forEach(langDir => {
    const filepath = path.join(ROOT_DIR, langDir, 'cgv.html');
    if (fs.existsSync(filepath)) {
        let content = fs.readFileSync(filepath, 'utf8');
        
        // Regex to find the two specific divs under Article 5
        const regex = /<div class="flex-1 bg-surface-container p-5 rounded-lg shadow-sm">\s*<h6 class="font-label-md text-label-md text-on-surface mb-2">NOUVEAUX CLIENTS<\/h6>\s*<p class="font-body-sm text-body-sm">Conditions de Règlement B2B<\/p>\s*<\/div>\s*<div class="flex-1 bg-surface-container p-5 rounded-lg shadow-sm">\s*<h6 class="font-label-md text-label-md text-on-surface mb-2">COMPTES EN COURS<\/h6>\s*<p class="font-body-sm text-body-sm">Conditions de Règlement B2B<\/p>\s*<\/div>/;
        
        if (regex.test(content)) {
            content = content.replace(regex, replacementHTML);
            fs.writeFileSync(filepath, content, 'utf8');
            console.log(`Updated cgv.html in ${langDir}`);
        } else {
            console.log(`Could not match target in ${langDir}/cgv.html`);
        }
    }
});

const i18nData = {
  "fr": {
    "cgv": {
      "payment_method_title": "MODE DE PAIEMENT",
      "payment_method_desc": "Le règlement s'effectue <strong>exclusivement par virement bancaire</strong>. Aucun autre moyen de paiement (carte bancaire, chèque, prélèvement SEPA) n'est accepté.",
      "payment_terms_title": "DÉLAIS DE PAIEMENT",
      "payment_terms_desc": "Selon les modalités convenues avec votre chargé de compte."
    }
  },
  "en": {
    "cgv": {
      "payment_method_title": "PAYMENT METHOD",
      "payment_method_desc": "Payment is made <strong>exclusively by bank transfer</strong>. No other payment methods (credit card, check, SEPA direct debit) are accepted.",
      "payment_terms_title": "PAYMENT TERMS",
      "payment_terms_desc": "According to the terms agreed upon with your account manager."
    }
  },
  "de": {
    "cgv": {
      "payment_method_title": "ZAHLUNGSMETHODE",
      "payment_method_desc": "Die Zahlung erfolgt <strong>ausschließlich per Banküberweisung</strong>. Keine anderen Zahlungsmethoden (Kreditkarte, Scheck, SEPA-Lastschrift) werden akzeptiert.",
      "payment_terms_title": "ZAHLUNGSBEDINGUNGEN",
      "payment_terms_desc": "Gemäß den mit Ihrem Kundenbetreuer vereinbarten Bedingungen."
    }
  },
  "nl": {
    "cgv": {
      "payment_method_title": "BETAALMETHODE",
      "payment_method_desc": "Betaling geschiedt <strong>uitsluitend per bankoverschrijving</strong>. Andere betaalmethoden (creditcard, cheque, SEPA-incasso) worden niet geaccepteerd.",
      "payment_terms_title": "BETALINGSTERMIJNEN",
      "payment_terms_desc": "Volgens de voorwaarden die met uw accountmanager zijn overeengekomen."
    }
  }
};

Object.keys(i18nData).forEach(lang => {
    const jsonPath = path.join(ROOT_DIR, 'data', 'i18n', `${lang}.json`);
    if (fs.existsSync(jsonPath)) {
        let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        if (!data.cgv) data.cgv = {};
        
        Object.assign(data.cgv, i18nData[lang].cgv);
        
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated data/i18n/${lang}.json for cgv keys`);
    }
});
