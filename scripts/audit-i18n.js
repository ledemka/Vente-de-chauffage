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

// Load FR JSON to check missing keys
const frJsonPath = path.join(__dirname, '../data/i18n/fr.json');
let frJson = {};
if (fs.existsSync(frJsonPath)) {
    frJson = JSON.parse(fs.readFileSync(frJsonPath, 'utf8'));
}

function hasNestedKey(obj, keyPath) {
    const keys = keyPath.split('.');
    let val = obj;
    for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
            val = val[k];
        } else {
            return false;
        }
    }
    return true;
}

let totalErrors = 0;

const dir = path.join(__dirname, '..');
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
            if (val && !hasNestedKey(frJson, val)) {
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
                if (text && !['script', 'style', 'svg'].includes(child.parent.name)) {
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
                        if (file === 'confirmation-commande.html' && (text.includes('SOTRAMSBOIS') || text.includes('FR76') || text.includes('Domiciliation'))) {
                            return;
                        }
                        // Exclude produit.html default labels replaced by JS
                        if (file === 'produit.html' && (text.includes('Palettes Bûches') || text.includes('€') || text.includes('kg') || text.includes('Livraison sous') || text.includes('Ref:'))) {
                            return;
                        }
                        
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
    
    // Check body
    checkTextNodes($('body'));
    
    // Check hardcoded placeholders and alts
    $('input[placeholder], textarea[placeholder]').each((_, el) => {
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
    console.log(`\n🎉 PERFECT! NO HARDCODED TEXT FOUND!`);
}
