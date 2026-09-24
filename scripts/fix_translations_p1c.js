const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '../data/i18n');
const fr = JSON.parse(fs.readFileSync(path.join(i18nDir, 'fr.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(i18nDir, 'en.json'), 'utf8'));
const de = JSON.parse(fs.readFileSync(path.join(i18nDir, 'de.json'), 'utf8'));
const nl = JSON.parse(fs.readFileSync(path.join(i18nDir, 'nl.json'), 'utf8'));

// recapitulatif_commande.le_rib_de_conteneur_pro_vous_s
fr.recapitulatif_commande.le_rib_de_conteneur_pro_vous_s = fr.recapitulatif_commande.le_rib_de_conteneur_pro_vous_s.replace('Conteneur Pro', 'sotramsbois');
en.recapitulatif_commande.le_rib_de_conteneur_pro_vous_s = "The sotramsbois bank details will be sent immediately after validation. Order processed upon receipt of funds (24-48h).";
de.recapitulatif_commande.le_rib_de_conteneur_pro_vous_s = "Die Bankverbindung von sotramsbois wird Ihnen unmittelbar nach der Bestätigung mitgeteilt. Ihre Bestellung wird nach Eingang der Gelder bearbeitet (in der Regel 24-48h).";
nl.recapitulatif_commande.le_rib_de_conteneur_pro_vous_s = "De bankgegevens van sotramsbois worden direct na validatie verstrekt. Uw bestelling wordt verwerkt na ontvangst van de gelden (doorgaans 24-48 uur).";

// contact.notre_quipe_dexperts_en_biomas (DE, NL)
de.contact.notre_quipe_dexperts_en_biomas = "Unser Expertenteam für Biomasse steht Ihnen zur Verfügung, um Sie bei der Wahl des besten Brennstoffs für Ihren industriellen oder gewerblichen Bedarf zu beraten.";
nl.contact.notre_quipe_dexperts_en_biomas = "Ons team van biomassa-experts staat klaar om u te adviseren over de beste brandstof voor uw industriële of zakelijke behoeften.";

// contact.jaccepte_que_les_informations_ (DE, NL)
de.contact.jaccepte_que_les_informations_ = "Ich stimme zu, dass die eingegebenen Informationen im Rahmen der Kontaktanfrage und der daraus resultierenden Geschäftsbeziehung verwendet werden.";
nl.contact.jaccepte_que_les_informations_ = "Ik ga ermee akkoord dat de ingevoerde informatie wordt gebruikt in het kader van het contactverzoek en de daaruit voortvloeiende zakelijke relatie.";

// produit.bois_sec_premium_prt__lemploi_ (DE, NL)
de.produit.bois_sec_premium_prt__lemploi_ = "Trockenes Premium-Holz, gebrauchsfertig. Zertifizierte Feuchtigkeit < 20%. Ideal für Wiederverkäufer oder intensive professionelle Nutzung.";
nl.produit.bois_sec_premium_prt__lemploi_ = "Droog premium hout, klaar voor gebruik. Gecertificeerde vochtigheid < 20%. Ideaal voor wederverkopers of intensief professioneel gebruik.";

// activation.accdez__vos_grilles_tarifaires (DE, NL)
de.activation.accdez__vos_grilles_tarifaires = "Greifen Sie auf Ihre ausgehandelten Preislisten zu, verfolgen Sie Ihre Hochleistungs-Holzlieferungen in Echtzeit und verwalten Sie Ihre Großbestellungen ganz einfach.";
nl.activation.accdez__vos_grilles_tarifaires = "Krijg toegang tot uw onderhandelde prijslijsten, volg uw leveringen van hoogwaardig hout in realtime en beheer eenvoudig uw bulkbestellingen.";

// connexion.accdez__vos_grilles_tarifaires (DE, NL)
de.connexion.accdez__vos_grilles_tarifaires = "Greifen Sie auf Ihre ausgehandelten Preislisten zu, verfolgen Sie Ihre Hochleistungs-Holzlieferungen in Echtzeit und verwalten Sie Ihre Großbestellungen ganz einfach.";
nl.connexion.accdez__vos_grilles_tarifaires = "Krijg toegang tot uw onderhandelde prijslijsten, volg uw leveringen van hoogwaardig hout in realtime en beheer eenvoudig uw bulkbestellingen.";

// guide_choix.bon_pouvoir_calorifique_mais_c (EN, DE, NL)
en.guide_choix.bon_pouvoir_calorifique_mais_c = "Good calorific value but faster combustion. Easy to split and ignite. Note: chestnut tends to crackle and throw sparks, it strictly requires a closed fireplace. Very useful for quickly boosting temperature.";
de.guide_choix.bon_pouvoir_calorifique_mais_c = "Guter Heizwert, aber schnellere Verbrennung. Leicht zu spalten und zu entzünden. Achtung: Kastanie neigt zum Knistern und Funkenflug, erfordert zwingend einen geschlossenen Kamin. Sehr nützlich für schnelle Temperatursteigerungen.";
nl.guide_choix.bon_pouvoir_calorifique_mais_c = "Goede calorische waarde maar snellere verbranding. Makkelijk te splijten en aan te steken. Let op: kastanje neigt te knetteren en vonken af te geven, een gesloten haard is absoluut noodzakelijk. Zeer nuttig voor snelle temperatuurverhogingen.";

// guide_choix.montent_trs_vite_en_temprature (EN, DE, NL)
en.guide_choix.montent_trs_vite_en_temprature = "Very fast temperature rise. Ideal for lighting a fire or for ovens requiring a rapid heat-up. However, their resin tends to quickly clog the flues. Use sparingly or well mixed.";
de.guide_choix.montent_trs_vite_en_temprature = "Sehr schneller Temperaturanstieg. Ideal zum Anzünden oder für Öfen, die ein extrem schnelles Aufheizen erfordern. Ihr Harz neigt jedoch dazu, die Abzüge schnell zu verstopfen. Sparsam oder gut gemischt verwenden.";
nl.guide_choix.montent_trs_vite_en_temprature = "Zeer snelle temperatuurstijging. Ideaal voor het aansteken van een vuur of voor ovens die een snelle opwarming vereisen. Hun hars heeft echter de neiging de rookkanalen snel te verstoppen. Spaarzaam of goed gemengd gebruiken.";

// avis_clients.avis_client__ajouter__emplacem (DE, NL)
de.avis_clients.avis_client__ajouter__emplacem = "[Kundenbewertung hinzuzufügen — Platzhalter für echte professionelle Erfahrungsberichte]";
nl.avis_clients.avis_client__ajouter__emplacem = "[Klantbeoordeling toe te voegen — Gereserveerde ruimte voor echte professionele getuigenissen]";

// devis.ph_prcisions_sur_laccs_horaires_d (DE, NL)
de.devis.ph_prcisions_sur_laccs_horaires_d = "Details zur Zufahrt, Empfangszeiten, spezifische Einschränkungen...";
nl.devis.ph_prcisions_sur_laccs_horaires_d = "Details over toegang, ontvangsttijden, specifieke beperkingen...";

// livraison.le_transpalette_manuel_ncessit (NL only)
nl.livraison.le_transpalette_manuel_ncessit = "De handmatige palletwagen vereist een harde, vlakke ondergrond (beton, asfalt). Lossen op grind, aarde of steile hellingen vereist voorafgaande specifieke goedkeuring (optie voor meeneemheftruck).";

// avis_clients.dcouvrez_pourquoi_plus_de_1_00 (NL only)
nl.avis_clients.dcouvrez_pourquoi_plus_de_1_00 = "Ontdek waarom meer dan 1.000 horecaprofessionals, bakkers en industriële bedrijven vertrouwen op sotramsbois voor hun energievoorziening.";

// devis.obtenez_une_tarification_sur-m (NL only)
nl.devis["obtenez_une_tarification_sur-m"] = "Ontvang een prijsopgave op maat voor uw volumes biomassa en professioneel brandhout. Ons logistieke team streeft ernaar om u binnen 24 uur een optimaal leveringsplan te bezorgen.";

// contact.charbon__allume-feu__bches_de_ (DE, NL)
de.contact["charbon__allume-feu__bches_de_"] = "Kohle / Anzündholz / Fackelhölzer";
nl.contact["charbon__allume-feu__bches_de_"] = "Steenkool / Aanmaakblokjes / Fakkelhoutblokken";

// produit._20_schoir
en.produit._20_schoir = "< 20% (kiln-dried)";
de.produit._20_schoir = "< 20% (ofengetrocknet)";
nl.produit._20_schoir = "< 20% (ovengedroogd)";

fs.writeFileSync(path.join(i18nDir, 'fr.json'), JSON.stringify(fr, null, 2));
fs.writeFileSync(path.join(i18nDir, 'en.json'), JSON.stringify(en, null, 2));
fs.writeFileSync(path.join(i18nDir, 'de.json'), JSON.stringify(de, null, 2));
fs.writeFileSync(path.join(i18nDir, 'nl.json'), JSON.stringify(nl, null, 2));
console.log('Fixed translations');
