const fs = require('fs');
const path = require('path');

const directories = ['.', 'en', 'de', 'nl'];

function modifyIndexFile(filepath) {
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. Add group class to hero section
    content = content.replace(
        /id="hero-carousel-section" class="/,
        'id="hero-carousel-section" class="group '
    );

    // 2. Add classes to prev and next buttons
    content = content.replace(
        /<button id="hero-prev-btn" class="([^"]*)"/g,
        '<button id="hero-prev-btn" class="$1 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300"'
    );
    content = content.replace(
        /<button id="hero-next-btn" class="([^"]*)"/g,
        '<button id="hero-next-btn" class="$1 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300"'
    );

    // 3. Remove Carousel Controls
    content = content.replace(
        /\s*<!-- Carousel Controls -->[\s\S]*?(?=<\/div>\s*<\/section>)/,
        ''
    );

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Modified ${filepath}`);
}

directories.forEach(d => {
    modifyIndexFile(path.join(__dirname, '..', d, 'index.html'));
});

console.log("Done.");
