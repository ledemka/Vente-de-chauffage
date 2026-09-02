const fs = require('fs');
const path = require('path');

const dirs = ['.', 'en', 'de', 'nl'];
const filename = 'blog.html';

dirs.forEach(dir => {
    const filepath = path.join(__dirname, '..', dir, filename);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Title 1
    content = content.replace(
        /<h2 class="([^"]*)">Optimisation du Stockage Hivernal : Maintenir un Taux d'Humidité Inférieur à 15%<\/h2>/,
        '<h2 class="$1" data-i18n="blog.article_1_title"><span data-i18n="blog.article_1_title">Optimisation du Stockage Hivernal : Maintenir un Taux d\'Humidité Inférieur à 15%</span></h2>'
    );
    // As a fallback without the extra span: 
    // Actually the i18n script replaces textContent of elements with data-i18n attribute unless it has data-i18n-html or it's on a self-closing tag. But standard is to put data-i18n on the element itself, OR on a span. The prompt says "Ajouter un attribut data-i18n="blog.article_X_title" sur chaque titre". Let's put it directly on the h2/h4 elements.
    
    // Title 1
    content = content.replace(
        /<h2([^>]*)>Optimisation du Stockage Hivernal : Maintenir un Taux d'Humidité Inférieur à 15%<\/h2>/,
        '<h2$1 data-i18n="blog.article_1_title">Optimisation du Stockage Hivernal : Maintenir un Taux d\'Humidité Inférieur à 15%</h2>'
    );

    // Title 2
    content = content.replace(
        /<h3([^>]*)>L'Avenir du Pellet Industriel<\/h3>/,
        '<h3$1 data-i18n="blog.article_2_title">L\'Avenir du Pellet Industriel</h3>'
    );

    // Title 3
    content = content.replace(
        /<h4([^>]*)>Quel bois choisir pour la cuisson professionnelle \?<\/h4>/,
        '<h4$1 data-i18n="blog.article_3_title">Quel bois choisir pour la cuisson professionnelle ?</h4>'
    );

    // Title 4
    content = content.replace(
        /<h4([^>]*)>Anticiper les ruptures d'approvisionnement<\/h4>/,
        '<h4$1 data-i18n="blog.article_4_title">Anticiper les ruptures d\'approvisionnement</h4>'
    );

    // Title 5
    content = content.replace(
        /<h4([^>]*)>Décryptage : La norme ISO 17225-2<\/h4>/,
        '<h4$1 data-i18n="blog.article_5_title">Décryptage : La norme ISO 17225-2</h4>'
    );

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated blog.html in ${dir}`);
});
