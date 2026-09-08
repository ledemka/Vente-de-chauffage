const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const replaceInFile = (filePath) => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // The exact duplicate line to remove:
        // <span class="text-headline-md font-headline-md text-inverse-on-surface">sotramsbois</span></div><div class="flex-1 max-w-md px-gutter">
        const regex = /^\s*<span class="text-headline-md font-headline-md text-inverse-on-surface">sotramsbois<\/span><\/div><div class="flex-1 max-w-md px-gutter">/gm;
        
        const newContent = content.replace(regex, '</div><div class="flex-1 max-w-md px-gutter">');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Fixed: ${path.relative(ROOT_DIR, filePath)}`);
        }
    } catch (e) {
        console.error(`Error processing ${filePath}:`, e);
    }
};

const walkSync = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (['node_modules', '.git', '.agent', 'dist-production'].includes(file)) continue;
            walkSync(fullPath);
        } else {
            if (file.endsWith('.html')) {
                replaceInFile(fullPath);
            }
        }
    }
};

walkSync(ROOT_DIR);
console.log('Done cleaning up duplicate header name.');
