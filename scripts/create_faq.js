const fs = require('fs');

const faqData = [
  {
    "id": "q1",
    "question": {
      "fr": "Quels types de camions utilisez-vous pour la livraison ?",
      "en": "What types of trucks do you use for delivery?",
      "de": "Welche Art von LKWs verwenden Sie für die Lieferung?",
      "nl": "Welke soorten vrachtwagens gebruikt u voor de levering?"
    },
    "answer": {
      "fr": "Nous utilisons des Plateaux Tautliner 44T pour les gros volumes (jusqu'à 32 palettes) sur sites équipés, des Porteurs Grue avec une portée jusqu'à 6m, et des camions à hayon.",
      "en": "We use 44T Tautliner flatbeds for large volumes (up to 32 pallets) on equipped sites, Crane Trucks with a reach of up to 6m, and tail-lift trucks.",
      "de": "Wir verwenden 44T Tautliner für große Volumina (bis zu 32 Paletten) auf ausgestatteten Baustellen, Kranwagen mit einer Reichweite von bis zu 6m und Hebebühnen-LKWs.",
      "nl": "Wij gebruiken 44T Tautliners voor grote volumes (tot 32 pallets) op uitgeruste locaties, kraanwagens met een bereik tot 6m, en vrachtwagens met laadklep."
    }
  },
  {
    "id": "q2",
    "question": {
      "fr": "Quels sont vos délais de livraison selon les zones ?",
      "en": "What are your delivery times by zone?",
      "de": "Wie sind Ihre Lieferzeiten je nach Zone?",
      "nl": "Wat zijn uw levertijden per zone?"
    },
    "answer": {
      "fr": "Pour la Zone 1, la livraison s'effectue en J+1 ou J+2. Pour la Zone 2, comptez entre J+3 et J+5.",
      "en": "For Zone 1, delivery takes place in D+1 or D+2. For Zone 2, expect between D+3 and D+5.",
      "de": "In Zone 1 erfolgt die Lieferung in T+1 oder T+2. Für Zone 2 rechnen Sie mit T+3 bis T+5.",
      "nl": "Voor Zone 1 vindt de levering plaats op D+1 of D+2. Voor Zone 2 verwacht u D+3 tot D+5."
    }
  },
  {
    "id": "q3",
    "question": {
      "fr": "Y a-t-il des contraintes d'accès pour les camions à hayon ?",
      "en": "Are there access constraints for tail-lift trucks?",
      "de": "Gibt es Zugangsbeschränkungen für Hebebühnen-LKWs?",
      "nl": "Zijn er toegangsbeperkingen voor vrachtwagens met laadklep?"
    },
    "answer": {
      "fr": "Oui, un gabarit hayon nécessite une hauteur minimum de passage de 4.00m, une largeur de portail de 3.50m et un rayon de braquage de 12.0m.",
      "en": "Yes, a tail-lift truck requires a minimum clearance height of 4.00m, a gate width of 3.50m, and a turning radius of 12.0m.",
      "de": "Ja, ein Hebebühnen-LKW benötigt eine Mindestdurchfahrtshöhe von 4,00m, eine Torbreite von 3,50m und einen Wenderadius von 12,0m.",
      "nl": "Ja, een vrachtwagen met laadklep vereist een minimale doorrijhoogte van 4.00m, een poortbreedte van 3.50m en een draaicirkel van 12.0m."
    }
  },
  {
    "id": "q4",
    "question": {
      "fr": "Quelle est l'humidité garantie pour votre bois de chauffage ?",
      "en": "What is the guaranteed moisture content for your firewood?",
      "de": "Wie hoch ist die garantierte Feuchtigkeit für Ihr Brennholz?",
      "nl": "Wat is het gegarandeerde vochtgehalte voor uw brandhout?"
    },
    "answer": {
      "fr": "Conformément à notre politique de retour, nous garantissons un taux d'humidité strictement inférieur à 20% pour notre bois de chauffage étuvé.",
      "en": "In accordance with our return policy, we guarantee a moisture content strictly below 20% for our kiln-dried firewood.",
      "de": "Gemäß unseren Rückgaberichtlinien garantieren wir für unser ofengetrocknetes Brennholz eine Feuchtigkeit von streng unter 20%.",
      "nl": "Conform ons retourbeleid garanderen wij een vochtgehalte van strikt onder de 20% voor ons ovengedroogd brandhout."
    }
  },
  {
    "id": "q5",
    "question": {
      "fr": "Comment obtenir un tarif personnalisé (devis) ?",
      "en": "How to get a personalized quote?",
      "de": "Wie erhalte ich ein personalisiertes Angebot?",
      "nl": "Hoe krijg ik een gepersonaliseerde offerte?"
    },
    "answer": {
      "fr": "Vous pouvez obtenir une cotation sur-mesure pour vos commandes de palettes ou de camions complets via notre page Devis express B2B.",
      "en": "You can get a custom quote for your pallet or full truckload orders via our B2B express Quote page.",
      "de": "Sie können über unsere B2B-Express-Angebotsseite ein maßgeschneidertes Angebot für Ihre Paletten- oder Komplettladungsbestellungen anfordern.",
      "nl": "U kunt een offerte op maat aanvragen voor uw pallet- of volle vrachtwagenbestellingen via onze B2B express Offerte pagina."
    }
  },
  {
    "id": "q6",
    "question": {
      "fr": "À qui s'adressent vos offres ?",
      "en": "Who are your offers for?",
      "de": "An wen richten sich Ihre Angebote?",
      "nl": "Voor wie zijn uw aanbiedingen bedoeld?"
    },
    "answer": {
      "fr": "Nous sommes un grossiste B2B exclusif. Nos offres s'adressent aux professionnels : revendeurs, paysagistes, collectivités et entreprises.",
      "en": "We are an exclusive B2B wholesaler. Our offers are intended for professionals: resellers, landscapers, communities, and businesses.",
      "de": "Wir sind ein exklusiver B2B-Großhändler. Unsere Angebote richten sich an Profis: Wiederverkäufer, Landschaftsgärtner, Gemeinden und Unternehmen.",
      "nl": "Wij zijn een exclusieve B2B-groothandel. Onze aanbiedingen zijn bedoeld voor professionals: wederverkopers, hoveniers, gemeenschappen en bedrijven."
    }
  },
  {
    "id": "q7",
    "question": {
      "fr": "Comment s'inscrire pour voir les tarifs ?",
      "en": "How to register to see the prices?",
      "de": "Wie melde ich mich an, um die Preise zu sehen?",
      "nl": "Hoe registreer ik me om de prijzen te zien?"
    },
    "answer": {
      "fr": "Vous pouvez créer un compte professionnel depuis notre page Connexion / Inscription pour accéder à l'intégralité de nos tarifs B2B.",
      "en": "You can create a professional account from our Login / Registration page to access all our B2B prices.",
      "de": "Sie können auf unserer Anmelde-/Registrierungsseite ein professionelles Konto erstellen, um auf alle unsere B2B-Preise zuzugreifen.",
      "nl": "U kunt een professioneel account aanmaken via onze Inlog- / Registratiepagina om toegang te krijgen tot al onze B2B-prijzen."
    }
  },
  {
    "id": "q8",
    "question": {
      "fr": "Dans quels pays êtes-vous implantés ?",
      "en": "In which countries are you located?",
      "de": "In welchen Ländern sind Sie vertreten?",
      "nl": "In welke landen bent u gevestigd?"
    },
    "answer": {
      "fr": "Notre réseau d'approvisionnement B2B est implanté dans 8 pays en Europe, notamment la Pologne, la Lettonie, la Lituanie, la Roumanie, la Tchéquie, la Croatie, la Bosnie et la France.",
      "en": "Our B2B supply network is located in 8 European countries, including Poland, Latvia, Lithuania, Romania, Czechia, Croatia, Bosnia, and France.",
      "de": "Unser B2B-Versorgungsnetzwerk befindet sich in 8 europäischen Ländern, darunter Polen, Lettland, Litauen, Rumänien, Tschechien, Kroatien, Bosnien und Frankreich.",
      "nl": "Ons B2B-leveringsnetwerk is gevestigd in 8 Europese landen, waaronder Polen, Letland, Litouwen, Roemenië, Tsjechië, Kroatië, Bosnië en Frankrijk."
    }
  },
  {
    "id": "q9",
    "question": {
      "fr": "Combien de villes desservez-vous depuis vos dépôts ?",
      "en": "How many cities do you serve from your depots?",
      "de": "Wie viele Städte bedienen Sie von Ihren Depots aus?",
      "nl": "Hoeveel steden bedient u vanuit uw depots?"
    },
    "answer": {
      "fr": "Nous opérons depuis 24 villes d'Europe pour garantir une logistique d'approvisionnement rapide et efficace.",
      "en": "We operate from 24 European cities to ensure fast and efficient supply logistics.",
      "de": "Wir operieren von 24 europäischen Städten aus, um eine schnelle und effiziente Versorgungslogistik zu gewährleisten.",
      "nl": "Wij opereren vanuit 24 Europese steden om een snelle en efficiënte leveringslogistiek te garanderen."
    }
  },
  {
    "id": "q10",
    "question": {
      "fr": "Quels produits proposez-vous en gros ?",
      "en": "What products do you offer wholesale?",
      "de": "Welche Produkte bieten Sie im Großhandel an?",
      "nl": "Welke producten biedt u groothandel aan?"
    },
    "answer": {
      "fr": "Nous proposons 5 gammes professionnelles : bûches de bois, bûches compressées, briquettes, granulés/pellets, ainsi que du charbon et allume-feu.",
      "en": "We offer 5 professional ranges: firewood logs, compressed logs, briquettes, wood pellets, as well as charcoal and kindling.",
      "de": "Wir bieten 5 professionelle Sortimente an: Brennholz, Holzbriketts, Briketts, Holzpellets sowie Holzkohle und Anzünder.",
      "nl": "Wij bieden 5 professionele assortimenten aan: brandhout, houtbriketten, briketten, houtpellets, evenals houtskool en aanmaakblokjes."
    }
  },
  {
    "id": "q11",
    "question": {
      "fr": "Puis-je commander au détail ?",
      "en": "Can I order retail?",
      "de": "Kann ich im Einzelhandel bestellen?",
      "nl": "Kan ik particulier bestellen?"
    },
    "answer": {
      "fr": "Non, en tant que grossiste, nous vendons uniquement par palettes entières ou par camions complets pour les professionnels.",
      "en": "No, as a wholesaler, we only sell by full pallets or full trucks for professionals.",
      "de": "Nein, als Großhändler verkaufen wir nur in ganzen Paletten oder kompletten LKWs an Profis.",
      "nl": "Nee, als groothandel verkopen wij alleen per volle pallet of volle vrachtwagen aan professionals."
    }
  },
  {
    "id": "q12",
    "question": {
      "fr": "Où puis-je consulter vos Conditions Générales de Vente ?",
      "en": "Where can I consult your General Terms and Conditions of Sale?",
      "de": "Wo kann ich Ihre Allgemeinen Geschäftsbedingungen einsehen?",
      "nl": "Waar kan ik uw Algemene Verkoopvoorwaarden raadplegen?"
    },
    "answer": {
      "fr": "Nos CGV sont accessibles à tout moment via le lien situé dans le pied de page du site.",
      "en": "Our General Terms and Conditions are accessible at any time via the link located in the footer of the site.",
      "de": "Unsere Allgemeinen Geschäftsbedingungen sind jederzeit über den Link in der Fußzeile der Website zugänglich.",
      "nl": "Onze Algemene Voorwaarden zijn te allen tijde toegankelijk via de link in de voettekst van de website."
    }
  },
  {
    "id": "q13",
    "question": {
      "fr": "Que faire en cas de non-conformité de la livraison ?",
      "en": "What to do in case of non-compliance of the delivery?",
      "de": "Was tun bei Nichtübereinstimmung der Lieferung?",
      "nl": "Wat te doen bij niet-naleving van de levering?"
    },
    "answer": {
      "fr": "Veuillez consulter notre Politique de Retour B2B pour connaître la procédure exacte de gestion des retours et de garantie de conformité.",
      "en": "Please refer to our B2B Return Policy for the exact procedure regarding returns and compliance warranty.",
      "de": "Bitte konsultieren Sie unsere B2B-Rückgaberichtlinien, um das genaue Verfahren zur Rückgabe und Konformitätsgarantie zu erfahren.",
      "nl": "Raadpleeg ons B2B Retourbeleid voor de exacte procedure met betrekking tot retouren en conformiteitsgarantie."
    }
  },
  {
    "id": "q14",
    "question": {
      "fr": "Vos prix incluent-ils la livraison ?",
      "en": "Do your prices include delivery?",
      "de": "Beinhalten Ihre Preise die Lieferung?",
      "nl": "Zijn uw prijzen inclusief levering?"
    },
    "answer": {
      "fr": "La logistique peut varier selon les volumes et l'adresse. Nous vous invitons à générer un devis ou consulter votre panier pour obtenir une tarification précise du transport.",
      "en": "Logistics can vary based on volume and address. We invite you to generate a quote or check your cart to get accurate transport pricing.",
      "de": "Die Logistik kann je nach Volumen und Adresse variieren. Wir laden Sie ein, ein Angebot zu erstellen oder Ihren Warenkorb zu überprüfen, um eine genaue Transportpreisgestaltung zu erhalten.",
      "nl": "Logistiek kan variëren op basis van volume en adres. Wij nodigen u uit om een offerte te genereren of uw winkelwagen te controleren voor nauwkeurige transportprijzen."
    }
  },
  {
    "id": "q15",
    "question": {
      "fr": "Fournissez-vous des informations techniques sur les produits ?",
      "en": "Do you provide technical information on products?",
      "de": "Bieten Sie technische Informationen zu Produkten an?",
      "nl": "Biedt u technische informatie over producten?"
    },
    "answer": {
      "fr": "Oui, chaque page produit détaille l'essence, le pouvoir calorifique, le format, le taux d'humidité et les spécificités de conditionnement.",
      "en": "Yes, each product page details the wood species, calorific value, format, moisture content, and packaging specifics.",
      "de": "Ja, jede Produktseite enthält Details zu Holzart, Heizwert, Format, Feuchtigkeitsgehalt und Verpackungsspezifikationen.",
      "nl": "Ja, elke productpagina beschrijft de houtsoort, calorische waarde, formaat, vochtgehalte en verpakkingsspecificaties."
    }
  },
  {
    "id": "q16",
    "question": {
      "fr": "Proposez-vous du bois mi-sec ?",
      "en": "Do you offer semi-dry wood?",
      "de": "Bieten Sie halbtrockenes Holz an?",
      "nl": "Biedt u halfdroog hout aan?"
    },
    "answer": {
      "fr": "Oui, notre catalogue comprend plusieurs niveaux de séchage (étuvé, sec à l'air, demi-sec) pour s'adapter à tous vos besoins.",
      "en": "Yes, our catalog includes several drying levels (kiln-dried, air-dried, semi-dry) to suit all your needs.",
      "de": "Ja, unser Katalog umfasst mehrere Trocknungsstufen (ofengetrocknet, luftgetrocknet, halbtrocken), um allen Ihren Bedürfnissen gerecht zu werden.",
      "nl": "Ja, onze catalogus bevat verschillende drogingsniveaus (ovengedroogd, luchtgedroogd, halfdroog) om aan al uw behoeften te voldoen."
    }
  },
  {
    "id": "q17",
    "question": {
      "fr": "Comment puis-je suivre l'état de ma commande ?",
      "en": "How can I track my order status?",
      "de": "Wie kann ich den Status meiner Bestellung verfolgen?",
      "nl": "Hoe kan ik de status van mijn bestelling volgen?"
    },
    "answer": {
      "fr": "Une fois connecté à votre Espace Client, vous avez accès au suivi complet de vos commandes en cours et passées.",
      "en": "Once logged into your Customer Space, you have access to full tracking of your current and past orders.",
      "de": "Sobald Sie in Ihrem Kundenbereich angemeldet sind, haben Sie vollen Zugriff auf die Verfolgung Ihrer aktuellen und vergangenen Bestellungen.",
      "nl": "Zodra u bent ingelogd in uw Klantenruimte, heeft u volledige toegang tot de tracering van uw huidige en eerdere bestellingen."
    }
  },
  {
    "id": "q18",
    "question": {
      "fr": "Y a-t-il des remises pour les très gros volumes ?",
      "en": "Are there discounts for very large volumes?",
      "de": "Gibt es Rabatte für sehr große Volumina?",
      "nl": "Zijn er kortingen voor zeer grote volumes?"
    },
    "answer": {
      "fr": "Oui, notre système applique une grille de remises dégressives en fonction du nombre de palettes commandées.",
      "en": "Yes, our system applies a sliding discount scale based on the number of pallets ordered.",
      "de": "Ja, unser System wendet eine degressive Rabattstaffel basierend auf der Anzahl der bestellten Paletten an.",
      "nl": "Ja, ons systeem past een glijdende kortingsschaal toe op basis van het aantal bestelde pallets."
    }
  },
  {
    "id": "q19",
    "question": {
      "fr": "Que faire si j'ai besoin d'informations commerciales supplémentaires ?",
      "en": "What if I need additional commercial information?",
      "de": "Was, wenn ich zusätzliche kommerzielle Informationen benötige?",
      "nl": "Wat als ik aanvullende commerciële informatie nodig heb?"
    },
    "answer": {
      "fr": "Notre équipe commerciale et nos conseillers thermiciens sont à votre disposition via la page Contact de notre site.",
      "en": "Our commercial team and heating advisors are at your disposal via the Contact page on our site.",
      "de": "Unser Verkaufsteam und unsere Heizberater stehen Ihnen über die Kontaktseite auf unserer Website zur Verfügung.",
      "nl": "Ons commerciële team en onze verwarmingsadviseurs staan tot uw beschikking via de Contactpagina op onze site."
    }
  },
  {
    "id": "q20",
    "question": {
      "fr": "Les données de mon entreprise sont-elles sécurisées ?",
      "en": "Is my company data secure?",
      "de": "Sind meine Unternehmensdaten sicher?",
      "nl": "Zijn mijn bedrijfsgegevens veilig?"
    },
    "answer": {
      "fr": "Absolument. Conformément à notre Politique de Confidentialité et au RGPD, toutes vos données professionnelles sont strictement protégées.",
      "en": "Absolutely. In accordance with our Privacy Policy and the GDPR, all your professional data is strictly protected.",
      "de": "Absolut. Gemäß unserer Datenschutzrichtlinie und der DSGVO werden alle Ihre beruflichen Daten streng geschützt.",
      "nl": "Absoluut. In overeenstemming met ons Privacybeleid en de AVG worden al uw professionele gegevens strikt beschermd."
    }
  }
];

fs.writeFileSync('data/faq.json', JSON.stringify(faqData, null, 2));
console.log('Created data/faq.json');
