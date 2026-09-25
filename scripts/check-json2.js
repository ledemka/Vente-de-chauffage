const fs = require('fs');
const html = fs.readFileSync('dist-production/en/mentions-legales.html', 'utf8');
const scriptMatches = html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
for (const match of scriptMatches) {
    try {
        JSON.parse(match[1]);
        console.log('Valid');
    } catch (e) {
        console.log('Invalid:', e.message);
        console.log(match[1]);
    }
}
