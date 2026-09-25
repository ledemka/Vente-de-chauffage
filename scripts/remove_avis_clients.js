const fs = require('fs');

// 1. avis-clients.html -> add noindex
let avisHtml = fs.readFileSync('avis-clients.html', 'utf8');
if (!avisHtml.includes('<meta name="robots"')) {
    avisHtml = avisHtml.replace(
        '<meta name="google" content="notranslate">',
        '<meta name="google" content="notranslate">\n    <meta name="robots" content="noindex, follow">'
    );
    fs.writeFileSync('avis-clients.html', avisHtml, 'utf8');
    console.log('Added noindex to avis-clients.html');
}

// 2. generate_seo_assets.js -> remove from PUBLIC_PAGES
let generateSeo = fs.readFileSync('scripts/generate_seo_assets.js', 'utf8');
if (generateSeo.includes("'avis-clients.html',")) {
    generateSeo = generateSeo.replace(/\s*'avis-clients.html',/, '');
    fs.writeFileSync('scripts/generate_seo_assets.js', generateSeo, 'utf8');
    console.log('Removed avis-clients.html from PUBLIC_PAGES in generate_seo_assets.js');
}

// 3. audit-seo.js -> add to privatePages
let auditSeo = fs.readFileSync('scripts/audit-seo.js', 'utf8');
if (!auditSeo.includes("'avis-clients.html'")) {
    auditSeo = auditSeo.replace(
        "const privatePages = ['panier.html', 'connexion.html',",
        "const privatePages = ['avis-clients.html', 'panier.html', 'connexion.html',"
    );
    fs.writeFileSync('scripts/audit-seo.js', auditSeo, 'utf8');
    console.log('Added avis-clients.html to privatePages in audit-seo.js');
}
