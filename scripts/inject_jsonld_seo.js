/**
 * inject_jsonld_seo.js
 * 1. Fix produit.html meta description (4 langs) — localized template
 * 2. Inject Organization + BreadcrumbList JSON-LD into 12 public pages × 4 langs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://www.sotramsbois.com';

// ─── BREADCRUMB LABELS (from i18n files, exact values) ────────────────────────

const HOME = { fr: 'Accueil', en: 'Home', de: 'Startseite', nl: 'Home' };

// page → { file, label per lang }
// Labels sourced exactly from data/i18n/*.json nav/footer keys
const PAGES = [
    {
        file: 'catalogue.html',
        label: { fr: 'Catalogue', en: 'Catalog', de: 'Katalog', nl: 'Catalogus' }
    },
    {
        file: 'depots.html',
        label: { fr: 'Dépôts', en: 'Depots', de: 'Depots', nl: 'Depots' }
    },
    {
        file: 'blog.html',
        label: { fr: 'Blog', en: 'Blog', de: 'Blog', nl: 'Blog' }
    },
    {
        file: 'guide-choix.html',
        label: { fr: 'Guide de Choix', en: 'Buying Guide', de: 'Ratgeber', nl: 'Keuzehulp' }
    },
    {
        file: 'livraison.html',
        label: { fr: 'Livraison', en: 'Delivery', de: 'Lieferung', nl: 'Levering' }
    },
    {
        file: 'avis-clients.html',
        label: { fr: 'Avis Clients', en: 'Reviews', de: 'Bewertungen', nl: 'Beoordelingen' }
    },
    {
        file: 'contact.html',
        label: { fr: 'Contact', en: 'Contact', de: 'Kontakt', nl: 'Contact' }
    },
    {
        file: 'devis.html',
        label: { fr: 'Devis', en: 'Quote', de: 'Angebot', nl: 'Offerte' }
    },
    {
        file: 'cgv.html',
        label: { fr: 'CGV', en: 'Terms & Conditions', de: 'AGB', nl: 'Algemene Voorwaarden' }
    },
    {
        file: 'mentions-legales.html',
        label: { fr: 'Mentions Légales', en: 'Legal Notice', de: 'Impressum', nl: 'Juridische kennisgeving' }
    },
    {
        file: 'politique-confidentialite.html',
        label: { fr: 'Confidentialité', en: 'Privacy Policy', de: 'Datenschutz', nl: 'Privacybeleid' }
    },
    {
        file: 'politique-retour.html',
        label: { fr: 'Politique de Retour', en: 'Return Policy', de: 'Rückgaberecht', nl: 'Retourbeleid' }
    },
];

const LANG_PREFIX = { fr: '', en: '/en', de: '/de', nl: '/nl' };
const LANGS = ['fr', 'en', 'de', 'nl'];

// ─── JSON-LD BUILDERS ─────────────────────────────────────────────────────────

function buildOrganization() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'sotramsbois',
        'url': 'https://www.sotramsbois.com'
    };
}

function buildBreadcrumb(lang, file) {
    const prefix = LANG_PREFIX[lang];
    const pageSlug = file === 'index.html' ? '' : file;
    const homeUrl = `${BASE_URL}${prefix}/`;
    const pageUrl = `${BASE_URL}${prefix}/${pageSlug}`;
    const pageEntry = PAGES.find(p => p.file === file);
    const pageName = pageEntry ? pageEntry.label[lang] : file;

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': HOME[lang], 'item': homeUrl },
            { '@type': 'ListItem', 'position': 2, 'name': pageName, 'item': pageUrl }
        ]
    };
}

function buildJsonLdBlock(org, breadcrumb) {
    const orgJson = JSON.stringify(org, null, 4);
    const bcJson = JSON.stringify(breadcrumb, null, 4);
    return `    <!-- JSON-LD Organization + BreadcrumbList -->
    <script type="application/ld+json">
${orgJson}
    </script>
    <script type="application/ld+json">
${bcJson}
    </script>`;
}

// ─── PART 1: Fix produit.html meta description (4 langs) ─────────────────────

const META_DESC_SEARCH = /metaDesc\.content\s*=\s*`[^`]+`;/;

const META_DESC_REPLACEMENT = `const descTemplates = {
                                    fr: (p) => \`Découvrez \${getProductName(p)} (\${p.species_material}, \${p.format}). Prix conseillé : \${p.recommended_price}€ TTC. Livraison palette ou camion complet pour professionnels.\`,
                                    en: (p) => \`Explore \${getProductName(p)} (\${p.species_material}, \${p.format}). Recommended retail price: €\${p.recommended_price} incl. VAT. Pallet or full truckload delivery for trade buyers.\`,
                                    de: (p) => \`Entdecken Sie \${getProductName(p)} (\${p.species_material}, \${p.format}). Empfohlener Verkaufspreis: \${p.recommended_price}€ inkl. MwSt. Lieferung per Palette oder Komplettladung für Gewerbekunden.\`,
                                    nl: (p) => \`Ontdek \${getProductName(p)} (\${p.species_material}, \${p.format}). Aanbevolen verkoopprijs: €\${p.recommended_price} incl. btw. Levering per pallet of volle vracht voor zakelijke klanten.\`
                                };
                                const descLang = document.documentElement.lang || 'fr';
                                metaDesc.content = (descTemplates[descLang] || descTemplates.fr)(product);`;

let produitFixed = 0;
LANGS.forEach(lang => {
    const filePath = lang === 'fr'
        ? path.join(ROOT, 'produit.html')
        : path.join(ROOT, lang, 'produit.html');

    if (!fs.existsSync(filePath)) { console.warn(`[SKIP] ${filePath}`); return; }

    let content = fs.readFileSync(filePath, 'utf8');

    if (META_DESC_SEARCH.test(content)) {
        content = content.replace(META_DESC_SEARCH, META_DESC_REPLACEMENT);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[produit.html] Fixed meta description for lang=${lang}`);
        produitFixed++;
    } else {
        console.log(`[produit.html] No match for meta desc in lang=${lang} (already fixed?)`);
    }
});

// ─── PART 2: Inject Organization + BreadcrumbList into 12 public pages ────────

let injected = 0;

LANGS.forEach(lang => {
    PAGES.forEach(({ file }) => {
        const filePath = lang === 'fr'
            ? path.join(ROOT, file)
            : path.join(ROOT, lang, file);

        if (!fs.existsSync(filePath)) { console.warn(`[SKIP] Missing: ${filePath}`); return; }

        let content = fs.readFileSync(filePath, 'utf8');

        // Skip if already has Organization JSON-LD
        if (content.includes('"@type": "Organization"')) {
            console.log(`[SKIP] Organization already present in ${lang}/${file}`);
            return;
        }

        const org = buildOrganization();
        const breadcrumb = buildBreadcrumb(lang, file);
        const block = buildJsonLdBlock(org, breadcrumb);

        // Insert before </head>
        if (content.includes('</head>')) {
            content = content.replace('</head>', `${block}\n</head>`);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`[INJECT] Organization + BreadcrumbList → ${lang}/${file}`);
            injected++;
        } else {
            console.warn(`[WARN] No </head> found in ${filePath}`);
        }
    });
});

console.log(`\n✅ Done: ${produitFixed}/4 produit.html meta desc fixed, ${injected}/${LANGS.length * PAGES.length} pages injected.`);
