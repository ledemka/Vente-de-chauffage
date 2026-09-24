const fs = require('fs');
const cheerio = require('cheerio');

// tableau-de-bord.html
let html = fs.readFileSync('tableau-de-bord.html', 'utf8');
let $ = cheerio.load(html, { decodeEntities: false });

const dashboardKeys = [
    'dashboard.profile.company',
    'dashboard.profile.contact_name',
    'dashboard.profile.email',
    'dashboard.profile.phone',
    'dashboard.profile.address'
];

dashboardKeys.forEach(key => {
    $(`[data-i18n="${key}"]`).each((i, el) => {
        const text = $(el).contents().filter(function() { return this.nodeType === 3; }).text().trim();
        const hasAsterisk = $(el).find('.text-error').length > 0;
        if (hasAsterisk) {
            $(el).removeAttr('data-i18n');
            $(el).empty();
            $(el).append(`<span data-i18n="${key}">${text}</span> <span class="text-error">*</span>`);
        }
    });
});
fs.writeFileSync('tableau-de-bord.html', $.html());

// index.html - categories.pellets
html = fs.readFileSync('index.html', 'utf8');
$ = cheerio.load(html, { decodeEntities: false });
$(`[data-i18n="categories.pellets"]`).each((i, el) => {
    const htmlContent = $(el).html();
    if (htmlContent.includes('<sup')) {
        const text = $(el).contents().filter(function() { return this.nodeType === 3; }).text().trim();
        const sup = $(el).find('sup').parent().html(); // it might be inside a child
        // Better: just remove data-i18n from the parent and wrap the text
        $(el).removeAttr('data-i18n');
        $(el).empty();
        $(el).append(`<span data-i18n="categories.pellets">Granulés de bois</span><sup class="text-xs text-primary relative -top-2 ml-0.5">*</sup>`);
    }
});
fs.writeFileSync('index.html', $.html());

// blog.html - blog.article_1_title
html = fs.readFileSync('blog.html', 'utf8');
$ = cheerio.load(html, { decodeEntities: false });
$(`[data-i18n="blog.article_1_title"]`).each((i, el) => {
    const htmlContent = $(el).html();
    if (htmlContent.includes('<br')) {
        $(el).removeAttr('data-i18n');
        $(el).empty();
        $(el).append(`<span data-i18n="blog.article_1_title">Comment bien stocker ses granulés de bois ?</span>`);
    }
});
fs.writeFileSync('blog.html', $.html());

// cgv.html - cgv.payment_method_desc
if (fs.existsSync('cgv.html')) {
    html = fs.readFileSync('cgv.html', 'utf8');
    $ = cheerio.load(html, { decodeEntities: false });
    $(`[data-i18n="cgv.payment_method_desc"]`).each((i, el) => {
        const htmlContent = $(el).html();
        if (htmlContent.includes('<ul')) {
            $(el).removeAttr('data-i18n');
            // Hard to rebuild, let's just do a string replace on the raw file
            let raw = fs.readFileSync('cgv.html', 'utf8');
            raw = raw.replace(
                /<p data-i18n="cgv\.payment_method_desc">([^<]+)<ul/g,
                '<p><span data-i18n="cgv.payment_method_desc">$1</span><ul'
            );
            fs.writeFileSync('cgv.html', raw);
        }
    });
}
console.log('Fixed tags');
