const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langDirs = ['', 'en', 'de', 'nl'];

for (const lang of langDirs) {
    const relPath = lang ? '../' : './';
    const filePath = path.join(rootDir, lang, 'catalogue.html');
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Only append if not already there
    if (!content.includes('</body>')) {
        const toAppend = `\n<script src="${relPath}assets/js/user-menu.js"></script>\n<script src="${relPath}assets/js/lang-selector.js"></script>\n</body></html>\n`;
        fs.appendFileSync(filePath, toAppend);
        console.log(`✓ Fixed ${lang ? lang + '/' : ''}catalogue.html`);
    } else if (!content.includes('user-menu.js')) {
        // If </body> exists but user-menu.js is missing
        content = content.replace('</body>', `<script src="${relPath}assets/js/user-menu.js"></script>\n</body>`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Added user-menu.js to ${lang ? lang + '/' : ''}catalogue.html`);
    }
}
