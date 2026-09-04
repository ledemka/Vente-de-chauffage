const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const frSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" class="w-5 h-3.5 rounded-sm shadow-sm object-cover"><rect width="3" height="2" fill="#ED2939"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#002395"/></svg>`;
const enSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="w-5 h-3.5 rounded-sm shadow-sm object-cover"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`;
const deSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" class="w-5 h-3.5 rounded-sm shadow-sm object-cover"><rect width="5" height="3" fill="#000"/><rect width="5" height="2" y="1" fill="#D00"/><rect width="5" height="1" y="2" fill="#FFCE00"/></svg>`;
const nlSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" class="w-5 h-3.5 rounded-sm shadow-sm object-cover"><rect width="9" height="6" fill="#21468B"/><rect width="9" height="4" fill="#FFF"/><rect width="9" height="2" fill="#AE1C28"/></svg>`;

const langsInfo = {
    'FR': { title: 'Français', svg: frSvg },
    'EN': { title: 'English', svg: enSvg },
    'DE': { title: 'Deutsch', svg: deSvg },
    'NL': { title: 'Nederlands', svg: nlSvg }
};

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
        if (file.endsWith('.html')) {
            const filePath = path.join(fullPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Regex to find the language div block
            const blockRegex = /<div class="flex gap-2 text-label-md text-outline-variant font-label-md">([\s\S]*?)<\/div>/;
            const match = content.match(blockRegex);
            
            if (match) {
                const blockContent = match[1];
                // Check if it already has SVG to avoid double replacement
                if (blockContent.includes('<svg')) continue;

                // Extract all anchor tags inside the block
                const aTags = [...blockContent.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)];
                
                if (aTags.length === 4) {
                    let newBlock = '<div class="flex gap-3 items-center">\n';
                    
                    aTags.forEach((aMatch) => {
                        const href = aMatch[1];
                        const langCode = aMatch[2].trim();
                        // Determine if active by looking at the class string in the full match.
                        // The active one usually has 'font-bold'
                        const isActive = aMatch[0].includes('font-bold');
                        const info = langsInfo[langCode];
                        
                        const classes = isActive 
                            ? 'ring-2 ring-inverse-on-surface ring-offset-1 rounded-sm shadow-sm cursor-pointer'
                            : 'opacity-70 hover:opacity-100 transition-opacity cursor-pointer';
                            
                        newBlock += `                <a href="${href}" class="${classes}" title="${info.title}" aria-label="${info.title}">\n`;
                        newBlock += `                    ${info.svg}\n`;
                        newBlock += `                </a>\n`;
                    });
                    
                    newBlock += '            </div>';
                    
                    content = content.replace(blockRegex, newBlock);
                    fs.writeFileSync(filePath, content, 'utf8');
                    modifiedCount++;
                    console.log(`Updated ${path.join(dir, file)}`);
                }
            }
        }
    }
}

console.log(`Updated ${modifiedCount} files.`);
