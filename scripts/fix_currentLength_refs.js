const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const dirs = ['.', 'en', 'de', 'nl'];

dirs.forEach(d => {
    const file = path.join(rootDir, d, 'produit.html');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        content = content.replace(/if\s*\(!currentLength\)/g, 'if (!selectedLength)');
        content = content.replace(/\/\/ For Bûches: currentLength = URL param if valid, else empty \(no silent default\)/g, '// For Bûches: selectedLength = URL param if valid, else empty (no silent default)');
        content = content.replace(/\/\/ currentLength starts empty if no URL param/g, '// selectedLength starts empty if no URL param');
        content = content.replace(/\/\/ currentLength is declared below in the pricing block/g, '// selectedLength is declared below in the pricing block');
        
        // Also remove the old global window.currentLength if it exists
        content = content.replace(/window\.currentLength\s*=\s*currentLength;/g, '');

        fs.writeFileSync(file, content, 'utf8');
        console.log(`[OK] Updated currentLength refs in ${file}`);
    }
});
