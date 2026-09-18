const fs = require('fs');
['tableau-de-bord.html', 'admin-commandes.html'].forEach(f => {
    let txt = fs.readFileSync(f, 'utf8');
    txt = txt.replace(/class:/g, "'class':");
    fs.writeFileSync(f, txt);
    console.log('Fixed ' + f);
});
