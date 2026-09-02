const fs = require('fs');
const path = require('path');

const directories = ['.', 'en', 'de', 'nl'];

function modifyHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.endsWith('.html')) {
            const filepath = path.join(dir, file);
            let content = fs.readFileSync(filepath, 'utf8');

            const frRegex = /(<a [^>]*href="[^"]*"[^>]*class="[^"]*cursor-pointer[^"]*"[^>]*>)🇫🇷(<\/a>)/g;
            const enRegex = /(<a [^>]*href="[^"]*"[^>]*class="[^"]*cursor-pointer[^"]*"[^>]*>)🇬🇧(<\/a>)/g;
            const deRegex = /(<a [^>]*href="[^"]*"[^>]*class="[^"]*cursor-pointer[^"]*"[^>]*>)🇩🇪(<\/a>)/g;
            const nlRegex = /(<a [^>]*href="[^"]*"[^>]*class="[^"]*cursor-pointer[^"]*"[^>]*>)🇳🇱(<\/a>)/g;

            let modified = false;
            
            if (frRegex.test(content)) {
                content = content.replace(frRegex, '$1FR$2');
                modified = true;
            }
            if (enRegex.test(content)) {
                content = content.replace(enRegex, '$1EN$2');
                modified = true;
            }
            if (deRegex.test(content)) {
                content = content.replace(deRegex, '$1DE$2');
                modified = true;
            }
            if (nlRegex.test(content)) {
                content = content.replace(nlRegex, '$1NL$2');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(filepath, content, 'utf8');
                console.log(`Modified ${filepath}`);
            }
        }
    }
}

directories.forEach(d => {
    modifyHtmlFiles(path.join(__dirname, '..', d));
});

console.log("Done.");
