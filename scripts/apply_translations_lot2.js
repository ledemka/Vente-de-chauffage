const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const tableData = [
  // depots.html
  { file: 'depots.html', key: 'depots.countries', fr: 'Pays partenaires', en: 'Partner Countries', de: 'Partnerländer', nl: 'Partnerlanden' },
  { file: 'depots.html', key: 'depots.local', fr: 'Dépôts locaux', en: 'Local Depots', de: 'Lokale Lager', nl: 'Lokale depots' },
  { file: 'depots.html', key: 'depots.presence', fr: 'Notre présence', en: 'Our Presence', de: 'Unsere Präsenz', nl: 'Onze aanwezigheid' },

  // blog.html
  { file: 'blog.html', key: 'blog.hero.title', fr: 'Expertise & Actualités', en: 'Expertise & News', de: 'Expertise & Neuigkeiten', nl: 'Expertise & Nieuws' },
  { file: 'blog.html', key: 'blog.hero.subtitle', fr: 'La science du bois énergie.', en: 'The science of wood energy.', de: 'Die Wissenschaft der Holzenergie.', nl: 'De wetenschap van houtenergie.' },
  { file: 'blog.html', key: 'blog.filter.all', fr: 'TOUS LES ARTICLES', en: 'ALL ARTICLES', de: 'ALLE ARTIKEL', nl: 'ALLE ARTIKELEN' },
  { file: 'blog.html', key: 'blog.filter.trends', fr: 'TENDANCES B2B', en: 'B2B TRENDS', de: 'B2B-TRENDS', nl: 'B2B-TRENDS' },
  { file: 'blog.html', key: 'blog.filter.guide', fr: 'GUIDE TECHNIQUE', en: 'TECHNICAL GUIDE', de: 'TECHNISCHER LEITFADEN', nl: 'TECHNISCHE GIDS' },
  { file: 'blog.html', key: 'blog.draft', fr: 'Brouillon — article à rédiger', en: 'Draft — article to be written', de: 'Entwurf — Artikel in Vorbereitung', nl: 'Concept — artikel in voorbereiding' },
  { file: 'blog.html', key: 'blog.read_article', fr: 'LIRE L\'ARTICLE', en: 'READ ARTICLE', de: 'ARTIKEL LESEN', nl: 'ARTIKEL LEZEN' },
  { file: 'blog.html', key: 'blog.tag.industry', fr: 'INDUSTRIE', en: 'INDUSTRY', de: 'INDUSTRIE', nl: 'INDUSTRIE' },
  { file: 'blog.html', key: 'blog.tag.gastronomy', fr: 'GASTRONOMIE', en: 'CULINARY', de: 'GASTRONOMIE', nl: 'GASTRONOMIE' },
  { file: 'blog.html', key: 'blog.discover', fr: 'DÉCOUVRIR', en: 'DISCOVER', de: 'ENTDECKEN', nl: 'ONTDEKKEN' },
  { file: 'blog.html', key: 'blog.tag.logistics', fr: 'LOGISTIQUE', en: 'LOGISTICS', de: 'LOGISTIK', nl: 'LOGISTIEK' },
  { file: 'blog.html', key: 'blog.tag.science', fr: 'SCIENCES & NORMES', en: 'SCIENCE & STANDARDS', de: 'WISSENSCHAFT & NORMEN', nl: 'WETENSCHAP & NORMEN' },
  { file: 'blog.html', key: 'blog.newsletter.title', fr: 'Veille Stratégique.', en: 'Market Intelligence.', de: 'Markt-Insights.', nl: 'Marktinzichten.' },
  { file: 'blog.html', key: 'blog.newsletter.desc', fr: 'Recevez nos analyses de marché mensuelles, les évolutions réglementaires et les conseils d\'optimisation énergétique directement dans votre boîte mail.', en: 'Get our monthly market analysis, regulatory updates, and energy optimization tips straight to your inbox.', de: 'Erhalten Sie unsere monatlichen Marktanalysen, regulatorische Updates und Tipps zur Energieoptimierung direkt in Ihr Postfach.', nl: 'Ontvang onze maandelijkse marktanalyses, regelgevingsupdates en tips voor energieoptimalisatie rechtstreeks in uw inbox.', fallbackFr: 'Recevez nos analyses de marché mensuelles, les évolutions réglementaires et les conseils d\'optimisation énergétique directement dans votre boîte mail.' },
  { file: 'blog.html', key: 'blog.newsletter.placeholder', fr: 'ADRESSE EMAIL PROFESSIONNELLE', en: 'BUSINESS EMAIL ADDRESS', de: 'GESCHÄFTLICHE E-MAIL-ADRESSE', nl: 'ZAKELIJK E-MAILADRES' },

  // guide-choix.html
  { file: 'guide-choix.html', key: 'guide.hero.title', fr: 'Expertise & Conseil', en: 'Expertise & Advice', de: 'Expertise & Beratung', nl: 'Expertise & Advies' },
  { file: 'guide-choix.html', key: 'guide.nav.species', fr: 'ESSENCE DU BOIS', en: 'WOOD SPECIES', de: 'HOLZART', nl: 'HOUTSOORT' },
  { file: 'guide-choix.html', key: 'guide.nav.moisture', fr: 'TAUX D\'HUMIDITÉ', en: 'MOISTURE CONTENT', de: 'FEUCHTIGKEITSGEHALT', nl: 'VOCHTGEHALTE' },
  { file: 'guide-choix.html', key: 'guide.nav.dimensions', fr: 'DIMENSIONS', en: 'DIMENSIONS', de: 'ABMESSUNGEN', nl: 'AFMETINGEN' },
  { file: 'guide-choix.html', key: 'guide.nav.storage', fr: 'STOCKAGE', en: 'STORAGE', de: 'LAGERUNG', nl: 'OPSLAG' },
  { file: 'guide-choix.html', key: 'guide.species.title', fr: 'Choisir la bonne essence', en: 'Choosing the right species', de: 'Die richtige Holzart wählen', nl: 'De juiste houtsoort kiezen' },
  { file: 'guide-choix.html', key: 'guide.species.desc', fr: 'Toutes les essences ne se valent pas pour le chauffage. Privilégiez les feuillus durs pour une combustion lente et un pouvoir calorifique élevé.', en: 'Not all wood species are equal for heating. Choose hardwoods for slow combustion and high calorific value.', de: 'Nicht alle Holzarten eignen sich gleichermaßen zum Heizen. Bevorzugen Sie Hartlaubholz für eine langsame Verbrennung und hohen Heizwert.', nl: 'Niet alle houtsoorten zijn gelijk voor verwarming. Kies voor hardhout voor een langzame verbranding en hoge calorische waarde.' },
  { file: 'guide-choix.html', key: 'guide.species.g1_title', fr: 'G1 - Feuillus Durs', en: 'G1 - Hardwoods', de: 'G1 - Harthölzer', nl: 'G1 - Hardhout' },
  { file: 'guide-choix.html', key: 'guide.species.g1_desc', fr: 'Chêne, Hêtre, Frêne, Charme', en: 'Oak, Beech, Ash, Hornbeam', de: 'Eiche, Buche, Esche, Hainbuche', nl: 'Eik, Beuk, Es, Haagbeuk' },
  { file: 'guide-choix.html', key: 'guide.species.calorific', fr: 'Pouvoir calorifique', en: 'Calorific value', de: 'Heizwert', nl: 'Calorische waarde' },
  { file: 'guide-choix.html', key: 'guide.species.excellent', fr: 'Excellent', en: 'Excellent', de: 'Ausgezeichnet', nl: 'Uitstekend' },
  { file: 'guide-choix.html', key: 'guide.species.g2_title', fr: 'G2 - Feuillus Tendres', en: 'G2 - Softer Hardwoods', de: 'G2 - Weiche Laubhölzer', nl: 'G2 - Zachter hardhout' },
  { file: 'guide-choix.html', key: 'guide.species.g2_desc', fr: 'Châtaignier, Acacia, Merisier', en: 'Chestnut, Acacia, Wild Cherry', de: 'Kastanie, Robinie, Wildkirsche', nl: 'Kastanje, Acacia, Wilde kers' },
  { file: 'guide-choix.html', key: 'guide.species.g3_title', fr: 'G3 - Résineux & Autres', en: 'G3 - Softwoods & Other', de: 'G3 - Nadelhölzer & Sonstige', nl: 'G3 - Naaldhout & Overige' },
  { file: 'guide-choix.html', key: 'guide.species.g3_desc', fr: 'Sapin, Pin, Épicéa, Bouleau', en: 'Fir, Pine, Spruce, Birch', de: 'Tanne, Kiefer, Fichte, Birke', nl: 'Den, Grove den, Spar, Berk' },
  { file: 'guide-choix.html', key: 'guide.species.medium', fr: 'Moyen', en: 'Medium', de: 'Mittel', nl: 'Gemiddeld' },
  { file: 'guide-choix.html', key: 'guide.moisture.title', fr: 'L\'importance du taux d\'humidité', en: 'The importance of moisture content', de: 'Die Bedeutung des Feuchtigkeitsgehalts', nl: 'Het belang van het vochtgehalte' },
  { file: 'guide-choix.html', key: 'guide.moisture.desc', fr: 'Un bois sec (H1) dégage plus de chaleur, encrasse moins votre conduit et pollue moins. Découvrez la différence d\'efficacité selon le séchage.', en: 'Dry wood (H1) releases more heat, clogs your flue less, and pollutes less. Discover the efficiency difference based on drying method.', de: 'Trockenes Holz (H1) gibt mehr Wärme ab, verrußt Ihren Schornstein weniger und verursacht weniger Emissionen. Entdecken Sie den Effizienzunterschied je nach Trocknungsart.', nl: 'Droog hout (H1) geeft meer warmte af, vervuilt uw schoorsteen minder en vervuilt minder. Ontdek het efficiëntieverschil afhankelijk van de droogmethode.' },
  { file: 'guide-choix.html', key: 'guide.moisture.h1_desc', fr: 'Prêt à l\'emploi. Offre le meilleur rendement énergétique. Séchage naturel de 18 à 24 mois ou séchage artificiel.', en: 'Ready to use. Offers the best energy yield. Natural drying over 18 to 24 months or kiln-dried.', de: 'Sofort einsatzbereit. Bietet die beste Energieausbeute. Natürliche Trocknung über 18 bis 24 Monate oder künstliche Trocknung.', nl: 'Direct klaar voor gebruik. Biedt het beste energierendement. Natuurlijke droging van 18 tot 24 maanden of kunstmatig gedroogd.' },
  { file: 'guide-choix.html', key: 'guide.moisture.h2_desc', fr: 'Nécessite d\'être stocké dans un endroit sec et ventilé pendant 6 à 12 mois avant utilisation. Plus économique à l\'achat.', en: 'Needs to be stored in a dry, ventilated place for 6 to 12 months before use. More economical to purchase.', de: 'Muss vor Gebrauch 6 bis 12 Monate an einem trockenen, belüfteten Ort gelagert werden. Günstiger im Einkauf.', nl: 'Moet vóór gebruik 6 tot 12 maanden op een droge, geventileerde plaats worden opgeslagen. Voordeliger in aanschaf.' },
  { file: 'guide-choix.html', key: 'guide.moisture.h3_desc', fr: 'Bois fraîchement coupé. Inutilisable en l\'état. Nécessite un stockage de 2 ans minimum avant de pouvoir être brûlé.', en: 'Freshly cut wood. Not usable as is. Requires at least 2 years of storage before it can be burned.', de: 'Frisch geschlagenes Holz. So nicht verwendbar. Erfordert mindestens 2 Jahre Lagerung vor dem Verbrennen.', nl: 'Vers gekapt hout. Niet direct bruikbaar. Vereist minstens 2 jaar opslag voordat het verbrand kan worden.' },
  { file: 'guide-choix.html', key: 'guide.moisture.yield_title', fr: 'Rendement Énergétique Comparé', en: 'Compared Energy Yield', de: 'Vergleich der Energieausbeute', nl: 'Vergelijking energierendement' },
  { file: 'guide-choix.html', key: 'guide.moisture.yield_desc', fr: 'Brûler du bois humide dissipe l\'énergie pour évaporer l\'eau avant de produire de la chaleur utile.', en: 'Burning wet wood wastes energy evaporating water before producing usable heat.', de: 'Das Verbrennen von feuchtem Holz verschwendet Energie zum Verdampfen von Wasser, bevor nutzbare Wärme entsteht.', nl: 'Het verbranden van vochtig hout verspilt energie aan het verdampen van water voordat bruikbare warmte ontstaat.' },
  { file: 'guide-choix.html', key: 'guide.dimensions.title', fr: 'Choisir la bonne longueur', en: 'Choosing the right length', de: 'Die richtige Länge wählen', nl: 'De juiste lengte kiezen' },
  { file: 'guide-choix.html', key: 'guide.dimensions.desc', fr: 'La longueur de vos bûches doit être adaptée à la taille de votre foyer. Mesurez l\'intérieur de votre appareil en retranchant 5cm par sécurité.', en: 'Log length should match the size of your firebox. Measure the inside of your appliance and subtract 5cm for safety.', de: 'Die Länge Ihrer Scheite sollte zur Größe Ihres Feuerraums passen. Messen Sie das Innere Ihres Geräts und ziehen Sie sicherheitshalber 5cm ab.', nl: 'De lengte van uw houtblokken moet passen bij de grootte van uw stookruimte. Meet de binnenkant van uw toestel en trek voor de veiligheid 5cm af.' },
  { file: 'guide-choix.html', key: 'guide.dimensions.small', fr: 'Petits poêles à bois, cuisinières. Séchage très rapide.', en: 'Small wood stoves, cookers. Very fast drying.', de: 'Kleine Holzöfen, Herde. Sehr schnelle Trocknung.', nl: 'Kleine houtkachels, fornuizen. Zeer snelle droging.' },
  { file: 'guide-choix.html', key: 'guide.dimensions.standard', fr: 'Standard pour la majorité des poêles modernes et inserts.', en: 'Standard for most modern stoves and inserts.', de: 'Standard für die meisten modernen Öfen und Kamineinsätze.', nl: 'Standaard voor de meeste moderne kachels en inzethaarden.' },
  { file: 'guide-choix.html', key: 'guide.dimensions.medium', fr: 'Taille intermédiaire pour inserts moyens.', en: 'Intermediate size for medium inserts.', de: 'Mittlere Größe für mittelgroße Kamineinsätze.', nl: 'Tussenmaat voor middelgrote inzethaarden.' },
  { file: 'guide-choix.html', key: 'guide.dimensions.large', fr: 'Grands inserts, cheminées ouvertes traditionnelles.', en: 'Large inserts, traditional open fireplaces.', de: 'Große Kamineinsätze, traditionelle offene Kamine.', nl: 'Grote inzethaarden, traditionele open haarden.' },
  { file: 'guide-choix.html', key: 'guide.storage.title', fr: 'Règles d\'or du stockage', en: 'Golden rules of storage', de: 'Goldene Regeln der Lagerung', nl: 'Gouden regels voor opslag' },
  { file: 'guide-choix.html', key: 'guide.storage.desc', fr: 'Un bon bois peut perdre toutes ses qualités s\'il est mal stocké. Protégez votre investissement en suivant ces règles simples.', en: 'Good wood can lose all its qualities if poorly stored. Protect your investment by following these simple rules.', de: 'Gutes Holz kann bei falscher Lagerung alle seine Eigenschaften verlieren. Schützen Sie Ihre Investition, indem Sie diese einfachen Regeln befolgen.', nl: 'Goed hout kan al zijn kwaliteiten verliezen bij verkeerde opslag. Bescherm uw investering door deze eenvoudige regels te volgen.' },
  { file: 'guide-choix.html', key: 'guide.storage.ventilation_title', fr: 'Ventilation', en: 'Ventilation', de: 'Belüftung', nl: 'Ventilatie' },
  { file: 'guide-choix.html', key: 'guide.storage.vent_1', fr: 'Ne pas coller le tas de bois directement contre un mur (laisser ~10cm).', en: 'Do not stack the woodpile directly against a wall (leave ~10cm).', de: 'Stellen Sie den Holzstapel nicht direkt an eine Wand (ca. 10cm Abstand lassen).', nl: 'Zet de houtstapel niet direct tegen een muur (laat ~10cm ruimte).' },
  { file: 'guide-choix.html', key: 'guide.storage.vent_2', fr: 'Croiser les bûches aux extrémités pour stabiliser et aérer.', en: 'Cross the logs at the ends to stabilize and ventilate the stack.', de: 'Kreuzen Sie die Scheite an den Enden zur Stabilisierung und Belüftung.', nl: 'Kruis de houtblokken aan de uiteinden voor stabiliteit en ventilatie.' },
  { file: 'guide-choix.html', key: 'guide.storage.vent_3', fr: 'Privilégier un endroit exposé aux vents dominants et au soleil.', en: 'Choose a spot exposed to prevailing winds and sunlight.', de: 'Wählen Sie einen Standort, der den vorherrschenden Winden und der Sonne ausgesetzt ist.', nl: 'Kies een plek die is blootgesteld aan de overheersende wind en zon.' },
  { file: 'guide-choix.html', key: 'guide.storage.protection_title', fr: 'Protection', en: 'Protection', de: 'Schutz', nl: 'Bescherming' },
  { file: 'guide-choix.html', key: 'guide.storage.prot_1', fr: 'Isoler du sol à l\'aide de palettes ou de chevrons.', en: 'Insulate from the ground using pallets or battens.', de: 'Vom Boden isolieren mit Paletten oder Kanthölzern.', nl: 'Isoleer van de grond met pallets of balken.' },
  { file: 'guide-choix.html', key: 'guide.storage.prot_2', fr: 'Couvrir uniquement le dessus avec une tôle ou une bâche (laisser les côtés libres).', en: 'Cover only the top with sheet metal or a tarp (leave the sides open).', de: 'Nur die Oberseite mit Blech oder einer Plane abdecken (Seiten offen lassen).', nl: 'Bedek alleen de bovenkant met plaatstaal of een dekzeil (laat de zijkanten open).' },
  { file: 'guide-choix.html', key: 'guide.storage.prot_3', fr: 'Éviter le stockage en cave fermée (risque de moisissures).', en: 'Avoid storing in a closed cellar (risk of mould).', de: 'Lagerung in einem geschlossenen Keller vermeiden (Schimmelgefahr).', nl: 'Vermijd opslag in een gesloten kelder (risico op schimmel).' },

  // livraison.html
  { file: 'livraison.html', key: 'livraison.process.title', fr: 'Processus de Livraison', en: 'Delivery Process', de: 'Lieferprozess', nl: 'Leveringsproces' },
  { file: 'livraison.html', key: 'livraison.process.validation', fr: 'Validation', en: 'Confirmation', de: 'Bestätigung', nl: 'Bevestiging' },
  { file: 'livraison.html', key: 'livraison.process.preparation', fr: 'Préparation', en: 'Preparation', de: 'Vorbereitung', nl: 'Voorbereiding' },
  { file: 'livraison.html', key: 'livraison.process.scheduling', fr: 'Planification', en: 'Scheduling', de: 'Terminplanung', nl: 'Planning' },
  { file: 'livraison.html', key: 'livraison.process.delivery', fr: 'Réception', en: 'Delivery', de: 'Anlieferung', nl: 'Ontvangst' },
  { file: 'livraison.html', key: 'livraison.fleet.title', fr: 'Spécifications Flotte & Accès', en: 'Fleet & Access Specifications', de: 'Flotten- & Zufahrtsspezifikationen', nl: 'Vloot- & toegangsspecificaties' },
  { file: 'livraison.html', key: 'livraison.fleet.tautliner_title', fr: 'Plateau Tautliner 44T', en: '44T Curtainside Trailer', de: '44t Planensattelzug', nl: '44T huifopleggercombinatie' },
  { file: 'livraison.html', key: 'livraison.fleet.tautliner_desc', fr: 'Capacité maximale de 32 palettes. Idéal pour les livraisons en gros volume sur sites équipés de quais de déchargement.', en: 'Maximum capacity of 32 pallets. Ideal for high-volume deliveries to sites with loading docks.', de: 'Maximale Kapazität von 32 Paletten. Ideal für Großlieferungen an Standorte mit Laderampen.', nl: 'Maximale capaciteit van 32 pallets. Ideaal voor grootvolume-leveringen aan locaties met laadperrons.' },
  { file: 'livraison.html', key: 'livraison.fleet.tail_lift', fr: 'Gabarit Hayon', en: 'Tail Lift Dimensions', de: 'Ladebordwand-Abmessungen', nl: 'Laadklep-afmetingen' },
  { file: 'livraison.html', key: 'livraison.fleet.clearance', fr: 'Hauteur mini de passage', en: 'Min. clearance height', de: 'Mindestdurchfahrtshöhe', nl: 'Min. doorrijhoogte' },
  { file: 'livraison.html', key: 'livraison.fleet.gate', fr: 'Largeur mini portail', en: 'Min. gate width', de: 'Mindestbreite Einfahrt', nl: 'Min. poortbreedte' },
  { file: 'livraison.html', key: 'livraison.fleet.turning', fr: 'Rayon braquage', en: 'Turning radius', de: 'Wenderadius', nl: 'Draaicirkel' },
  { file: 'livraison.html', key: 'livraison.fleet.crane_title', fr: 'Porteur Grue', en: 'Crane Truck', de: 'Kranfahrzeug', nl: 'Kraanwagen' },
  { file: 'livraison.html', key: 'livraison.fleet.crane_desc', fr: 'Déchargement par dessus obstacle (murs, haies). Portée jusqu\'à 6m.', en: 'Over-obstacle unloading (walls, hedges). Reach up to 6m.', de: 'Entladung über Hindernisse (Mauern, Hecken). Reichweite bis 6m.', nl: 'Lossen over obstakels heen (muren, hagen). Reikwijdte tot 6m.' },
  { file: 'livraison.html', key: 'livraison.area.title', fr: 'Zone d\'Intervention', en: 'Service Area', de: 'Einsatzgebiet', nl: 'Interventiegebied' },
  { file: 'livraison.html', key: 'livraison.area.zone1', fr: 'Zone 1 (J+1 / J+2)', en: 'Zone 1 (D+1 / D+2)', de: 'Zone 1 (T+1 / T+2)', nl: 'Zone 1 (D+1 / D+2)' },
  { file: 'livraison.html', key: 'livraison.area.zone2', fr: 'Zone 2 (J+3 / J+5)', en: 'Zone 2 (D+3 / D+5)', de: 'Zone 2 (T+3 / T+5)', nl: 'Zone 2 (D+3 / D+5)' },
  { file: 'livraison.html', key: 'livraison.constraints', fr: 'Contraintes Terrain', en: 'Site Constraints', de: 'Standortbeschränkungen', nl: 'Terreinbeperkingen' },

  // avis-clients.html
  { file: 'avis-clients.html', key: 'reviews.trust.title', fr: 'Indice de confiance', en: 'Trust Score', de: 'Vertrauensindex', nl: 'Vertrouwensscore' },
  { file: 'avis-clients.html', key: 'reviews.trust.subtitle', fr: 'validée par les pros.', en: 'trusted by professionals.', de: 'von Profis bestätigt.', nl: 'vertrouwd door professionals.' },
  { file: 'avis-clients.html', key: 'reviews.trust.customers', fr: '+1k clients', en: '+1k customers', de: '+1.000 Kunden', nl: '+1k klanten' },
  { file: 'avis-clients.html', key: 'reviews.filter.all', fr: 'TOUS', en: 'ALL', de: 'ALLE', nl: 'ALLE' },
  { file: 'avis-clients.html', key: 'reviews.filter.hospitality', fr: 'RESTAURATION', en: 'HOSPITALITY', de: 'GASTRONOMIE', nl: 'HORECA' },
  { file: 'avis-clients.html', key: 'reviews.filter.industry', fr: 'INDUSTRIE', en: 'INDUSTRY', de: 'INDUSTRIE', nl: 'INDUSTRIE' },
  { file: 'avis-clients.html', key: 'reviews.filter.resellers', fr: 'REVENDEURS', en: 'RESELLERS', de: 'WIEDERVERKÄUFER', nl: 'WEDERVERKOPERS' },
  { file: 'avis-clients.html', key: 'reviews.commitments', fr: 'Nos engagements qualité', en: 'Our quality commitments', de: 'Unsere Qualitätsversprechen', nl: 'Onze kwaliteitsbeloften' }
];

function setNestedProperty(obj, key, value) {
  const parts = key.split('.');
  for (let i = 0; i < parts.length - 1; i++) {
    if (!obj[parts[i]]) obj[parts[i]] = {};
    obj = obj[parts[i]];
  }
  obj[parts[parts.length - 1]] = value;
}

// 1. Update JSON files
const langs = ['fr', 'en', 'de', 'nl'];
langs.forEach(lang => {
  const jsonPath = path.join(rootDir, `data/i18n/${lang}.json`);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  tableData.forEach(item => {
    setNestedProperty(data, item.key, item[lang]);
  });
  
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 4));
});
console.log('JSON i18n files updated for Lot 2.');

// 2. Patch HTML files
const htmlFiles = [...new Set(tableData.map(t => t.file))];

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function processHtml(filePath, lang) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  const pageItems = tableData.filter(t => t.file === path.basename(filePath));
  
  // Fix html lang attribute if it was incorrectly set to 'fr'
  content = content.replace(/<html([^>]*)lang=["']fr["']([^>]*)>/g, `<html$1lang="${lang}"$2>`);
  
  pageItems.forEach(item => {
    const textToReplace = item[lang];
    const key = item.key;
    
    // Build list of all possible texts that could be currently in the HTML
    const searchTexts = [
        item.fr, 
        item.en, 
        item.de, 
        item.nl,
        item.fallbackEn,
        item.fallbackFr
    ].filter(Boolean);

    searchTexts.forEach(textToMatch => {
        // We ensure we don't match texts that are inside tags or material symbols.
        // We'll replace exact text nodes where the text is exactly textToMatch (ignoring surrounding spaces).
        const reTextNode = new RegExp(`(>[\\s\\r\\n]*)(${escapeRegExp(textToMatch)})([\\s\\r\\n]*<)`, 'g');
        content = content.replace(reTextNode, (match, p1, p2, p3) => {
          return `${p1}<!--i18n:${key}-->${textToReplace}${p3}`;
        });
    
        // Placeholders
        const rePlaceholder = new RegExp(`(placeholder=["'])${escapeRegExp(textToMatch)}(["'])`, 'g');
        content = content.replace(rePlaceholder, `data-i18n-placeholder="${key}" $1${textToReplace}$2`);
        
        // Values
        const reValue = new RegExp(`(value=["'])${escapeRegExp(textToMatch)}(["'])`, 'g');
        content = content.replace(reValue, `data-i18n-value="${key}" $1${textToReplace}$2`);
    });
  });

  const reTagWithComment = /<([a-zA-Z0-9\-]+)([^>]*?)>(?:[\s\r\n]*)<!--i18n:([a-zA-Z0-9_.-]+)-->/g;
  content = content.replace(reTagWithComment, (match, tag, attrs, key) => {
    // DO NOT touch Material Symbols or the lang selector, but those shouldn't be matched by the text replacement anyway
    if (attrs.includes('data-i18n=')) {
      return `<${tag}${attrs.replace(/data-i18n="[^"]*"/, `data-i18n="${key}"`)}>`;
    }
    return `<${tag} data-i18n="${key}"${attrs}>`;
  });
  
  content = content.replace(/<!--i18n:[a-zA-Z0-9_.-]+-->/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
}

htmlFiles.forEach(file => {
  const dirs = ['.', 'en', 'de', 'nl'];
  dirs.forEach(dir => {
    const lang = dir === '.' ? 'fr' : dir;
    const filePath = path.join(rootDir, dir, file);
    processHtml(filePath, lang);
  });
});

console.log('HTML files patched for Lot 2.');
