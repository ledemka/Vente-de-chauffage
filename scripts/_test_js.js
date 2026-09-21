const fs = require('fs');
const path = require('path');
const ROOT = path.resolve('.');

const translations = {
    fr: {
        legal_label: 'Juridique &amp; Conformite',
        page_title: 'Conditions Generales de Vente',
        toc_title: 'Sommaire',
        b2b_title: 'Service B2B',
        b2b_desc: 'Pour toute question concernant nos conditions de vente en gros, contactez votre charge de compte.',
        art1_title: "Article 1 - Objet et Champ d'Application",
        art1_p1: "Les presentes Conditions Generales de Vente (CGV) constituent le socle de la negociation commerciale et sont systematiquement adressees ou remises a chaque acheteur pour lui permettre de passer commande.",
        art1_info: "sotramsbois se reserve le droit de deroger a certaines clauses des presentes CGV, en fonction des negociations menees avec l'acheteur, par l'etablissement de Conditions Particulieres de Vente.",
        art2_title: 'Article 2 - Caracteristiques des Produits',
        art2_p1: 'Les produits proposes a la vente sont ceux figurant sur le catalogue B2B de sotramsbois au jour de la consultation.',
        moisture_label: "TAUX D'HUMIDITE GARANTI",
        species_label: 'ESSENCES',
        species_value: 'Chene, Hetre, Charme',
    },
};
console.log('test ok');
