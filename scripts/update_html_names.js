const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const helperStr = `const lang = document.documentElement.lang || 'fr';\n                        const getProductName = (p) => p ? (typeof p.name === 'string' ? p.name : (p.name[lang] || p.name.fr)) : '';`;
const helperStrPlain = `const lang = document.documentElement.lang || 'fr';\nconst getProductName = (p) => p ? (typeof p.name === 'string' ? p.name : (p.name[lang] || p.name.fr)) : '';`;

// 1. produit.html
const produitPath = path.join(rootDir, 'produit.html');
let produitContent = fs.readFileSync(produitPath, 'utf8');
if (!produitContent.includes('getProductName')) {
    produitContent = produitContent.replace("const productId = urlParams.get('id');", `const productId = urlParams.get('id');\n                                ${helperStr}`);
    produitContent = produitContent.replace(/product\.name/g, 'getProductName(product)');
    // But wait, there might be 'name': getProductName(product) in JSON object which doesn't need quotes if it's a variable, but let's check.
    // product.name is used in:
    // textContent = product.name; -> textContent = getProductName(product);
    // ${product.name} -> ${getProductName(product)}
    // "name": product.name -> "name": getProductName(product)
    fs.writeFileSync(produitPath, produitContent);
    console.log('Updated produit.html');
}

// 2. catalogue.html
const cataloguePath = path.join(rootDir, 'catalogue.html');
let catalogueContent = fs.readFileSync(cataloguePath, 'utf8');
if (!catalogueContent.includes('getProductName')) {
    catalogueContent = catalogueContent.replace("fetch('./data/products.json')", `${helperStr}\n                        fetch('./data/products.json')`);
    catalogueContent = catalogueContent.replace(/p\.name/g, 'getProductName(p)');
    fs.writeFileSync(cataloguePath, catalogueContent);
    console.log('Updated catalogue.html');
}

// 3. devis.html
const devisPath = path.join(rootDir, 'devis.html');
let devisContent = fs.readFileSync(devisPath, 'utf8');
if (!devisContent.includes('getProductName')) {
    devisContent = devisContent.replace("fetch('./data/products.json')", `${helperStr}\n                fetch('./data/products.json')`);
    devisContent = devisContent.replace(/p\.name/g, 'getProductName(p)');
    fs.writeFileSync(devisPath, devisContent);
    console.log('Updated devis.html');
}

// 4. tableau-de-bord.html
const tdbPath = path.join(rootDir, 'tableau-de-bord.html');
let tdbContent = fs.readFileSync(tdbPath, 'utf8');
if (!tdbContent.includes('getProductName')) {
    tdbContent = tdbContent.replace("if (orders.length === 0)", `${helperStr}\n                    if (orders.length === 0)`);
    tdbContent = tdbContent.replace(/item\.name/g, 'getProductName(item)');
    fs.writeFileSync(tdbPath, tdbContent);
    console.log('Updated tableau-de-bord.html');
}

// 5. admin-commandes.html
const adminPath = path.join(rootDir, 'admin-commandes.html');
let adminContent = fs.readFileSync(adminPath, 'utf8');
if (!adminContent.includes('getProductName')) {
    adminContent = adminContent.replace("function renderOrders(ordersToRender) {", `function renderOrders(ordersToRender) {\n            ${helperStr}`);
    adminContent = adminContent.replace(/item\.name/g, 'getProductName(item)');
    fs.writeFileSync(adminPath, adminContent);
    console.log('Updated admin-commandes.html');
}

// 6. assets/js/cart.js
const cartPath = path.join(rootDir, 'assets', 'js', 'cart.js');
let cartContent = fs.readFileSync(cartPath, 'utf8');
if (!cartContent.includes('getProductName')) {
    cartContent = cartContent.replace("class Cart {", `${helperStrPlain}\n\nclass Cart {`);
    cartContent = cartContent.replace(/prod\.name/g, 'getProductName(prod)');
    cartContent = cartContent.replace(/p\.name/g, 'getProductName(p)');
    // But wait, there is `this.items.push({... prod})` which copies name.
    // That's fine, the cart items will store the full product object (including the multilingual name object).
    // Or if it only stored string previously, now it stores the object.
    fs.writeFileSync(cartPath, cartContent);
    console.log('Updated cart.js');
}
