const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LANGS = ['en', 'de', 'nl'];

const newLogic = `
    if (document.getElementById('modal-download-btn')) {
        const btn = document.getElementById('modal-download-btn');
        btn.href = '#';
        btn.onclick = (e) => {
            e.preventDefault();
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            const inSubdir = window.location.pathname.includes('/en/') || window.location.pathname.includes('/de/') || window.location.pathname.includes('/nl/');
            const apiPath = inSubdir ? '../api/generate-order-pdf.php' : './api/generate-order-pdf.php';
            iframe.src = \`\${apiPath}?ref=\${data.ref}\`;
            document.body.appendChild(iframe);
            setTimeout(() => { if (iframe.parentNode) document.body.removeChild(iframe); }, 5000);
        };
    }
`;

function injectLogic(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    const targetRegex = /if \(document\.getElementById\('modal-download-btn'\)\) \{\s*document\.getElementById\('modal-download-btn'\)\.href = `\.\/api\/generate-order-pdf\.php\?ref=\$\{data\.ref\}`;\s*\}/;
    
    if (targetRegex.test(content)) {
        content = content.replace(targetRegex, newLogic.trim());
        fs.writeFileSync(filePath, content);
        console.log(`Injected logic into ${filePath}`);
    } else {
        console.log(`Target block not found in ${filePath}`);
    }
}

LANGS.forEach(lang => {
    injectLogic(path.join(ROOT_DIR, lang, 'tableau-de-bord.html'));
});
