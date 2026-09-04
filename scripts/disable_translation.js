const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
        if (file.endsWith('.html')) {
            const filePath = path.join(fullPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            let changed = false;

            // 1. Add translate="no" to <html>
            if (!content.includes('translate="no"')) {
                // Find <html ...> and add translate="no" before the closing >
                // Assumes format like <html lang="en"> or <html lang="en" class="...">
                content = content.replace(/<html([^>]+)>/i, (match, p1) => {
                    // Make sure not to duplicate
                    if (p1.includes('translate="no"')) return match;
                    return `<html${p1} translate="no">`;
                });
                changed = true;
            }

            // 2. Add <meta name="google" content="notranslate">
            if (!content.includes('content="notranslate"')) {
                // Insert after <head> or <meta charset="utf-8"/>
                if (content.includes('<meta charset="utf-8"/>')) {
                    content = content.replace('<meta charset="utf-8"/>', '<meta charset="utf-8"/>\n    <meta name="google" content="notranslate"/>');
                } else if (content.includes('<head>')) {
                    content = content.replace('<head>', '<head>\n    <meta name="google" content="notranslate"/>');
                }
                changed = true;
            }

            if (changed) {
                fs.writeFileSync(filePath, content, 'utf8');
                modifiedCount++;
                console.log(`Updated ${path.join(dir, file)}`);
            }
        }
    }
}

console.log(`Updated ${modifiedCount} files.`);
