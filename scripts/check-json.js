const fs = require('fs');
const html = fs.readFileSync('dist-production/en/mentions-legales.html', 'utf8');
const matches = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g);
if (matches) {
    matches.forEach((m, idx) => {
        console.log(`--- Match ${idx} ---`);
        console.log(m);
    });
}
