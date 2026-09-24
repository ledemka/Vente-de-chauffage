const fs = require('fs');
const path = require('path');

const seoDir = path.join(__dirname, '../data/seo');
const langs = ['fr', 'en', 'de', 'nl'];

// Helper to remove forbidden terms
function cleanText(text) {
    if (!text) return text;
    text = text.replace(/1\s?000 clients/gi, '');
    text = text.replace(/4,8\/5/g, '');
    text = text.replace(/certifiés?/gi, '');
    text = text.replace(/DINplus\/ENplus/gi, '');
    text = text.replace(/100\s?%\s?français/gi, '');
    text = text.replace(/PCI garanti/gi, '');
    text = text.replace(/24h/gi, '');
    text = text.replace(/48h/gi, '');
    // Clean up multiple spaces
    return text.replace(/\s+/g, ' ').trim();
}

langs.forEach(lang => {
    const filePath = path.join(seoDir, lang + '.json');
    if (fs.existsSync(filePath)) {
        let seo = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        for (let page in seo) {
            if (seo[page].title) {
                seo[page].title = seo[page].title.replace(/\|\s*Bois de Chauffage PRO/gi, '| sotramsbois');
                seo[page].title = cleanText(seo[page].title);
                if (seo[page].title.length > 60) {
                    // Truncate intelligently
                    seo[page].title = seo[page].title.substring(0, 57) + '...';
                }
            }
            if (seo[page].description) {
                seo[page].description = cleanText(seo[page].description);
                if (seo[page].description.length > 160) {
                    seo[page].description = seo[page].description.substring(0, 157) + '...';
                }
            }
        }
        
        fs.writeFileSync(filePath, JSON.stringify(seo, null, 2));
    }
});
console.log('SEO JSONs updated');
