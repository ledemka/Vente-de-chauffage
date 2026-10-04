const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const EXCLUDE_FILES = [
    'admin-commandes.html',
    'tableau-de-bord.html',
    'activation.html',
    'reinitialiser-mot-de-passe.html'
];

const gtagSnippet = `<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18453340840"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'wait_for_update': 500
});

gtag('js', new Date());

// Nettoyage de l'URL pour Google Ads
var params = new URLSearchParams(window.location.search);
params.delete('email');
params.delete('token');
params.delete('ref');
params.delete('password');
var qs = params.toString();
var cleanUrl = window.location.origin + window.location.pathname + (qs ? '?' + qs : '');

gtag('config', 'AW-18453340840', { page_location: cleanUrl });
</script>`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const fp = path.join(dir, f);
        const stat = fs.statSync(fp);
        if (stat.isDirectory()) {
            if (f === 'produits' && dir === ROOT) {
                processDir(fp);
            }
            continue;
        }
        if (!f.endsWith('.html')) continue;
        if (EXCLUDE_FILES.includes(f)) continue;

        let html = fs.readFileSync(fp, 'utf8');
        
        // Remove old gtag snippet if exists (to prevent duplicates)
        const oldGtagStart = html.indexOf('<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18453340840"></script>');
        if (oldGtagStart !== -1) {
            const oldGtagEnd = html.indexOf('</script>', html.indexOf("gtag('config', 'AW-18453340840'")) + 9;
            if (oldGtagEnd > oldGtagStart) {
                html = html.substring(0, oldGtagStart) + html.substring(oldGtagEnd);
            }
        }
        
        // Ensure no multiple script tags for googletagmanager
        html = html.replace(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=AW-18453340840"><\/script>\n?/g, '');
        
        // Remove any old config blocks
        const configRegex = /<script>\s*window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];[\s\S]*?gtag\('config',\s*'AW-18453340840'[\s\S]*?<\/script>\n?/g;
        html = html.replace(configRegex, '');

        // Inject new one right after <head>
        html = html.replace(/<head>/i, '<head>\n' + gtagSnippet);
        fs.writeFileSync(fp, html);
    }
}

processDir(ROOT);
console.log('Injection complete.');
