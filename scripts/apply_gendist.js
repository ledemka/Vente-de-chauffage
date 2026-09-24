const fs = require('fs');

let content = fs.readFileSync('scripts/generate-dist.js', 'utf8');

if (!content.includes('post_process_seo')) {
    content = content.replace(
        "const fs = require('fs');",
        "const fs = require('fs');\nconst { processSeo } = require('./post_process_seo');"
    );
    
    // Replace fs.copyFileSync(srcPath, distPath) with fs.writeFileSync(distPath, processSeo(fs.readFileSync(srcPath, 'utf8'), 'fr', page))
    content = content.replace(
        "fs.copyFileSync(srcPath, distPath);",
        "fs.writeFileSync(distPath, processSeo(fs.readFileSync(srcPath, 'utf8'), 'fr', page));"
    );
    
    // For non-FR
    content = content.replace(
        "fs.writeFileSync(distPath, content);",
        "content = processSeo(content, lang, page);\n                fs.writeFileSync(distPath, content);"
    );
    
    fs.writeFileSync('scripts/generate-dist.js', content);
    console.log('Patched generate-dist.js for SEO post-processing');
}
