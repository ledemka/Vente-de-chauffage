const fs = require('fs');
let c = fs.readFileSync('tableau-de-bord.html', 'utf8');
c = c.replace('<div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16">', '<div class="w-full px-margin-mobile md:px-margin-desktop py-16">');
fs.writeFileSync('tableau-de-bord.html', c);
console.log('Done.');
