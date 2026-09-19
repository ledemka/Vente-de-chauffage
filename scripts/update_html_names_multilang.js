const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langs = ['', 'en', 'de', 'nl'];

const helperStr = `const lang = document.documentElement.lang || 'fr';\n                        const getProductName = (p) => p ? (typeof p.name === 'string' ? p.name : (p.name[lang] || p.name.fr)) : '';`;
const helperStrPlain = `const lang = document.documentElement.lang || 'fr';\nconst getProductName = (p) => p ? (typeof p.name === 'string' ? p.name : (p.name[lang] || p.name.fr)) : '';`;

langs.forEach(lang => {
    const dir = lang ? path.join(rootDir, lang) : rootDir;

    // 1. produit.html
    const produitPath = path.join(dir, 'produit.html');
    if (fs.existsSync(produitPath)) {
        let content = fs.readFileSync(produitPath, 'utf8');
        if (!content.includes('getProductName')) {
            content = content.replace("const productId = urlParams.get('id');", `const productId = urlParams.get('id');\n                                ${helperStr}`);
            content = content.replace(/product\.name/g, 'getProductName(product)');
            fs.writeFileSync(produitPath, content);
            console.log(`Updated ${produitPath}`);
        }
    }

    // 2. catalogue.html
    const cataloguePath = path.join(dir, 'catalogue.html');
    if (fs.existsSync(cataloguePath)) {
        let content = fs.readFileSync(cataloguePath, 'utf8');
        if (!content.includes('getProductName')) {
            // Note: In localized files, fetch path might be '../data/products.json' instead of './data/products.json'
            content = content.replace(/fetch\(['"](?:\.\.|\.)\/data\/products\.json['"]\)/, `${helperStr}\n                        $&`);
            content = content.replace(/p\.name/g, 'getProductName(p)');
            fs.writeFileSync(cataloguePath, content);
            console.log(`Updated ${cataloguePath}`);
        }
    }

    // 3. devis.html
    const devisPath = path.join(dir, 'devis.html');
    if (fs.existsSync(devisPath)) {
        let content = fs.readFileSync(devisPath, 'utf8');
        if (!content.includes('getProductName')) {
            content = content.replace(/fetch\(['"](?:\.\.|\.)\/data\/products\.json['"]\)/, `${helperStr}\n                $&`);
            content = content.replace(/p\.name/g, 'getProductName(p)');
            fs.writeFileSync(devisPath, content);
            console.log(`Updated ${devisPath}`);
        }
    }

    // 4. tableau-de-bord.html
    const tdbPath = path.join(dir, 'tableau-de-bord.html');
    if (fs.existsSync(tdbPath)) {
        let content = fs.readFileSync(tdbPath, 'utf8');
        if (!content.includes('getProductName')) {
            content = content.replace("if (orders.length === 0)", `${helperStr}\n                    if (orders.length === 0)`);
            content = content.replace(/item\.name/g, 'getProductName(item)');
            fs.writeFileSync(tdbPath, content);
            console.log(`Updated ${tdbPath}`);
        }
    }

    // 5. admin-commandes.html
    const adminPath = path.join(dir, 'admin-commandes.html');
    if (fs.existsSync(adminPath)) {
        let content = fs.readFileSync(adminPath, 'utf8');
        if (!content.includes('getProductName')) {
            content = content.replace("function renderOrders(ordersToRender) {", `function renderOrders(ordersToRender) {\n            ${helperStr}`);
            content = content.replace(/item\.name/g, 'getProductName(item)');
            fs.writeFileSync(adminPath, content);
            console.log(`Updated ${adminPath}`);
        }
    }
});
