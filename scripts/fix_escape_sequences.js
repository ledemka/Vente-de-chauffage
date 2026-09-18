const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const files = [
    'tableau-de-bord.html',
    path.join('en', 'tableau-de-bord.html'),
    path.join('de', 'tableau-de-bord.html'),
    path.join('nl', 'tableau-de-bord.html'),
    path.join('dist-production', 'en', 'tableau-de-bord.html'),
    path.join('dist-production', 'de', 'tableau-de-bord.html'),
    path.join('dist-production', 'nl', 'tableau-de-bord.html'),
    path.join('dist-production', 'tableau-de-bord.html'),
];

files.forEach(f => {
    const fp = path.join(root, f);
    if (!fs.existsSync(fp)) {
        console.log('SKIP (missing): ' + f);
        return;
    }
    let txt = fs.readFileSync(fp, 'utf8');
    
    const btBefore = (txt.match(/\\`/g) || []).length;
    const ipBefore = (txt.match(/\\\$\{/g) || []).length;
    
    // Fix: replace escaped backticks and escaped interpolations ONLY inside <script> blocks
    // to avoid touching legitimate HTML content
    // Strategy: split on <script> and </script> boundaries and fix only JS portions
    
    const parts = txt.split(/(<script[^>]*>|<\/script>)/gi);
    let inScript = false;
    const fixed = parts.map(part => {
        if (/^<script/i.test(part)) { inScript = true; return part; }
        if (/^<\/script>/i.test(part)) { inScript = false; return part; }
        if (inScript) {
            // Remove erroneous backslash escaping before ` and ${
            return part.replace(/\\`/g, '`').replace(/\\\$\{/g, '${');
        }
        return part;
    });
    txt = fixed.join('');
    
    const btAfter = (txt.match(/\\`/g) || []).length;
    const ipAfter = (txt.match(/\\\$\{/g) || []).length;
    
    fs.writeFileSync(fp, txt);
    console.log(f + ': fixed backticks ' + btBefore + '->' + btAfter + ', interp ' + ipBefore + '->' + ipAfter);
});
