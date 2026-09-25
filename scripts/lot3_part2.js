const fs = require('fs');

let js = fs.readFileSync('scripts/post_process_seo.js', 'utf8');

// In processSeo, we need to wrap the canonical and og logic
// "3. Canonical and hreflang"
const canonicalTarget = `// 3. Canonical and hreflang
    $('link[rel="canonical"]').remove();
    $('link[rel="alternate"][hreflang]').remove();
    
    // For produit.html and article.html, apply same rule (URL without params)
    $('head').append(\`\\n<link rel="canonical" href="\${canonicalUrl}">\`);
    
    ['fr', 'en', 'de', 'nl'].forEach(l => {
        $('head').append(\`\\n<link rel="alternate" hreflang="\${l}" href="\${getCanonicalUrl(l, pageName)}">\`);
    });
    $('head').append(\`\\n<link rel="alternate" hreflang="x-default" href="\${getCanonicalUrl('fr', pageName)}">\`);`;

const canonicalReplacement = `// 3. Canonical and hreflang
    $('link[rel="canonical"]').remove();
    $('link[rel="alternate"][hreflang]').remove();
    
    if (pageName !== 'produit.html') {
        $('head').append(\`\\n<link rel="canonical" href="\${canonicalUrl}">\`);
        
        ['fr', 'en', 'de', 'nl'].forEach(l => {
            $('head').append(\`\\n<link rel="alternate" hreflang="\${l}" href="\${getCanonicalUrl(l, pageName)}">\`);
        });
        $('head').append(\`\\n<link rel="alternate" hreflang="x-default" href="\${getCanonicalUrl('fr', pageName)}">\`);
    }`;

js = js.replace(canonicalTarget, canonicalReplacement);

fs.writeFileSync('scripts/post_process_seo.js', js, 'utf8');
console.log('post_process_seo.js patched.');
