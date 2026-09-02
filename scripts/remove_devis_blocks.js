const fs = require('fs');
const path = require('path');

const directories = ['.', 'en', 'de', 'nl'];

function modifyDevisFile(filepath) {
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    const initialLength = content.length;

    // Tâche 1: Remove "01 / B2B LOGISTICS" label
    // The exact class might have some variations or spacing, let's use a flexible regex
    const task1Regex = /<p class="font-label-md[^>]*>\s*<span class="inline-block[^>]*>01<\/span> \/ B2B LOGISTICS\s*<\/p>\s*/;
    content = content.replace(task1Regex, '');

    // Tâche 2: Remove Logistics Visual and Trust Badges
    const task2Regex = /\s*<!-- Logistics Visual \(Image\) -->[\s\S]*?<!-- Trust Badges -->[\s\S]*?DINplus[\s\S]*?<\/div>\s*<\/div>\s*/;
    content = content.replace(task2Regex, '\n');

    if (content.length < initialLength) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Modified ${filepath}`);
    } else {
        console.log(`No changes made to ${filepath}`);
    }
}

directories.forEach(d => {
    modifyDevisFile(path.join(__dirname, '..', d, 'devis.html'));
});

console.log("Done.");
