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
    'article.html',
    'merci-contact.html',
    'merci-devis.html',
    'merci-inscription.html'
];

const langs = ['fr', 'en', 'de', 'nl'];
const i18nDir = path.join(__dirname, '../data/i18n');
const dir = path.join(__dirname, '..');

const jsons = {};
for (const lang of langs) {
    jsons[lang] = JSON.parse(fs.readFileSync(path.join(i18nDir, `${lang}.json`), 'utf8'));
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

function setNestedKey(obj, keyPath, value) {
    const keys = keyPath.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '_')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        .substring(0, 30);
}

// DeepL API could translate these, but we don't have an API key. 
// We will just use the FR text as fallback for EN, DE, NL, and the user's manual review can fix EN/DE/NL if needed.
// Wait, the prompt says "harmonisation langues", so any new keys should have the same text initially, or "TODO". I will set it to the FR text for now so it doesn't break visually.

let totalReplaced = 0;

for (const file of includedPages) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf8');
    // Important: decodeEntities: false ensures HTML entities stay as they are, but cheerio sometimes messes up self-closing tags. 
    // We can use xmlMode: false.
    const $ = cheerio.load(content, { decodeEntities: false });
    const pageName = file.replace('.html', '').replace(/-/g, '_');
    
    if (!jsons['fr'][pageName]) {
        for (const lang of langs) jsons[lang][pageName] = {};
    }

    let pageReplaced = 0;

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
                        if (file === 'confirmation-commande.html' && (text.includes('SOTRAMSBOIS') || text.includes('FR76') || text.includes('Domiciliation'))) return;
                        if (file === 'produit.html' && (text.includes('Palettes Bûches') || text.includes('€') || text.includes('kg') || text.includes('Livraison sous') || text.includes('Ref:'))) return;
                        if ($(child.parent).hasClass('material-symbols-outlined')) return;
                        if ($(child.parent).closest('#lang-selector-btn').length || $(child.parent).closest('#lang-dropdown').length) return;
                        
                        if (text.replace(/[0-9\s€%+\-.,!:;/?()]/g, '').length > 0) {
                            
                            // Generate key
                            const slug = slugify(text) || 'txt_' + Math.floor(Math.random()*1000);
                            const keyPath = `${pageName}.${slug}`;
                            
                            // Prevent duplicates
                            let finalKeyPath = keyPath;
                            let counter = 1;
                            while (hasNestedKey(jsons['fr'], finalKeyPath) && jsons['fr'].split('.').reduce((o, i) => o[i], jsons['fr']) !== text) {
                                finalKeyPath = `${keyPath}_${counter}`;
                                counter++;
                            }
                            
                            // Add to jsons
                            for (const lang of langs) {
                                if (!hasNestedKey(jsons[lang], finalKeyPath)) {
                                    setNestedKey(jsons[lang], finalKeyPath, text); // Put French text everywhere for now
                                }
                            }
                            
                            // Replace in HTML
                            // Since we have whitespace around child.data, we want to replace only the text portion.
                            // If parent only has 1 child, we can just put data-i18n on the parent.
                            const parentChildren = $(child.parent).contents();
                            if (parentChildren.length === 1 && $(child.parent)[0].name !== 'body' && $(child.parent)[0].name !== 'html') {
                                $(child.parent).attr('data-i18n', finalKeyPath);
                            } else {
                                // Wrap the text in a span
                                // We replace child.data with a wrapped version. But cheerio doesn't let us easily replace a text node with HTML via child.data = ...
                                // We can use replaceWith
                                const before = child.data.substring(0, child.data.indexOf(text));
                                const after = child.data.substring(child.data.indexOf(text) + text.length);
                                const newHtml = `${before}<span data-i18n="${finalKeyPath}">${text}</span>${after}`;
                                $(child).replaceWith(newHtml);
                            }
                            pageReplaced++;
                            totalReplaced++;
                        }
                    }
                }
            } else if (child.type === 'tag') {
                checkTextNodes(child);
            }
        });
    };
    
    checkTextNodes($('body'));
    
    // Check hardcoded placeholders and alts
    $('input[placeholder], textarea[placeholder]').each((_, el) => {
        if (!$(el).attr('data-i18n-placeholder')) {
             const text = $(el).attr('placeholder');
             if (text) {
                 const slug = 'ph_' + (slugify(text) || Math.floor(Math.random()*1000));
                 const keyPath = `${pageName}.${slug}`;
                 for (const lang of langs) {
                     if (!hasNestedKey(jsons[lang], keyPath)) setNestedKey(jsons[lang], keyPath, text);
                 }
                 $(el).attr('data-i18n-placeholder', keyPath);
                 pageReplaced++;
                 totalReplaced++;
             }
        }
    });
    
    $('img[alt]').each((_, el) => {
        if (!$(el).attr('data-i18n-alt') && !$(el).attr('data-ignore-audit')) {
             const text = $(el).attr('alt');
             if (text) {
                 const slug = 'alt_' + (slugify(text) || Math.floor(Math.random()*1000));
                 const keyPath = `${pageName}.${slug}`;
                 for (const lang of langs) {
                     if (!hasNestedKey(jsons[lang], keyPath)) setNestedKey(jsons[lang], keyPath, text);
                 }
                 $(el).attr('data-i18n-alt', keyPath);
                 pageReplaced++;
                 totalReplaced++;
             }
        }
    });
    
    if (pageReplaced > 0) {
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log(`✅ Updated ${file} - replaced ${pageReplaced} texts`);
    }
}

// Write JSONs
for (const lang of langs) {
    fs.writeFileSync(path.join(i18nDir, `${lang}.json`), JSON.stringify(jsons[lang], null, 2), 'utf8');
}

console.log(`\n🎉 Applied ${totalReplaced} i18n tags!`);
