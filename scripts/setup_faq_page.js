const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

// 1. Setup faq.html
let faqHtml = fs.readFileSync('faq.html', 'utf8');
const $faq = cheerio.load(faqHtml);
$faq('title').text('Foire Aux Questions B2B | sotramsbois');
$faq('link[rel="canonical"]').attr('href', 'https://www.sotramsbois.com/faq.html');
$faq('link[hreflang="fr"]').attr('href', 'https://www.sotramsbois.com/faq.html');
$faq('link[hreflang="en"]').attr('href', 'https://www.sotramsbois.com/en/faq.html');
$faq('link[hreflang="de"]').attr('href', 'https://www.sotramsbois.com/de/faq.html');
$faq('link[hreflang="nl"]').attr('href', 'https://www.sotramsbois.com/nl/faq.html');
$faq('link[hreflang="x-default"]').attr('href', 'https://www.sotramsbois.com/faq.html');

const htmlContent = `
    <!-- Hero Section -->
    <section class="bg-surface-container py-16 md:py-24 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M54.627 0l1.373 1.373-1.373 1.373-1.373-1.373z\\' fill=\\'%23802813\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')]"></div>
        <div class="max-w-[1440px] mx-auto px-margin-desktop relative z-10 text-center">
            <h1 class="text-headline-xl font-headline-xl text-on-surface mb-6" data-i18n="faq.title">Foire Aux Questions</h1>
            <p class="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto" data-i18n="faq.intro">
                Retrouvez les réponses aux questions fréquentes concernant nos produits, nos livraisons et notre politique B2B.
            </p>
        </div>
    </section>

    <!-- FAQ Container -->
    <section class="py-16 md:py-24 bg-surface">
        <div class="max-w-3xl mx-auto px-margin-desktop flex flex-col gap-4" id="faq-container">
            <!-- Loaded dynamically -->
        </div>
    </section>

    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            const lang = document.documentElement.lang || 'fr';
            const dataPath = window.resolveDataPath ? window.resolveDataPath('data/faq.json') : './data/faq.json';
            try {
                const res = await fetch(dataPath);
                const faqs = await res.json();
                const container = document.getElementById('faq-container');
                let html = '';
                let schemaItems = [];
                
                faqs.forEach(q => {
                    const question = q.question[lang] || q.question.fr;
                    const answer = q.answer[lang] || q.answer.fr;
                    
                    html += '<details class="bg-surface-container border border-outline-variant rounded-lg overflow-hidden group">' +
                            '<summary class="cursor-pointer px-6 py-4 flex items-center justify-between list-none text-headline-md font-headline-md text-on-surface hover:bg-surface-variant transition-colors">' +
                                '<span>' + question + '</span>' +
                                '<span class="material-symbols-outlined text-[#802813] transition-transform duration-300 group-open:rotate-180">expand_more</span>' +
                            '</summary>' +
                            '<div class="px-6 pb-6 pt-2 text-body-md font-body-md text-on-surface-variant leading-relaxed">' +
                                answer +
                            '</div>' +
                        '</details>';
                    
                    schemaItems.push({
                        "@type": "Question",
                        "name": question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": answer
                        }
                    });
                });
                container.innerHTML = html;
                
                // Add FAQ Schema
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.text = JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": schemaItems
                });
                document.head.appendChild(script);
            } catch(e) {
                console.error('Failed to load FAQ', e);
            }
        });
    </script>
`;

$faq('main').html(htmlContent);
fs.writeFileSync('faq.html', $faq.html());
console.log('Updated faq.html');

// 2. Add FAQ to all HTML navs
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(content);
    
    // Add to Desktop Nav (find nav containing ACCUEIL)
    const $desktopNav = $('nav').filter(function() {
        return $(this).find('a[href*="index.html"]').length > 0;
    }).first();
    
    if ($desktopNav.length > 0) {
        if ($desktopNav.find('a[data-i18n="nav.faq"]').length === 0) {
            const isActive = file === 'faq.html';
            const cls = isActive ? 'text-primary font-bold border-b-2 border-primary text-label-md font-label-md transition-colors py-3' : 'text-on-surface-variant hover:text-primary text-label-md font-label-md transition-colors py-3';
            $desktopNav.find('div.flex.items-center.gap-10').append('<a class="' + cls + '" data-i18n="nav.faq" href="./faq.html"><span data-i18n="nav.faq">FAQ</span></a>');
        }
    }
    
    // Add to Mobile Nav
    const $mobileMenu = $('#mobile-menu-drawer nav');
    if ($mobileMenu.length > 0) {
        if ($mobileMenu.find('a[data-i18n="nav.faq"]').length === 0) {
            $mobileMenu.append('<a class="block py-4 border-b border-outline-variant/30 text-headline-md font-headline-md text-on-surface" data-i18n="nav.faq" href="./faq.html">FAQ</a>');
        }
    }
    
    // Add to Footer
    const $footerNav = $('footer h4:contains("SERVICES"), footer h4:has(span[data-i18n="footer.services_title"])').parent().find('nav');
    if ($footerNav.length > 0) {
        if ($footerNav.find('a[href="./faq.html"]').length === 0) {
            // Insert before contact
            const $contact = $footerNav.find('a[href="./contact.html"]');
            const faqLink = '<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./faq.html"><span data-i18n="nav.faq">FAQ</span></a>';
            if ($contact.length) {
                $contact.before(faqLink);
            } else {
                $footerNav.append(faqLink);
            }
        }
    }
    
    // Write back
    let newContent = $.html();
    
    // Restore raw HTML for templates that Cheerio might escape (especially in script tags)
    newContent = newContent.replace(/&#x3E;/g, '>').replace(/&#x3C;/g, '<').replace(/&#x22;/g, '"');
    
    fs.writeFileSync(file, newContent);
});
console.log('Updated nav in all HTML files');
