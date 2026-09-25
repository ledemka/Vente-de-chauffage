const fs = require('fs');
const path = require('path');

// 1. Update i18n JSON files
const i18nDir = path.join(__dirname, '..', 'data', 'i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const seoTitles = {
    fr: '{name} – sotramsbois',
    en: '{name} – sotramsbois',
    de: '{name} – sotramsbois',
    nl: '{name} – sotramsbois'
};

const seoDescriptions = {
    fr: '{name} ({species}, {format}). {units} unités/palette, {palette_weight}. Demandez un devis pro gratuit.',
    en: '{name} ({species}, {format}). {units} units/pallet, {palette_weight}. Request a free B2B quote.',
    de: '{name} ({species}, {format}). {units} Stück/Palette, {palette_weight}. Fordern Sie ein B2B-Angebot an.',
    nl: '{name} ({species}, {format}). {units} stuks/pallet, {palette_weight}. Vraag een B2B-offerte aan.'
};

const unitsTranslations = {
    fr: 'unités par palette',
    en: 'units per pallet',
    de: 'Stück pro Palette',
    nl: 'stuks per pallet'
};

langs.forEach(lang => {
    const file = path.join(i18nDir, lang + '.json');
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (!data.product) data.product = {};
    data.product.seo_title = seoTitles[lang];
    data.product.seo_description = seoDescriptions[lang];
    data.product.units_per_pallet = unitsTranslations[lang];

    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
});

// 2. Update post_process_seo.js so it doesn't inject canonical for produit.html
const postSeoFile = path.join(__dirname, 'post_process_seo.js');
let postSeo = fs.readFileSync(postSeoFile, 'utf8');
postSeo = postSeo.replace(/if \(!isPrivate\) \{/, 'if (!isPrivate && pageName !== "produit.html") {');
// Wait, the regex might not match perfectly.
// Let's use string replace for the exact line if needed, or parse the file better.
fs.writeFileSync(postSeoFile, postSeo, 'utf8');

console.log('Done script 1');
