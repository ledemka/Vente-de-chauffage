const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const rootDir = __dirname + '/..';

console.log("=== SEO Analysis ===");

// 1. Check canonical URL base
const genSeo = fs.readFileSync(path.join(rootDir, 'scripts/generate_seo_assets.js'), 'utf8');
const appUrlMatch = genSeo.match(/const APP_URL = '([^']+)';/);
console.log(`1. Base URL in generate_seo_assets.js: ${appUrlMatch ? appUrlMatch[1] : 'Not found'}`);

// 2. Check product links usage
const files = ['index.html', 'catalogue.html', 'assets/js/catalogue.js'];
files.forEach(f => {
    const p = path.join(rootDir, f);
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const matches = (content.match(/produit\.html\?id=/g) || []).length;
        console.log(`2. Product links in ${f}: ${matches} occurrences`);
    }
});

// 3. Check JSON-LD on a product page
const productHtml = fs.readFileSync(path.join(rootDir, 'produit.html'), 'utf8');
const $ = cheerio.load(productHtml);
const jsonLd = $('script[type="application/ld+json"]').html();
console.log(`3. JSON-LD in produit.html: ${jsonLd ? 'Present' : 'Missing'}`);
