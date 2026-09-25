const fs = require('fs');
let html = fs.readFileSync('produit.html', 'utf8');
html = html.replace(/<link rel="canonical"[^>]*>/gi, '');
html = html.replace(/<link rel="alternate" hreflang=[^>]*>/gi, '');
fs.writeFileSync('produit.html', html, 'utf8');
console.log('Removed static canonical and alternate links from produit.html');
