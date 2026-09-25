const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { processSeo } = require('./post_process_seo');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist-production');
const LANGS = ['fr', 'en', 'de', 'nl'];
const MAIN_HOST = 'https://www.sotramsbois.com';

function getProductField(p, field, lang) {
    if (!p || !p[field]) return '';
    if (typeof p[field] === 'string') return p[field];
    return p[field][lang] || p[field]['fr'] || '';
}

function getProductName(p, lang) {
    return getProductField(p, 'name', lang);
}

const SEO_KEYWORDS = {
    fr: {
        firewood: 'Bois de chauffage B2B, Grossiste',
        pellets: 'Pellets Grossiste, B2B',
        briquettes: 'Briquettes Grossiste, B2B',
        default: 'Grossiste B2B'
    },
    en: {
        firewood: 'Wholesale Firewood Supplier',
        pellets: 'Wood Pellets Wholesale Supplier',
        briquettes: 'Wholesale Wood Briquettes',
        default: 'Wholesale B2B'
    },
    de: {
        firewood: 'Brennholz Großhandel Lieferant',
        pellets: 'Holzpellets Großhandel',
        briquettes: 'Holzbriketts Großhandel',
        default: 'Großhandel Lieferant'
    },
    nl: {
        firewood: 'Brandhout Groothandel Leverancier',
        pellets: 'Houtpellets Groothandel',
        briquettes: 'Houtbriketten Groothandel',
        default: 'Groothandel Leverancier'
    }
};

function getSeoKeywords(subgroupId, lang) {
    const k = SEO_KEYWORDS[lang] || SEO_KEYWORDS.fr;
    if (subgroupId === 1) return k.firewood;
    if (subgroupId === 4) return k.pellets;
    if (subgroupId === 2 || subgroupId === 3) return k.briquettes;
    return k.default;
}

const META_DESC_TEMPLATE = {
    fr: (name, kw, mat, fmt, price) => price > 0 ? `${kw}. Découvrez ${name} (${mat}, ${fmt}) pour professionnels. Prix conseillé: ${price}€ TTC. Idéal pour l'achat en gros.` : `${kw}. Découvrez ${name} (${mat}, ${fmt}) pour professionnels. Idéal pour l'achat en gros.`,
    en: (name, kw, mat, fmt, price) => price > 0 ? `${kw}. ${name} (${mat}, ${fmt}) for professionals. Retail price: ${price}€ incl. VAT. Ideal for bulk buyers.` : `${kw}. ${name} (${mat}, ${fmt}) for professionals. Ideal for bulk buyers.`,
    de: (name, kw, mat, fmt, price) => price > 0 ? `${kw}. ${name} (${mat}, ${fmt}) für Profis. Verkaufspreis: ${price}€ inkl. MwSt. Ideal für Großeinkäufer.` : `${kw}. ${name} (${mat}, ${fmt}) für Profis. Ideal für Großeinkäufer.`,
    nl: (name, kw, mat, fmt, price) => price > 0 ? `${kw}. ${name} (${mat}, ${fmt}) voor professionals. Verkoopprijs: ${price}€ incl. btw. Ideaal voor zakelijke kopers.` : `${kw}. ${name} (${mat}, ${fmt}) voor professionals. Ideaal voor zakelijke kopers.`,
};

function buildProducts() {
    console.log('=== Building Product Static Pages ===');
    const productsJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/products.json'), 'utf8'));
    const srcHtml = fs.readFileSync(path.join(ROOT_DIR, 'produit.html'), 'utf8');

    let total = 0;
    LANGS.forEach(lang => {
        productsJson.forEach(product => {
            let content = srcHtml;
            
            // 1. Base i18n translation from post_process_seo
            content = processSeo(content, lang, 'produit.html');
            
            // 2. Language and path fixing
            if (lang !== 'fr') {
                content = content.replace(/<html[^>]*lang="[^"]*"[^>]*>/i, (match) => match.replace(/lang="[^"]*"/i, `lang="${lang}"`));
                // In /en/produits/, it's 2 levels deep
                content = content.replace(/(['"]).\/(assets|data|api)\//g, `$1../../$2/`);
            } else {
                // In /produits/, it's 1 level deep
                content = content.replace(/(['"]).\/(assets|data|api)\//g, `$1../$2/`);
            }

            // 3. Cheerio manipulation for SEO
            const $ = cheerio.load(content, { decodeEntities: false });

            // Fix relative links (e.g. href="./catalogue.html" -> href="../catalogue.html")
            const levelsBack = lang === 'fr' ? '../' : '../../';
            $('a').each((i, el) => {
                let href = $(el).attr('href');
                if (href && href.startsWith('./')) {
                    $(el).attr('href', href.replace('./', levelsBack));
                } else if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('mailto:')) {
                    // e.g. "catalogue.html" without ./
                    $(el).attr('href', levelsBack + href);
                }
            });

            // Inject PRODUCT_ID
            $('head').append(`\n<script>window.PRODUCT_ID = '${product.id}';</script>\n`);

            // Generate SEO data
            const name = getProductName(product, lang);
            const species = getProductField(product, 'species_material', lang);
            const format = product.format;
            const price = product.recommended_price || 0;
            const kw = getSeoKeywords(product.subgroup_id, lang);
            const desc = META_DESC_TEMPLATE[lang](name, kw, species, format, price);
            const title = `${name} – ${kw} | sotramsbois`;
            const canonUrl = lang === 'fr' ? `${MAIN_HOST}/produits/${product.id}.html` : `${MAIN_HOST}/${lang}/produits/${product.id}.html`;

            if ($('title').length === 0) $('head').append('<title></title>');
            $('title').text(title);

            if ($('meta[name="description"]').length === 0) $('head').append('<meta name="description" content="">');
            $('meta[name="description"]').attr('content', desc);
            
            // Enhance H1 - Keep it clean, just the product name
            if ($('h1#product-name').length) {
                $('h1#product-name').text(name);
            } else if ($('#product-title').length) {
                $('#product-title').text(name);
            } else if ($('h1').length) {
                $('h1').first().text(name);
            }
            
            // SEO Images
            const imgPath1 = lang === 'fr' ? `../${product.image_product}` : `../../${product.image_product}`;
            const imgPath2 = lang === 'fr' ? `../${product.image_packaging}` : `../../${product.image_packaging}`;
            
            $('#product-img-1')
                .attr('src', imgPath1)
                .attr('alt', `${name} - ${species}`)
                .attr('width', '600')
                .attr('height', '400')
                .attr('fetchpriority', 'high');
                
            $('#product-img-2')
                .attr('src', imgPath2)
                .attr('alt', `Conditionnement de ${name}`)
                .attr('width', '600')
                .attr('height', '400')
                .attr('loading', 'lazy');

            $('link[rel="canonical"]').remove();
            $('link[rel="alternate"][hreflang]').remove();

            $('head').append(`\n<link rel="canonical" href="${canonUrl}">`);
            LANGS.forEach(l => {
                const href = l === 'fr' ? `${MAIN_HOST}/produits/${product.id}.html` : `${MAIN_HOST}/${l}/produits/${product.id}.html`;
                const hl = l === 'fr' ? 'fr' : l;
                $('head').append(`\n<link rel="alternate" hreflang="${hl}" href="${href}">`);
            });
            $('head').append(`\n<link rel="alternate" hreflang="x-default" href="${MAIN_HOST}/produits/${product.id}.html">`);

            // Product JSON-LD
            const productJsonLd = {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": name,
                "description": desc,
                "sku": product.id,
                "image": `${MAIN_HOST}/${String(product.image_product).replace(/^\/+/, '')}`,
                "url": canonUrl,
                "brand": {
                    "@type": "Brand",
                    "name": "Sotrams Bois"
                }
            };
            $('head').append(`\n<script type="application/ld+json">\n${JSON.stringify(productJsonLd, null, 2)}\n</script>\n`);

            // Open Graph & Twitter
            const ogLocale = lang === 'fr' ? 'fr_FR' : (lang === 'en' ? 'en_GB' : (lang === 'de' ? 'de_DE' : 'nl_NL'));
            $('head').append(`\n<meta property="og:type" content="product">`);
            $('head').append(`\n<meta property="og:title" content="${title}">`);
            $('head').append(`\n<meta property="og:description" content="${desc}">`);
            $('head').append(`\n<meta property="og:url" content="${canonUrl}">`);
            $('head').append(`\n<meta property="og:image" content="${MAIN_HOST}/${String(product.image_product).replace(/^\/+/, '')}">`);
            $('head').append(`\n<meta property="og:site_name" content="sotramsbois">`);
            $('head').append(`\n<meta property="og:locale" content="${ogLocale}">`);
            $('head').append(`\n<meta name="twitter:card" content="summary_large_image">`);

            // HTML Static Hydration (pre-rendering for SEO without noscript)
            $('#product-ref').text(`Ref: ${product.id.toUpperCase()}-PAL`);
            const displayHumidity = product.humidity_bucket || "Non communiqué";
            $('#product-desc').text(`${species} - Humidité: ${displayHumidity}`);
            $('#product-stock').text('En Stock');
            $('#spec-essence').text(species);
            $('#spec-longueur').text(format);
            $('#spec-humidite').text(displayHumidity);
            $('#spec-origine').text(product.origin || 'À préciser');
            $('#spec-pouvoir').text('~ 4.8 kWh/kg');
            $('#spec-poids').text(product.palette_weight || '');
            $('#spec-volume-m3').text(product.volume_m3 ? `${product.volume_m3} m³` : '');
            $('#spec-conditionnement').text((product.units_per_palette || '') + ' unités par palette');
            
            // Note: The JavaScript (product.js logic inside produit.html) will still execute on the client
            // and overwrite these with the correct translated strings based on the dynamic lang,
            // but the crawlers will now see these static real values instead of placeholders or empty spans!


            // Output
            const outPath = lang === 'fr' 
                ? path.join(DIST_DIR, 'produits', `${product.id}.html`)
                : path.join(DIST_DIR, lang, 'produits', `${product.id}.html`);
            
            fs.mkdirSync(path.dirname(outPath), { recursive: true });
            fs.writeFileSync(outPath, $.html());
            total++;
            
            // Also save to root lang/produits for local dev
            const localDevPath = lang === 'fr' 
                ? path.join(ROOT_DIR, 'produits', `${product.id}.html`)
                : path.join(ROOT_DIR, lang, 'produits', `${product.id}.html`);
            fs.mkdirSync(path.dirname(localDevPath), { recursive: true });
            fs.writeFileSync(localDevPath, $.html());
        });
    });
    console.log(`[Products] Generated ${total} static product pages.`);
}

module.exports = { buildProducts };
