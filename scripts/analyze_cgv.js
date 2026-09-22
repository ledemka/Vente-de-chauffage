const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT = process.cwd();
const LANGS = ['en', 'de', 'nl'];

const frHtml = fs.readFileSync(path.join(ROOT, 'cgv.html'), 'utf8');
const $fr = cheerio.load(frHtml);

const report = [];
let hasMissing = false;

// We look for substantive text in these tags inside the content area.
// We'll focus on elements inside the main content or generally these tags.
const tags = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'li', 'strong', 'a'];

const textNodes = [];
$fr('body').find(tags.join(', ')).each(function() {
    const el = $fr(this);
    // exclude elements with children that are also in our tags to avoid duplicates,
    // or just check direct text nodes.
    const text = el.clone().children().remove().end().text().trim();
    
    // Check if it's substantial text (e.g. > 3 words)
    if (text.split(/\s+/).length > 3 && !el.closest('header, footer, nav, script, style').length) {
        textNodes.push({
            tag: this.tagName,
            text: text,
            dataI18n: el.attr('data-i18n'),
            html: el.prop('outerHTML')
        });
    }
});

for (const node of textNodes) {
    // Check in translations
    const results = {};
    let missingI18n = !node.dataI18n;
    
    for (const lang of LANGS) {
        const langHtml = fs.readFileSync(path.join(ROOT, lang, 'cgv.html'), 'utf8');
        const $lang = cheerio.load(langHtml);
        
        let foundTranslatedText = false;
        let hasI18nAttr = false;
        
        if (node.dataI18n) {
            const langEl = $lang(`[data-i18n="${node.dataI18n}"]`);
            if (langEl.length) {
                hasI18nAttr = true;
                const langText = langEl.clone().children().remove().end().text().trim();
                if (langText && langText !== node.text) {
                    foundTranslatedText = true;
                }
            }
        }
        
        results[lang] = {
            hasI18n: hasI18nAttr,
            translated: foundTranslatedText
        };
    }
    
    let isOk = node.dataI18n && LANGS.every(l => results[l].hasI18n && results[l].translated);
    
    if (!isOk) {
        hasMissing = true;
    }
    
    report.push({
        tag: node.tag,
        text: node.text.substring(0, 50) + (node.text.length > 50 ? '...' : ''),
        dataI18n: node.dataI18n || 'MISSING',
        status: isOk ? 'OK' : 'MISSING/UNTRANSLATED',
        details: results
    });
}

console.log(JSON.stringify(report, null, 2));
