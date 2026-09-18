const fs = require('fs');
const path = require('path');

const root = __dirname;
const projectRoot = path.join(root, '..');
const langs = ['en', 'de', 'nl'];
const fileToSync = 'admin-commandes.html';

const srcHtml = fs.readFileSync(path.join(projectRoot, fileToSync), 'utf8');

langs.forEach(lang => {
    // Check if lang directory exists, if not, create it
    const langDir = path.join(projectRoot, lang);
    if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir);
    }
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
        .replace(/href="admin-commandes\.html"/g, 'href="../admin-commandes.html"') // The FR link
        .replace(/<html lang="fr"/g, '<html lang="' + lang + '"');
        
    fs.writeFileSync(destPath, destHtml);
    console.log("Synced to " + lang);
});
