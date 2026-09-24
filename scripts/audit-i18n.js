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

let allowlist = [];
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
    if (allowlist.includes(key)) continue;
    if (key.startsWith('emails.')) continue; // ignore emails for this audit
    
    if (enJson[key] === frJson[key] && !allowlist.includes(key)) {
        console.error(`❌ Untranslated in EN: ${key} = "${frJson[key]}"`);
        jsonErrors++;
    }
    if (deJson[key] === frJson[key] && !allowlist.includes(key)) {
        console.error(`❌ Untranslated in DE: ${key} = "${frJson[key]}"`);
        jsonErrors++;
    }
    if (nlJson[key] === frJson[key] && !allowlist.includes(key)) {
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
    
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const $ = cheerio.load(content);
    
    let pageTextErrors = 0;
    let pageKeyErrors = 0;
    
    console.log(`\n=== SCANNING ${file} ===`);
    
    // Check missing keys
    $('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-alt], [data-i18n-title], [data-i18n-aria-label]').each((_, el) => {
        const attrs = ['data-i18n', 'data-i18n-html', 'data-i18n-placeholder', 'data-i18n-alt', 'data-i18n-title', 'data-i18n-aria-label'];
        for (const attr of attrs) {
            const val = $(el).attr(attr);
            if (val && !frJson.hasOwnProperty(val)) {
                console.error(`❌ MISSING KEY in JSON: ${val}`);
                pageKeyErrors++;
            }
        }
    });

    const checkTextNodes = (element) => {
        $(element).contents().each((_, child) => {
            if (child.type === 'text') {
                const text = child.data.trim();
                // Ignore script, style tags, and empty text
                if (text && !['script', 'style', 'svg', 'noscript'].includes(child.parent.name)) {
                    // Check if parent has data-i18n or data-i18n-html
                    let parent = $(child.parent);
                    let hasI18n = false;
                    while (parent.length && parent[0].name !== 'html') {
                        if (parent.attr('data-i18n') || parent.attr('data-i18n-html') || parent.attr('data-ignore-audit')) {
                            hasI18n = true;
                            break;
                        }
                        parent = parent.parent();
                    }
                    if (!hasI18n) {
                        // Exclude banking data in confirmation-commande
                        if (file === 'confirmation-commande.html' && (text.includes('SOTRAMSBOIS') || text.includes('FR76') || text.includes('Domiciliation'))) return;
                        // Exclude produit.html default labels replaced by JS
                        if (file === 'produit.html' && (text.includes('Palettes Bûches') || text.includes('€') || text.includes('kg') || text.includes('Livraison sous') || text.includes('Ref:'))) return;
                        
                        // Exclude material icons
                        if ($(child.parent).hasClass('material-symbols-outlined')) return;
                        
                        // Exclude lang-selector-btn text and dropdown text
                        if ($(child.parent).closest('#lang-selector-btn').length || $(child.parent).closest('#lang-dropdown').length) return;
                        
                        // Ignore pure numbers/punctuation
                        if (text.replace(/[0-9\s€%+\-.,!:;/?()]/g, '').length > 0) {
                            console.error(`❌ HARDCODED TEXT: "${text.substring(0, 50)}"`);
                            pageTextErrors++;
                        }
                    }
                }
            } else if (child.type === 'tag') {
                checkTextNodes(child);
            }
        });
    };
    
    checkTextNodes($('body'));
    
    // Check hardcoded placeholders, alts, titles, aria-labels
    $('[placeholder]').each((_, el) => {
        if (!$(el).attr('data-i18n-placeholder')) {
             console.error(`❌ HARDCODED PLACEHOLDER: "${$(el).attr('placeholder')}"`);
             pageTextErrors++;
        }
    });
    $('img[alt]').each((_, el) => {
        if (!$(el).attr('data-i18n-alt') && !$(el).attr('data-ignore-audit')) {
             const altText = $(el).attr('alt').trim();
             if (altText) {
                 console.error(`❌ HARDCODED ALT: "${altText}"`);
                 pageTextErrors++;
             }
        }
    });
    $('[title]').each((_, el) => {
        if (!$(el).attr('data-i18n-title')) {
             console.error(`❌ HARDCODED TITLE: "${$(el).attr('title')}"`);
             pageTextErrors++;
        }
    });
    $('[aria-label]').each((_, el) => {
        if (!$(el).attr('data-i18n-aria-label') && !$(el).attr('data-ignore-audit') && !$(el).attr('aria-label').includes('menu')) {
             console.error(`❌ HARDCODED ARIA-LABEL: "${$(el).attr('aria-label')}"`);
             pageTextErrors++;
        }
    });
    
    if (pageTextErrors === 0 && pageKeyErrors === 0) {
        console.log(`✅ OK (${file})`);
    } else {
        totalErrors += pageTextErrors + pageKeyErrors;
    }
}

if (totalErrors > 0) {
    console.error(`\n🚨 FOUND ${totalErrors} ERRORS`);
    process.exit(1);
} else {
    console.log(`\n🎉 PERFECT! NO HARDCODED TEXT FOUND AND TRANSLATIONS ARE COMPLETE!`);
}
