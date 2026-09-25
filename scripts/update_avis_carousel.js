const fs = require('fs');

// --- 1. Update Translations ---
const fr = JSON.parse(fs.readFileSync('data/i18n/fr.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('data/i18n/en.json', 'utf8'));
const de = JSON.parse(fs.readFileSync('data/i18n/de.json', 'utf8'));
const nl = JSON.parse(fs.readFileSync('data/i18n/nl.json', 'utf8'));

if (!fr.reviews) fr.reviews = {};
if (!en.reviews) en.reviews = {};
if (!de.reviews) de.reviews = {};
if (!nl.reviews) nl.reviews = {};

const newKeys = {
    "trust": {
        "pending": {
            fr: "Nouveaux sur le marché — voici le type de retours que nous visons auprès de nos clients professionnels.",
            en: "New to the market — here is the type of feedback we aim for from our professional clients.",
            de: "Neu auf dem Markt — dies ist die Art von Feedback, die wir von unseren professionellen Kunden anstreben.",
            nl: "Nieuw op de markt — dit is het soort feedback dat we nastreven bij onze professionele klanten."
        }
    },
    "examples_notice": {
        fr: "Exemples fournis à titre d'illustration, en attendant de vrais avis clients. Ne représentent aucune entreprise réelle.",
        en: "Examples provided for illustration purposes, pending real customer reviews. They do not represent any real company.",
        de: "Beispiele zur Veranschaulichung, bis echte Kundenbewertungen vorliegen. Sie repräsentieren kein reales Unternehmen.",
        nl: "Voorbeelden ter illustratie, in afwachting van echte klantbeoordelingen. Ze vertegenwoordigen geen echt bedrijf."
    },
    "example_1": {
        "quote": {
            fr: "Le bois sec que nous recevons brûle proprement et régulièrement, un vrai plus pour la cuisson au feu de bois en service continu.",
            en: "The dry wood we receive burns cleanly and evenly, a real plus for wood-fired cooking in continuous service.",
            de: "Das trockene Holz, das wir erhalten, brennt sauber und gleichmäßig, ein echtes Plus für das Kochen auf dem Holzfeuer im Dauerbetrieb.",
            nl: "Het droge hout dat we ontvangen brandt schoon en gelijkmatig, een echt pluspunt voor koken op houtvuur in continubedrijf."
        },
        "attribution": {
            fr: "Exemple, restaurant gastronomique",
            en: "Example, gastronomic restaurant",
            de: "Beispiel, gastronomisches Restaurant",
            nl: "Voorbeeld, gastronomisch restaurant"
        }
    },
    "example_2": {
        "quote": {
            fr: "Les livraisons arrivent à l'heure convenue, ce qui compte quand on gère un stock de cuisine tendu.",
            en: "Deliveries arrive at the agreed time, which matters when managing tight kitchen stock.",
            de: "Lieferungen kommen zur vereinbarten Zeit an, was bei knapper Küchenvorratshaltung wichtig ist.",
            nl: "Leveringen komen op de afgesproken tijd aan, wat belangrijk is bij het beheren van krappe keukenvoorraden."
        },
        "attribution": {
            fr: "Exemple, restaurant",
            en: "Example, restaurant",
            de: "Beispiel, Restaurant",
            nl: "Voorbeeld, restaurant"
        }
    },
    "example_3": {
        "quote": {
            fr: "Le pouvoir calorifique constant d'une palette à l'autre facilite le pilotage de notre chaudière biomasse.",
            en: "The constant calorific value from one pallet to another facilitates the control of our biomass boiler.",
            de: "Der konstante Heizwert von Palette zu Palette erleichtert die Steuerung unseres Biomassekessels.",
            nl: "De constante calorische waarde van pallet tot pallet vergemakkelijkt de besturing van onze biomassaketel."
        },
        "attribution": {
            fr: "Exemple, site industriel",
            en: "Example, industrial site",
            de: "Beispiel, Industriestandort",
            nl: "Voorbeeld, industriële site"
        }
    },
    "example_4": {
        "quote": {
            fr: "Un interlocuteur unique pour les commandes en volume nous fait gagner du temps sur la logistique.",
            en: "A single point of contact for volume orders saves us time on logistics.",
            de: "Ein einziger Ansprechpartner für Volumenbestellungen spart uns Zeit bei der Logistik.",
            nl: "Een enkel aanspreekpunt voor volumebestellingen bespaart ons tijd op logistiek."
        },
        "attribution": {
            fr: "Exemple, unité de production",
            en: "Example, production unit",
            de: "Beispiel, Produktionseinheit",
            nl: "Voorbeeld, productie-eenheid"
        }
    },
    "example_5": {
        "quote": {
            fr: "Des conditions de revente claires et un réapprovisionnement fiable, ce qui simplifie notre gestion de stock.",
            en: "Clear resale conditions and reliable restocking, which simplifies our stock management.",
            de: "Klare Wiederverkaufsbedingungen und zuverlässige Wiederbeschaffung, was unser Bestandsmanagement vereinfacht.",
            nl: "Duidelijke doorverkoopvoorwaarden en betrouwbare bevoorrading, wat ons voorraadbeheer vereenvoudigt."
        },
        "attribution": {
            fr: "Exemple, négoce de matériaux",
            en: "Example, materials trading",
            de: "Beispiel, Baustoffhandel",
            nl: "Voorbeeld, materialenhandel"
        }
    },
    "example_6": {
        "quote": {
            fr: "La disponibilité des différents formats nous permet de répondre à une clientèle variée.",
            en: "The availability of different formats allows us to respond to a varied clientele.",
            de: "Die Verfügbarkeit verschiedener Formate ermöglicht es uns, auf eine vielfältige Kundschaft zu reagieren.",
            nl: "De beschikbaarheid van verschillende formaten stelt ons in staat om te reageren op een gevarieerde klantenkring."
        },
        "attribution": {
            fr: "Exemple, revendeur",
            en: "Example, reseller",
            de: "Beispiel, Wiederverkäufer",
            nl: "Voorbeeld, wederverkoper"
        }
    }
};

const applyTranslation = (obj, source, lang) => {
    if (!obj.trust) obj.trust = {};
    obj.trust.pending = source.trust.pending[lang];
    obj.examples_notice = source.examples_notice[lang];
    for (let i = 1; i <= 6; i++) {
        obj[`example_${i}`] = {
            quote: source[`example_${i}`].quote[lang],
            attribution: source[`example_${i}`].attribution[lang]
        };
    }
};

applyTranslation(fr.reviews, newKeys, 'fr');
applyTranslation(en.reviews, newKeys, 'en');
applyTranslation(de.reviews, newKeys, 'de');
applyTranslation(nl.reviews, newKeys, 'nl');

fs.writeFileSync('data/i18n/fr.json', JSON.stringify(fr, null, 2), 'utf8');
fs.writeFileSync('data/i18n/en.json', JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync('data/i18n/de.json', JSON.stringify(de, null, 2), 'utf8');
fs.writeFileSync('data/i18n/nl.json', JSON.stringify(nl, null, 2), 'utf8');

// --- 2. Update avis-clients.html ---
let avisHtml = fs.readFileSync('avis-clients.html', 'utf8');

const newHeroAndCarousel = `
<!-- Hero / Reviews Carousel Section -->
<section class="w-full relative bg-surface-container py-24 mb-16 rounded-b-[2rem] overflow-hidden shadow-sm">
    <div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: radial-gradient(circle at 100% 0%, var(--tw-colors-primary) 0%, transparent 50%), radial-gradient(circle at 0% 100%, var(--tw-colors-tertiary-fixed) 0%, transparent 50%);"></div>
    <div class="max-w-[1440px] mx-auto px-margin-desktop flex flex-col xl:flex-row gap-12 relative z-10">
        
        <!-- Left Column -->
        <div class="flex-1 max-w-xl">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-surface rounded-full mb-6 shadow-sm border border-outline/10">
                <span data-i18n="reviews.trust.title" class="text-label-md font-label-md text-primary tracking-widest uppercase">Indice de confiance</span>
            </div>
            <h1 class="text-headline-xl font-headline-xl text-on-surface mb-6">
                <span data-i18n="reviews.trust.subtitle">Ils nous font confiance</span>
            </h1>
            <p class="text-body-lg font-body-lg text-on-surface-variant mb-8" data-i18n="reviews.trust.pending">
                Nouveaux sur le marché — voici le type de retours que nous visons auprès de nos clients professionnels.
            </p>

            <div class="flex flex-wrap gap-3 mt-12">
                <button data-i18n="reviews.filter.all" data-filter="all" class="filter-btn px-6 py-2 rounded-full bg-primary text-on-primary text-label-md font-label-md shadow-md">TOUS</button>
                <button data-i18n="reviews.filter.hospitality" data-filter="hospitality" class="filter-btn px-6 py-2 rounded-full bg-surface-container-lowest text-on-surface text-label-md font-label-md hover:bg-surface-variant transition-colors shadow-sm">RESTAURATION</button>
                <button data-i18n="reviews.filter.industry" data-filter="industry" class="filter-btn px-6 py-2 rounded-full bg-surface-container-lowest text-on-surface text-label-md font-label-md hover:bg-surface-variant transition-colors shadow-sm">INDUSTRIE</button>
                <button data-i18n="reviews.filter.resellers" data-filter="resellers" class="filter-btn px-6 py-2 rounded-full bg-surface-container-lowest text-on-surface text-label-md font-label-md hover:bg-surface-variant transition-colors shadow-sm">REVENDEURS</button>
            </div>
        </div>

        <!-- Right Column (Carousel) -->
        <div class="flex-1 w-full relative min-w-0">
            <!-- CARROUSEL D'EXEMPLE — à retirer intégralement (bandeau d'avertissement + 6 cartes + éventuel widget de note) dès que de vrais témoignages/avis Google sont disponibles. Ne jamais garder les cartes d'exemple sans le bandeau. Le jour où une vraie fiche Google Business existe, utiliser l'API/widget officiel de Google, jamais une reproduction visuelle maison de son logo ou de sa note. -->
            <div class="w-full bg-surface-variant text-on-surface-variant p-4 rounded-lg mb-6 font-body-md shadow-sm border border-outline/20">
                <p data-i18n="reviews.examples_notice">Exemples fournis à titre d'illustration, en attendant de vrais avis clients. Ne représentent aucune entreprise réelle.</p>
            </div>
            
            <div class="relative w-full group">
                <button id="reviews-prev-btn" class="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-surface hover:bg-surface-variant shadow-md rounded-full flex items-center justify-center text-on-surface transition-colors cursor-pointer border border-outline/20 z-20">
                    <span class="material-symbols-outlined">chevron_left</span>
                </button>
                <button id="reviews-next-btn" class="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-surface hover:bg-surface-variant shadow-md rounded-full flex items-center justify-center text-on-surface transition-colors cursor-pointer border border-outline/20 z-20">
                    <span class="material-symbols-outlined">chevron_right</span>
                </button>

                <div id="reviews-carousel-slides" class="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 pt-2 px-2 w-full" style="scroll-behavior: smooth;">
                    
                    <!-- Example 1 -->
                    <article class="review-card snap-start flex-none w-80 bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative border border-outline/10 flex flex-col" data-category="hospitality">
                        <div class="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
                        <div class="flex gap-1 text-primary mb-4">
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                        </div>
                        <p class="text-body-lg text-on-surface-variant mb-6 italic flex-grow" data-i18n="reviews.example_1.quote">"Le bois sec que nous recevons brûle proprement et régulièrement, un vrai plus pour la cuisson au feu de bois en service continu."</p>
                        <div class="mt-auto pt-4 border-t border-outline/10">
                            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example_1.attribution">Exemple, restaurant gastronomique</p>
                        </div>
                    </article>

                    <!-- Example 2 -->
                    <article class="review-card snap-start flex-none w-80 bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative border border-outline/10 flex flex-col" data-category="hospitality">
                        <div class="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
                        <div class="flex gap-1 text-primary mb-4">
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                        </div>
                        <p class="text-body-lg text-on-surface-variant mb-6 italic flex-grow" data-i18n="reviews.example_2.quote">"Les livraisons arrivent à l'heure convenue, ce qui compte quand on gère un stock de cuisine tendu."</p>
                        <div class="mt-auto pt-4 border-t border-outline/10">
                            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example_2.attribution">Exemple, restaurant</p>
                        </div>
                    </article>

                    <!-- Example 3 -->
                    <article class="review-card snap-start flex-none w-80 bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative border border-outline/10 flex flex-col" data-category="industry">
                        <div class="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
                        <div class="flex gap-1 text-primary mb-4">
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                        </div>
                        <p class="text-body-lg text-on-surface-variant mb-6 italic flex-grow" data-i18n="reviews.example_3.quote">"Le pouvoir calorifique constant d'une palette à l'autre facilite le pilotage de notre chaudière biomasse."</p>
                        <div class="mt-auto pt-4 border-t border-outline/10">
                            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example_3.attribution">Exemple, site industriel</p>
                        </div>
                    </article>

                    <!-- Example 4 -->
                    <article class="review-card snap-start flex-none w-80 bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative border border-outline/10 flex flex-col" data-category="industry">
                        <div class="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
                        <div class="flex gap-1 text-primary mb-4">
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                        </div>
                        <p class="text-body-lg text-on-surface-variant mb-6 italic flex-grow" data-i18n="reviews.example_4.quote">"Un interlocuteur unique pour les commandes en volume nous fait gagner du temps sur la logistique."</p>
                        <div class="mt-auto pt-4 border-t border-outline/10">
                            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example_4.attribution">Exemple, unité de production</p>
                        </div>
                    </article>

                    <!-- Example 5 -->
                    <article class="review-card snap-start flex-none w-80 bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative border border-outline/10 flex flex-col" data-category="resellers">
                        <div class="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
                        <div class="flex gap-1 text-primary mb-4">
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                        </div>
                        <p class="text-body-lg text-on-surface-variant mb-6 italic flex-grow" data-i18n="reviews.example_5.quote">"Des conditions de revente claires et un réapprovisionnement fiable, ce qui simplifie notre gestion de stock."</p>
                        <div class="mt-auto pt-4 border-t border-outline/10">
                            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example_5.attribution">Exemple, négoce de matériaux</p>
                        </div>
                    </article>

                    <!-- Example 6 -->
                    <article class="review-card snap-start flex-none w-80 bg-surface-container-lowest rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative border border-outline/10 flex flex-col" data-category="resellers">
                        <div class="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider" data-i18n="reviews.example_badge">Exemple</div>
                        <div class="flex gap-1 text-primary mb-4">
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">star</span>
                        </div>
                        <p class="text-body-lg text-on-surface-variant mb-6 italic flex-grow" data-i18n="reviews.example_6.quote">"La disponibilité des différents formats nous permet de répondre à une clientèle variée."</p>
                        <div class="mt-auto pt-4 border-t border-outline/10">
                            <p class="font-bold text-on-surface text-body-md" data-i18n="reviews.example_6.attribution">Exemple, revendeur</p>
                        </div>
                    </article>

                </div>
            </div>
        </div>
    </div>
</section>
`;

const regexHeroToGrid = /<!-- Hero \/ Summary Section -->[\s\S]*?<!-- Trust Badges Section -->/;
if (regexHeroToGrid.test(avisHtml)) {
    avisHtml = avisHtml.replace(regexHeroToGrid, newHeroAndCarousel + '\n<!-- Trust Badges Section -->');
} else {
    console.log("Could not find the block to replace in avis-clients.html.");
}

// Add the carousel sliding JS logic
const scriptLogic = `
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.review-card');
        const carousel = document.getElementById('reviews-carousel-slides');
        const prevBtn = document.getElementById('reviews-prev-btn');
        const nextBtn = document.getElementById('reviews-next-btn');

        if(prevBtn && nextBtn && carousel) {
            prevBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -350, behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: 350, behavior: 'smooth' });
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => {
                    b.classList.remove('bg-primary', 'text-on-primary', 'shadow-md');
                    b.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
                });
                btn.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
                btn.classList.add('bg-primary', 'text-on-primary', 'shadow-md');

                const filter = btn.getAttribute('data-filter');
                cards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    });
</script>
`;

// Replace the old script block I added in the previous turn if it exists
if (avisHtml.includes('const filterBtns = document.querySelectorAll')) {
    avisHtml = avisHtml.replace(/<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => \{\s*const filterBtns = document\.querySelectorAll[\s\S]*?<\/script>\s*(<\/body>)/, scriptLogic + '$1');
}

fs.writeFileSync('avis-clients.html', avisHtml, 'utf8');
console.log('avis-clients.html updated.');
