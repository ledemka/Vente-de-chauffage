const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const langs = ['fr', 'en', 'de', 'nl'];

for (const l of langs) {
    const filePath = path.join(ROOT, l === 'fr' ? '' : l, 'produit.html');
    if (!fs.existsSync(filePath)) continue;
    
    let html = fs.readFileSync(filePath, 'utf8');

    // Replace the specific line
    const searchString = "document.getElementById('product-desc').textContent = `${getProductField(product, 'species_material')} - Humidité: ${displayHumidity}. Origine: ${product.origin}. Idéal pour professionnels.`;";
    const replaceString = "document.getElementById('product-desc').textContent = `${getProductField(product, 'species_material')} - Humidité: ${displayHumidity}`;";
    
    html = html.replace(searchString, replaceString);

    fs.writeFileSync(filePath, html);
    console.log(`Updated ${filePath}`);
}
