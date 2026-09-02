const fs = require('fs');
const path = require('path');

const dirs = ['.', 'en', 'de', 'nl'];
const filename = 'produit.html';

const targetContent = `                                const breadcrumbCat = document.getElementById('breadcrumb-category');
                                if (breadcrumbCat) {
                                    breadcrumbCat.textContent = product.subgroup_name;
                                    breadcrumbCat.href = \`./catalogue.html?subgroup=\${product.subgroup_id}\`;
                                }`;

const replacementContent = `                                const breadcrumbCat = document.getElementById('breadcrumb-category');
                                if (breadcrumbCat) {
                                    breadcrumbCat.textContent = (t.categories && t.categories[product.subgroup_id]) ? t.categories[product.subgroup_id] : product.subgroup_name;
                                    breadcrumbCat.href = \`./catalogue.html?subgroup=\${product.subgroup_id}\`;
                                }

                                // 1. Dynamic SEO
                                document.title = \`\${product.name} – Bois de Chauffage PRO\`;
                                
                                let metaDesc = document.querySelector('meta[name="description"]');
                                if (!metaDesc) {
                                    metaDesc = document.createElement('meta');
                                    metaDesc.name = "description";
                                    document.head.appendChild(metaDesc);
                                }
                                metaDesc.content = \`Découvrez \${product.name} (\${product.species_material}, \${product.format}). Prix public conseillé: \${product.recommended_price}€ TTC. Idéal pour professionnels.\`;

                                // 2. Product JSON-LD
                                const productJsonLd = {
                                    "@context": "https://schema.org/",
                                    "@type": "Product",
                                    "name": product.name,
                                    "description": \`\${product.species_material} B2B Wholesale Palette. \${product.format}\`,
                                    "sku": product.id,
                                    "image": "https://www.boisdechauffage-pro.com" + product.image_product.replace('.', ''),
                                    "offers": {
                                        "@type": "Offer",
                                        "priceCurrency": "EUR",
                                        "price": product.recommended_price,
                                        "availability": product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                                    }
                                };
                                
                                let ldScript = document.getElementById('product-json-ld');
                                if (!ldScript) {
                                    ldScript = document.createElement('script');
                                    ldScript.id = 'product-json-ld';
                                    ldScript.type = 'application/ld+json';
                                    document.head.appendChild(ldScript);
                                }
                                ldScript.textContent = JSON.stringify(productJsonLd, null, 2);`;


dirs.forEach(dir => {
    const filepath = path.join(__dirname, '..', dir, filename);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    if (content.includes('product.subgroup_name;') && !content.includes('document.title = `${product.name} – Bois de Chauffage PRO`;')) {
        content = content.replace(targetContent, replacementContent);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated produit.html in ${dir}`);
    } else {
        console.log(`produit.html already updated in ${dir}`);
    }
});
