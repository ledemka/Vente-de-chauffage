const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const LANGS = ['.', 'en', 'de', 'nl'];

const jsDescTarget = `document.getElementById('product-desc').textContent = \`\${product.species_material} - Humidité: \${product.humidity_bucket}. Origine: \${product.origin}. Idéal pour professionnels.\`;`;
const jsSpecTarget = `document.getElementById('spec-humidite').textContent = product.humidity_bucket;
                                document.getElementById('spec-origine').textContent = product.origin;`;

// Using translations from t (translations object already available in the JS)
// Let's assume t.specs && t.specs.humidity_unavailable
const jsDescReplacement = `const displayHumidity = product.humidity_bucket || (t.specs && t.specs.humidity_unavailable) || "Non communiqué";
                                document.getElementById('product-desc').textContent = \`\${product.species_material} - Humidité: \${displayHumidity}. Origine: \${product.origin}. Idéal pour professionnels.\`;`;

const jsSpecReplacement = `document.getElementById('spec-humidite').textContent = product.humidity_bucket || (t.specs && t.specs.humidity_unavailable) || "Non communiqué";
                                document.getElementById('spec-origine').textContent = product.origin;`;

LANGS.forEach(langDir => {
    const filepath = path.join(ROOT_DIR, langDir, 'produit.html');
    if (fs.existsSync(filepath)) {
        let content = fs.readFileSync(filepath, 'utf8');
        
        content = content.replace(jsDescTarget, jsDescReplacement);
        content = content.replace(jsSpecTarget, jsSpecReplacement);
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated null handling in ${langDir}/produit.html`);
    }
});

const i18nData = {
    fr: { humidity_unavailable: "Non communiqué" },
    en: { humidity_unavailable: "Not specified" },
    de: { humidity_unavailable: "Keine Angabe" },
    nl: { humidity_unavailable: "Niet gespecificeerd" }
};

Object.keys(i18nData).forEach(lang => {
    const jsonPath = path.join(ROOT_DIR, 'data', 'i18n', `${lang}.json`);
    if (fs.existsSync(jsonPath)) {
        let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        if (!data.specs) data.specs = {};
        
        data.specs.humidity_unavailable = i18nData[lang].humidity_unavailable;
        
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated data/i18n/${lang}.json for humidity_unavailable key`);
    }
});
