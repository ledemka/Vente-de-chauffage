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
    const seoPage = pageName; // keep '.html' because it's keyed with .html in json
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
    // "Si l'entrée est vide ou absente : ne rien injecter."
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
    
    // For produit.html and article.html, apply same rule (URL without params)
    $('head').append(`\n<link rel="canonical" href="${canonicalUrl}">`);
    
    ['fr', 'en', 'de', 'nl'].forEach(l => {
        $('head').append(`\n<link rel="alternate" hreflang="${l}" href="${getCanonicalUrl(l, pageName)}">`);
    });
    $('head').append(`\n<link rel="alternate" hreflang="x-default" href="${getCanonicalUrl('fr', pageName)}">`);

    // 4. Open Graph & Twitter
    $('meta[property^="og:"], meta[name^="twitter:"]').remove();
    const hasNoIndex = $('meta[name="robots"]').attr('content') && $('meta[name="robots"]').attr('content').includes('noindex');
    if (metaData.title && metaData.description && !hasNoIndex) {
        $('head').append(`\n<meta property="og:title" content="${metaData.title}">`);
        $('head').append(`\n<meta property="og:description" content="${metaData.description}">`);
        $('head').append(`\n<meta property="og:url" content="${canonicalUrl}">`);
        $('head').append(`\n<meta property="og:site_name" content="sotramsbois">`);
        $('head').append(`\n<meta property="og:type" content="website">`);
        $('head').append(`\n<meta property="og:locale" content="${locales[lang]}">`);
        ['fr', 'en', 'de', 'nl'].filter(l => l !== lang).forEach(l => {
            $('head').append(`\n<meta property="og:locale:alternate" content="${locales[l]}">`);
        });
        
        const heroImage = '/assets/images/hero/hero-carousel-1.jpg';
        $('head').append(`\n<meta property="og:image" content="${MAIN_HOST}${heroImage}">`);
        $('head').append(`\n<meta name="twitter:card" content="summary_large_image">`);
    }
    
    // 5. Internal Links to Homepage
    // "Les liens internes vers l'accueil ... pointent sur /, en/, de/, nl/ selon la page, avec les mêmes préfixes relatifs"
    // So `./index.html` -> `./`
    // `../index.html` -> `../`
    $('a').each((i, el) => {
        let href = $(el).attr('href');
        if (href) {
            if (href === 'index.html' || href === './index.html') {
                $(el).attr('href', './');
            } else if (href.endsWith('/index.html')) {
                $(el).attr('href', href.replace(/\/index\.html$/, '/'));
            } else if (href === '../index.html') {
                $(el).attr('href', '../');
            }
        }
    });

    // 6. JSON-LD fixing
    $('script[type="application/ld+json"]').each((i, el) => {
        let content = $(el).html();
        if (content.includes('BreadcrumbList') || content.includes('Organization')) {
            let json;
            try {
                json = JSON.parse(content);
            } catch (e) {
                return;
            }
            
            // Fix URLs
            const fixUrl = (url) => {
                if (!url) return url;
                if (url.includes('sotramsbois.com')) {
                    url = url.replace(/https:\/\/sotramsbois\.com/g, MAIN_HOST);
                    url = url.replace(/https:\/\/www\.sotramsbois\.com\/index\.html/g, MAIN_HOST + '/');
                    if (lang !== 'fr') {
                        // Very naive but we just replace the base with the lang base if we can match it
                        // e.g. https://www.sotramsbois.com/catalogue.html -> https://www.sotramsbois.com/en/catalogue.html
                        if (url.startsWith(MAIN_HOST + '/') && !url.startsWith(MAIN_HOST + '/' + lang + '/')) {
                            const end = url.substring(MAIN_HOST.length + 1);
                            if (end === '') {
                                url = MAIN_HOST + '/' + lang + '/';
                            } else {
                                url = MAIN_HOST + '/' + lang + '/' + end;
                            }
                        }
                    }
                }
                return url;
            };

            if (json['@type'] === 'Organization') {
                json.url = fixUrl(json.url);
                // "Aucun ajout d'adresse, téléphone, logo, AggregateRating ni Review"
                delete json.address;
                delete json.telephone;
                delete json.logo;
                delete json.aggregateRating;
                delete json.review;
            }
            
            if (json['@type'] === 'BreadcrumbList') {
                if (json.itemListElement) {
                    json.itemListElement.forEach(item => {
                        if (item.item) {
                            item.item = fixUrl(item.item);
                            if (lang !== 'fr' && item.name === 'Accueil') item.name = i18nFlat[lang]['nav.home'] || 'Home';
                            if (lang !== 'fr' && item.name === 'Catalogue') item.name = i18nFlat[lang]['nav.catalog'] || 'Catalog';
                        }
                    });
                }
            }
            $(el).html(JSON.stringify(json, null, 2));
        }
    });

    return $.html();
}

module.exports = { processSeo };
