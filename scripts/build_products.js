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

const META_DESC_TEMPLATE = {
    fr: (name, mat, fmt, price) => `Découvrez ${name} (${mat}, ${fmt}). Prix public conseillé: ${price}€ TTC. Idéal pour professionnels.`,
    en: (name, mat, fmt, price) => `${name} (${mat}, ${fmt}). Recommended retail price: ${price}€ incl. VAT. Ideal for professionals.`,
    de: (name, mat, fmt, price) => `${name} (${mat}, ${fmt}). Empfohlener Verkaufspreis: ${price}€ inkl. MwSt. Ideal für professionelle Käufer.`,
    nl: (name, mat, fmt, price) => `${name} (${mat}, ${fmt}). Aanbevolen verkoopprijs: ${price}€ incl. btw. Ideaal voor professionele kopers.`,
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
            const desc = META_DESC_TEMPLATE[lang](name, species, format, price);
            const title = `${name} – sotramsbois`;
            const canonUrl = lang === 'fr' ? `${MAIN_HOST}/produits/${product.id}.html` : `${MAIN_HOST}/${lang}/produits/${product.id}.html`;

            if ($('title').length === 0) $('head').append('<title></title>');
            $('title').text(title);

            if ($('meta[name="description"]').length === 0) $('head').append('<meta name="description" content="">');
            $('meta[name="description"]').attr('content', desc);

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
                "url": canonUrl
            };
            $('head').append(`\n<script type="application/ld+json">\n${JSON.stringify(productJsonLd, null, 2)}\n</script>\n`);

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
