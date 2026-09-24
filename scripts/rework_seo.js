const fs = require('fs');
const path = require('path');

const seoDir = path.join(__dirname, '../data/seo');

const translations = {
    fr: {
        'index.html': { t: 'Grossiste Bois de Chauffage & Pellets B2B', d: "Grossiste B2B en bois de chauffage dur (chêne, hêtre), pellets et briquettes compressées. Livraison palette ou camion complet." },
        'catalogue.html': { t: 'Catalogue B2B Bois de Chauffage' },
        'livraison.html': { t: 'Livraison & Logistique B2B' },
        'guide-choix.html': { t: 'Guide de Choix Bois de Chauffage' },
        'politique-retour.html': { t: 'Politique de Retour B2B' },
        'blog.html': { t: 'Blog du Marché du Bois de Chauffage' },
        'depots.html': { t: "Réseau d'approvisionnement B2B en Europe", d: "Grossiste bois de chauffage implanté dans 8 pays et 24 villes d'Europe : Pologne, Lettonie, Lituanie, Roumanie, Tchéquie, Croatie, Bosnie, France." },
        'devis.html': { d: "Obtenez une cotation sur-mesure pour vos commandes de palettes de bois de chauffage ou camions complets." },
    },
    en: {
        'index.html': { t: 'Wholesale Firewood & Pellets B2B', d: "B2B wholesaler of hard firewood (oak, beech), pellets, and compressed briquettes. Pallet or full truck delivery." },
        'depots.html': { t: 'B2B Supply Network in Europe', d: "Firewood wholesaler located in 8 countries and 24 cities in Europe: Poland, Latvia, Lithuania, Romania, Czechia, Croatia, Bosnia, France." },
        'devis.html': { d: "Get a custom quote for your pallet or full truckload firewood orders." }
    },
    de: {
        'index.html': { t: 'Großhandel Brennholz & Pellets B2B', d: "B2B-Großhändler für hartes Brennholz (Eiche, Buche), Pellets und gepresste Briketts. Paletten- oder Komplettladungslieferung." },
        'depots.html': { d: "Brennholzgroßhändler in 8 Ländern und 24 Städten Europas: Polen, Lettland, Litauen, Rumänien, Tschechien, Kroatien, Bosnien, Frankreich." },
        'devis.html': { d: "Fordern Sie ein maßgeschneidertes Angebot für Ihre Paletten- oder Komplettladungs-Brennholzbestellungen an." }
    },
    nl: {
        'index.html': { t: 'Groothandel Brandhout & Pellets B2B', d: "B2B groothandel in hard brandhout (eik, beuk), pellets en geperste briketten. Levering per pallet of volle vrachtwagen." },
        'depots.html': { d: "Brandhoutgroothandel gevestigd in 8 landen en 24 steden in Europa: Polen, Letland, Litouwen, Roemenië, Tsjechië, Kroatië, Bosnië, Frankrijk." },
        'devis.html': { d: "Ontvang een prijsopgave op maat voor uw bestellingen van pallets of volle vrachtwagens brandhout." }
    }
};

['fr', 'en', 'de', 'nl'].forEach(lang => {
    const file = path.join(seoDir, `${lang}.json`);
    let data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    for (const page in data) {
        // Replace suffix
        if (data[page].title) {
            data[page].title = data[page].title.replace(/\|\s*Bois de Chauffage PRO/gi, '| sotramsbois');
        }
        
        // Remove forbidden words using regex to catch standard ones that might not be manually mapped
        if (data[page].description) {
            data[page].description = data[page].description
                .replace(/certifiés DINplus\/ENplus/gi, '')
                .replace(/certifié/gi, '')
                .replace(/1\s?000 clients/gi, '')
                .replace(/4,8\/5/g, '')
                .replace(/100\s?%\s?français/gi, '')
                .replace(/PCI garanti/gi, '')
                .replace(/sous 24h/gi, '')
                .replace(/sous 48h/gi, '')
                .replace(/\s+/g, ' ')
                .trim();
        }
        
        // Apply manual overrides
        if (translations[lang] && translations[lang][page]) {
            if (translations[lang][page].t) {
                data[page].title = `${translations[lang][page].t} | sotramsbois`;
            }
            if (translations[lang][page].d) {
                data[page].description = translations[lang][page].d;
            }
        }
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
});

console.log('SEO JSON files updated accurately according to Lot 2 rules.');
