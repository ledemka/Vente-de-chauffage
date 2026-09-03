const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const LANGS = ['.', 'en', 'de', 'nl'];

const promoHtml = `
<!-- Promotional Delivery Section -->
<section class="py-16 bg-surface-container-low w-full border-t border-outline/20">
    <div class="max-w-[1440px] mx-auto px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="flex items-start gap-6">
            <div class="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-primary shadow-sm border border-outline/10">
                <span class="material-symbols-outlined text-[32px]">local_shipping</span>
            </div>
            <div class="flex flex-col gap-2 max-w-2xl">
                <h2 class="text-headline-md font-headline-md text-on-surface"><span data-i18n="delivery_promo.title">Livraison Industrielle Sécurisée</span></h2>
                <p class="text-body-md text-on-surface-variant">
                    <span data-i18n="delivery_promo.desc">Des forêts gérées durablement jusqu'à votre site. Notre flotte garantit un approvisionnement constant pour les volumes professionnels, avec un délai d'expédition moyen de 48h.</span>
                </p>
            </div>
        </div>
        <div class="flex-shrink-0 w-full md:w-auto">
            <a href="./livraison.html" class="flex w-full md:inline-flex bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider py-4 px-8 rounded-md transition-colors items-center justify-center gap-2 shadow-md">
                <span data-i18n="delivery_promo.cta">En savoir plus sur la livraison</span>
                <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
            </a>
        </div>
    </div>
</section>
</div></main><footer`;

const i18nData = {
    fr: {
        "title": "Livraison Industrielle Sécurisée",
        "desc": "Des forêts gérées durablement jusqu'à votre site. Notre flotte garantit un approvisionnement constant pour les volumes professionnels, avec un délai d'expédition moyen de 48h.",
        "cta": "En savoir plus sur la livraison"
    },
    en: {
        "title": "Secure Industrial Delivery",
        "desc": "From sustainably managed forests to your site. Our fleet guarantees a constant supply for professional volumes, with an average dispatch time of 48 hours.",
        "cta": "Learn more about delivery"
    },
    de: {
        "title": "Sichere industrielle Lieferung",
        "desc": "Von nachhaltig bewirtschafteten Wäldern bis zu Ihrem Standort. Unsere Flotte garantiert eine konstante Versorgung für gewerbliche Mengen bei einer durchschnittlichen Versandzeit von 48 Stunden.",
        "cta": "Mehr zur Lieferung erfahren"
    },
    nl: {
        "title": "Veilige industriële levering",
        "desc": "Van duurzaam beheerde bossen tot op uw locatie. Onze vloot garandeert een constante aanvoer voor professionele volumes, met een gemiddelde verzendtijd van 48 uur.",
        "cta": "Meer info over levering"
    }
};

// 1. Update index.html
LANGS.forEach(langDir => {
    const indexPath = path.join(ROOT_DIR, langDir, 'index.html');
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf8');
        if (!content.includes('delivery_promo.title')) {
            content = content.replace('</div></main><footer', promoHtml);
            fs.writeFileSync(indexPath, content, 'utf8');
            console.log(`Updated index.html in ${langDir}`);
        }
    }
});

// 2. Update i18n JSON
Object.keys(i18nData).forEach(lang => {
    const jsonPath = path.join(ROOT_DIR, 'data', 'i18n', `${lang}.json`);
    if (fs.existsSync(jsonPath)) {
        let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        if (!data.delivery_promo) {
            data.delivery_promo = i18nData[lang];
            fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Updated data/i18n/${lang}.json`);
        }
    }
});
