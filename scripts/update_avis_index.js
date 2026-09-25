const fs = require('fs');

// --- 1. Update avis-clients.html ---
let avisHtml = fs.readFileSync('avis-clients.html', 'utf8');

const reviewsContent = `
<!-- CARTES D'EXEMPLE — à retirer intégralement (bandeau + 6 cartes) dès que de vrais témoignages sont disponibles. Ne jamais retirer le bandeau en gardant les cartes. -->
<div class="w-full bg-surface-variant text-on-surface-variant p-4 rounded-lg mb-8 font-body-md shadow-sm border border-outline/20">
    <p data-i18n="reviews.example_warning">Les témoignages ci-dessous sont des exemples fournis à titre d'illustration, en attendant de vrais avis clients. Ils ne représentent aucune entreprise réelle.</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10" id="reviews-grid">
    <!-- Hospitality 1 -->
    <article class="bg-surface-container rounded-xl p-8 shadow-sm hover:-translate-y-1 transition-transform duration-300 relative border border-outline/10 review-card" data-category="hospitality">
        <div class="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
        <div class="flex gap-1 text-primary mb-4">
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
        </div>
        <p class="text-body-lg text-on-surface-variant mb-6 italic" data-i18n="reviews.example.hosp1_text">"Le bois sec que nous recevons brûle proprement et régulièrement, un vrai plus pour la cuisson au feu de bois en service continu."</p>
        <div class="mt-auto">
            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example.hosp1_attr">Exemple, restaurant gastronomique</p>
        </div>
    </article>
    
    <!-- Hospitality 2 -->
    <article class="bg-surface-container rounded-xl p-8 shadow-sm hover:-translate-y-1 transition-transform duration-300 relative border border-outline/10 review-card" data-category="hospitality">
        <div class="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
        <div class="flex gap-1 text-primary mb-4">
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
        </div>
        <p class="text-body-lg text-on-surface-variant mb-6 italic" data-i18n="reviews.example.hosp2_text">"Les livraisons arrivent à l'heure convenue, ce qui compte quand on gère un stock de cuisine tendu."</p>
        <div class="mt-auto">
            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example.hosp2_attr">Exemple, restaurant</p>
        </div>
    </article>

    <!-- Industry 1 -->
    <article class="bg-surface-container rounded-xl p-8 shadow-sm hover:-translate-y-1 transition-transform duration-300 relative border border-outline/10 review-card" data-category="industry">
        <div class="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
        <div class="flex gap-1 text-primary mb-4">
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
        </div>
        <p class="text-body-lg text-on-surface-variant mb-6 italic" data-i18n="reviews.example.ind1_text">"Le pouvoir calorifique constant d'une palette à l'autre facilite le pilotage de notre chaudière biomasse."</p>
        <div class="mt-auto">
            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example.ind1_attr">Exemple, site industriel</p>
        </div>
    </article>

    <!-- Industry 2 -->
    <article class="bg-surface-container rounded-xl p-8 shadow-sm hover:-translate-y-1 transition-transform duration-300 relative border border-outline/10 review-card" data-category="industry">
        <div class="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
        <div class="flex gap-1 text-primary mb-4">
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
        </div>
        <p class="text-body-lg text-on-surface-variant mb-6 italic" data-i18n="reviews.example.ind2_text">"Un interlocuteur unique pour les commandes en volume nous fait gagner du temps sur la logistique."</p>
        <div class="mt-auto">
            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example.ind2_attr">Exemple, unité de production</p>
        </div>
    </article>

    <!-- Resellers 1 -->
    <article class="bg-surface-container rounded-xl p-8 shadow-sm hover:-translate-y-1 transition-transform duration-300 relative border border-outline/10 review-card" data-category="resellers">
        <div class="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
        <div class="flex gap-1 text-primary mb-4">
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
        </div>
        <p class="text-body-lg text-on-surface-variant mb-6 italic" data-i18n="reviews.example.res1_text">"Des conditions de revente claires et un réapprovisionnement fiable, ce qui simplifie notre gestion de stock."</p>
        <div class="mt-auto">
            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example.res1_attr">Exemple, négoce de matériaux</p>
        </div>
    </article>

    <!-- Resellers 2 -->
    <article class="bg-surface-container rounded-xl p-8 shadow-sm hover:-translate-y-1 transition-transform duration-300 relative border border-outline/10 review-card" data-category="resellers">
        <div class="absolute top-4 right-4 bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
        <div class="flex gap-1 text-primary mb-4">
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
        </div>
        <p class="text-body-lg text-on-surface-variant mb-6 italic" data-i18n="reviews.example.res2_text">"La disponibilité des différents formats nous permet de répondre à une clientèle variée."</p>
        <div class="mt-auto">
            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example.res2_attr">Exemple, revendeur</p>
        </div>
    </article>
</div>
`;

// Replace the grid content in avis-clients.html
avisHtml = avisHtml.replace(
    /<div class="grid grid-cols-1 gap-8 relative z-10" id="reviews-grid">[\s\S]*?<\/div>\s*<\/div>/,
    reviewsContent
);

// Add filtering logic to the buttons
avisHtml = avisHtml.replace('data-i18n="reviews.filter.all" class="', 'data-i18n="reviews.filter.all" data-filter="all" class="filter-btn ');
avisHtml = avisHtml.replace('data-i18n="reviews.filter.hospitality" class="', 'data-i18n="reviews.filter.hospitality" data-filter="hospitality" class="filter-btn ');
avisHtml = avisHtml.replace('data-i18n="reviews.filter.industry" class="', 'data-i18n="reviews.filter.industry" data-filter="industry" class="filter-btn ');
avisHtml = avisHtml.replace('data-i18n="reviews.filter.resellers" class="', 'data-i18n="reviews.filter.resellers" data-filter="resellers" class="filter-btn ');

// Add simple JS for filtering
const filterScript = `
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.review-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active styling from all
                filterBtns.forEach(b => {
                    b.classList.remove('bg-primary', 'text-on-primary', 'shadow-md');
                    b.classList.add('bg-surface-container', 'text-on-surface', 'hover:bg-surface-variant');
                });
                // Add active styling to clicked
                btn.classList.remove('bg-surface-container', 'text-on-surface', 'hover:bg-surface-variant');
                btn.classList.add('bg-primary', 'text-on-primary', 'shadow-md');

                const filter = btn.getAttribute('data-filter');
                cards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    });
</script>
`;
avisHtml = avisHtml.replace('</body>', filterScript + '</body>');
fs.writeFileSync('avis-clients.html', avisHtml, 'utf8');
console.log('avis-clients.html updated.');

// --- 2. Update index.html ---
let indexHtml = fs.readFileSync('index.html', 'utf8');
const originalBanner = `<div class="max-w-max-width mx-auto px-margin-desktop flex flex-wrap items-center justify-center gap-8 text-label-md font-label-md uppercase tracking-wider">`;
const newBanner = `<a href="./avis-clients.html" class="max-w-max-width mx-auto px-margin-desktop flex flex-wrap items-center justify-center gap-8 text-label-md font-label-md uppercase tracking-wider hover:opacity-80 transition-opacity cursor-pointer">`;
// We also need to change the closing </div> of that container to </a>.
// We can use a regex to match the exact block:
const regexBanner = /(<section class="bg-primary text-on-primary py-4 w-full shadow-md z-20">\s*)<div class="max-w-max-width mx-auto px-margin-desktop flex flex-wrap items-center justify-center gap-8 text-label-md font-label-md uppercase tracking-wider">([\s\S]*?)<\/div>(\s*<\/section>)/;

if (regexBanner.test(indexHtml)) {
    indexHtml = indexHtml.replace(regexBanner, '$1<a href="./avis-clients.html" class="max-w-max-width mx-auto px-margin-desktop flex flex-wrap items-center justify-center gap-8 text-label-md font-label-md uppercase tracking-wider hover:bg-primary-container transition-colors cursor-pointer py-2 rounded-lg">$2</a>$3');
    fs.writeFileSync('index.html', indexHtml, 'utf8');
    console.log('index.html updated.');
} else {
    console.log('Failed to find trust banner in index.html');
}

