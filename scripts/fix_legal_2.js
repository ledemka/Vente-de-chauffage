const fs = require('fs');
const path = require('path');

const dirs = ['.', 'en', 'de', 'nl'];
const files = ['mentions-legales.html', 'cgv.html', 'politique-confidentialite.html'];

dirs.forEach(dir => {
    files.forEach(file => {
        const filepath = path.join(__dirname, '..', dir, file);
        if (!fs.existsSync(filepath)) return;
        
        let content = fs.readFileSync(filepath, 'utf8');
        
        // Emails and phones
        content = content.replace(/contact@terreetfeu\.pro/g, '[Email de contact à compléter]');
        content = content.replace(/\+33 \(0\)3 88 00 00 00/g, '[Téléphone à compléter]');
        content = content.replace(/\+33388000000/g, '[Téléphone à compléter]');
        content = content.replace(/dpo@terreetfeu\.pro/g, '[Email du DPO à compléter]');
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log("Fixed remaining strings in " + filepath);
    });
});
