const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    const $ = cheerio.load(content, { decodeEntities: false });
    
    let modified = false;
    
    $('img').each((i, el) => {
        const src = $(el).attr('src');
        if (src && src.includes('hero')) {
            // Hero image => fetchpriority="high", NO lazy
            if (!$(el).attr('fetchpriority')) {
                $(el).attr('fetchpriority', 'high');
                modified = true;
            }
            if ($(el).attr('loading')) {
                $(el).removeAttr('loading');
                modified = true;
            }
            if ($(el).attr('decoding')) {
                $(el).removeAttr('decoding');
                modified = true;
            }
        } else {
            // Regular images
            if (!$(el).attr('loading') || $(el).attr('loading') !== 'lazy') {
                $(el).attr('loading', 'lazy');
                modified = true;
            }
            if (!$(el).attr('decoding') || $(el).attr('decoding') !== 'async') {
                $(el).attr('decoding', 'async');
                modified = true;
            }
        }
    });

    if (modified) {
        // Need to unescape because cheerio escapes single quotes and some chars by default sometimes
        // But since decodeEntities is false it might be okay. Let's just save.
        // Wait, cheerio modifies formatting. We don't want to break Tailwind spacing.
        // It's safer to use regex to inject `loading="lazy" decoding="async"` on <img ...>
        // But cheerio can be messy.
    }
});
