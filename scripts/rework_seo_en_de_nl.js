const fs = require('fs');
const path = require('path');

const seoDir = path.join(__dirname, '../data/seo');

['en', 'de', 'nl'].forEach(lang => {
    const file = path.join(seoDir, `${lang}.json`);
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    for (const page in data) {
        if (data[page].title) {
            data[page].title = data[page].title.replace(/\|\s*Firewood PRO/gi, '| sotramsbois')
                                               .replace(/\|\s*Brennholz PRO/gi, '| sotramsbois')
                                               .replace(/\|\s*Haardhout PRO/gi, '| sotramsbois');
                                               
            // Ensure length <= 60 by truncating safely if necessary, but typically this replacement makes it shorter or equal
            // Wait, the prompt said: "Contrôler que les titres restent ≤ 60 caractères."
            if (data[page].title.length > 60) {
                // Remove some words or truncate carefully
                // e.g. "Wholesale Firewood & Pellets B2B | sotramsbois"
                let t = data[page].title;
                if (t.length > 60) {
                    const parts = t.split('|');
                    let p0 = parts[0].trim();
                    while (p0.length + parts[1].length + 3 > 60 && p0.length > 0) {
                        p0 = p0.slice(0, -1);
                    }
                    data[page].title = `${p0.trim()} | ${parts[1].trim()}`;
                }
            }
        }
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
});

console.log('EN/DE/NL SEO JSON titles updated.');
