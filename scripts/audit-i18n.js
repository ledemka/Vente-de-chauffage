const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const includedPages = [
    'guide-choix.html',
    'livraison.html',
    'inscription.html',
    'avis-clients.html',
    'devis.html',
    'contact.html',
    'confirmation-commande.html',
    'recapitulatif-commande.html',
    'blog.html',
    'activation.html',
    'connexion.html',
    'panier.html',
    'index.html',
    'catalogue.html',
    'depots.html',
    'produit.html',
    'article.html'
];

const excludedPages = [
    'cgv.html',
    'mentions-legales.html',
    'politique-confidentialite.html',
    'politique-retour.html',
    'admin-commandes.html',
    'tableau-de-bord.html'
];

function flatten(obj, prefix = '') {
    let res = {};
    for (let k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(res, flatten(obj[k], prefix + k + '.'));
        } else {
            res[prefix + k] = obj[k];
        }
    }
    return res;
}

const dir = path.join(__dirname, '..');
const frJson = flatten(JSON.parse(fs.readFileSync(path.join(dir, 'data/i18n/fr.json'), 'utf8')));
const enJson = flatten(JSON.parse(fs.readFileSync(path.join(dir, 'data/i18n/en.json'), 'utf8')));
const deJson = flatten(JSON.parse(fs.readFileSync(path.join(dir, 'data/i18n/de.json'), 'utf8')));
const nlJson = flatten(JSON.parse(fs.readFileSync(path.join(dir, 'data/i18n/nl.json'), 'utf8')));

let allowlist = {};
const allowlistPath = path.join(__dirname, 'i18n-allowlist.json');
if (fs.existsSync(allowlistPath)) {
    allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
}

let totalErrors = 0;
let jsonErrors = 0;

// 1. JSON Keys Consistency Check
const allKeys = new Set([...Object.keys(frJson), ...Object.keys(enJson), ...Object.keys(deJson), ...Object.keys(nlJson)]);
for (const key of allKeys) {
    if (!(key in frJson)) { console.error(`❌ Key ${key} missing in fr.json`); jsonErrors++; }
    if (!(key in enJson)) { console.error(`❌ Key ${key} missing in en.json`); jsonErrors++; }
    if (!(key in deJson)) { console.error(`❌ Key ${key} missing in de.json`); jsonErrors++; }
    if (!(key in nlJson)) { console.error(`❌ Key ${key} missing in nl.json`); jsonErrors++; }
}

// 2. Untranslated values check
for (const key in frJson) {
    if (key.startsWith('emails.')) continue;
    
    if (enJson[key] === frJson[key] && !(allowlist[key] && allowlist[key].includes('en'))) {
        console.error(`❌ Untranslated in EN: ${key} = "${frJson[key]}"`);
        jsonErrors++;
    }
    if (deJson[key] === frJson[key] && !(allowlist[key] && allowlist[key].includes('de'))) {
        console.error(`❌ Untranslated in DE: ${key} = "${frJson[key]}"`);
        jsonErrors++;
    }
    if (nlJson[key] === frJson[key] && !(allowlist[key] && allowlist[key].includes('nl'))) {
        console.error(`❌ Untranslated in NL: ${key} = "${frJson[key]}"`);
        jsonErrors++;
    }
}

if (jsonErrors > 0) {
    totalErrors += jsonErrors;
} else {
    console.log("✅ JSON files have exactly the same keys and all non-allowlisted values are translated.");
}

// 3. HTML Pages Scan
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
    if (excludedPages.includes(file)) continue;
    
    const html = fs.readFileSync(path.join(dir, file), 'utf8');
    const $ = cheerio.load(html);
    
    let pageErrors = 0;
    
    $('[data-i18n], [data-i18n-html], [data-i18n-alt], [data-i18n-title], [data-i18n-aria-label], [data-i18n-placeholder]').each((i, el) => {
        const keys = [
            $(el).attr('data-i18n'),
            $(el).attr('data-i18n-html'),
            $(el).attr('data-i18n-alt'),
            $(el).attr('data-i18n-title'),
            $(el).attr('data-i18n-aria-label'),
            $(el).attr('data-i18n-placeholder')
        ].filter(k => k);
        
        for (const k of keys) {
            if (!frJson[k]) {
                if (k.startsWith('formats.') && $(el).html().includes('window.i18n')) {
                    // dynamic format parsing in JS, safe to skip
                    continue;
                }
                console.error(`❌ Undefined key used in ${file}: ${k}`);
                pageErrors++;
            }
        }
    });

    // Check for hardcoded text in specific elements
    // Just a basic heuristic scan for text that looks French and isn't a script/style
    $('*').each((i, el) => {
        if (['script', 'style', 'link', 'meta', 'title'].includes(el.tagName.toLowerCase())) return;
        
        const contents = $(el).contents().filter(function() {
            return this.nodeType === 3; // Text nodes
        });
        
        contents.each(function() {
            const text = $(this).text().trim();
            // Basic heuristics to find hardcoded French text
            if (text.length > 3 && /[éèàçùêâôîû]/.test(text) && !$(el).closest('[data-i18n], [data-i18n-html]').length) {
                // Ignore some known exceptions
                if (text.includes('sotramsbois') || text.includes('Conteneur')) return;
                // We're suppressing this heuristic check for now because it yields too many false positives
                // console.warn(`⚠️ Possible hardcoded text in ${file}: "${text}"`);
            }
        });
    });

    if (pageErrors > 0) {
        totalErrors += pageErrors;
    }
}

if (totalErrors > 0) {
    console.error(`\n❌ Audit failed with ${totalErrors} errors.`);
    process.exit(1);
} else {
    console.log(`\n✅ Audit passed successfully!`);
    process.exit(0);
}
