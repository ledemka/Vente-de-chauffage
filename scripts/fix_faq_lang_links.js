const fs = require('fs');

let content = fs.readFileSync('faq.html', 'utf8');

// Replace language switcher links
content = content.replace(/"politique-retour.html"/g, '"faq.html"');
content = content.replace(/"en\/politique-retour.html"/g, '"en/faq.html"');
content = content.replace(/"de\/politique-retour.html"/g, '"de/faq.html"');
content = content.replace(/"nl\/politique-retour.html"/g, '"nl/faq.html"');

fs.writeFileSync('faq.html', content, 'utf8');
console.log('Fixed language switcher links in faq.html');
