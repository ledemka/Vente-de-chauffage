const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const distDir = path.join(__dirname, '../dist-production');

const langs = ['fr', 'en', 'de', 'nl'];
const privatePages = ['avis-clients.html', 'panier.html', 'connexion.html', 'inscription.html', 'merci-contact.html', 'merci-devis.html', 'merci-inscription.html', 'confirmation-commande.html', 'recapitulatif-commande.html', 'activation.html', 'tableau-de-bord.html', 'admin-commandes.html'];

let errors = 0;
let stats = {};

function addError(file, lang, msg) {
    console.error(`[${lang}] ${file}: ${msg}`);
    if (!stats[lang]) stats[lang] = {};
    if (!stats[lang][file]) stats[lang][file] = 0;
    stats[lang][file]++;
    errors++;
}

langs.forEach(lang => {
    const dir = lang === 'fr' ? distDir : path.join(distDir, lang);
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const html = fs.readFileSync(filePath, 'utf8');

        // Check DOCTYPE
        if (!html.trimStart().toLowerCase().startsWith('<!doctype html>')) {
            addError(file, lang, 'Missing DOCTYPE');
        }

        // Check empty head
        const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
        if (!headMatch || headMatch[1].trim() === '') {
            addError(file, lang, 'Empty or missing <head>');
        }

        // Check tags in body
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/(body|html)>/i);
        if (bodyMatch) {
            const bodyContent = bodyMatch[1];
            // Look for meta, link, title, style directly in body (naive check, looking for tags that should be in head)
            if (bodyContent.match(/<meta[^>]*>/i)) addError(file, lang, '<meta> tag in <body>');
            if (bodyContent.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/i)) addError(file, lang, '<link stylesheet> tag in <body>');
            if (bodyContent.match(/<title[^>]*>/i)) addError(file, lang, '<title> tag in <body>');
            if (bodyContent.match(/<style[^>]*>/i)) addError(file, lang, '<style> tag in <body>');
        }

        const $ = cheerio.load(html, { decodeEntities: false });
        
        if (privatePages.includes(file)) {
            const robots = $('meta[name="robots"]').attr('content');
            if (!robots || (!robots.includes('noindex, nofollow') && !robots.includes('noindex, follow'))) {
                addError(file, lang, 'Private page missing noindex, (no)follow');
            }
        }

        // JSON-LD checks
        const jsonLdBlocks = [];
        $('script[type="application/ld+json"]').each((i, el) => {
            const content = $(el).html();
            try {
                const parsed = JSON.parse(content);
                jsonLdBlocks.push(parsed);
                // check duplicates by type (very naive)
            } catch (e) {
                addError(file, lang, 'Invalid JSON-LD');
            }
        });
        const types = jsonLdBlocks.map(b => b['@type']);
        if (new Set(types).size !== types.length && file !== 'produit.html') {
            addError(file, lang, 'Duplicate JSON-LD block type');
        }

        // Public pages specific checks
        if (!privatePages.includes(file) && file !== 'produit.html' && file !== 'article.html') {
            if ($('title').length !== 1) addError(file, lang, 'Must have exactly 1 <title>');
            if ($('link[rel="canonical"]').length !== 1) addError(file, lang, 'Must have exactly 1 canonical');
            if ($('link[rel="alternate"][hreflang]').length !== 5) addError(file, lang, 'Must have exactly 5 hreflang');
            
            const expectedCanonical = (file === 'index.html') 
                ? (lang === 'fr' ? 'https://www.sotramsbois.com/' : `https://www.sotramsbois.com/${lang}/`)
                : (lang === 'fr' ? `https://www.sotramsbois.com/${file}` : `https://www.sotramsbois.com/${lang}/${file}`);
                
            if ($('link[rel="canonical"]').attr('href') !== expectedCanonical) {
                addError(file, lang, `Canonical mismatch: expected ${expectedCanonical} got ${$('link[rel="canonical"]').attr('href')}`);
            }

            // H1 check
            if ($('h1').length !== 1) {
                addError(file, lang, `Must have exactly 1 <h1> (found ${$('h1').length})`);
            }

            const title = $('title').text();
            if (title.length > 60) addError(file, lang, 'Title > 60 chars');
            if (title.includes('PRO')) addError(file, lang, 'Title contains "PRO"');

            const desc = $('meta[name="description"]').attr('content');
            if (desc && desc.length > 160) addError(file, lang, 'Description > 160 chars');
        }

        // index.html in links
        const checkHref = (selector, attr) => {
            $(selector).each((i, el) => {
                const val = $(el).attr(attr);
                if (val && val.includes('index.html')) {
                    addError(file, lang, `index.html found in ${selector} ${attr}: ${val}`);
                }
            });
        };
        checkHref('link[rel="canonical"]', 'href');
        checkHref('link[rel="alternate"]', 'href');
        checkHref('meta[property="og:url"]', 'content');
        checkHref('a', 'href');
    });
});

console.log('--- SEO Audit Results ---');
console.log(`Total Errors: ${errors}`);
for (const lang in stats) {
    console.log(`\nLang: ${lang}`);
    for (const file in stats[lang]) {
        console.log(`  ${file}: ${stats[lang][file]} errors`);
    }
}

if (errors > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
