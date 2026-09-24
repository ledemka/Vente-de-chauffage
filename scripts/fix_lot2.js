const fs = require('fs');
const path = require('path');

// 2.2 robots.txt
if (fs.existsSync('robots.txt')) {
    let robots = fs.readFileSync('robots.txt', 'utf8');
    robots = robots.replace(/https:\/\/sotramsbois\.com/g, 'https://www.sotramsbois.com');
    if (!robots.includes('Disallow: /api/')) {
        robots = robots.replace('User-agent: *', 'User-agent: *\nDisallow: /api/');
    }
    fs.writeFileSync('robots.txt', robots);
}

// 2.2 sitemap.xml
if (fs.existsSync('sitemap.xml')) {
    let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
    sitemap = sitemap.replace(/https:\/\/sotramsbois\.com/g, 'https://www.sotramsbois.com');
    sitemap = sitemap.replace(/\/index\.html/g, '/');
    // Remove lastmod
    sitemap = sitemap.replace(/<lastmod>.*?<\/lastmod>/g, '');
    fs.writeFileSync('sitemap.xml', sitemap);
}

// 2.3 catalogue.html (transform main title to h1)
if (fs.existsSync('catalogue.html')) {
    let cat = fs.readFileSync('catalogue.html', 'utf8');
    // Look for the main title, which is likely an h2 or div with text-headline-xl
    // I don't know exactly what it is, I will replace the <h2 with <h1 and </h2 with </h1 for the main title
    // Let's do it intelligently. Usually it's: <h2 class="text-headline-xl text-on-surface mb-8">Catalogue</h2>
    cat = cat.replace(
        /<h2([^>]*)data-i18n="nav.catalog"([^>]*)>(.*?)<\/h2>/,
        '<h1$1data-i18n="nav.catalog"$2>$3</h1>'
    );
    // There might not be data-i18n on it, let's also try to find the biggest text
    if (!cat.includes('<h1')) {
        cat = cat.replace(
            /<h2([^>]*)text-headline-[lx][l]?([^>]*)>(.*?)<\/h2>/,
            '<h1$1text-headline-xl$2>$3</h1>'
        );
    }
    // Try again with text-display
    if (!cat.includes('<h1')) {
        cat = cat.replace(
            /<h2([^>]*)text-display-[a-z]+([^>]*)>(.*?)<\/h2>/,
            '<h1$1text-display-sm$2>$3</h1>'
        );
    }
    fs.writeFileSync('catalogue.html', cat);
}

// 2.4 article.html
if (fs.existsSync('article.html')) {
    let art = fs.readFileSync('article.html', 'utf8');
    if (!art.includes('<meta name="robots" content="noindex, follow">')) {
        art = art.replace('</head>', '    <meta name="robots" content="noindex, follow">\n</head>');
        fs.writeFileSync('article.html', art);
    }
}

console.log('Lot 2 HTML files fixed');
