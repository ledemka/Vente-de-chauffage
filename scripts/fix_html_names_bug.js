const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langs = ['', 'en', 'de', 'nl'];

const helperStr = `
                        // Injected getProductName helper
                        if (typeof window.getProductName === 'undefined') {
                            window.getProductName = (p) => {
                                const l = document.documentElement.lang || 'fr';
                                return p ? (typeof p.name === 'string' ? p.name : (p.name[l] || p.name.fr)) : '';
                            };
                        }
`;

langs.forEach(lang => {
    const dir = lang ? path.join(rootDir, lang) : rootDir;

    // 2. catalogue.html
    const cataloguePath = path.join(dir, 'catalogue.html');
    if (fs.existsSync(cataloguePath)) {
        let content = fs.readFileSync(cataloguePath, 'utf8');
        if (!content.includes('Injected getProductName helper')) {
            content = content.replace("try {", `try {${helperStr}`);
            fs.writeFileSync(cataloguePath, content);
            console.log(`Fixed ${cataloguePath}`);
        }
    }

    // 3. devis.html
    const devisPath = path.join(dir, 'devis.html');
    if (fs.existsSync(devisPath)) {
        let content = fs.readFileSync(devisPath, 'utf8');
        if (!content.includes('Injected getProductName helper')) {
            content = content.replace("try {", `try {${helperStr}`);
            fs.writeFileSync(devisPath, content);
            console.log(`Fixed ${devisPath}`);
        }
    }
});
