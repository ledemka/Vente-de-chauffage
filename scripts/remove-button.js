const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../livraison.html');
let content = fs.readFileSync(file, 'utf8');

// The button structure might vary, let's use a regex to find and remove the button containing "TÉLÉCHARGER LE GUIDE D'ACCÈS"
content = content.replace(/<button[^>]*>[\s\S]*?TÉLÉCHARGER LE GUIDE D'ACCÈS[\s\S]*?<\/button>/, '');
// If it's an 'a' tag:
content = content.replace(/<a[^>]*>[\s\S]*?TÉLÉCHARGER LE GUIDE D'ACCÈS[\s\S]*?<\/a>/, '');

fs.writeFileSync(file, content);
console.log('Button removed.');
