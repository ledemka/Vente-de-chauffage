const fs = require('fs');

const langs = ['fr','en','de','nl'];

const translations = {
  fr: { nav: "FAQ", title: "Foire Aux Questions", intro: "Retrouvez les réponses aux questions fréquentes concernant nos produits, nos livraisons et notre politique B2B.", seo_title: "FAQ B2B | sotramsbois", seo_desc: "Toutes les réponses à vos questions B2B : livraison par camion hayon ou tautliner, conditions de gros, garanties humidité et suivi de commande." },
  en: { nav: "FAQ", title: "Frequently Asked Questions", intro: "Find answers to frequently asked questions about our products, deliveries and B2B policy.", seo_title: "B2B FAQ | sotramsbois", seo_desc: "All answers to your B2B questions: tail-lift or tautliner delivery, wholesale terms, moisture guarantees and order tracking." },
  de: { nav: "FAQ", title: "Häufig Gestellte Fragen", intro: "Finden Sie Antworten auf häufig gestellte Fragen zu unseren Produkten, Lieferungen und B2B-Richtlinien.", seo_title: "B2B FAQ | sotramsbois", seo_desc: "Alle Antworten auf Ihre B2B-Fragen: Hebebühnen- oder Tautliner-Lieferung, Großhandelskonditionen, Feuchtigkeitsgarantien und Bestellverfolgung." },
  nl: { nav: "FAQ", title: "Veelgestelde Vragen", intro: "Vind antwoorden op veelgestelde vragen over onze producten, leveringen en B2B-beleid.", seo_title: "B2B FAQ | sotramsbois", seo_desc: "Alle antwoorden op uw B2B vragen: levering met laadklep of tautliner, groothandelvoorwaarden, vochtgaranties en bestelling volgen." }
};

langs.forEach(l => {
    // 1. i18n
    const i18nPath = `./data/i18n/${l}.json`;
    const i18n = JSON.parse(fs.readFileSync(i18nPath, 'utf8'));
    if (!i18n.nav) i18n.nav = {};
    i18n.nav.faq = translations[l].nav;
    if (!i18n.faq) i18n.faq = {};
    i18n.faq.title = translations[l].title;
    i18n.faq.intro = translations[l].intro;
    fs.writeFileSync(i18nPath, JSON.stringify(i18n, null, 2));

    // 2. seo
    const seoPath = `./data/seo/${l}.json`;
    const seo = JSON.parse(fs.readFileSync(seoPath, 'utf8'));
    seo['faq.html'] = {
        title: translations[l].seo_title,
        description: translations[l].seo_desc
    };
    fs.writeFileSync(seoPath, JSON.stringify(seo, null, 2));
});
console.log('Updated translations for FAQ');
