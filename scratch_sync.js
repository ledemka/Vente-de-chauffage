const fs = require('fs');
const path = require('path');

const root = __dirname;
const langs = ['en', 'de', 'nl'];

function syncScriptBlock(filename, scriptStart, scriptEnd) {
    const srcHtml = fs.readFileSync(path.join(root, filename), 'utf8');
    const blockStartIdx = srcHtml.indexOf(scriptStart);
    const blockEndIdx = srcHtml.lastIndexOf(scriptEnd) + scriptEnd.length;
    
    if (blockStartIdx === -1 || blockEndIdx === -1) {
        console.error("Could not find script block in " + filename);
        return;
    }
    
    const srcScript = srcHtml.substring(blockStartIdx, blockEndIdx);
    
    langs.forEach(lang => {
        const destPath = path.join(root, lang, filename);
        if (fs.existsSync(destPath)) {
            let destHtml = fs.readFileSync(destPath, 'utf8');
            const dStartIdx = destHtml.indexOf(scriptStart);
            const dEndIdx = destHtml.lastIndexOf(scriptEnd) + scriptEnd.length;
            if (dStartIdx !== -1 && dEndIdx !== -1) {
                destHtml = destHtml.substring(0, dStartIdx) + srcScript + destHtml.substring(dEndIdx);
                fs.writeFileSync(destPath, destHtml);
                console.log("Updated " + destPath);
            } else {
                console.log("Script block not found in " + destPath);
            }
        }
    });
}

syncScriptBlock('catalogue.html', `<script>
            document.addEventListener('DOMContentLoaded', () => {`, `            });
        </script>`);

syncScriptBlock('produit.html', `<script>
                document.addEventListener('DOMContentLoaded', () => {
                    document.addEventListener('i18nLoaded', async (e) => {`, `                    });
                });
            </script>`);
