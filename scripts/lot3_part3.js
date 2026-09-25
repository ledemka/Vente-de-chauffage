const fs = require('fs');

let html = fs.readFileSync('produit.html', 'utf8');

// Replace the SEO block
const oldSeoStart = '// 1. Dynamic SEO';
const oldSeoEnd = '// 3.6 units per palette';
// Actually we can replace up to `const qtyInput` to include the unit price replacement.

// Find the start index
const startIndex = html.indexOf(oldSeoStart);
const endIndex = html.indexOf('const qtyInput = document.getElementById(\'qty-input\');');

if (startIndex !== -1 && endIndex !== -1) {
    const newSeoBlock = `// 1. Dynamic SEO
                                const lang = document.documentElement.lang || 'fr';
                                
                                // Clean up static tags
                                document.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach(el => el.remove());

                                // Add Canonical
                                const canon = document.createElement('link');
                                canon.rel = 'canonical';
                                canon.href = \`https://www.sotramsbois.com\${lang === 'fr' ? '' : '/' + lang}/produit.html?id=\${product.id}\`;
                                document.head.appendChild(canon);

                                // Add Hreflang
                                ['fr', 'en', 'de', 'nl', 'x-default'].forEach(l => {
                                    const alt = document.createElement('link');
                                    alt.rel = 'alternate';
                                    alt.hreflang = l;
                                    const prefix = (l === 'fr' || l === 'x-default') ? '' : '/' + l;
                                    alt.href = \`https://www.sotramsbois.com\${prefix}/produit.html?id=\${product.id}\`;
                                    document.head.appendChild(alt);
                                });

                                // Title
                                const titleTemplate = window.i18n && window.i18n.t ? window.i18n.t('product.seo_title', '{name} – sotramsbois') : '{name} – sotramsbois';
                                const pageTitle = titleTemplate.replace('{name}', getProductName(product));
                                document.title = pageTitle;

                                // Description
                                let formatStr = product.format;
                                if (isBuche && product.prices_by_length) {
                                    formatStr = Object.keys(product.prices_by_length).join('/') + ' cm';
                                }
                                
                                const descTemplate = window.i18n && window.i18n.t 
                                    ? window.i18n.t('product.seo_description', '{name} ({species}, {format}). {units} unités/palette, {palette_weight}. Demandez un devis pro gratuit.') 
                                    : '{name} ({species}, {format}). {units} unités/palette, {palette_weight}. Demandez un devis pro gratuit.';
                                
                                let pageDesc = descTemplate
                                    .replace('{name}', getProductName(product))
                                    .replace('{species}', getProductField(product, 'species_material'))
                                    .replace('{format}', formatStr)
                                    .replace('{units}', product.units_per_palette)
                                    .replace('{palette_weight}', product.palette_weight);

                                if (pageDesc.length > 160) {
                                    const lastSpace = pageDesc.lastIndexOf(' ', 157);
                                    pageDesc = pageDesc.substring(0, lastSpace > 0 ? lastSpace : 157) + '...';
                                }

                                let metaDesc = document.querySelector('meta[name="description"]');
                                if (!metaDesc) {
                                    metaDesc = document.createElement('meta');
                                    metaDesc.name = "description";
                                    document.head.appendChild(metaDesc);
                                }
                                metaDesc.content = pageDesc;

                                // Open Graph & Twitter
                                const ogData = {
                                    'og:type': 'product',
                                    'og:title': pageTitle,
                                    'og:description': pageDesc,
                                    'og:url': canon.href,
                                    'og:image': 'https://www.sotramsbois.com/' + String(product.image_product).replace(/^\\/+/, ''),
                                    'og:site_name': 'sotramsbois',
                                    'og:locale': lang === 'fr' ? 'fr_FR' : (lang === 'en' ? 'en_GB' : (lang === 'de' ? 'de_DE' : 'nl_NL')),
                                    'twitter:card': 'summary_large_image'
                                };
                                for (const [prop, content] of Object.entries(ogData)) {
                                    let metaOg = document.querySelector(\`meta[property="\${prop}"], meta[name="\${prop}"]\`);
                                    if (!metaOg) {
                                        metaOg = document.createElement('meta');
                                        if (prop.startsWith('twitter:')) metaOg.name = prop;
                                        else metaOg.setAttribute('property', prop);
                                        document.head.appendChild(metaOg);
                                    }
                                    metaOg.content = content;
                                }

                                // Breadcrumb JSON-LD
                                const breadcrumbJsonLd = {
                                    "@context": "https://schema.org",
                                    "@type": "BreadcrumbList",
                                    "itemListElement": [
                                        {
                                            "@type": "ListItem",
                                            "position": 1,
                                            "name": window.i18n && window.i18n.t ? window.i18n.t('nav.home', 'Accueil') : 'Accueil',
                                            "item": \`https://www.sotramsbois.com\${lang === 'fr' ? '' : '/' + lang}/\`
                                        },
                                        {
                                            "@type": "ListItem",
                                            "position": 2,
                                            "name": window.i18n && window.i18n.t ? window.i18n.t('nav.catalog', 'Catalogue') : 'Catalogue',
                                            "item": \`https://www.sotramsbois.com\${lang === 'fr' ? '' : '/' + lang}/catalogue.html\`
                                        },
                                        {
                                            "@type": "ListItem",
                                            "position": 3,
                                            "name": getProductName(product),
                                            "item": canon.href
                                        }
                                    ]
                                };
                                let ldBreadcrumb = document.getElementById('breadcrumb-json-ld');
                                if (!ldBreadcrumb) {
                                    ldBreadcrumb = document.createElement('script');
                                    ldBreadcrumb.id = 'breadcrumb-json-ld';
                                    ldBreadcrumb.type = 'application/ld+json';
                                    document.head.appendChild(ldBreadcrumb);
                                }
                                ldBreadcrumb.textContent = JSON.stringify(breadcrumbJsonLd, null, 2);

                                // 2. Product JSON-LD
                                let displayPrice = 0;
                                let isAggregate = false;
                                let lowPrice = 0, highPrice = 0, offerCount = 0;
                                
                                if (isBuche && product.prices_by_length) {
                                    const prices = Object.values(product.prices_by_length).map(p => Number(p) * 1.20);
                                    if (prices.length > 0) {
                                        lowPrice = Math.min(...prices).toFixed(2);
                                        highPrice = Math.max(...prices).toFixed(2);
                                        offerCount = prices.length;
                                        isAggregate = true;
                                    }
                                } else if (product.wholesale_price) {
                                    displayPrice = (Number(product.wholesale_price) * 1.20).toFixed(2);
                                }
                                
                                const offers = {};
                                if (isAggregate) {
                                    offers["@type"] = "AggregateOffer";
                                    offers["priceCurrency"] = "EUR";
                                    offers["lowPrice"] = lowPrice;
                                    offers["highPrice"] = highPrice;
                                    offers["offerCount"] = offerCount;
                                } else if (displayPrice > 0) {
                                    offers["@type"] = "Offer";
                                    offers["priceCurrency"] = "EUR";
                                    offers["price"] = displayPrice;
                                    offers["availability"] = product.available === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock";
                                    offers["itemCondition"] = "https://schema.org/NewCondition";
                                    offers["valueAddedTaxIncluded"] = true;
                                }

                                const productJsonLd = {
                                    "@context": "https://schema.org/",
                                    "@type": "Product",
                                    "name": getProductName(product),
                                    "description": pageDesc,
                                    "sku": product.id,
                                    "image": "https://www.sotramsbois.com/" + String(product.image_product).replace(/^\\/+/, ''),
                                    "url": canon.href
                                };
                                
                                if (Object.keys(offers).length > 0) {
                                    productJsonLd.offers = offers;
                                }

                                let ldScript = document.getElementById('product-json-ld');
                                if (!ldScript) {
                                    ldScript = document.createElement('script');
                                    ldScript.id = 'product-json-ld';
                                    ldScript.type = 'application/ld+json';
                                    document.head.appendChild(ldScript);
                                }
                                ldScript.textContent = JSON.stringify(productJsonLd, null, 2);

                                // 3.6 units per palette
                                const unitT = window.i18n && window.i18n.t ? window.i18n.t('product.units_per_pallet', 'unités par palette') : 'unités par palette';
                                document.getElementById('spec-conditionnement').textContent = product.units_per_palette + ' ' + unitT;

                                `;
    html = html.substring(0, startIndex) + newSeoBlock + html.substring(endIndex);
    fs.writeFileSync('produit.html', html, 'utf8');
    console.log('Updated produit.html');
} else {
    console.log('Could not find start or end index');
}
