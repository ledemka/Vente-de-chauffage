const fs = require('fs');
const path = require('path');

// Ensure --draft flag
if (!process.argv.includes('--draft')) {
  console.error("Erreur: Le script doit être exécuté avec l'option --draft.");
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT, 'data', 'merchant-config.json');
const PRODUCTS_PATH = path.join(ROOT, 'data', 'products.json');
const DIST_PATH = path.join(ROOT, 'dist-production');
const OUT_DIR = path.join(ROOT, 'feeds-draft');

if (!fs.existsSync(CONFIG_PATH)) {
  console.error("Config manquante: data/merchant-config.json");
  process.exit(1);
}
if (!fs.existsSync(PRODUCTS_PATH)) {
  console.error("Produits manquants: data/products.json");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let reportContent = "# Rapport Génération Google Merchant Center (Draft)\n\n";
reportContent += `**Domaine à confirmer** : ${config.site_origin}\n\n`;

for (const lang of config.langs) {
  const isFr = (lang === 'fr');
  const prodDir = isFr 
    ? path.join(DIST_PATH, 'produits') 
    : path.join(DIST_PATH, lang, 'produits');
  
  if (!fs.existsSync(prodDir)) {
    console.error(`Erreur: Dossier manquant ${prodDir}`);
    process.exit(1);
  }
  const files = fs.readdirSync(prodDir);
  if (files.length === 0) {
    console.error(`Erreur: Dossier vide ${prodDir}`);
    process.exit(1);
  }

  let itemsXml = "";
  let itemCount = 0;
  const missingWarnings = [];

  for (const p of products) {
    // Determine variations
    const variations = [];
    if (p.prices_by_length) {
      for (const [len, priceHt] of Object.entries(p.prices_by_length)) {
        variations.push({
          id: `${p.id}-${len}`,
          item_group_id: p.id,
          title: `${p.name[lang]} – ${len} cm`,
          link_suffix: `?length=${len}`,
          priceHt: priceHt
        });
      }
    } else {
      variations.push({
        id: p.id,
        title: p.name[lang],
        link_suffix: "",
        priceHt: p.wholesale_price
      });
    }

    // Read HTML for description
    const htmlPath = path.join(prodDir, `${p.id}.html`);
    let description = "";
    if (fs.existsSync(htmlPath)) {
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      const descMatch = htmlContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/is);
      if (descMatch && descMatch[1]) {
        description = descMatch[1].trim();
      }
    }

    if (!description) {
      missingWarnings.push(`Produit ${p.id} : Description manquante (balise meta description non trouvée)`);
    }

    if (!config.brand) {
      missingWarnings.push(`Produit ${p.id} : Marque manquante (brand vide dans config)`);
    }
    
    if (!p.image_product) {
        missingWarnings.push(`Produit ${p.id} : Image produit introuvable`);
    }

    const avail = p.available ? 'in_stock' : 'out_of_stock';
    const imgUrl = p.image_product ? `${config.site_origin}${p.image_product}` : '';
    const addImgUrl = p.image_packaging ? `${config.site_origin}${p.image_packaging}` : '';

    const baseLink = isFr ? `${config.site_origin}/produits/${p.id}.html` : `${config.site_origin}/${lang}/produits/${p.id}.html`;

    for (const v of variations) {
      const priceTtc = (v.priceHt * (1 + config.vat_rate)).toFixed(2);
      const link = `${baseLink}${v.link_suffix}`;

      itemsXml += `
    <item>
      <g:id>${v.id}</g:id>
      ${v.item_group_id ? `<g:item_group_id>${v.item_group_id}</g:item_group_id>` : ''}
      <g:title><![CDATA[${v.title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imgUrl}</g:image_link>
      ${addImgUrl ? `<g:additional_image_link>${addImgUrl}</g:additional_image_link>` : ''}
      <g:price>${priceTtc} ${config.currency}</g:price>
      <g:availability>${avail}</g:availability>
      <g:condition>new</g:condition>
      <g:shipping_weight>${p.palette_weight}</g:shipping_weight>
      ${config.brand ? `<g:brand><![CDATA[${config.brand}]]></g:brand>` : ''}
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
      itemCount++;
    }
  }

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Sotramsbois - ${lang.toUpperCase()}</title>
    <link>${config.site_origin}${!isFr ? `/${lang}` : ''}</link>
    <description>Flux Google Merchant Center (Draft)</description>${itemsXml}
  </channel>
</rss>`;

  const outXmlPath = path.join(OUT_DIR, `merchant-${lang}.xml`);
  fs.writeFileSync(outXmlPath, feedXml, 'utf8');

  // Add to report
  reportContent += `## Flux ${lang.toUpperCase()}\n`;
  reportContent += `- Nombre d'articles générés : ${itemCount}\n`;
  if (missingWarnings.length > 0) {
    reportContent += `- Avertissements : \n`;
    // De-duplicate warnings to keep report clean if they repeat per variant
    const uniqueWarnings = [...new Set(missingWarnings)];
    for (const w of uniqueWarnings) {
      reportContent += `  - ${w}\n`;
    }
  } else {
    reportContent += `- Aucun avertissement.\n`;
  }
  reportContent += `\n`;
}

const outReportPath = path.join(OUT_DIR, 'report.md');
fs.writeFileSync(outReportPath, reportContent, 'utf8');

console.log(`Génération réussie en mode --draft. Dossier: ${OUT_DIR}`);
