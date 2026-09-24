const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const seoDir = path.join(__dirname, '../data/seo');
const i18nDir = path.join(__dirname, '../data/i18n');

const seoData = {};
const i18nData = {};
['fr', 'en', 'de', 'nl'].forEach(lang => {
    seoData[lang] = JSON.parse(fs.readFileSync(path.join(seoDir, lang + '.json'), 'utf8'));
    i18nData[lang] = JSON.parse(fs.readFileSync(path.join(i18nDir, lang + '.json'), 'utf8'));
});

// Helper to flatten i18n
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
const i18nFlat = {
    fr: flatten(i18nData.fr),
    en: flatten(i18nData.en),
    de: flatten(i18nData.de),
    nl: flatten(i18nData.nl)
};

const MAIN_HOST = 'https://www.sotramsbois.com';

function getCanonicalUrl(lang, pageName) {
    let p = pageName;
    if (p === 'index.html') {
        return lang === 'fr' ? `${MAIN_HOST}/` : `${MAIN_HOST}/${lang}/`;
    }
    return lang === 'fr' ? `${MAIN_HOST}/${p}` : `${MAIN_HOST}/${lang}/${p}`;
}

function processSeo(html, lang, pageName) {
    const $ = cheerio.load(html, { decodeEntities: false });
    const seoPage = pageName.replace('.html', '');
    const metaData = seoData[lang][seoPage] || {};

    const canonicalUrl = getCanonicalUrl(lang, pageName);
    
    const locales = {
        fr: 'fr_FR',
        en: 'en_GB',
        de: 'de_DE',
        nl: 'nl_NL'
    };

    // 1. Static pre-rendering for EN/DE/NL
    if (lang !== 'fr') {
        const trans = i18nFlat[lang];
        
        $('[data-i18n]').each((i, el) => {
            const key = $(el).attr('data-i18n');
            if (trans[key]) {
                const textNodes = $(el).contents().filter(function() { return this.nodeType === 3; });
                if (textNodes.length > 0) {
                    textNodes.first().replaceWith(trans[key]);
                    // If there are other text nodes, clear them so we don't duplicate
                    for(let j=1; j<textNodes.length; j++) $(textNodes[j]).remove();
                } else {
                    $(el).text(trans[key]);
                }
            }
        });
        $('[data-i18n-html]').each((i, el) => {
            const key = $(el).attr('data-i18n-html');
            if (trans[key]) {
                $(el).html(trans[key]);
            }
        });
        $('[data-i18n-placeholder], [data-i18n-title], [data-i18n-aria-label], [data-i18n-alt]').each((i, el) => {
            if ($(el).attr('data-i18n-placeholder') && trans[$(el).attr('data-i18n-placeholder')]) {
                $(el).attr('placeholder', trans[$(el).attr('data-i18n-placeholder')]);
            }
            if ($(el).attr('data-i18n-title') && trans[$(el).attr('data-i18n-title')]) {
                $(el).attr('title', trans[$(el).attr('data-i18n-title')]);
            }
            if ($(el).attr('data-i18n-aria-label') && trans[$(el).attr('data-i18n-aria-label')]) {
                $(el).attr('aria-label', trans[$(el).attr('data-i18n-aria-label')]);
            }
            if ($(el).attr('data-i18n-alt') && trans[$(el).attr('data-i18n-alt')]) {
                $(el).attr('alt', trans[$(el).attr('data-i18n-alt')]);
            }
        });
    }

    // 2. <title> and <meta name="description">
    if (metaData.title) {
        if ($('title').length === 0) $('head').append('<title></title>');
        $('title').text(metaData.title);
    }
    if (metaData.description) {
        if ($('meta[name="description"]').length === 0) $('head').append('<meta name="description" content="">');
        $('meta[name="description"]').attr('content', metaData.description);
    }

    // 3. Canonical and hreflang
    $('link[rel="canonical"]').remove();
    $('link[rel="alternate"][hreflang]').remove();
    
    // We only set fixed canonical for pages that are not dynamic
    // Wait, the prompt says "Canonical auto-référent par langue : https://www.sotramsbois.com/{lang}/{page}"
    // But later "LOT 3: le canonical de produit.html est fixe". We will handle product.html dynamically in JS later.
    // For now, inject standard canonical and hreflang for all EXCEPT produit.html maybe? The prompt says "Dans le bloc Dynamic SEO de produit.html, remplacer la valeur fixe".
    // So we can put it statically here and JS will replace it.
    $('head').append(`\n<link rel="canonical" href="${canonicalUrl}">`);
    
    ['fr', 'en', 'de', 'nl'].forEach(l => {
        $('head').append(`\n<link rel="alternate" hreflang="${l}" href="${getCanonicalUrl(l, pageName)}">`);
    });
    $('head').append(`\n<link rel="alternate" hreflang="x-default" href="${getCanonicalUrl('fr', pageName)}">`);

    // 4. Open Graph & Twitter
    $('meta[property^="og:"], meta[name^="twitter:"]').remove();
    if (metaData.title) {
        $('head').append(`\n<meta property="og:title" content="${metaData.title}">`);
    }
    if (metaData.description) {
        $('head').append(`\n<meta property="og:description" content="${metaData.description}">`);
    }
    $('head').append(`\n<meta property="og:url" content="${canonicalUrl}">`);
    $('head').append(`\n<meta property="og:site_name" content="sotramsbois">`);
    $('head').append(`\n<meta property="og:type" content="website">`);
    $('head').append(`\n<meta property="og:locale" content="${locales[lang]}">`);
    ['fr', 'en', 'de', 'nl'].filter(l => l !== lang).forEach(l => {
        $('head').append(`\n<meta property="og:locale:alternate" content="${locales[l]}">`);
    });
    // Find hero carousel image for og:image
    const heroImage = '/assets/images/briquette_ruf_pellets.jpg'; // just using one absolute
    $('head').append(`\n<meta property="og:image" content="${MAIN_HOST}${heroImage}">`);
    $('head').append(`\n<meta name="twitter:card" content="summary_large_image">`);
    
    // 5. Internal Links to Homepage
    $('a').each((i, el) => {
        let href = $(el).attr('href');
        if (href === 'index.html' || href === './index.html' || href === '../index.html') {
            const prefix = lang === 'fr' ? './' : (href.startsWith('../') ? '../' : './');
            // But wait, the prompt says "pointer sur / (ou /en/, /de/, /nl/) tous les liens internes vers l'accueil"
            // Wait, if it's hosted, we can use absolute paths!
            $(el).attr('href', lang === 'fr' ? '/' : `/${lang}/`);
        }
    });

    // JSON-LD fixing
    $('script[type="application/ld+json"]').each((i, el) => {
        let content = $(el).html();
        if (content.includes('BreadcrumbList') || content.includes('Organization')) {
            // Very naive replacement of https://sotramsbois.com to https://www.sotramsbois.com
            content = content.replace(/https:\/\/sotramsbois\.com/g, MAIN_HOST);
            if (lang !== 'fr') {
                content = content.replace(/"name"\s*:\s*"Accueil"/g, `"name": "${i18nFlat[lang]['nav.home'] || 'Home'}"`);
                content = content.replace(/"name"\s*:\s*"Catalogue"/g, `"name": "${i18nFlat[lang]['nav.catalog'] || 'Catalog'}"`);
                // update urls
                content = content.replace(/https:\/\/www\.sotramsbois\.com\//g, getCanonicalUrl(lang, 'index.html'));
                content = content.replace(/https:\/\/www\.sotramsbois\.com\/catalogue\.html/g, getCanonicalUrl(lang, 'catalogue.html'));
            }
            $(el).html(content);
        }
    });

    return $.html();
}

module.exports = { processSeo };
