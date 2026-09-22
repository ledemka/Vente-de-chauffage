const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const langs = ['fr', 'en', 'de', 'nl'];

const newSelectOptions = `
<option disabled="" selected="" value="">Sélectionnez votre type de demande...</option>
<option value="buches">Bûches de bois</option>
<option value="buches_compressees">Bûches compressées / briquettes de bois</option>
<option value="briquettes">Briquettes</option>
<option value="pellets">Granulés / Pellets</option>
<option value="allume-feu">Charbon / Allume-feu / Bûches de torche</option>
<option value="autre">Autre demande</option>
`;

for (const l of langs) {
    const filePath = path.join(ROOT, l === 'fr' ? '' : l, 'contact.html');
    if (!fs.existsSync(filePath)) continue;

    let html = fs.readFileSync(filePath, 'utf8');

    // Find the select block
    const regex = /<select [^>]*id="besoin"[^>]*>([\s\S]*?)<\/select>/;
    
    html = html.replace(regex, (match, p1) => {
        return match.replace(p1, newSelectOptions);
    });

    fs.writeFileSync(filePath, html);
    console.log(`Updated ${filePath}`);
}
console.log('Done');
