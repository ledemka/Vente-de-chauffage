const fs = require("fs");
const path = require("path");

const isDraft = process.argv.includes("--draft");

const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "data", "merchant-config.json");
const PRODUCTS_PATH = path.join(ROOT, "data", "products.json");
const DIST_PATH = path.join(ROOT, "dist-production");
const OUT_DIR = isDraft
  ? path.join(ROOT, "feeds-draft")
  : path.join(DIST_PATH, "feeds");

if (!fs.existsSync(CONFIG_PATH)) {
  console.error("Config manquante: data/merchant-config.json");
  process.exit(1);
}
if (!fs.existsSync(PRODUCTS_PATH)) {
  console.error("Produits manquants: data/products.json");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));

if (!isDraft) {
  if (!config.brand || config.publish !== true) {
    console.log("Flux non publiés : marque vide ou publish=false");
    process.exit(0);
  }
}

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let hasError = false;

let reportContent = `# Rapport Génération Google Merchant Center (${isDraft ? "Draft" : "Production"})\n\n`;
reportContent += `**Domaine à confirmer** : ${config.site_origin}\n\n`;

for (const lang of config.langs) {
  const isFr = lang === "fr";
  const prodDir = isFr
    ? path.join(DIST_PATH, "produits")
    : path.join(DIST_PATH, lang, "produits");

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
  let cleanedCount = 0;
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
          priceHt: priceHt,
        });
      }
    } else {
      variations.push({
        id: p.id,
        title: p.name[lang],
        link_suffix: "",
        priceHt: p.wholesale_price,
      });
    }

    // Read HTML for description
    const htmlPath = path.join(prodDir, `${p.id}.html`);
    let description = "";
    if (fs.existsSync(htmlPath)) {
      const htmlContent = fs.readFileSync(htmlPath, "utf8");
      const descMatch = htmlContent.match(
        /<meta\s+name=(["'])description\1\s+content=(["'])([\s\S]*?)\2\s*\/?>/i,
      );
      if (descMatch && descMatch[3]) {
        description = descMatch[3].trim();
        // Decode HTML entities
        description = description
          .replace(/&amp;/g, "&")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">");

        // Scrub price phrase
        const originalDesc = description;
        const pricePhraseRegex =
          /(Prix (public )?conseillé|Retail price|Recommended retail price|Empfohlener Verkaufspreis|Aanbevolen verkoopprijs)[\s\S]*?€[^.]*\./gi;
        description = description
          .replace(pricePhraseRegex, "")
          .replace(/\s+/g, " ")
          .trim();
        if (originalDesc !== description) {
          cleanedCount++;
        }

        // Safety check for remaining price pattern: \d+[.,]\d{2}\s*€ or € followed by digit
        if (/\d+[.,]\d{2}\s*€|€\s*\d+/i.test(description)) {
          const msg = `Produit ${p.id} : Motif de prix suspect détecté dans la description après nettoyage.`;
          missingWarnings.push(msg);
          if (!isDraft) {
            console.error("Erreur critique: " + msg);
            hasError = true;
          }
        }
      }
    }

    if (!description) {
      const msg = `Produit ${p.id} : Description manquante (balise meta description non trouvée)`;
      missingWarnings.push(msg);
      if (!isDraft) {
        console.error("Erreur critique: " + msg);
        hasError = true;
      }
    }

    if (!config.brand) {
      missingWarnings.push(
        `Produit ${p.id} : Marque manquante (brand vide dans config)`,
      );
    }

    if (!p.image_product) {
      const msg = `Produit ${p.id} : Image produit introuvable`;
      missingWarnings.push(msg);
      if (!isDraft) {
        console.error("Erreur critique: " + msg);
        hasError = true;
      }
    }

    const avail = p.available ? "in_stock" : "out_of_stock";
    const imgUrl = p.image_product
      ? `${config.site_origin}${p.image_product}`
      : "";
    const addImgUrl = p.image_packaging
      ? `${config.site_origin}${p.image_packaging}`
      : "";

    const baseLink = isFr
      ? `${config.site_origin}/produits/${p.id}.html`
      : `${config.site_origin}/${lang}/produits/${p.id}.html`;

    for (const v of variations) {
      if (!v.priceHt || isNaN(v.priceHt) || v.priceHt <= 0) {
        const msg = `Produit ${v.id} : Prix HT invalide (${v.priceHt})`;
        missingWarnings.push(msg);
        if (!isDraft) {
          console.error("Erreur critique: " + msg);
          hasError = true;
        }
      }
      const priceTtc = (v.priceHt * (1 + config.vat_rate)).toFixed(2);
      const link = `${baseLink}${v.link_suffix}`;

      itemsXml += `
    <item>
      <g:id>${v.id}</g:id>
      ${v.item_group_id ? `<g:item_group_id>${v.item_group_id}</g:item_group_id>` : ""}
      <g:title><![CDATA[${v.title}]]></g:title>
      <g:description><![CDATA[${description}]]></g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imgUrl}</g:image_link>
      ${addImgUrl ? `<g:additional_image_link>${addImgUrl}</g:additional_image_link>` : ""}
      <g:price>${priceTtc} ${config.currency}</g:price>
      <g:availability>${avail}</g:availability>
      <g:condition>new</g:condition>
      <g:shipping_weight>${p.palette_weight}</g:shipping_weight>
      ${config.brand ? `<g:brand><![CDATA[${config.brand}]]></g:brand>` : ""}
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
      itemCount++;
    }
  }

  const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Sotramsbois - ${lang.toUpperCase()}</title>
    <link>${config.site_origin}${!isFr ? `/${lang}` : ""}</link>
    <description>Flux Google Merchant Center (${isDraft ? "Draft" : "Production"})</description>${itemsXml}
  </channel>
</rss>`;

  if (hasError && !isDraft) {
    console.error("Génération annulée en raison d'erreurs critiques.");
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
    process.exit(1);
  }

  const outXmlPath = path.join(OUT_DIR, `merchant-${lang}.xml`);
  fs.writeFileSync(outXmlPath, feedXml, "utf8");

  // Add to report
  reportContent += `## Flux ${lang.toUpperCase()}\n`;
  reportContent += `- Nombre d'articles générés : ${itemCount}\n`;
  reportContent += `- Descriptions nettoyées (prix retiré) : ${cleanedCount}\n`;
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

const outReportPath = path.join(OUT_DIR, "report.md");
fs.writeFileSync(outReportPath, reportContent, "utf8");

console.log(
  `Génération réussie en mode ${isDraft ? "--draft" : "production"}. Dossier: ${OUT_DIR}`,
);
