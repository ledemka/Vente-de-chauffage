const fs = require('fs');
const path = require('path');

const directories = ['.', 'en', 'de', 'nl'];

function modifyContactFile(filepath) {
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. Société
    content = content.replace('>Société *</label>', '>Société</label>');
    content = content.replace('id="societe" required=""', 'id="societe"');

    // 2. SIRET
    content = content.replace('>SIRET / TVA Intracom. *</label>', '>SIRET / TVA Intracom.</label>');
    content = content.replace('id="siret" required=""', 'id="siret"');

    // 3. Détails du projet -> Commentaire
    content = content.replace('>Détails du projet / Volumes estimés *</label>', '>Commentaire</label>');
    content = content.replace('id="message" required=""', 'id="message"');

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Modified ${filepath}`);
}

directories.forEach(d => {
    modifyContactFile(path.join(__dirname, '..', d, 'contact.html'));
});

console.log("Done.");
