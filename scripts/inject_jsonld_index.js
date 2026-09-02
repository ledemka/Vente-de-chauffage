const fs = require('fs');
const path = require('path');

const dirs = ['.', 'en', 'de', 'nl'];
const filename = 'index.html';

const jsonLd = `
    <!-- JSON-LD Organization -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Terre & Feu",
      "url": "https://www.boisdechauffage-pro.com"
    }
    </script>
</head>`;

dirs.forEach(dir => {
    const filepath = path.join(__dirname, '..', dir, filename);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Inject before </head>
    if (!content.includes('"@type": "Organization"')) {
        content = content.replace('</head>', jsonLd);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated index.html in ${dir}`);
    } else {
        console.log(`JSON-LD already exists in index.html in ${dir}`);
    }
});
