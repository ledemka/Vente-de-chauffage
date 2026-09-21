/**
 * fix_asset_paths.js
 * Injects a global resolveAssetPath function and updates image src assignments.
 */

const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, '..');

const resolveFunctionStr = `
// Resolves absolute /assets/... paths to relative paths based on language
window.resolveAssetPath = function(pathStr) {
    if (!pathStr) return '';
    const cleanPath = String(pathStr).replace(/^\\/+/, '');
    const lang = document.documentElement.lang || 'fr';
    return (lang === 'fr' ? './' : '../') + cleanPath;
};
`;

function fixHtmlFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Inject window.resolveAssetPath if not present
    if (!content.includes('window.resolveAssetPath = function')) {
        // Find a good place to inject. Let's put it right after <script src="...i18n-loader.js"></script>
        // or inside the first script block that has DOMContentLoaded.
        // Or simply right before the closing </head> or inside an existing <script> in the body.
        
        // Let's inject it inside the main script block that handles products.
        // We can just add a small <script> tag before the main application scripts.
        const i18nLoaderPattern = /<script src="[^"]*i18n-loader\.js"><\/script>/;
        if (i18nLoaderPattern.test(content)) {
            content = content.replace(i18nLoaderPattern, match => match + '\n<script>' + resolveFunctionStr + '</script>\n');
        } else {
            // fallback, inject before </head>
            content = content.replace('</head>', '<script>' + resolveFunctionStr + '</script>\n</head>');
        }
    }

    // 2. Replace catalogue image logic
    // src="${imgPrefix}${p.image_product}" => src="${resolveAssetPath(p.image_product)}"
    content = content.replace(/src="\$\{imgPrefix\}\$\{p\.image_product\}"/g, 'src="${resolveAssetPath(p.image_product)}"');
    
    // src="${p.image_product}" => src="${resolveAssetPath(p.image_product)}"
    content = content.replace(/src="\$\{p\.image_product\}"/g, 'src="${resolveAssetPath(p.image_product)}"');

    // Also replace image_product in a ternary or variable assignment
    // const imgSrc = p.image_product.startsWith('http') ? p.image_product : ('../' + p.image_product).replace('../assets', '../assets');
    const oldImgSrcRegex = /const imgSrc = p\.image_product\.startsWith\('http'\)[^;]+;/g;
    content = content.replace(oldImgSrcRegex, "const imgSrc = p.image_product.startsWith('http') ? p.image_product : resolveAssetPath(p.image_product);");
    
    // In catalogue.html, if it uses `<img class="..." src="${imgSrc}"` we need to make sure we don't break it if it's already using imgSrc.
    // Actually, in our previous sync script, we did:
    // <img class="..." src="${p.image_product}"
    // which the above regex /src="\$\{p\.image_product\}"/ will catch.

    // 3. Replace produit.html image assignments
    // document.getElementById('product-img-1').src = imgPrefix + product.image_product;
    content = content.replace(/document\.getElementById\('product-img-1'\)\.src\s*=\s*(?:imgPrefix\s*\+\s*)?product\.image_product;/g, 
        "document.getElementById('product-img-1').src = resolveAssetPath(product.image_product);");
    
    // document.getElementById('product-img-2').src = imgPrefix + product.image_packaging;
    content = content.replace(/document\.getElementById\('product-img-2'\)\.src\s*=\s*(?:imgPrefix\s*\+\s*)?product\.image_packaging;/g, 
        "document.getElementById('product-img-2').src = resolveAssetPath(product.image_packaging);");

    // Also for thumbnails if any
    content = content.replace(/document\.getElementById\('thumb-1'\)\.src\s*=\s*(?:imgPrefix\s*\+\s*)?product\.image_product;/g, 
        "document.getElementById('thumb-1').src = resolveAssetPath(product.image_product);");
    
    content = content.replace(/document\.getElementById\('thumb-2'\)\.src\s*=\s*(?:imgPrefix\s*\+\s*)?product\.image_packaging;/g, 
        "document.getElementById('thumb-2').src = resolveAssetPath(product.image_packaging);");

    // Replace structured data schema image logic in produit.html
    // "image": "https://www.sotramsbois.com" + product.image_product.replace('.', ''),
    content = content.replace(/"image":\s*"https:\/\/www\.sotramsbois\.com"\s*\+\s*product\.image_product\.replace\('\.',\s*''\),/g, 
        `"image": "https://www.sotramsbois.com/" + String(product.image_product).replace(/^\\/+/, ''),`);

    // 4. Admin and dashboard
    // const img = product.image_product ? `<img src="${product.image_product}" class="w-12 h-12 object-cover rounded" />` : ...
    content = content.replace(/src="\$\{product\.image_product\}"/g, 'src="${resolveAssetPath(product.image_product)}"');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[UPDATED] ${filePath}`);
    }
}

// Apply to all HTML files in root and en, de, nl
const dirs = ['.', 'en', 'de', 'nl'];
const files = ['catalogue.html', 'produit.html', 'admin-commandes.html', 'tableau-de-bord.html', 'panier.html'];

dirs.forEach(d => {
    files.forEach(f => {
        fixHtmlFile(path.join(rootDir, d, f));
    });
});

console.log('✅ Asset paths logic injected and updated. Please run generate-dist.js next.');
