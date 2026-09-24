const fs = require('fs');
let html = fs.readFileSync('produit.html', 'utf8');

const newDynamicSeo = `// 1. Dynamic SEO
                                const prodName = getProductName(product).substring(0, 45); // safeguard
                                document.title = \`\${prodName} – sotramsbois\`;
                                
                                let metaDesc = document.querySelector('meta[name="description"]');
                                if (!metaDesc) {
                                    metaDesc = document.createElement('meta');
                                    metaDesc.name = "description";
                                    document.head.appendChild(metaDesc);
                                }
                                
                                const upp = product.units_per_palette || '';
                                const pw = product.palette_weight_kg ? product.palette_weight_kg + 'kg' : '';
                                const descTemplates = {
                                    fr: (p) => \`Découvrez \${getProductName(p)} (\${getProductField(p, 'species_material')}, \${p.format}, \${upp} unités, \${pw}). Commandez en gros pour votre activité professionnelle.\`,
                                    en: (p) => \`Explore \${getProductName(p)} (\${getProductField(p, 'species_material')}, \${p.format}, \${upp} units, \${pw}). Order in bulk for your professional activity.\`,
                                    de: (p) => \`Entdecken Sie \${getProductName(p)} (\${getProductField(p, 'species_material')}, \${p.format}, \${upp} Einheiten, \${pw}). Bestellen Sie in großen Mengen für Ihre professionelle Tätigkeit.\`,
                                    nl: (p) => \`Ontdek \${getProductName(p)} (\${getProductField(p, 'species_material')}, \${p.format}, \${upp} eenheden, \${pw}). Bestel in bulk voor uw professionele activiteit.\`
                                };
                                const descLang = document.documentElement.lang || 'fr';
                                let generatedDesc = (descTemplates[descLang] || descTemplates.fr)(product);
                                if (generatedDesc.length > 160) generatedDesc = generatedDesc.substring(0, 157) + '...';
                                metaDesc.content = generatedDesc;
                                
                                // Canonical and Hreflang
                                const host = 'https://www.sotramsbois.com';
                                const getUrl = (l) => l === 'fr' ? \`\${host}/produit.html?id=\${product.id}\` : \`\${host}/\${l}/produit.html?id=\${product.id}\`;
                                
                                let canonical = document.querySelector('link[rel="canonical"]');
                                if (!canonical) {
                                    canonical = document.createElement('link');
                                    canonical.rel = 'canonical';
                                    document.head.appendChild(canonical);
                                }
                                canonical.href = getUrl(descLang);
                                
                                document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
                                ['fr', 'en', 'de', 'nl'].forEach(l => {
                                    const link = document.createElement('link');
                                    link.rel = 'alternate';
                                    link.hreflang = l;
                                    link.href = getUrl(l);
                                    document.head.appendChild(link);
                                });
                                const xdef = document.createElement('link');
                                xdef.rel = 'alternate';
                                xdef.hreflang = 'x-default';
                                xdef.href = getUrl('fr');
                                document.head.appendChild(xdef);

                                // OG and Twitter tags
                                document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(el => el.remove());
                                
                                const addMeta = (prop, content) => {
                                    const meta = document.createElement('meta');
                                    if(prop.startsWith('og:')) meta.setAttribute('property', prop);
                                    else meta.setAttribute('name', prop);
                                    meta.content = content;
                                    document.head.appendChild(meta);
                                };
                                
                                addMeta('og:title', document.title);
                                addMeta('og:description', metaDesc.content);
                                addMeta('og:url', canonical.href);
                                addMeta('og:type', 'product');
                                if (product.images && product.images.length > 0) {
                                    addMeta('og:image', host + product.images[0]);
                                }
                                addMeta('twitter:card', 'summary_large_image');
                                

                                // 2. Product JSON-LD
                                const productJsonLd = {
                                    "@context": "https://schema.org/",
                                    "@type": "Product",
                                    "name": getProductName(product),
                                    "image": product.images ? product.images.map(img => host + img) : [],
                                    "description": metaDesc.content,
                                    "sku": product.id,
                                    "brand": {
                                        "@type": "Brand",
                                        "name": "sotramsbois"
                                    }
                                };
                                
                                if (product.prices_by_length) {
                                    const prices = Object.values(product.prices_by_length);
                                    if (prices.length > 0) {
                                        const minP = Math.min(...prices);
                                        const maxP = Math.max(...prices);
                                        productJsonLd.offers = {
                                            "@type": "AggregateOffer",
                                            "priceCurrency": "EUR",
                                            "lowPrice": minP.toFixed(2),
                                            "highPrice": maxP.toFixed(2),
                                            "availability": "https://schema.org/InStock",
                                            "url": canonical.href
                                        };
                                    }
                                } else if (product.recommended_price) {
                                    productJsonLd.offers = {
                                        "@type": "Offer",
                                        "priceCurrency": "EUR",
                                        "price": product.recommended_price.toFixed(2),
                                        "availability": "https://schema.org/InStock",
                                        "url": canonical.href,
                                        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
                                    };
                                }
                                
                                let jsonLdScript = document.querySelector('script[type="application/ld+json"].product-jsonld');
                                if (!jsonLdScript) {
                                    jsonLdScript = document.createElement('script');
                                    jsonLdScript.type = "application/ld+json";
                                    jsonLdScript.className = "product-jsonld";
                                    document.head.appendChild(jsonLdScript);
                                }
                                jsonLdScript.textContent = JSON.stringify(productJsonLd, null, 2);`;

// Regex replacement
const regex = /\/\/ 1\. Dynamic SEO[\s\S]*?(?=\/\/ 3\. Initialize components)/;
html = html.replace(regex, newDynamicSeo + '\n\n                                ');

fs.writeFileSync('produit.html', html);
console.log('Lot 3 applied to produit.html');
