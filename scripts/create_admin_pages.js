const fs = require('fs');
const path = require('path');

const src = 'admin-commandes.html';
const dests = ['en/admin-commandes.html', 'de/admin-commandes.html', 'nl/admin-commandes.html'];

let content = fs.readFileSync(src, 'utf8');

// Replace relative paths for subdirectories
let subContent = content
    .replace(/href="\.\/assets/g, 'href="../assets')
    .replace(/src="\.\/assets/g, 'src="../assets')
    .replace(/href="\.\//g, 'href="../')
    .replace(/fetch\('\.\/api/g, "fetch('../api")
    .replace(/fetch\('\.\/data/g, "fetch('../data");

dests.forEach(dest => {
    // For language switcher URLs in the dropdown
    // e.g., href="admin-commandes.html" -> href="../admin-commandes.html"
    // Actually the language dropdown in HTML uses absolute paths from root for other langs
    // So for 'en/admin-commandes.html':
    // href="admin-commandes.html" -> href="../admin-commandes.html" (for FR)
    // href="en/admin-commandes.html" -> href="admin-commandes.html" (for EN, current)
    // href="de/admin-commandes.html" -> href="../de/admin-commandes.html"
    
    // Simplest way is to just write subContent and then fix the lang dropdown manually or rely on `update_i18n.js` / `replace_flags.js` if they exist.
    // Wait, let's just make the dropdown use absolute paths or correct relative paths.
    
    let destContent = subContent;
    
    // Fix lang dropdown links
    destContent = destContent.replace(/href="admin-commandes\.html"/g, 'href="../admin-commandes.html"');
    destContent = destContent.replace(/href="\.\.\/en\/admin-commandes\.html"/g, 'href="../en/admin-commandes.html"');
    destContent = destContent.replace(/href="\.\.\/de\/admin-commandes\.html"/g, 'href="../de/admin-commandes.html"');
    destContent = destContent.replace(/href="\.\.\/nl\/admin-commandes\.html"/g, 'href="../nl/admin-commandes.html"');
    
    // If the dest is EN, the EN link should be current dir
    if (dest.startsWith('en/')) destContent = destContent.replace(/href="\.\.\/en\/admin-commandes\.html"/g, 'href="admin-commandes.html"');
    if (dest.startsWith('de/')) destContent = destContent.replace(/href="\.\.\/de\/admin-commandes\.html"/g, 'href="admin-commandes.html"');
    if (dest.startsWith('nl/')) destContent = destContent.replace(/href="\.\.\/nl\/admin-commandes\.html"/g, 'href="admin-commandes.html"');
    
    fs.writeFileSync(dest, destContent, 'utf8');
    console.log('Created ' + dest);
});
