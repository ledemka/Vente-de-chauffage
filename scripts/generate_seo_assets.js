/**
 * generate_seo_assets.js
 * 1. Fix produit.html title suffix (+ meta description) in all 4 languages
 * 2. Generate sitemap.xml
 * 3. Generate robots.txt
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const APP_URL = 'https://sotramsbois.com';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const PRIVATE_PAGES = [
    'tableau-de-bord.html',
    'admin-commandes.html',
    'connexion.html',
    'inscription.html',
    'panier.html',
    'recapitulatif-commande.html',
    'merci-contact.html',
    'merci-devis.html',
    'merci-inscription.html',
    'confirmation-commande.html',
    'activation.html',
];

const PUBLIC_PAGES = [
    'index.html',
    'catalogue.html',
    'depots.html',
    'blog.html',
    'guide-choix.html',
    'livraison.html',
    'contact.html',
    'devis.html',
    'cgv.html',
    'mentions-legales.html',
    'politique-confidentialite.html',
    'politique-retour.html',
];

const LANGS = ['fr', 'en', 'de', 'nl'];

// Hreflang codes (fr at root, others in subdirectory)
const LANG_PATHS = { fr: '', en: '/en', de: '/de', nl: '/nl' };

// Brand suffixes per language
const BRAND_SUFFIX = {
    fr: '– Bois de Chauffage PRO',
    en: '– Firewood PRO',
    de: '– Brennholz PRO',
    nl: '– Haardhout PRO',
};

// Meta description templates per language
const META_DESC_TEMPLATE = {
    fr: (name, mat, fmt, price) => `Découvrez ${name} (${mat}, ${fmt}). Prix public conseillé: ${price}€ TTC. Idéal pour professionnels.`,
    en: (name, mat, fmt, price) => `${name} (${mat}, ${fmt}). Recommended retail price: ${price}€ incl. VAT. Ideal for professionals.`,
    de: (name, mat, fmt, price) => `${name} (${mat}, ${fmt}). Empfohlener Verkaufspreis: ${price}€ inkl. MwSt. Ideal für professionelle Käufer.`,
    nl: (name, mat, fmt, price) => `${name} (${mat}, ${fmt}). Aanbevolen verkoopprijs: ${price}€ incl. btw. Ideaal voor professionele kopers.`,
};

// ─── 1. FIX produit.html TITLE + META DESCRIPTION ─────────────────────────────

LANGS.forEach(lang => {
    const filePath = lang === 'fr'
        ? path.join(rootDir, 'produit.html')
        : path.join(rootDir, lang, 'produit.html');

    if (!fs.existsSync(filePath)) {
        console.warn(`[SKIP] Missing: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Fix title suffix — replace any hardcoded brand suffix
    const titleRegex = /(\$\{getProductName\(product\)\})\s*–\s*(Bois de Chauffage PRO|Firewood PRO|Brennholz PRO|Haardhout PRO)/g;
    const newTitle = `\${getProductName(product)} ${BRAND_SUFFIX[lang]}`;
    if (titleRegex.test(content)) {
        content = content.replace(titleRegex, newTitle);
        changed = true;
        console.log(`[produit.html] Fixed title suffix for lang=${lang}`);
    } else if (!content.includes(BRAND_SUFFIX[lang])) {
        // Might already have wrong suffix - fallback replace
        const fallbackRegex = /(\$\{getProductName\(product\)\})\s*[–-]\s*[^`"']+(?:PRO)/g;
        if (fallbackRegex.test(content)) {
            content = content.replace(fallbackRegex, newTitle);
            changed = true;
            console.log(`[produit.html] Fixed title suffix (fallback) for lang=${lang}`);
        }
    }

    // Fix meta description — replace hardcoded French template
    const metaDescFrRegex = /`Découvrez \$\{getProductName\(product\)\} \(\$\{product\.species_material\}, \$\{product\.format\}\)\. Prix public conseillé: \$\{product\.recommended_price\}€ TTC\. Idéal pour professionnels\.`/g;
    const template = META_DESC_TEMPLATE[lang];
    const newMetaDesc = `\`${template('${getProductName(product)}', '${product.species_material}', '${product.format}', '${product.recommended_price}')}\``;

    if (lang !== 'fr' && metaDescFrRegex.test(content)) {
        content = content.replace(metaDescFrRegex, newMetaDesc);
        changed = true;
        console.log(`[produit.html] Fixed meta description for lang=${lang}`);
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
    } else {
        console.log(`[produit.html] No changes needed for lang=${lang}`);
    }
});

// ─── 2. GENERATE sitemap.xml ───────────────────────────────────────────────────

// Load product IDs
const productsJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'data', 'products.json'), 'utf8'));
const productIds = productsJson.map(p => p.id);

// Verify public pages exist in at least FR
const verifiedPublicPages = PUBLIC_PAGES.filter(page => {
    const exists = fs.existsSync(path.join(rootDir, page));
    if (!exists) console.warn(`[SITEMAP SKIP] Missing public page: ${page}`);
    return exists;
});

// Verify product pages exist
const verifiedProductIds = productIds.filter(id => {
    const exists = fs.existsSync(path.join(rootDir, 'produit.html')); // template exists
    return exists;
});

function pageToUrl(lang, page, productId = null) {
    const base = `${APP_URL}${LANG_PATHS[lang]}`;
    if (productId) {
        return `${base}/produit.html?id=${productId}`;
    }
    if (lang === 'fr') {
        return `${APP_URL}/${page}`;
    }
    return `${base}/${page}`;
}

function buildAlternateLinks(page, productId = null) {
    return LANGS.map(l => {
        const href = pageToUrl(l, page, productId);
        const hreflang = l === 'fr' ? 'fr' : l;
        return `        <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`;
    }).join('\n') +
        '\n' +
        `        <xhtml:link rel="alternate" hreflang="x-default" href="${pageToUrl('fr', page, productId)}"/>`;
}

let sitemapEntries = [];

// Public static pages
verifiedPublicPages.forEach(page => {
    const priority = page === 'index.html' ? '1.0' : page === 'catalogue.html' ? '0.9' : '0.7';
    const changefreq = page === 'index.html' ? 'weekly' : page === 'catalogue.html' ? 'weekly' : 'monthly';

    LANGS.forEach(lang => {
        const url = pageToUrl(lang, page);
        sitemapEntries.push(`
    <url>
        <loc>${url}</loc>
${buildAlternateLinks(page)}
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`);
    });
});

// Product pages
verifiedProductIds.forEach(id => {
    LANGS.forEach(lang => {
        const url = pageToUrl(lang, 'produit.html', id);
        sitemapEntries.push(`
    <url>
        <loc>${url}</loc>
${buildAlternateLinks('produit.html', id)}
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`);
    });
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap, 'utf8');
console.log(`\n[sitemap.xml] Generated with ${sitemapEntries.length} entries (${verifiedPublicPages.length * LANGS.length} static + ${verifiedProductIds.length * LANGS.length} product pages).`);

// ─── 3. GENERATE robots.txt ────────────────────────────────────────────────────

// Disallow paths for FR (root) + all 3 language subdirs
const disallowPaths = [];
PRIVATE_PAGES.forEach(page => {
    disallowPaths.push(`Disallow: /${page}`);
    ['en', 'de', 'nl'].forEach(l => {
        disallowPaths.push(`Disallow: /${l}/${page}`);
    });
});

const robotsTxt = `User-agent: *
Allow: /

# Private pages (noindex + disallow for defense in depth)
${disallowPaths.join('\n')}

Sitemap: ${APP_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(rootDir, 'robots.txt'), robotsTxt, 'utf8');
console.log(`[robots.txt] Generated with ${disallowPaths.length} Disallow directives (${PRIVATE_PAGES.length} pages × 4 langs).`);

console.log('\n✅ Done. Run generate-dist.js to deploy to dist-production.');
