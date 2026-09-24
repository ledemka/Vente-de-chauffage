const fs = require('fs');
const files = ['connexion.html', 'inscription.html', 'activation.html', 'tableau-de-bord.html', 'admin-commandes.html', 'devis.html'];
const cheerio = require('cheerio');
for (const file of files) {
    if(!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(content);
    console.log('--- ' + file + ' ---');
    $('script').each((_, s) => {
        const text = $(s).html();
        if(!text) return;
        const lines = text.split('\n');
        lines.forEach((l, i) => {
            if (l.includes('alert(') || l.includes('showToast(') || l.includes('textContent = ') || l.includes('innerHTML = ') || l.includes('res.message ||')) {
                const trimmed = l.trim();
                // Filter out non-French strings like purely technical code
                if (trimmed.match(/['"`][A-ZÀ-Ÿa-zà-ÿ0-9\s.,?!:;]+['"`]/) && !trimmed.includes('console.log') && !trimmed.includes('window.location') && !trimmed.includes('display =')) {
                    console.log((i+1) + ': ' + trimmed);
                }
            }
        });
    });
}
