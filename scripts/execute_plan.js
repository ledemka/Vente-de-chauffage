const fs = require('fs');
const path = require('path');

const directories = ['.', 'en', 'de', 'nl'];

function modifyHtmlFiles(dir) {
    const isRoot = dir === '.';
    const files = fs.readdirSync(path.join(__dirname, '..', dir));
    
    for (const file of files) {
        if (!file.endsWith('.html')) continue;
        
        const filepath = path.join(__dirname, '..', dir, file);
        let content = fs.readFileSync(filepath, 'utf8');
        let modified = false;

        // TASK 1: Fix routing bug in en/index.html, de/index.html, nl/index.html
        if (!isRoot && file === 'index.html') {
            const oldContent = content;
            content = content.replace(/href="\.\.\/catalogue\.html/g, 'href="./catalogue.html');
            content = content.replace(/href="\.\.\/devis\.html/g, 'href="./devis.html');
            if (content !== oldContent) modified = true;
        }

        // TASK 5: Reconnect global footer legal links
        const oldContentFooter = content;
        content = content.replace(/<span>(<span data-i18n="footer\.legal">[^<]*<\/span>)<\/span>/g, '<a href="./mentions-legales.html" class="hover:text-primary transition-colors">$1</a>');
        content = content.replace(/<span>(<span data-i18n="footer\.cgv">[^<]*<\/span>)<\/span>/g, '<a href="./cgv.html" class="hover:text-primary transition-colors">$1</a>');
        content = content.replace(/<span>(<span data-i18n="footer\.privacy">[^<]*<\/span>)é?<\/span>/g, '<a href="./politique-confidentialite.html" class="hover:text-primary transition-colors">$1</a>');
        if (content !== oldContentFooter) modified = true;

        // TASK 6: Update devis.html RGPD checkbox
        if (file === 'devis.html') {
            const oldContentDevis = content;
            content = content.replace(/href="#"([^>]*>Politique de <span data-i18n="footer\.privacy">)/g, 'href="./politique-confidentialite.html"$1');
            if (content !== oldContentDevis) modified = true;
        }

        // TASK 7: Update blog.html privacy text
        if (file === 'blog.html') {
            const oldContentBlog = content;
            content = content.replace(/politique de <span data-i18n="footer\.privacy">([^<]*)<\/span>é?/g, '<a href="./politique-confidentialite.html" class="underline hover:text-primary">politique de <span data-i18n="footer.privacy">$1</span></a>');
            if (content !== oldContentBlog) modified = true;
        }

        // TASK 8: Update livraison.html CGV link
        if (file === 'livraison.html') {
            const oldContentLiv = content;
            content = content.replace(/href="#"([^>]*>\s*<span data-i18n="footer\.cgv">)/g, 'href="./cgv.html"$1');
            if (content !== oldContentLiv) modified = true;
        }

        // TASK 9: Update produit.html breadcrumbs (HTML part)
        if (file === 'produit.html') {
            const oldContentProd = content;
            
            // Replace <a href="#">Catalogue</a> with <a href="./catalogue.html">Catalogue</a>
            content = content.replace(/<a class="hover:text-primary transition-colors" href="#">Catalogue<\/a>/g, '<a class="hover:text-primary transition-colors" href="./catalogue.html">Catalogue</a>');
            
            // Replace <a href="#">Bois de chauffage</a> with <a href="#" id="breadcrumb-category">Bois de chauffage</a>
            content = content.replace(/<a class="hover:text-primary transition-colors" href="#">Bois de chauffage<\/a>/g, '<a class="hover:text-primary transition-colors" href="#" id="breadcrumb-category">Bois de chauffage</a>');
            
            // Inject JS logic
            if (!content.includes('breadcrumbCat.textContent = product.subgroup_name')) {
                const jsInjection = `
                                document.getElementById('spec-dimensions').textContent = '100x120cm';

                                const breadcrumbCat = document.getElementById('breadcrumb-category');
                                if (breadcrumbCat) {
                                    breadcrumbCat.textContent = product.subgroup_name;
                                    breadcrumbCat.href = \`./catalogue.html?subgroup=\${product.subgroup_id}\`;
                                }
`;
                content = content.replace(/document\.getElementById\('spec-dimensions'\)\.textContent = '100x120cm';/, jsInjection);
            }

            if (content !== oldContentProd) modified = true;
        }

        if (modified) {
            fs.writeFileSync(filepath, content, 'utf8');
            console.log(`Modified ${filepath}`);
        }
    }
}

directories.forEach(d => {
    modifyHtmlFiles(d);
});

console.log("Done updating links and routing.");
