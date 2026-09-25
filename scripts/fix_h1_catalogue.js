const fs = require('fs');
let html = fs.readFileSync('catalogue.html', 'utf8');

// Replace the h1 in the JS template
html = html.replace('<h1 class="text-headline-xlg font-headline-lg text-on-surface">${sg.name}</h1>', '<h2 class="text-headline-xlg font-headline-lg text-on-surface">${sg.name}</h2>');

// Add a visually hidden h1 for the main page title
html = html.replace('<main class="w-full pt-[128px] bg-background"><div class="flex flex-col w-full">', '<main class="w-full pt-[128px] bg-background">\n<h1 class="sr-only" data-i18n="nav.catalog">Catalogue</h1>\n<div class="flex flex-col w-full">');

fs.writeFileSync('catalogue.html', html, 'utf8');
console.log('Fixed catalogue.html');
