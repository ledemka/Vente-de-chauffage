const fs = require('fs');
const path = './data/faq.json';

const faqData = JSON.parse(fs.readFileSync(path, 'utf8'));

// Determine next ID
let maxId = 0;
faqData.forEach(q => {
    const num = parseInt(q.id.replace('q', ''));
    if (num > maxId) maxId = num;
});

const newQuestions = [
    {
        id: `q${++maxId}`,
        category: 'qualite',
        question: {
            fr: "Quel est le taux d'humidité de ce bois ?",
            en: "What is the moisture content of this wood?",
            de: "Wie hoch ist der Feuchtigkeitsgehalt dieses Holzes?",
            nl: "Wat is het vochtgehalte van dit hout?"
        },
        answer: {
            fr: "La qualité de notre bois de chauffage repose sur un séchage optimal. Nous nous engageons à fournir un bois étuvé premium dont le taux d'humidité est certifié inférieur à 20%. Cette faible humidité garantit un pouvoir calorifique (PCI) maximal et assure une combustion propre qui limite l'encrassement de vos installations thermiques professionnelles.",
            en: "The quality of our firewood is based on optimal drying. We are committed to providing premium kiln-dried wood with a certified moisture content of less than 20%. This low moisture guarantees maximum calorific value (NCV) and ensures clean combustion that limits the fouling of your professional thermal installations.",
            de: "Die Qualität unseres Brennholzes beruht auf einer optimalen Trocknung. Wir verpflichten uns, hochwertiges kammergetrocknetes Holz mit einem zertifizierten Feuchtigkeitsgehalt von weniger als 20% zu liefern. Diese geringe Feuchtigkeit garantiert einen maximalen Heizwert (Hu) und sorgt für eine saubere Verbrennung, die die Verschmutzung Ihrer professionellen thermischen Anlagen minimiert.",
            nl: "De kwaliteit van ons brandhout is gebaseerd op een optimale droging. Wij streven ernaar premium ovengedroogd hout te leveren met een gecertificeerd vochtgehalte van minder dan 20%. Dit lage vochtgehalte garandeert een maximale stookwaarde en zorgt voor een schone verbranding die vervuiling van uw professionele thermische installaties beperkt."
        }
    },
    {
        id: `q${++maxId}`,
        category: 'qualite',
        question: {
            fr: "Quelle longueur de bûche choisir ?",
            en: "Which log length to choose?",
            de: "Welche Scheitlänge soll ich wählen?",
            nl: "Welke lengte houtblok moet ik kiezen?"
        },
        answer: {
            fr: "Le choix de la longueur dépend directement de la taille de votre foyer ou de votre installation industrielle. Notre catalogue propose généralement plusieurs formats standards (25cm, 33cm, 50cm). Nous vous conseillons de vérifier les dimensions de votre chambre de combustion. Un format adapté permet de maximiser le rendement et de limiter les manipulations.",
            en: "The choice of length depends directly on the size of your fireplace or industrial installation. Our catalog generally offers several standard formats (25cm, 33cm, 50cm). We advise you to check the dimensions of your combustion chamber. An adapted format maximizes efficiency and limits handling.",
            de: "Die Wahl der Länge hängt direkt von der Größe Ihres Kamins oder Ihrer Industrieanlage ab. Unser Katalog bietet in der Regel verschiedene Standardformate (25cm, 33cm, 50cm). Wir empfehlen Ihnen, die Abmessungen Ihrer Brennkammer zu überprüfen. Ein angepasstes Format maximiert die Effizienz und begrenzt die Handhabung.",
            nl: "De keuze van de lengte hangt direct af van de grootte van uw haard of industriële installatie. Onze catalogus biedt over het algemeen verschillende standaardformaten (25cm, 33cm, 50cm). Wij adviseren u om de afmetingen van uw verbrandingskamer te controleren. Een aangepast formaat maximaliseert de efficiëntie en beperkt de manipulatie."
        }
    },
    {
        id: `q${++maxId}`,
        category: 'commande',
        question: {
            fr: "Le produit est-il disponible en palette ?",
            en: "Is the product available on a pallet?",
            de: "Ist das Produkt auf einer Palette erhältlich?",
            nl: "Is het product op een pallet verkrijgbaar?"
        },
        answer: {
            fr: "Oui, tous nos produits bois énergie sont systématiquement conditionnés sur palettes pour répondre aux exigences logistiques B2B. Ce conditionnement sécurisé facilite le déchargement au transpalette ou au chariot élévateur et optimise le stockage dans vos entrepôts. Les spécifications exactes de chaque palette sont disponibles sur les fiches produits.",
            en: "Yes, all our wood energy products are systematically packaged on pallets to meet B2B logistical requirements. This secure packaging facilitates unloading with a pallet truck or forklift and optimizes storage in your warehouses. The exact specifications of each pallet are available on the product sheets.",
            de: "Ja, alle unsere Holzenergieprodukte werden systematisch auf Paletten verpackt, um den logistischen B2B-Anforderungen gerecht zu werden. Diese sichere Verpackung erleichtert das Entladen mit Hubwagen oder Gabelstapler und optimiert die Lagerung in Ihren Hallen. Die genauen Spezifikationen jeder Palette finden Sie auf den Produktdatenblättern.",
            nl: "Ja, al onze houtenergieproducten worden systematisch op pallets verpakt om te voldoen aan de logistieke B2B-vereisten. Deze veilige verpakking vergemakkelijkt het lossen met een pompwagen of heftruck en optimaliseert de opslag in uw magazijnen. De exacte specificaties van elke pallet zijn beschikbaar op de productfiches."
        }
    },
    {
        id: `q${++maxId}`,
        category: 'commande',
        question: {
            fr: "Quelle quantité peut être commandée ?",
            en: "What quantity can be ordered?",
            de: "Welche Menge kann bestellt werden?",
            nl: "Welke hoeveelheid kan besteld worden?"
        },
        answer: {
            fr: "Sotrams Bois agit exclusivement en tant que grossiste B2B. Par conséquent, la quantité minimale de commande sur notre plateforme correspond au volume d'une palette complète. Pour les besoins industriels plus importants, vous pouvez commander plusieurs dizaines de palettes simultanément ou demander l'affrètement de camions complets pour bénéficier de nos tarifs dégressifs.",
            en: "Sotrams Bois acts exclusively as a B2B wholesaler. Therefore, the minimum order quantity on our platform corresponds to the volume of a full pallet. For larger industrial needs, you can order several dozen pallets simultaneously or request the chartering of full trucks to benefit from our sliding scale prices.",
            de: "Sotrams Bois agiert ausschließlich als B2B-Großhändler. Daher entspricht die Mindestbestellmenge auf unserer Plattform dem Volumen einer kompletten Palette. Für größere industrielle Anforderungen können Sie mehrere Dutzend Paletten gleichzeitig bestellen oder die Charterung von kompletten Lkw anfordern, um von unseren gestaffelten Preisen zu profitieren.",
            nl: "Sotrams Bois treedt uitsluitend op als B2B-groothandel. Daarom komt de minimale bestelhoeveelheid op ons platform overeen met het volume van een volle pallet. Voor grotere industriële behoeften kunt u tientallen pallets tegelijk bestellen of de bevrachting van volle vrachtwagens aanvragen om te profiteren van onze kwantumkortingen."
        }
    }
];

faqData.push(...newQuestions);

fs.writeFileSync(path, JSON.stringify(faqData, null, 2), 'utf8');
console.log('Appended new questions to data/faq.json');
