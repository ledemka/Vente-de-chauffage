const fs = require('fs');

const langs = ['fr', 'en', 'de', 'nl'];

const seoTranslations = {
  fr: {
    title: "Foire Aux Questions B2B | sotramsbois",
    description: "Retrouvez les réponses aux questions fréquentes concernant nos produits, nos livraisons et notre politique B2B."
  },
  en: {
    title: "B2B Frequently Asked Questions | sotramsbois",
    description: "Find answers to frequently asked questions about our products, deliveries, and B2B policy."
  },
  de: {
    title: "B2B Häufig gestellte Fragen | sotramsbois",
    description: "Finden Sie Antworten auf häufig gestellte Fragen zu unseren Produkten, Lieferungen und B2B-Richtlinien."
  },
  nl: {
    title: "B2B Veelgestelde Vragen | sotramsbois",
    description: "Vind antwoorden op veelgestelde vragen over onze producten, leveringen en B2B-beleid."
  }
};

const i18nFaq = {
  fr: {
    title: "Foire Aux Questions",
    intro: "Retrouvez les réponses aux questions fréquentes concernant nos produits, nos livraisons et notre politique B2B."
  },
  en: {
    title: "Frequently Asked Questions",
    intro: "Find answers to frequently asked questions about our products, deliveries, and B2B policy."
  },
  de: {
    title: "Häufig gestellte Fragen",
    intro: "Finden Sie Antworten auf häufig gestellte Fragen zu unseren Produkten, Lieferungen und B2B-Richtlinien."
  },
  nl: {
    title: "Veelgestelde Vragen",
    intro: "Vind antwoorden op veelgestelde vragen over onze producten, leveringen en B2B-beleid."
  }
};

for (const lang of langs) {
  // Update SEO
  const seoPath = `data/seo/${lang}.json`;
  if (fs.existsSync(seoPath)) {
    const seoData = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
    seoData['faq.html'] = seoTranslations[lang];
    fs.writeFileSync(seoPath, JSON.stringify(seoData, null, 2), 'utf8');
  }

  // Update i18n
  const i18nPath = `data/i18n/${lang}.json`;
  if (fs.existsSync(i18nPath)) {
    const i18nData = JSON.parse(fs.readFileSync(i18nPath, 'utf8'));
    i18nData['faq'] = i18nFaq[lang];
    fs.writeFileSync(i18nPath, JSON.stringify(i18nData, null, 2), 'utf8');
  }
}

// Ensure allowlist exists for nav.faq and nav.blog
const allowlistPath = 'scripts/i18n-allowlist.json';
let allowlist = {};
if (fs.existsSync(allowlistPath)) {
  allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
}
allowlist['nav.faq'] = ['en', 'de', 'nl'];
allowlist['nav.blog'] = ['en', 'de', 'nl'];
fs.writeFileSync(allowlistPath, JSON.stringify(allowlist, null, 2), 'utf8');

console.log('Fixed audit issues.');
