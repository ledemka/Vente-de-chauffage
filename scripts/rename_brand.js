const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const replaceInFile = (filePath) => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content;

        // Replace brand names
        newContent = newContent.replace(/sotramsbois/g, 'sotramsbois');
        newContent = newContent.replace(/sotramsbois/g, 'sotramsbois');
        newContent = newContent.replace(/sotramsbois/g, 'sotramsbois');
        newContent = newContent.replace(/sotramsbois/g, 'sotramsbois'); // just in case
        
        // Replace domain
        newContent = newContent.replace(/boisdechauffage-pro\.com/g, 'sotramsbois.com');

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated: ${path.relative(ROOT_DIR, filePath)}`);
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
            const ext = path.extname(file);
            if (['.html', '.json', '.js', '.php', '.md'].includes(ext)) {
                replaceInFile(fullPath);
            }
        }
    }
};

console.log('Starting brand rename...');
walkSync(ROOT_DIR);
console.log('Finished brand rename.');
