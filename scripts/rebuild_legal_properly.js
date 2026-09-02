const fs = require('fs');
const path = require('path');

const dirs = ['.', 'en', 'de', 'nl'];
const files = ['mentions-legales.html', 'cgv.html', 'politique-confidentialite.html'];

function extractTag(html, tag, includeTag = true) {
    const startIdx = html.indexOf(`<${tag}`);
    if (startIdx === -1) return '';
    const endIdx = html.indexOf(`</${tag}>`, startIdx);
    if (endIdx === -1) return '';
    if (includeTag) {
        return html.substring(startIdx, endIdx + `</${tag}>`.length);
    } else {
        const startTagEnd = html.indexOf('>', startIdx) + 1;
        return html.substring(startTagEnd, endIdx);
    }
}

// Extract mobile menu explicitly
function extractMobileMenu(html) {
    const startStr = '<div id="mobile-menu-drawer"';
    const startIdx = html.indexOf(startStr);
    if (startIdx === -1) return '';
    
    let depth = 0;
    let i = startIdx;
    while (i < html.length) {
        if (html.substring(i, i + 4) === '<div') depth++;
        if (html.substring(i, i + 5) === '</div') {
            depth--;
            if (depth === 0) {
                return html.substring(startIdx, i + 6);
            }
        }
        i++;
    }
    return '';
}

dirs.forEach(dir => {
    // Read the source index.html for this language to get the true shell
    const indexPath = path.join(__dirname, '..', dir, 'index.html');
    if (!fs.existsSync(indexPath)) return;
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    
    const trueHead = extractTag(indexHtml, 'head', false);
    const trueHeader = extractTag(indexHtml, 'header', true);
    const trueMobileMenu = extractMobileMenu(indexHtml);
    const trueFooter = extractTag(indexHtml, 'footer', true);
    
    files.forEach(file => {
        const filepath = path.join(__dirname, '..', dir, file);
        if (!fs.existsSync(filepath)) return;
        
        let currentHtml = fs.readFileSync(filepath, 'utf8');
        let mainContent = extractTag(currentHtml, 'main', true);
        
        // We need to fix the active nav link in the trueHeader for this specific file
        let modifiedHeader = trueHeader;
        
        // Remove active state from Accueil (index.html)
        modifiedHeader = modifiedHeader.replace(/class="([^"]*)text-primary font-bold border-b-2 border-primary([^"]*)"([^>]*)href="(\.\/|\.\.\/)index\.html"/, 'class="$1text-on-surface-variant hover:text-primary$2"$3href="$4index.html"');
        
        // In index.html, CONTACT is just contact.html or mentions-legales.html
        // We should make the current file active.
        modifiedHeader = modifiedHeader.replace(new RegExp(`class="([^"]*)text-on-surface-variant hover:text-primary([^"]*)"([^>]*)href="(\\.\\/|\\.\\.\\/)${file}"`), 'class="$1text-primary font-bold border-b-2 border-primary$2"$3href="$4' + file + '"');
        
        // Also fix the <head> tags for canonical / hreflang for this specific file
        let modifiedHead = trueHead;
        modifiedHead = modifiedHead.replace(/index\.html/g, file);
        // Ensure custom.css is correctly referenced
        
        // Build the new HTML
        const newHtml = `<!DOCTYPE html>
<html lang="${dir === '.' ? 'fr' : dir}">
<head>
${modifiedHead}
</head>
<body class="bg-surface font-body-md text-on-surface">
${modifiedHeader}
${trueMobileMenu}
${mainContent}
${trueFooter}
<script src="${dir === '.' ? './' : '../'}assets/js/i18n-loader.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('mobile-menu-btn');
        const drawer = document.getElementById('mobile-menu-drawer');
        const close = document.getElementById('mobile-menu-close');
        
        if (btn && drawer) {
            btn.addEventListener('click', () => drawer.classList.remove('hidden'));
        }
        if (close && drawer) {
            close.addEventListener('click', () => drawer.classList.add('hidden'));
        }
    });
</script>
</body>
</html>`;
        
        fs.writeFileSync(filepath, newHtml, 'utf8');
        console.log(`Rebuilt ${filepath}`);
    });
});
