const jsdom = require('jsdom');
const fs = require('fs');
const path = require('path');
const { JSDOM } = jsdom;

const html = fs.readFileSync('dist-production/produit.html', 'utf8');

const dom = new JSDOM(html, {
    url: 'https://www.sotramsbois.com/produit.html?id=hetre-etuve',
    runScripts: "dangerously",
    resources: "usable"
});

setTimeout(() => {
    const doc = dom.window.document;
    
    console.log('Title:', doc.title);
    
    const metaDesc = doc.querySelector('meta[name="description"]');
    console.log('Meta Description:', metaDesc ? metaDesc.content : 'missing');
    
    const canonical = doc.querySelector('link[rel="canonical"]');
    console.log('Canonical:', canonical ? canonical.href : 'missing');
    
    const hLangs = Array.from(doc.querySelectorAll('link[rel="alternate"][hreflang]')).map(l => `${l.hreflang} -> ${l.href}`);
    console.log('Hreflangs:', hLangs);
    
    const ogTitle = doc.querySelector('meta[property="og:title"]');
    console.log('OG Title:', ogTitle ? ogTitle.content : 'missing');
    
    const lds = Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).map(s => {
        try {
            return JSON.parse(s.textContent);
        } catch (e) {
            return { error: e.message, content: s.textContent };
        }
    });
    console.log('JSON-LDs:', JSON.stringify(lds, null, 2));

}, 2000);
