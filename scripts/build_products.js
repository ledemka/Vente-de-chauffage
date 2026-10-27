const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const { processSeo } = require("./post_process_seo");

const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist-production");
const LANGS = ["fr", "en", "de", "nl"];
const MAIN_HOST = "https://www.sotramsbois.com";

const i18nDir = path.join(ROOT_DIR, "data/i18n");
const i18nData = {};
LANGS.forEach((lang) => {
  i18nData[lang] = JSON.parse(
    fs.readFileSync(path.join(i18nDir, lang + ".json"), "utf8"),
  );
});

function getProductField(p, field, lang) {
  if (!p || !p[field]) return "";
  if (typeof p[field] === "string") return p[field];
  return p[field][lang] || p[field]["fr"] || "";
}

function getProductName(p, lang) {
  return getProductField(p, "name", lang);
}

const SEO_KEYWORDS = {
  fr: {
    firewood: "Bois de chauffage B2B, Grossiste",
    pellets: "Pellets Grossiste, B2B",
    briquettes: "Briquettes Grossiste, B2B",
    default: "Grossiste B2B",
  },
  en: {
    firewood: "Wholesale Firewood Supplier",
    pellets: "Wood Pellets Wholesale Supplier",
    briquettes: "Wholesale Wood Briquettes",
    default: "Wholesale B2B",
  },
  de: {
    firewood: "Brennholz Großhandel Lieferant",
    pellets: "Holzpellets Großhandel",
    briquettes: "Holzbriketts Großhandel",
    default: "Großhandel Lieferant",
  },
  nl: {
    firewood: "Brandhout Groothandel Leverancier",
    pellets: "Houtpellets Groothandel",
    briquettes: "Houtbriketten Groothandel",
    default: "Groothandel Leverancier",
  },
};

function getSeoKeywords(subgroupId, lang) {
  const k = SEO_KEYWORDS[lang] || SEO_KEYWORDS.fr;
  if (subgroupId === 1) return k.firewood;
  if (subgroupId === 4) return k.pellets;
  if (subgroupId === 2 || subgroupId === 3) return k.briquettes;
  return k.default;
}

const META_DESC_TEMPLATE = {
  fr: (name, kw, mat, fmt, price) =>
    price > 0
      ? `${kw}. Découvrez ${name} (${mat}, ${fmt}) pour professionnels. Prix conseillé: ${price}€ TTC. Idéal pour l'achat en gros.`
      : `${kw}. Découvrez ${name} (${mat}, ${fmt}) pour professionnels. Idéal pour l'achat en gros.`,
  en: (name, kw, mat, fmt, price) =>
    price > 0
      ? `${kw}. ${name} (${mat}, ${fmt}) for professionals. Retail price: ${price}€ incl. VAT. Ideal for bulk buyers.`
      : `${kw}. ${name} (${mat}, ${fmt}) for professionals. Ideal for bulk buyers.`,
  de: (name, kw, mat, fmt, price) =>
    price > 0
      ? `${kw}. ${name} (${mat}, ${fmt}) für Profis. Verkaufspreis: ${price}€ inkl. MwSt. Ideal für Großeinkäufer.`
      : `${kw}. ${name} (${mat}, ${fmt}) für Profis. Ideal für Großeinkäufer.`,
  nl: (name, kw, mat, fmt, price) =>
    price > 0
      ? `${kw}. ${name} (${mat}, ${fmt}) voor professionals. Verkoopprijs: ${price}€ incl. btw. Ideaal voor zakelijke kopers.`
      : `${kw}. ${name} (${mat}, ${fmt}) voor professionals. Ideaal voor zakelijke kopers.`,
};

function buildProducts(buildId) {
  console.log("=== Building Product Static Pages ===");
  const productsJson = JSON.parse(
    fs.readFileSync(path.join(ROOT_DIR, "data/products.json"), "utf8"),
  );
  const srcHtml = fs.readFileSync(path.join(ROOT_DIR, "produit.html"), "utf8");

  let total = 0;
  LANGS.forEach((lang) => {
    productsJson.forEach((product) => {
      let content = srcHtml;

      // Add cache-busting to JS assets
      if (buildId) {
        content = content.replace(
          /(src=(['"])[^"']*assets\/js\/[^"']+\.js)\2/g,
          `$1?v=${buildId}$2`,
        );
      }

      // 1. Base i18n translation from post_process_seo
      content = processSeo(content, lang, "produit.html");

      // 2. Language attribute and asset path fixing
      if (lang !== "fr") {
        content = content.replace(/<html[^>]*lang="[^"]*"[^>]*>/i, (match) =>
          match.replace(/lang="[^"]*"/i, `lang="${lang}"`),
        );
        // In /[lang]/produits/, assets/data/api are 2 levels deep
        content = content.replace(
          /(['"`]).\/(assets|data|api)\//g,
          `$1../../$2/`,
        );
      } else {
        // In /produits/, assets/data/api are 1 level deep
        content = content.replace(
          /(['"`]).\/(assets|data|api)\//g,
          `$1../$2/`,
        );
      }

      // 3. Cheerio manipulation for SEO
      const $ = cheerio.load(content, { decodeEntities: false });

      // Fix internal page links: for both /produits/ and /[lang]/produits/,
      // other pages in the same language are 1 level up (../)
      $("a").each((i, el) => {
        let href = $(el).attr("href");
        if (!href) return;
        if (
          href.startsWith("http") ||
          href.startsWith("/") ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:")
        ) {
          return;
        }
        if (href.startsWith("./")) {
          $(el).attr("href", href.replace("./", "../"));
        } else if (!href.startsWith("../")) {
          $(el).attr("href", "../" + href);
        }
      });

      // Fix language switcher dropdown to point directly to localized product URLs
      const langUrls = {
        fr: `/produits/${product.id}.html`,
        en: `/en/produits/${product.id}.html`,
        de: `/de/produits/${product.id}.html`,
        nl: `/nl/produits/${product.id}.html`,
      };
      $("#lang-dropdown a").each((i, el) => {
        const text = $(el).text().toLowerCase();
        if (text.includes("français")) {
          $(el).attr("href", langUrls.fr);
        } else if (text.includes("english")) {
          $(el).attr("href", langUrls.en);
        } else if (text.includes("deutsch")) {
          $(el).attr("href", langUrls.de);
        } else if (text.includes("nederlands")) {
          $(el).attr("href", langUrls.nl);
        }
      });

      // Fix static breadcrumb category link
      if ($("#breadcrumb-category").length) {
        $("#breadcrumb-category").attr(
          "href",
          `../catalogue.html?subgroup=${product.subgroup_id}`,
        );
        const catName =
          (i18nData[lang] &&
            i18nData[lang].categories &&
            i18nData[lang].categories[product.subgroup_id]) ||
          product.subgroup_name;
        $("#breadcrumb-category").text(catName);
      }

      // Inject PRODUCT_ID
      $("head").append(
        `\n<script>window.PRODUCT_ID = '${product.id}';</script>\n`,
      );

      // Generate SEO data
      const name = getProductName(product, lang);
      const species = getProductField(product, "species_material", lang);
      const format = product.format;
      const price = 0; // Forced to 0 to remove recommended price from description
      const kw = getSeoKeywords(product.subgroup_id, lang);
      const desc = META_DESC_TEMPLATE[lang](name, kw, species, format, price);
      const title = `${name} – ${kw} | sotramsbois`;
      const canonUrl =
        lang === "fr"
          ? `${MAIN_HOST}/produits/${product.id}.html`
          : `${MAIN_HOST}/${lang}/produits/${product.id}.html`;

      if ($("title").length === 0) $("head").append("<title></title>");
      $("title").text(title);

      if ($('meta[name="description"]').length === 0)
        $("head").append('<meta name="description" content="">');
      $('meta[name="description"]').attr("content", desc);

      // Enhance H1 - Keep it clean, just the product name
      if ($("h1#product-name").length) {
        $("h1#product-name").text(name);
      } else if ($("#product-title").length) {
        $("#product-title").text(name);
      } else if ($("h1").length) {
        $("h1").first().text(name);
      }

      // SEO Images
      const imgPath1 =
        lang === "fr"
          ? `../${product.image_product}`
          : `../../${product.image_product}`;
      const imgPath2 =
        lang === "fr"
          ? `../${product.image_packaging}`
          : `../../${product.image_packaging}`;

      $("#product-img-1")
        .attr("src", imgPath1)
        .attr("alt", `${name} - ${species}`)
        .attr("width", "600")
        .attr("height", "400")
        .attr("fetchpriority", "high");

      $("#product-img-2")
        .attr("src", imgPath2)
        .attr("alt", `Conditionnement de ${name}`)
        .attr("width", "600")
        .attr("height", "400")
        .attr("loading", "lazy");

      $('link[rel="canonical"]').remove();
      $('link[rel="alternate"][hreflang]').remove();

      $("head").append(`\n<link rel="canonical" href="${canonUrl}">`);
      LANGS.forEach((l) => {
        const href =
          l === "fr"
            ? `${MAIN_HOST}/produits/${product.id}.html`
            : `${MAIN_HOST}/${l}/produits/${product.id}.html`;
        const hl = l === "fr" ? "fr" : l;
        $("head").append(
          `\n<link rel="alternate" hreflang="${hl}" href="${href}">`,
        );
      });
      $("head").append(
        `\n<link rel="alternate" hreflang="x-default" href="${MAIN_HOST}/produits/${product.id}.html">`,
      );

      // Product JSON-LD
      const vatRate = 0.2; // Hardcoded from merchant-config
      const offers = [];

      if (product.prices_by_length) {
        for (const [length, priceHT] of Object.entries(
          product.prices_by_length,
        )) {
          const priceTTC = (priceHT * (1 + vatRate)).toFixed(2);
          offers.push({
            "@type": "Offer",
            url: `${canonUrl}?length=${length}`,
            price: priceTTC,
            priceCurrency: "EUR",
            availability: product.available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            sku: `${product.id}-${length}`,
          });
        }
      } else {
        const priceHT = product.price || product.wholesale_price || 0;
        const priceTTC = (priceHT * (1 + vatRate)).toFixed(2);
        offers.push({
          "@type": "Offer",
          url: canonUrl,
          price: priceTTC,
          priceCurrency: "EUR",
          availability: product.available
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          sku: product.id,
        });
      }

      const productJsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: name,
        description: desc,
        sku: product.id,
        image: [
          `${MAIN_HOST}/${String(product.image_product).replace(/^\/+/, "")}`,
        ],
        url: canonUrl,
        brand: {
          "@type": "Brand",
          name: "Sotramsbois",
        },
        offers: offers.length === 1 ? offers[0] : offers,
      };
      $("head").append(
        `\n<script type="application/ld+json">\n${JSON.stringify(productJsonLd, null, 2)}\n</script>\n`,
      );

      // Open Graph & Twitter
      const ogLocale =
        lang === "fr"
          ? "fr_FR"
          : lang === "en"
            ? "en_GB"
            : lang === "de"
              ? "de_DE"
              : "nl_NL";
      $("head").append(`\n<meta property="og:type" content="product">`);
      $("head").append(`\n<meta property="og:title" content="${title}">`);
      $("head").append(`\n<meta property="og:description" content="${desc}">`);
      $("head").append(`\n<meta property="og:url" content="${canonUrl}">`);
      $("head").append(
        `\n<meta property="og:image" content="${MAIN_HOST}/${String(product.image_product).replace(/^\/+/, "")}">`,
      );
      $("head").append(
        `\n<meta property="og:site_name" content="sotramsbois">`,
      );
      $("head").append(`\n<meta property="og:locale" content="${ogLocale}">`);
      $("head").append(
        `\n<meta name="twitter:card" content="summary_large_image">`,
      );

      // HTML Static Hydration (pre-rendering for SEO without noscript)
      $("#product-ref").text(`Ref: ${product.id.toUpperCase()}-PAL`);
      const rawHumidity = getProductField(product, "humidity_bucket", lang) || product.humidity_bucket;
      const hasHumidity = Boolean(rawHumidity && product.id !== 'allume-feu-laine-bois');
      const displayHumidity = rawHumidity || "Non communiqué";

      if (product.id === 'nuit-longue-duree') {
        $("#product-desc").text('Écorces bois densifiées');
      } else if (product.id === 'pini-kay-compressbee') {
        $("#product-desc").text('Bois chêne/hêtre extrudé Pini-Kay');
      } else if (product.id === 'briquettes-ruf' || product.id === 'briquettes-ecorce' || product.id === 'jour-premium-cylindrique' || product.id === 'jour-forte-chaleur-cubique') {
        $("#product-desc").text(species);
      } else if (hasHumidity) {
        $("#product-desc").text(`${species} - Humidité: ${displayHumidity}`);
      } else {
        $("#product-desc").text(species);
      }

      $("#product-stock").text("En Stock");
      $("#spec-essence").removeAttr("data-i18n").text(species);
      if (product.id === 'pini-kay-compressbee') {
        const lengthValues = { fr: 'environ 20 à 25 cm', en: 'approx. 20 to 25 cm', de: 'ca. 20 bis 25 cm', nl: 'ongeveer 20 tot 25 cm' };
        $("#spec-longueur").removeAttr("data-i18n").text(lengthValues[lang] || 'environ 20 à 25 cm');
      } else if (product.id === 'jour-forte-chaleur-cubique') {
        const lengthValues = { fr: '15 à 16 cm (indicative)', en: '15 to 16 cm (indicative)', de: '15 bis 16 cm (Richtwert)', nl: '15 tot 16 cm (indicatief)' };
        $("#spec-longueur").removeAttr("data-i18n").text(lengthValues[lang] || '15 à 16 cm (indicative)');
      } else if (product.id === 'jour-premium-cylindrique') {
        const lengthValues = { fr: 'de 20 à 30 cm', en: '20 to 30 cm', de: '20 bis 30 cm', nl: '20 tot 30 cm' };
        $("#spec-longueur").removeAttr("data-i18n").text(lengthValues[lang] || 'de 20 à 30 cm');
      } else {
        $("#spec-longueur").removeAttr("data-i18n").text(format);
      }

      if (product.id === 'pini-kay-compressbee') {
        const shapeLabels = { fr: 'FORME', en: 'SHAPE', de: 'FORM', nl: 'VORM' };
        const shapeValues = { fr: 'Octogonale (Pini Kay)', en: 'Octagonal (Pini Kay)', de: 'Achteckig (Pini Kay)', nl: 'Achthoekig (Pini Kay)' };
        const diameterLabels = { fr: 'DIAMÈTRE', en: 'DIAMETER', de: 'DURCHMESSER', nl: 'DIAMETER' };
        const diameterValues = { fr: '6 à 7 cm', en: '6 to 7 cm', de: '6 bis 7 cm', nl: '6 tot 7 cm' };

        const sLabel = shapeLabels[lang] || 'FORME';
        const sVal = shapeValues[lang] || 'Octogonale (Pini Kay)';
        const dLabel = diameterLabels[lang] || 'DIAMÈTRE';
        const dVal = diameterValues[lang] || '6 à 7 cm';

        const rowForme = `
<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-forme">
<span class="text-label-md font-label-md text-on-surface-variant">${sLabel}</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-forme">${sVal}</span>
</div>`;

        const rowDiametre = `
<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-diametre">
<span class="text-label-md font-label-md text-on-surface-variant">${dLabel}</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-diametre">${dVal}</span>
</div>`;

        $("#spec-row-essence").after(rowForme);
        $("#spec-row-longueur").before(rowDiametre);
        $("#spec-humidite").removeAttr("data-i18n").text(displayHumidity);
        $("#spec-row-conditionnement").removeClass("md:col-span-2");
      } else if (product.id === 'jour-forte-chaleur-cubique') {
        const shapeLabels = { fr: 'FORME', en: 'SHAPE', de: 'FORM', nl: 'VORM' };
        const shapeValues = { fr: 'Cubique', en: 'Cubic', de: 'Würfelform', nl: 'Kubusvorm' };
        const widthLabels = { fr: 'LARGEUR', en: 'WIDTH', de: 'BREITE', nl: 'BREEDTE' };
        const widthValues = { fr: '6,5 cm', en: '6.5 cm', de: '6,5 cm', nl: '6,5 cm' };
        const heightLabels = { fr: 'HAUTEUR', en: 'HEIGHT', de: 'HÖHE', nl: 'HOOGTE' };
        const heightValues = { fr: '9,5 cm', en: '9.5 cm', de: '9,5 cm', nl: '9,5 cm' };

        const sLabel = shapeLabels[lang] || 'FORME';
        const sVal = shapeValues[lang] || 'Cubique';
        const wLabel = widthLabels[lang] || 'LARGEUR';
        const wVal = widthValues[lang] || '6,5 cm';
        const hLabel = heightLabels[lang] || 'HAUTEUR';
        const hVal = heightValues[lang] || '9,5 cm';

        const rowForme = `
<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-forme">
<span class="text-label-md font-label-md text-on-surface-variant">${sLabel}</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-forme">${sVal}</span>
</div>`;

        const rowLargeur = `
<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-largeur">
<span class="text-label-md font-label-md text-on-surface-variant">${wLabel}</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-largeur">${wVal}</span>
</div>`;

        const rowHauteur = `
<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-hauteur">
<span class="text-label-md font-label-md text-on-surface-variant">${hLabel}</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-hauteur">${hVal}</span>
</div>`;

        $("#spec-row-essence").after(rowForme);
        $("#spec-row-longueur").after(rowLargeur);
        $("#spec-row-humidite").before(rowHauteur);
        $("#spec-humidite").removeAttr("data-i18n").text(displayHumidity);
        $("#spec-row-conditionnement").addClass("md:col-span-2");
      } else if (product.id === 'jour-premium-cylindrique') {
        const shapeLabels = { fr: 'FORME', en: 'SHAPE', de: 'FORM', nl: 'VORM' };
        const shapeValues = { fr: 'Cylindrique', en: 'Cylindrical', de: 'Zylindrisch', nl: 'Cilindrisch' };
        const diameterLabels = { fr: 'DIAMÈTRE', en: 'DIAMETER', de: 'DURCHMESSER', nl: 'DIAMETER' };
        const diameterValues = { fr: 'de 6 à 10 cm', en: '6 to 10 cm', de: '6 bis 10 cm', nl: '6 tot 10 cm' };

        const sLabel = shapeLabels[lang] || 'FORME';
        const sVal = shapeValues[lang] || 'Cylindrique';
        const dLabel = diameterLabels[lang] || 'DIAMÈTRE';
        const dVal = diameterValues[lang] || 'de 6 à 10 cm';

        const rowForme = `
<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-forme">
<span class="text-label-md font-label-md text-on-surface-variant">${sLabel}</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-forme">${sVal}</span>
</div>`;

        const rowDiametre = `
<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-diametre">
<span class="text-label-md font-label-md text-on-surface-variant">${dLabel}</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-diametre">${dVal}</span>
</div>`;

        $("#spec-row-essence").after(rowForme);
        $("#spec-row-longueur").before(rowDiametre);
        $("#spec-humidite").removeAttr("data-i18n").text(displayHumidity);
        $("#spec-row-conditionnement").removeClass("md:col-span-2");
      } else if (product.id === 'buches-torche-suedoise') {
        const heightLabels = { fr: 'HAUTEUR', en: 'HEIGHT', de: 'HÖHE', nl: 'HOOGTE' };
        const diameterLabels = { fr: 'DIAMÈTRE', en: 'DIAMETER', de: 'DURCHMESSER', nl: 'DIAMETER' };
        const heightValues = { fr: '25 cm', en: '25 cm', de: '25 cm', nl: '25 cm' };
        const diameterValues = { fr: 'environ 15 cm', en: 'approx. 15 cm', de: 'ca. 15 cm', nl: 'ongeveer 15 cm' };

        const hLabel = heightLabels[lang] || 'HAUTEUR';
        const dLabel = diameterLabels[lang] || 'DIAMÈTRE';
        const hVal = heightValues[lang] || '25 cm';
        const dVal = diameterValues[lang] || 'environ 15 cm';

        const rowHauteur = `
<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-hauteur">
<span class="text-label-md font-label-md text-on-surface-variant">${hLabel}</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-hauteur">${hVal}</span>
</div>`;

        const rowDiametre = `
<div class="flex justify-between py-3 border-b border-outline/30" id="spec-row-diametre">
<span class="text-label-md font-label-md text-on-surface-variant">${dLabel}</span>
<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-diametre">${dVal}</span>
</div>`;

        $("#spec-row-humidite").replaceWith(rowHauteur + rowDiametre);
        $("#spec-row-conditionnement").addClass("md:col-span-2");
      } else if (!hasHumidity) {
        $("#spec-row-humidite").remove();
        $("#spec-row-conditionnement").addClass("md:col-span-2");
      } else {
        $("#spec-humidite").removeAttr("data-i18n").text(displayHumidity);
      }
      $("#spec-pouvoir").text("~ 4.8 kWh/kg");
      $("#spec-poids").text(product.palette_weight || "");
      $("#spec-volume-m3").text(
        product.volume_m3 ? `${product.volume_m3} m³` : "",
      );
      const packagingText = getProductField(product, "packaging", lang) || ((product.units_per_palette || "") + " unités par palette");
      $("#spec-conditionnement").removeAttr("data-i18n").text(packagingText);

      // Note: The JavaScript (product.js logic inside produit.html) will still execute on the client
      // and overwrite these with the correct translated strings based on the dynamic lang,
      // but the crawlers will now see these static real values instead of placeholders or empty spans!

      // Output
      const outPath =
        lang === "fr"
          ? path.join(DIST_DIR, "produits", `${product.id}.html`)
          : path.join(DIST_DIR, lang, "produits", `${product.id}.html`);

      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, $.html());
      total++;

      // Also save to root lang/produits for local dev
      const localDevPath =
        lang === "fr"
          ? path.join(ROOT_DIR, "produits", `${product.id}.html`)
          : path.join(ROOT_DIR, lang, "produits", `${product.id}.html`);
      fs.mkdirSync(path.dirname(localDevPath), { recursive: true });
      fs.writeFileSync(localDevPath, $.html());
    });
  });
  console.log(`[Products] Generated ${total} static product pages.`);
}

module.exports = { buildProducts };
