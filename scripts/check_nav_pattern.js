const fs = require('fs');

const files = ['index.html', 'catalogue.html', 'produit.html', 'panier.html'];
files.forEach(f => {
    const s = fs.readFileSync(f, 'utf8');
    const m = s.match(/<a href="\.\/catalogue\.html" class="[^"]*"[^>]*data-i18n="nav\.catalog">[\s\S]*?<\/a>/g);
    console.log(f, m ? m.length + ' matches' : 'NONE');
    if (m) {
        m.forEach((match, i) => console.log(`  match ${i}: ${match}`));
    }
});
