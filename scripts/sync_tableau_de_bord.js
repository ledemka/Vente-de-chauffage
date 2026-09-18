const fs = require('fs');
const path = require('path');

const root = __dirname;
const projectRoot = path.join(root, '..');
const langs = ['en', 'de', 'nl'];
const fileToSync = 'tableau-de-bord.html';

const srcHtml = fs.readFileSync(path.join(projectRoot, fileToSync), 'utf8');

langs.forEach(lang => {
    const destPath = path.join(projectRoot, lang, fileToSync);
    
    // Replace ./assets, ./data, ./api with ../assets, ../data, ../api
    let destHtml = srcHtml
        .replace(/href="\.\/assets\//g, 'href="../assets/')
        .replace(/src="\.\/assets\//g, 'src="../assets/')
        .replace(/href="\.\/data\//g, 'href="../data/')
        .replace(/src="\.\/data\//g, 'src="../data/')
        .replace(/href="\.\/api\//g, 'href="../api/')
        .replace(/src="\.\/api\//g, 'src="../api/')
        .replace(/fetch\('\.\/api\//g, "fetch('../api/")
        .replace(/fetch\('\.\/data\//g, "fetch('../data/")
        // Fix language selector paths (the dropdown)
        .replace(/href="en\//g, 'href="../en/')
        .replace(/href="de\//g, 'href="../de/')
        .replace(/href="nl\//g, 'href="../nl/')
        .replace(/href="tableau-de-bord\.html"/g, 'href="../tableau-de-bord.html"'); // The FR link
        
    fs.writeFileSync(destPath, destHtml);
    console.log("Synced to " + lang);
});
