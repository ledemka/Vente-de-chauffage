const fs = require('fs');
const content = fs.readFileSync('recapitulatif-commande.html', 'utf8');
const fr = JSON.parse(fs.readFileSync('data/i18n/fr.json', 'utf8'));

const regex = /data-i18n(?:-placeholder)?="([^"]+)"/g;
let match;
const keys = new Set();
while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
}

const missing = [];
for (const key of keys) {
    const parts = key.split('.');
    let val = fr;
    for (const p of parts) {
        if (val && typeof val === 'object' && p in val) {
            val = val[p];
        } else {
            val = undefined;
            break;
        }
    }
    if (val === undefined) {
        missing.push(key);
    }
}
console.log('Missing keys:', missing);
