const fs = require('fs');
const path = require('path');

const directories = ['.', 'en', 'de', 'nl'];

function modifyIndexFile(filepath, isSubfolder) {
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');

    const catPrefix = isSubfolder ? '../catalogue.html' : './catalogue.html';
    const devisPath = isSubfolder ? '../devis.html' : './devis.html';

    // 1. Categories Grid Links
    // We replace the first 5 href="#" with subgroup 1 to 5
    for (let i = 1; i <= 5; i++) {
        content = content.replace('href="#"', `href="${catPrefix}?subgroup=${i}"`);
    }

    // 2. Footer links
    content = content.replace(
        /href="#"(>\s*<span[^>]*data-i18n="footer\.service_1")/g,
        `href="${catPrefix}?subgroup=1"$1`
    );
    content = content.replace(
        /href="#"(>\s*<span[^>]*data-i18n="footer\.service_2")/g,
        `href="${catPrefix}?subgroup=4"$1`
    );
    content = content.replace(
        /href="#"(>\s*<span[^>]*data-i18n="footer\.service_3")/g,
        `href="${catPrefix}"$1`
    );
    content = content.replace(
        /href="#"(>\s*<span[^>]*data-i18n="footer\.service_4")/g,
        `href="${devisPath}"$1`
    );

    // 3. Hero Carousel Arrows
    const prevBtnMatch = content.match(/<button id="hero-prev-btn"[^>]*>[\s\S]*?<\/button>/);
    const nextBtnMatch = content.match(/<button id="hero-next-btn"[^>]*>[\s\S]*?<\/button>/);

    if (prevBtnMatch && nextBtnMatch) {
        const prevBtn = prevBtnMatch[0];
        const nextBtn = nextBtnMatch[0];

        const newPrevBtn = prevBtn.replace(
            /class="([^"]*)"/,
            'class="$1 absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-30"'
        );

        const newNextBtn = nextBtn.replace(
            /class="([^"]*)"/,
            'class="$1 absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-30"'
        );

        content = content.replace(prevBtn, '');
        content = content.replace(nextBtn, '');

        content = content.replace(
            /(<section id="hero-carousel-section"[^>]*>)/,
            `$1\n${newPrevBtn}\n${newNextBtn}`
        );
    }

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Modified ${filepath}`);
}

directories.forEach(d => {
    modifyIndexFile(path.join(__dirname, '..', d, 'index.html'), d !== '.');
});

console.log("Done.");
