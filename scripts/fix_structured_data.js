const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 1. Mentions-legales
let mlPath = path.join(__dirname, '../mentions-legales.html');
if (fs.existsSync(mlPath)) {
    let ml = fs.readFileSync(mlPath, 'utf8');
    ml = ml.replace('<script type="application/ld+json" data-i18n="mentions.page_title">', '<script type="application/ld+json">');
    // ensure h1 has the data-i18n
    if (!ml.includes('<h1 data-i18n="mentions.page_title"')) {
        ml = ml.replace('<h1 class="text-headline-lg font-headline-lg text-on-surface mb-4">Mentions Légales</h1>', '<h1 class="text-headline-lg font-headline-lg text-on-surface mb-4" data-i18n="mentions.page_title">Mentions Légales</h1>');
    }
    fs.writeFileSync(mlPath, ml, 'utf8');
}

// 2. Catalogue
let catPath = path.join(__dirname, '../catalogue.html');
if (fs.existsSync(catPath)) {
    let cat = fs.readFileSync(catPath, 'utf8');
    // "Aucun <h1> statique ... Ajouter un seul <h1> : le titre principal existant ... Le script génère un <h1> par sous-groupe ... les passer en <h2>"
    // Wait, the prompt says "Aucun <h1> statique ... Ajouter un seul <h1> : le titre principal existant"
    // I did this in Lot 2, but let's make sure.
    // Replace h2 with data-i18n="nav.catalog" to h1
    cat = cat.replace(/<h2([^>]*)data-i18n="nav\.catalog"([^>]*)>(.*?)<\/h2>/, '<h1$1data-i18n="nav.catalog"$2>$3</h1>');
    
    // "le bloc BreadcrumbList est en double. En garder un."
    // Find BreadcrumbList in JSON-LD and remove the second one.
    const breadcrumbMatches = cat.match(/<script type="application\/ld\+json">\s*\{\s*"@context":\s*"https?:\/\/schema\.org",\s*"@type":\s*"BreadcrumbList"[\s\S]*?<\/script>/gi);
    if (breadcrumbMatches && breadcrumbMatches.length > 1) {
        cat = cat.replace(breadcrumbMatches[1], ''); // remove the second match
    }
    
    fs.writeFileSync(catPath, cat, 'utf8');
}

// 3. Catalogue.js: change h1 to h2
let catJsPath = path.join(__dirname, '../assets/js/catalogue.js');
if (fs.existsSync(catJsPath)) {
    let catJs = fs.readFileSync(catJsPath, 'utf8');
    catJs = catJs.replace(/<h1 class="text-headline-md font-headline-md text-on-surface mb-6">(.*?)<\/h1>/g, '<h2 class="text-headline-md font-headline-md text-on-surface mb-6">$1</h2>');
    catJs = catJs.replace(/<h1 class="text-headline-md font-headline-md text-on-surface mb-6">\$\{sg\.name\}<\/h1>/g, '<h2 class="text-headline-md font-headline-md text-on-surface mb-6">${sg.name}</h2>');
    fs.writeFileSync(catJsPath, catJs, 'utf8');
}

console.log('Structured data fixed');
