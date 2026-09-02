const fs = require('fs');
const path = require('path');

const dirs = {
    '.': { home: 'Accueil', cat: 'Catalogue' },
    'en': { home: 'Home', cat: 'Catalog' },
    'de': { home: 'Startseite', cat: 'Katalog' },
    'nl': { home: 'Startpagina', cat: 'Catalogus' }
};
const filename = 'catalogue.html';

Object.entries(dirs).forEach(([dir, labels]) => {
    const filepath = path.join(__dirname, '..', dir, filename);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    const prefix = dir === '.' ? '' : `/${dir}`;
    const jsonLd = `
    <!-- JSON-LD BreadcrumbList -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "${labels.home}",
          "item": "https://www.boisdechauffage-pro.com${prefix}/index.html"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "${labels.cat}",
          "item": "https://www.boisdechauffage-pro.com${prefix}/catalogue.html"
        }
      ]
    }
    </script>
</head>`;

    if (!content.includes('"@type": "BreadcrumbList"')) {
        content = content.replace('</head>', jsonLd);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated catalogue.html in ${dir}`);
    } else {
        console.log(`JSON-LD already exists in catalogue.html in ${dir}`);
    }
});
