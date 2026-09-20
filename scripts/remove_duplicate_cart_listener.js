const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

let count = 0;

for (const dir of dirs) {
    const filePath = path.join(rootDir, dir, 'produit.html');
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to remove the block:
    // const btnCommander = document.getElementById('btn-commander');
    // if (btnCommander) {
    //     btnCommander.addEventListener('click', async () => {
    //       ...
    //     });
    // }
    
    // Regex that matches from `const btnCommander = ...` up to the end of that if block, right before `const btnDevis`
    const regex = /const btnCommander\s*=\s*document\.getElementById\('btn-commander'\);[\s\S]*?\}\);\s*\n\s*\}/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, '');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${filePath}`);
        count++;
    } else {
        console.log(`No duplicate listener found in ${filePath}`);
    }
}

console.log(`Total fixed: ${count}`);
