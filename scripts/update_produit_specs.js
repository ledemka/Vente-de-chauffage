const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const LANGS = ['.', 'en', 'de', 'nl'];

const htmlTarget = `<div class="flex justify-between py-3 border-b border-outline/30">
<span class="text-label-md font-label-md text-on-surface-variant">TAUX D'HUMIDITÉ</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-humidite">< 20% (Séchoir)</span>
</div>`;

const htmlReplacement = `<div class="flex justify-between py-3 border-b border-outline/30">
<span class="text-label-md font-label-md text-on-surface-variant" data-i18n="specs.humidity">TAUX D'HUMIDITÉ</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-humidite">< 20% (Séchoir)</span>
</div>`;

const originTargetHTML = `</div>
</div>
<!-- Logistics / Delivery -->`;

const originReplacementHTML = `<div class="flex justify-between py-3 border-b border-outline/30">
<span class="text-label-md font-label-md text-on-surface-variant" data-i18n="specs.origin">ORIGINE</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-origine">France</span>
</div>
</div>
</div>
<!-- Logistics / Delivery -->`;

const jsDescTarget = `document.getElementById('product-desc').textContent = product.species_material + ' B2B Wholesale Palette.';`;
const jsDescReplacement = `document.getElementById('product-desc').textContent = \`\${product.species_material} - Humidité: \${product.humidity_bucket}. Origine: \${product.origin}. Idéal pour professionnels.\`;`;

const jsSpecTarget = `document.getElementById('spec-humidite').textContent = '< 20%';`;
const jsSpecReplacement = `document.getElementById('spec-humidite').textContent = product.humidity_bucket;
                                document.getElementById('spec-origine').textContent = product.origin;`;


LANGS.forEach(langDir => {
    const filepath = path.join(ROOT_DIR, langDir, 'produit.html');
    if (fs.existsSync(filepath)) {
        let content = fs.readFileSync(filepath, 'utf8');
        
        content = content.replace(htmlTarget, htmlReplacement);
        
        // Only replace origin if it doesn't already exist
        if (!content.includes('id="spec-origine"')) {
            content = content.replace(originTargetHTML, originReplacementHTML);
        }

        content = content.replace(jsDescTarget, jsDescReplacement);
        content = content.replace(jsSpecTarget, jsSpecReplacement);
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated specs in ${langDir}/produit.html`);
    }
});

// Update i18n
const i18nData = {
    fr: { humidity: "TAUX D'HUMIDITÉ", origin: "ORIGINE" },
    en: { humidity: "MOISTURE CONTENT", origin: "ORIGIN" },
    de: { humidity: "FEUCHTIGKEITSGEHALT", origin: "HERKUNFT" },
    nl: { humidity: "VOCHTGEHALTE", origin: "OORSPRONG" }
};

Object.keys(i18nData).forEach(lang => {
    const jsonPath = path.join(ROOT_DIR, 'data', 'i18n', `${lang}.json`);
    if (fs.existsSync(jsonPath)) {
        let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        if (!data.specs) data.specs = {};
        
        data.specs.humidity = i18nData[lang].humidity;
        data.specs.origin = i18nData[lang].origin;
        
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated data/i18n/${lang}.json for specs keys`);
    }
});
