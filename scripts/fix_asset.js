const fs = require('fs');

let c = fs.readFileSync('produit.html', 'utf8');

c = c.replace(
    /window\.resolveAssetPath = function\(pathStr\) \{[\s\S]*?return \(lang === 'fr' \? '\.\/' : '\.\.\/'\) \+ cleanPath;\s*\};/,
    `window.resolveAssetPath = function(pathStr) {
    if (!pathStr) return '';
    if (typeof window.resolveDataPath === 'function') {
        return window.resolveDataPath(pathStr);
    }
    const cleanPath = String(pathStr).replace(/^\\/+/, '');
    const lang = document.documentElement.lang || 'fr';
    return (lang === 'fr' ? './' : '../') + cleanPath;
};`
);

fs.writeFileSync('produit.html', c);
console.log('Fixed resolveAssetPath in produit.html');
