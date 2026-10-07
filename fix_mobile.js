const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (let entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist-production' && entry.name !== 'dist') {
            processDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
            let c = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            
            // Fix header padding
            if (c.includes('px-margin-desktop')) {
                c = c.replace(/px-margin-desktop/g, 'px-margin-mobile md:px-margin-desktop');
                changed = true;
            }
            
            // Fix nav gaps
            if (c.includes('flex items-center gap-10')) {
                c = c.replace(/flex items-center gap-10/g, 'flex items-center gap-4 md:gap-10 overflow-x-auto whitespace-nowrap no-scrollbar');
                changed = true;
            }

            // Prevent body horizontal scroll
            if (c.match(/<body class="([^"]*)"/)) {
                if (!c.includes('overflow-x-hidden')) {
                    c = c.replace(/<body class="([^"]*)"/g, '<body class="$1 overflow-x-hidden"');
                    changed = true;
                }
            }

            if (changed) {
                fs.writeFileSync(fullPath, c, 'utf8');
                console.log('Fixed ' + fullPath);
            }
        }
    }
}

processDir('.');
