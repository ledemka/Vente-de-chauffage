const fs = require('fs');
const cheerio = require('cheerio');

const pages = [
    { file: 'cgv.html', prefix: 'cgv.' },
    { file: 'mentions-legales.html', prefix: 'mentions.' },
    { file: 'politique-confidentialite.html', prefix: 'privacy.' },
    { file: 'politique-retour.html', prefix: 'return.' }
];

const extracted = {};

pages.forEach(({ file, prefix }) => {
    const html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html);
    
    // Find elements that have text but no data-i18n
    const tags = ['p', 'h1', 'h2', 'h3', 'li', 'span', 'strong', 'td', 'th'];
    
    let counter = 1;
    extracted[file] = [];
    
    $(tags.join(',')).each((i, el) => {
        const $el = $(el);
        if ($el.attr('data-i18n') || $el.attr('data-i18n-html')) return;
        if ($el.parents('[data-i18n], [data-i18n-html]').length > 0) return;
        
        // Only if it has direct text
        const text = $el.text().trim();
        const htmlContent = $el.html() ? $el.html().trim() : '';
        
        // Skip empty or very short non-text (like just an icon)
        if (!text || text.length < 2) return;
        
        // Skip navigation/footer parts (assume they have specific classes or are inside specific semantic tags)
        if ($el.closest('nav, footer, header').length > 0) return;
        
        extracted[file].push({
            tag: el.tagName,
            text: text,
            html: htmlContent,
            class: $el.attr('class') || ''
        });
    });
});

fs.writeFileSync('missing_legal.json', JSON.stringify(extracted, null, 2));
console.log('Extracted missing legal text to missing_legal.json');
