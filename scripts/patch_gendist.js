const fs = require('fs');

let content = fs.readFileSync('scripts/generate-dist.js', 'utf8');
if (!content.includes('admin-commandes.html')) {
    content = content.replace(
        "const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));",
        "const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html') && f !== 'admin-commandes.html');"
    );
    fs.writeFileSync('scripts/generate-dist.js', content);
    console.log('Patched generate-dist.js');
}

['dist-production/en/admin-commandes.html', 'dist-production/de/admin-commandes.html', 'dist-production/nl/admin-commandes.html'].forEach(f => {
    if (fs.existsSync(f)) {
        fs.unlinkSync(f);
        console.log('Deleted ' + f);
    }
});
