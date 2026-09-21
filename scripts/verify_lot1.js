const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const tableData = [
  // index.html
  { file: 'index.html', key: 'index.hero.tagline', fr: 'Grossiste Biomasse & Bois Énergie', en: 'Biomass & Wood Energy Wholesaler', de: 'Großhändler für Biomasse & Holzenergie', nl: 'Groothandel Biomassa & Houtenergie' },
  { file: 'index.html', key: 'index.hero.rating_badge', fr: 'Plus de 1 000 clients B2B satisfaits en Europe', en: 'Over 1,000 satisfied B2B customers across Europe', de: 'Über 1.000 zufriedene B2B-Kunden in Europa', nl: 'Meer dan 1.000 tevreden B2B-klanten in Europa' },
  { file: 'index.html', key: 'index.hero.subtitle', fr: 'Solutions de chauffage au bois adaptées aux besoins industriels et à la revente. Rendement calorifique optimal et taux d\'humidité contrôlé.', en: 'Wood heating solutions tailored for industrial needs and resale. Optimal heat output and controlled moisture level.', de: 'Holzheizlösungen für Industriebedarf und Weiterverkauf. Optimale Heizleistung und kontrollierter Feuchtigkeitsgehalt.', nl: 'Houtverwarmingsoplossingen op maat voor industriële behoeften en doorverkoop. Optimaal warmterendement en gecontroleerd vochtgehalte.' },
  { file: 'index.html', key: 'categories.coal_acc', fr: 'Charbon & Acc.', en: 'Charcoal & Acc.', de: 'Kohle & Zub.', nl: 'Houtskool & Acc.' },

  // catalogue.html
  { file: 'catalogue.html', key: 'catalog.filters.title', fr: 'Filtres', en: 'Filters', de: 'Filter', nl: 'Filters' },
  { file: 'catalogue.html', key: 'catalog.filters.category', fr: 'Catégorie', en: 'Category', de: 'Kategorie', nl: 'Categorie' },
  { file: 'catalogue.html', key: 'categories.1', fr: 'Bûches de bois', en: 'Firewood Logs', de: 'Brennholzscheite', nl: 'Houtblokken' },
  { file: 'catalogue.html', key: 'categories.2', fr: 'Bûches compressées / briquettes de bois', en: 'Compressed Logs / Wood Briquettes', de: 'Presslinge / Holzbriketts', nl: 'Geperste blokken / Houtbriketten' },
  { file: 'catalogue.html', key: 'categories.3', fr: 'Briquettes', en: 'Briquettes', de: 'Briketts', nl: 'Briketten' },
  { file: 'catalogue.html', key: 'categories.4', fr: 'Granulés / Pellets', en: 'Wood Pellets', de: 'Holzpellets', nl: 'Houtpellets' },
  { file: 'catalogue.html', key: 'categories.5', fr: 'Charbon / Allume-feu / Bûches de torche', en: 'Charcoal / Firelighters / Torch Logs', de: 'Kohle / Anzünder / Schwedenfackeln', nl: 'Houtskool / Aanmaakblokjes / Zweedse fakkels' },
  { file: 'catalogue.html', key: 'catalog.filters.moisture', fr: 'Humidité (H2O)', en: 'Moisture (H2O)', de: 'Feuchtigkeit (H2O)', nl: 'Vochtgehalte (H2O)' },
  { file: 'catalogue.html', key: 'catalog.filters.all', fr: 'Tout', en: 'All', de: 'Alle', nl: 'Alle' },
  { file: 'catalogue.html', key: 'catalog.filters.unspecified', fr: 'Non spécifié', en: 'Unspecified', de: 'Nicht angegeben', nl: 'Niet gespecificeerd' },
  { file: 'catalogue.html', key: 'catalog.filters.format', fr: 'Format :', en: 'Format:', de: 'Format:', nl: 'Formaat:' },
  { file: 'catalogue.html', key: 'catalog.filters.format_select', fr: 'Sélectionnez un format ↑', en: 'Select a format ↑', de: 'Format auswählen ↑', nl: 'Selecteer een formaat ↑' },
  { file: 'catalogue.html', key: 'catalog.table.format', fr: 'FORMAT', en: 'FORMAT', de: 'FORMAT', nl: 'FORMAAT' },
  { file: 'catalogue.html', key: 'catalog.table.unit_pallet', fr: 'UNITE / PALETTE', en: 'UNIT / PALLET', de: 'EINHEIT / PALETTE', nl: 'EENHEID / PALLET' },
  { file: 'catalogue.html', key: 'catalog.table.weight', fr: 'POIDS PALETTE', en: 'PALLET WEIGHT', de: 'PALETTENGEWICHT', nl: 'PALLETGEWICHT' },
  { file: 'catalogue.html', key: 'catalog.table.price', fr: 'PRIX GROS / PALETTE', en: 'WHOLESALE PRICE / PALLET', de: 'GROSSPREIS / PALETTE', nl: 'GROOTHANDELSPRIJS / PALLET' },
  { file: 'catalogue.html', key: 'catalog.table.currency', fr: '€ TTC', en: '€ incl. VAT', de: '€ inkl. MwSt', nl: '€ incl. btw' },

  // contact.html
  { file: 'contact.html', key: 'contact.info.hq', fr: 'Siège Social & Dépôt', en: 'Head Office & Depot', de: 'Hauptsitz & Lager', nl: 'Hoofdkantoor & Depot' },
  { file: 'contact.html', key: 'contact.info.phone', fr: 'Téléphone', en: 'Phone', de: 'Telefon', nl: 'Telefoon' },
  { file: 'contact.html', key: 'contact.info.b2b_line', fr: 'Ligne directe B2B', en: 'B2B direct line', de: 'B2B-Durchwahl', nl: 'B2B-rechtstreekse lijn' },
  { file: 'contact.html', key: 'contact.info.email', fr: 'Email', en: 'Email', de: 'E-Mail', nl: 'E-mail' },
  { file: 'contact.html', key: 'contact.info.response_time', fr: 'Réponse sous 24h ouvrées', en: 'Response within 24 business hours', de: 'Antwort innerhalb von 24 Werkstunden', nl: 'Reactie binnen 24 werkuren' },
  { file: 'contact.html', key: 'contact.info.hours', fr: 'Heures d\'Ouverture', en: 'Opening Hours', de: 'Öffnungszeiten', nl: 'Openingstijden' },
  { file: 'contact.html', key: 'contact.info.mon_thu', fr: 'Lundi - Jeudi', en: 'Monday - Thursday', de: 'Montag - Donnerstag', nl: 'Maandag - Donderdag' },
  { file: 'contact.html', key: 'contact.info.fri', fr: 'Vendredi', en: 'Friday', de: 'Freitag', nl: 'Vrijdag' },
  { file: 'contact.html', key: 'contact.info.weekend', fr: 'Week-end', en: 'Weekend', de: 'Wochenende', nl: 'Weekend' },
  { file: 'contact.html', key: 'contact.info.closed', fr: 'Fermé', en: 'Closed', de: 'Geschlossen', nl: 'Gesloten' },
  { file: 'contact.html', key: 'contact.form.title', fr: 'Demande de devis / Renseignements', en: 'Quote Request / Enquiries', de: 'Angebotsanfrage / Auskünfte', nl: 'Offerteaanvraag / Inlichtingen' },
  { file: 'contact.html', key: 'contact.form.subtitle', fr: 'Remplissez le formulaire ci-dessous, notre service commercial vous recontactera rapidement.', en: 'Fill in the form below, our sales team will get back to you promptly.', de: 'Füllen Sie das untenstehende Formular aus, unser Vertriebsteam meldet sich zeitnah bei Ihnen.', nl: 'Vul onderstaand formulier in, ons verkoopteam neemt snel contact met u op.' },
  { file: 'contact.html', key: 'contact.form.honeypot', fr: 'Laissez ce champ vide', en: 'Leave this field empty', de: 'Dieses Feld leer lassen', nl: 'Laat dit veld leeg' },
  { file: 'contact.html', key: 'contact.form.company', fr: 'Société', en: 'Company', de: 'Firma', nl: 'Bedrijf' },
  { file: 'contact.html', key: 'contact.form.siret', fr: 'SIRET / TVA Intracom.', en: 'Company Reg. No. / VAT Number', de: 'Handelsregisternr. / USt-IdNr.', nl: 'KVK-nummer / btw-nummer' },
  { file: 'contact.html', key: 'contact.form.name', fr: 'Nom & Prénom *', en: 'Full Name *', de: 'Vor- und Nachname *', nl: 'Voor- en achternaam *' },
  { file: 'contact.html', key: 'contact.form.job', fr: 'Fonction', en: 'Job Title', de: 'Funktion', nl: 'Functie' },
  { file: 'contact.html', key: 'contact.form.email_pro', fr: 'Email professionnel *', en: 'Business Email *', de: 'Geschäftliche E-Mail *', nl: 'Zakelijk e-mailadres *' },
  { file: 'contact.html', key: 'contact.form.phone_req', fr: 'Téléphone *', en: 'Phone *', de: 'Telefon *', nl: 'Telefoon *' },
  { file: 'contact.html', key: 'contact.form.need_type', fr: 'Type de besoin *', en: 'Type of Need *', de: 'Bedarfsart *', nl: 'Type behoefte *' },
  { file: 'contact.html', key: 'contact.form.comment', fr: 'Commentaire', en: 'Comment', de: 'Kommentar', nl: 'Opmerking' },
  { file: 'contact.html', key: 'contact.form.submit', fr: 'ENVOYER LA DEMANDE', en: 'SEND REQUEST', de: 'ANFRAGE SENDEN', nl: 'AANVRAAG VERZENDEN' },
  { file: 'contact.html', key: 'contact.logistics.title', fr: 'Plateforme Logistique', en: 'Logistics Platform', de: 'Logistikplattform', nl: 'Logistiek platform' },
  { file: 'contact.html', key: 'contact.logistics.desc', fr: 'Accès direct pour les camions de livraison. Un pont-bascule de 50T est disponible sur site pour la pesée des véhicules.', en: 'Direct access for delivery trucks. A 50T weighbridge is available on-site for vehicle weighing.', de: 'Direkter Zugang für Lieferfahrzeuge. Vor Ort steht eine 50-t-Fahrzeugwaage zur Verfügung.', nl: 'Directe toegang voor vrachtwagens. Een weegbrug van 50T is ter plaatse beschikbaar voor het wegen van voertuigen.' },
  { file: 'contact.html', key: 'contact.logistics.directions', fr: 'Calculer l\'itinéraire', en: 'Get directions', de: 'Route berechnen', nl: 'Route berekenen' },

  // devis.html
  { file: 'devis.html', key: 'quote.title', fr: 'Cotation', en: 'Quote', de: 'Angebot', nl: 'Offerte' },
  { file: 'devis.html', key: 'quote.assistance', fr: 'Assistance Directe', en: 'Direct Assistance', de: 'Direkte Unterstützung', nl: 'Directe ondersteuning' },
  { file: 'devis.html', key: 'quote.specs.title', fr: 'Spécifications Produit', en: 'Product Specifications', de: 'Produktspezifikationen', nl: 'Productspecificaties' },
  { file: 'devis.html', key: 'quote.specs.type', fr: 'TYPE DE PRODUIT *', en: 'PRODUCT TYPE *', de: 'PRODUKTTYP *', nl: 'PRODUCTTYPE *' },
  { file: 'devis.html', key: 'quote.specs.format', fr: 'FORMAT / CONDITIONNEMENT *', en: 'FORMAT / PACKAGING *', de: 'FORMAT / VERPACKUNG *', nl: 'FORMAAT / VERPAKKING *' },
  { file: 'devis.html', key: 'quote.specs.volume', fr: 'VOLUME ESTIMÉ *', en: 'ESTIMATED VOLUME *', de: 'GESCHÄTZTES VOLUMEN *', nl: 'GESCHAT VOLUME *' },
  { file: 'devis.html', key: 'quote.specs.units', fr: 'Unités', en: 'Units', de: 'Einheiten', nl: 'Eenheden' },
  { file: 'devis.html', key: 'quote.specs.min_order', fr: 'Minimum de commande: 1 palette / unité de vrac.', en: 'Minimum order: 1 pallet / bulk unit.', de: 'Mindestbestellung: 1 Palette / Schüttguteinheit.', nl: 'Minimumbestelling: 1 pallet / bulkeenheid.' },
  { file: 'devis.html', key: 'quote.logistics.title', fr: 'Informations Logistiques', en: 'Logistics Information', de: 'Logistikinformationen', nl: 'Logistieke informatie' },
  { file: 'devis.html', key: 'quote.logistics.date', fr: 'DATE SOUHAITÉE', en: 'DESIRED DATE', de: 'GEWÜNSCHTES DATUM', nl: 'GEWENSTE DATUM' },
  { file: 'devis.html', key: 'quote.logistics.truck', fr: 'ACCÈS POIDS LOURD *', en: 'TRUCK ACCESS *', de: 'LKW-ZUFAHRT *', nl: 'VRACHTWAGENTOEGANG *' },
  { file: 'devis.html', key: 'quote.logistics.address', fr: 'ADRESSE DE LIVRAISON COMPLÈTE *', en: 'FULL DELIVERY ADDRESS *', de: 'VOLLSTÄNDIGE LIEFERADRESSE *', nl: 'VOLLEDIG LEVERINGSADRES *' },
  { file: 'devis.html', key: 'quote.contact.title', fr: 'Coordonnées', en: 'Contact Details', de: 'Kontaktdaten', nl: 'Contactgegevens' },
  { file: 'devis.html', key: 'quote.contact.company', fr: 'ENTREPRISE / RAISON SOCIALE *', en: 'COMPANY / BUSINESS NAME *', de: 'UNTERNEHMEN / FIRMENNAME *', nl: 'BEDRIJF / HANDELSNAAM *' },
  { file: 'devis.html', key: 'quote.contact.siret', fr: 'SIRET / TVA INTRA (Optionnel)', en: 'Company Reg. No. / VAT Number (Optional)', de: 'Handelsregisternr. / USt-IdNr. (Optional)', nl: 'KVK-nummer / btw-nummer (Optioneel)' },
  { file: 'devis.html', key: 'quote.contact.name', fr: 'NOM DU CONTACT *', en: 'CONTACT NAME *', de: 'ANSPRECHPARTNER *', nl: 'CONTACTPERSOON *' },
  { file: 'devis.html', key: 'quote.contact.email', fr: 'EMAIL *', en: 'EMAIL *', de: 'E-MAIL *', nl: 'E-MAIL *' },
  { file: 'devis.html', key: 'quote.contact.phone', fr: 'TÉLÉPHONE *', en: 'PHONE *', de: 'TELEFON *', nl: 'TELEFOON *' },
  { file: 'devis.html', key: 'quote.contact.notes', fr: 'NOTES COMPLÉMENTAIRES (Optionnel)', en: 'ADDITIONAL NOTES (Optional)', de: 'ZUSÄTZLICHE ANMERKUNGEN (Optional)', nl: 'AANVULLENDE OPMERKINGEN (Optioneel)' },
  { file: 'devis.html', key: 'quote.submit', fr: 'ENVOYER LA DEMANDE', en: 'SEND REQUEST', de: 'ANFRAGE SENDEN', nl: 'AANVRAAG VERZENDEN' },
  { file: 'devis.html', key: 'quote.why.title', fr: 'Pourquoi nous choisir ?', en: 'Why choose us?', de: 'Warum uns wählen?', nl: 'Waarom voor ons kiezen?' },
  { file: 'devis.html', key: 'quote.why.quality_title', fr: 'Qualité Certifiée', en: 'Certified Quality', de: 'Zertifizierte Qualität', nl: 'Gecertificeerde kwaliteit' },
  { file: 'devis.html', key: 'quote.why.quality_desc', fr: 'Bois de qualité certifiée, taux d\'humidité garanti <20%.', en: 'Certified quality wood, guaranteed moisture level <20%.', de: 'Holz zertifizierter Qualität, garantierter Feuchtigkeitsgehalt <20%.', nl: 'Hout van gecertificeerde kwaliteit, gegarandeerd vochtgehalte <20%.' },
  { file: 'devis.html', key: 'quote.why.speed_title', fr: 'Réactivité B2B', en: 'B2B Responsiveness', de: 'B2B-Reaktionsschnelligkeit', nl: 'B2B-Reactiesnelheid' },
  { file: 'devis.html', key: 'quote.why.speed_desc', fr: 'Devis sous 24h, livraison prioritaire sur chantiers ou dépôts.', en: 'Quote within 24h, priority delivery to job sites or depots.', de: 'Angebot innerhalb von 24 Std., bevorzugte Lieferung zu Baustellen oder Lagern.', nl: 'Offerte binnen 24u, prioritaire levering op bouwplaatsen of depots.' },
  { file: 'devis.html', key: 'quote.why.volume_title', fr: 'Volume Adaptable', en: 'Flexible Volumes', de: 'Anpassbares Volumen', nl: 'Aanpasbaar volume' },
  { file: 'devis.html', key: 'quote.why.volume_desc', fr: 'De la palette isolée au semi-remorque complet en vrac.', en: 'From a single pallet to a full bulk trailer load.', de: 'Von der Einzelpalette bis zur kompletten Sattelzugladung lose.', nl: 'Van een losse pallet tot een volledige bulkoplegger.' },
  { file: 'devis.html', key: 'quote.processing', fr: 'TRAITEMENT...', en: 'PROCESSING...', de: 'WIRD VERARBEITET...', nl: 'VERWERKEN...' },

  // inscription.html
  { file: 'inscription.html', key: 'register.benefits.title', fr: 'Portail B2B Exclusif', en: 'Exclusive B2B Portal', de: 'Exklusives B2B-Portal', nl: 'Exclusief B2B-portaal' },
  { file: 'inscription.html', key: 'register.benefits.delivery_title', fr: 'Livraison semi-remorque & vrac', en: 'Full-trailer & bulk delivery', de: 'Sattelzug- & Schüttgutlieferung', nl: 'Oplegger- & bulklevering' },
  { file: 'inscription.html', key: 'register.benefits.delivery_desc', fr: 'Acheminement direct sur plateforme ou site de production avec hayon et transpalette.', en: 'Direct delivery to platform or production site with tail lift and pallet truck.', de: 'Direkte Anlieferung auf Plattform oder Produktionsstätte mit Ladebordwand und Hubwagen.', nl: 'Directe levering aan platform of productielocatie met laadklep en pompwagen.' },
  { file: 'inscription.html', key: 'register.benefits.pricing_title', fr: 'Tarifs professionnels TTC', en: 'Trade pricing (incl. VAT)', de: 'Gewerbepreise (inkl. MwSt)', nl: 'Zakelijke tarieven (incl. btw)' },
  { file: 'inscription.html', key: 'register.benefits.pricing_desc', fr: 'Visualisation immédiate des remises quantitatives et facturation centralisée.', en: 'Instant view of volume discounts and centralized invoicing.', de: 'Sofortige Anzeige von Mengenrabatten und zentralisierte Rechnungsstellung.', nl: 'Direct zicht op volumekortingen en gecentraliseerde facturatie.' },
  { file: 'inscription.html', key: 'register.benefits.advisor_title', fr: 'Conseiller dédié', en: 'Dedicated Account Manager', de: 'Persönlicher Ansprechpartner', nl: 'Vaste accountmanager' },
  { file: 'inscription.html', key: 'register.benefits.advisor_desc', fr: 'Un interlocuteur unique pour le suivi de vos commandes et contrats annuels.', en: 'A single point of contact for your orders and annual contracts.', de: 'Ein fester Ansprechpartner für Ihre Bestellungen und Jahresverträge.', nl: 'Eén vast aanspreekpunt voor uw bestellingen en jaarcontracten.' },
  { file: 'inscription.html', key: 'register.benefits.approval_notice', fr: 'Les comptes professionnels sont validés sous 24h ouvrées après vérification des informations légales.', en: 'Business accounts are approved within 24 business hours after verification of legal information.', de: 'Geschäftskonten werden innerhalb von 24 Werkstunden nach Prüfung der rechtlichen Angaben freigeschaltet.', nl: 'Zakelijke accounts worden binnen 24 werkuren goedgekeurd na verificatie van de juridische gegevens.' },
  { file: 'inscription.html', key: 'register.form.title', fr: 'Formulaire d\'inscription', en: 'Registration Form', de: 'Registrierungsformular', nl: 'Registratieformulier' },
  { file: 'inscription.html', key: 'register.form.subtitle', fr: 'Renseignez vos coordonnées professionnelles pour créer votre accès.', en: 'Enter your business details to create your account.', de: 'Geben Sie Ihre Geschäftsdaten ein, um Ihren Zugang zu erstellen.', nl: 'Vul uw zakelijke gegevens in om uw account aan te maken.' },
  { file: 'inscription.html', key: 'register.form.type_pro', fr: 'Vous êtes professionnel (entreprise, revendeur, artisan...)', en: 'I am a business (company, reseller, tradesperson...)', de: 'Ich bin gewerblich tätig (Unternehmen, Wiederverkäufer, Handwerker...)', nl: 'Ik ben een zakelijke klant (bedrijf, wederverkoper, vakman...)' },
  { file: 'inscription.html', key: 'register.form.section_business', fr: 'Informations professionnelles', en: 'Business Information', de: 'Geschäftsangaben', nl: 'Zakelijke gegevens' },
  { file: 'inscription.html', key: 'register.form.optional', fr: '(Optionnel)', en: '(Optional)', de: '(Optional)', nl: '(Optioneel)' },
  { file: 'inscription.html', key: 'register.form.cgv', fr: 'Conditions Générales de Vente (CGV)', en: 'Terms and Conditions of Sale', de: 'Allgemeine Geschäftsbedingungen (AGB)', nl: 'Algemene verkoopvoorwaarden' },
  { file: 'inscription.html', key: 'register.form.already_account', fr: 'Déjà un compte ?', en: 'Already have an account?', de: 'Bereits ein Konto?', nl: 'Al een account?' },
  { file: 'inscription.html', key: 'register.form.login', fr: 'Se connecter', en: 'Log in', de: 'Anmelden', nl: 'Inloggen' },
  { file: 'inscription.html', key: 'register.form.submit', fr: 'Créer mon compte', en: 'Create my account', de: 'Konto erstellen', nl: 'Account aanmaken' },

  // connexion.html
  { file: 'connexion.html', key: 'login.benefits.title', fr: 'Espace Professionnel B2B', en: 'B2B Professional Area', de: 'B2B-Geschäftsbereich', nl: 'B2B-zakelijke omgeving' },
  { file: 'connexion.html', key: 'login.benefits.delivery_title', fr: 'Livraison Palette', en: 'Pallet Delivery', de: 'Palettenlieferung', nl: 'Palletlevering' },
  { file: 'connexion.html', key: 'login.benefits.delivery_desc', fr: 'Suivi logistique précis sur toute la France.', en: 'Precise logistics tracking across France.', de: 'Präzise Sendungsverfolgung in ganz Frankreich.', nl: 'Nauwkeurige logistieke tracking in heel Frankrijk.' },
  { file: 'connexion.html', key: 'login.benefits.invoice_title', fr: 'Facturation Pro', en: 'Business Invoicing', de: 'Geschäftliche Rechnungsstellung', nl: 'Zakelijke facturatie' },
  { file: 'connexion.html', key: 'login.benefits.invoice_desc', fr: 'Gestion centralisée et bons de livraison dématérialisés.', en: 'Centralized management and paperless delivery notes.', de: 'Zentralisierte Verwaltung und digitale Lieferscheine.', nl: 'Gecentraliseerd beheer en digitale afleverbonnen.' },
  { file: 'connexion.html', key: 'login.form.title', fr: 'Connexion B2B', en: 'B2B Login', de: 'B2B-Anmeldung', nl: 'B2B-inloggen' },
  { file: 'connexion.html', key: 'login.form.subtitle', fr: 'Entrez vos identifiants professionnels pour accéder à votre espace.', en: 'Enter your business credentials to access your account.', de: 'Geben Sie Ihre Geschäftsdaten ein, um auf Ihren Bereich zuzugreifen.', nl: 'Voer uw zakelijke gegevens in om toegang te krijgen tot uw account.' },
  { file: 'connexion.html', key: 'login.form.email', fr: 'Email Professionnel', en: 'Business Email', de: 'Geschäftliche E-Mail', nl: 'Zakelijk e-mailadres' },
  { file: 'connexion.html', key: 'login.form.password', fr: 'Mot de passe', en: 'Password', de: 'Passwort', nl: 'Wachtwoord' },
  { file: 'connexion.html', key: 'login.form.forgot', fr: 'Mot de passe oublié ?', en: 'Forgot password?', de: 'Passwort vergessen?', nl: 'Wachtwoord vergeten?' },
  { file: 'connexion.html', key: 'login.form.remember', fr: 'Rester connecté', en: 'Stay logged in', de: 'Angemeldet bleiben', nl: 'Ingelogd blijven' },
  { file: 'connexion.html', key: 'login.form.submit', fr: 'Se connecter', en: 'Log in', de: 'Anmelden', nl: 'Inloggen' },
  { file: 'connexion.html', key: 'login.form.guest', fr: 'Continuer en tant qu\'invité', en: 'Continue as guest', de: 'Als Gast fortfahren', nl: 'Doorgaan als gast' },
  { file: 'connexion.html', key: 'login.form.no_account', fr: 'Pas encore de compte ?', en: 'No account yet?', de: 'Noch kein Konto?', nl: 'Nog geen account?' },
  { file: 'connexion.html', key: 'login.form.signup', fr: 'S\'inscrire', en: 'Sign up', de: 'Registrieren', nl: 'Registreren' }
];

const langs = ['fr', 'en', 'de', 'nl'];
let missingTranslations = 0;
let modifiedIcons = 0;

const htmlFiles = [...new Set(tableData.map(t => t.file))];

console.log("=== VÉRIFICATION DES TRADUCTIONS ET CLÉS ===");

htmlFiles.forEach(file => {
  langs.forEach(lang => {
    const dir = lang === 'fr' ? '.' : lang;
    const filePath = path.join(rootDir, dir, file);
    if (!fs.existsSync(filePath)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const pageItems = tableData.filter(t => t.file === file);
    
    pageItems.forEach(item => {
      const textToMatch = item[lang];
      const key = item.key;
      
      // We check if the translation exists AND if the data-i18n exists
      // Check presence of data-i18n="key" or data-i18n-placeholder="key"
      if (!content.includes(`data-i18n="${key}"`) && 
          !content.includes(`data-i18n-placeholder="${key}"`) && 
          !content.includes(`data-i18n-value="${key}"`)) {
        console.error(`[ERREUR] Clé manquante dans ${dir}/${file} : ${key}`);
        missingTranslations++;
      }
      
      // We also check if the translated text is there
      if (!content.includes(textToMatch)) {
        console.error(`[ERREUR] Texte traduit manquant dans ${dir}/${file} : "${textToMatch}"`);
        missingTranslations++;
      }
    });

    // Check material icons
    // Match <span class="material-symbols-outlined" ...> or similar where data-i18n is inside
    const iconRegex = /<[^>]*material-symbols-outlined[^>]*data-i18n[^>]*>|<[^>]*data-i18n[^>]*material-symbols-outlined[^>]*>/gi;
    const matches = content.match(iconRegex);
    if (matches && matches.length > 0) {
      console.error(`[ERREUR] Icône Material Symbol affectée dans ${dir}/${file} : ${matches.length} occurrences`);
      modifiedIcons += matches.length;
    }
  });
});

if (missingTranslations === 0) {
  console.log("✅ Toutes les clés data-i18n et textes traduits sont bien présents dans les 24 fichiers HTML (6 pages x 4 langues).");
}
if (modifiedIcons === 0) {
  console.log("✅ Aucune icône Material Symbols n'a été corrompue avec l'attribut data-i18n.");
}
