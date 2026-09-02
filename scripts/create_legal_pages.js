const fs = require('fs');
const path = require('path');

const directories = ['.', 'en', 'de', 'nl'];

const pages = [
    {
        filename: 'mentions-legales.html',
        title: 'Mentions Légales',
        sections: [
            { title: 'Éditeur du site', content: '[Contenu à compléter par le client / son juriste]' },
            { title: 'Hébergement', content: '[Contenu à compléter par le client / son juriste]' },
            { title: 'Propriété intellectuelle', content: '[Contenu à compléter par le client / son juriste]' }
        ]
    },
    {
        filename: 'cgv.html',
        title: 'Conditions Générales de Vente (CGV)',
        sections: [
            { title: 'Objet', content: '[Contenu à compléter par le client / son juriste]' },
            { title: 'Prix et paiement', content: '[Contenu à compléter par le client / son juriste]' },
            { title: 'Livraison', content: '[Contenu à compléter par le client / son juriste]' },
            { title: 'Litiges', content: '[Contenu à compléter par le client / son juriste]' }
        ]
    },
    {
        filename: 'politique-confidentialite.html',
        title: 'Politique de Confidentialité',
        sections: [
            { title: 'Données collectées', content: '[Contenu à compléter par le client / son juriste]' },
            { title: 'Finalité', content: '[Contenu à compléter par le client / son juriste]' },
            { title: 'Droits RGPD', content: '[Contenu à compléter par le client / son juriste]' },
            { title: 'Contact', content: '[Contenu à compléter par le client / son juriste]' }
        ]
    }
];

function extractLayout(contactHtml) {
    const mainStart = contactHtml.indexOf('<main');
    const mainContentStart = contactHtml.indexOf('>', mainStart) + 1;
    const mainEnd = contactHtml.indexOf('</main>');
    
    const header = contactHtml.substring(0, mainContentStart);
    const footer = contactHtml.substring(mainEnd);
    return { header, footer };
}

directories.forEach(dir => {
    const contactPath = path.join(__dirname, '..', dir, 'contact.html');
    if (!fs.existsSync(contactPath)) return;
    
    let contactHtml = fs.readFileSync(contactPath, 'utf8');
    
    // Fix nav active state in header
    contactHtml = contactHtml.replace(/border-b-2 border-primary/, '');

    const { header, footer } = extractLayout(contactHtml);
    
    pages.forEach(page => {
        const filePath = path.join(__dirname, '..', dir, page.filename);
        
        let sectionsHtml = page.sections.map(sec => `
            <section class="mb-12">
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4">${sec.title}</h2>
                <p class="text-body-lg text-on-surface-variant p-6 bg-surface-container rounded-lg border border-outline-variant/50">${sec.content}</p>
            </section>
        `).join('\n');

        let mainHtml = `
            <div class="max-w-3xl mx-auto px-margin-desktop py-20">
                <h1 class="text-headline-xl font-headline-xl text-primary mb-12">${page.title}</h1>
                ${sectionsHtml}
            </div>
        `;
        
        // Ensure proper filename for language switcher logic if necessary (though the user didn't mention it, let's replace "contact.html" with page.filename in header)
        const specificHeader = header.replace(/contact\.html/g, page.filename);
        const specificFooter = footer;
        
        fs.writeFileSync(filePath, specificHeader + mainHtml + specificFooter, 'utf8');
        console.log(`Created ${filePath}`);
    });
});

console.log('Done creating legal pages.');
