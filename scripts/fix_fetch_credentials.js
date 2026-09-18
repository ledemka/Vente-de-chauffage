const fs = require('fs');

const files = [
    'assets/js/auth.js',
    'assets/js/cart.js',
    'tableau-de-bord.html',
    'admin-commandes.html',
    'en/tableau-de-bord.html',
    'de/tableau-de-bord.html',
    'nl/tableau-de-bord.html',
    'en/admin-commandes.html',
    'de/admin-commandes.html',
    'nl/admin-commandes.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Add credentials: 'include' if missing
    if (content.includes("method: 'POST'")) {
        content = content.replace(/method:\s*'POST',(?!\s*credentials:)/g, "method: 'POST',\n            credentials: 'include',");
    }
    if (content.includes('method: "POST"')) {
        content = content.replace(/method:\s*"POST",(?!\s*credentials:)/g, 'method: "POST",\n            credentials: "include",');
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed ' + file);
});
