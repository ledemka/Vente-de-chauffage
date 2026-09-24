const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '../data/i18n');
const emailDir = path.join(__dirname, '../data/emails'); // Check if it's data/emails or data/i18n ? Wait, user said emails-{lang}.json. I need to find where they are.
// I'll assume they are in data/i18n or data/emails. Let's find out where emails-*.json are.

// First, let's update data/i18n/*.json
const langs = ['fr', 'en', 'de', 'nl'];

for (const lang of langs) {
    const filePath = path.join(i18nDir, `${lang}.json`);
    if (!fs.existsSync(filePath)) continue;
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add missing keys explicitly requested
    if (!data.blog) data.blog = {};
    data.blog.load_more = lang === 'fr' ? 'Charger plus d\'articles' : (lang === 'en' ? 'Load more articles' : (lang === 'de' ? 'Mehr Artikel laden' : 'Meer artikelen laden'));
    
    if (!data.checkout) data.checkout = {};
    data.checkout.auth_modal_title = lang === 'fr' ? 'Connexion requise' : (lang === 'en' ? 'Login required' : (lang === 'de' ? 'Anmeldung erforderlich' : 'Inloggen vereist'));
    data.checkout.auth_modal_desc = lang === 'fr' ? 'Vous devez être connecté pour finaliser votre commande.' : (lang === 'en' ? 'You must be logged in to complete your order.' : (lang === 'de' ? 'Sie müssen angemeldet sein, um Ihre Bestellung abzuschließen.' : 'U moet ingelogd zijn om uw bestelling af te ronden.'));
    data.checkout.auth_modal_login = lang === 'fr' ? 'Se connecter' : (lang === 'en' ? 'Log in' : (lang === 'de' ? 'Anmelden' : 'Inloggen'));
    data.checkout.auth_modal_register = lang === 'fr' ? 'Créer un compte' : (lang === 'en' ? 'Create an account' : (lang === 'de' ? 'Konto erstellen' : 'Account aanmaken'));
    data.checkout.distance = lang === 'fr' ? 'Distance' : (lang === 'en' ? 'Distance' : (lang === 'de' ? 'Entfernung' : 'Afstand'));
    
    if (lang === 'en') {
        data.checkout.bank_transfer_only = 'Bank Transfer Only';
        data.checkout.bank_transfer_desc = 'Please transfer the total amount to the provided bank account. Your order will be shipped upon receipt of payment.';
    }

    if (!data.stepper) data.stepper = {};
    data.stepper.cart = lang === 'fr' ? 'Panier' : (lang === 'en' ? 'Cart' : (lang === 'de' ? 'Warenkorb' : 'Winkelwagen'));
    data.stepper.address = lang === 'fr' ? 'Adresse' : (lang === 'en' ? 'Address' : (lang === 'de' ? 'Adresse' : 'Adres'));
    data.stepper.confirm = lang === 'fr' ? 'Confirmation' : (lang === 'en' ? 'Confirmation' : (lang === 'de' ? 'Bestätigung' : 'Bevestiging'));
    
    if (!data.dashboard) data.dashboard = {};
    if (!data.dashboard.profile) data.dashboard.profile = {};
    
    const frProfile = {
        identity: 'Identité',
        first_name: 'Prénom',
        last_name: 'Nom',
        function: 'Fonction',
        contact_info: 'Coordonnées',
        pro_info: 'Informations professionnelles',
        billing_address: 'Adresse de facturation',
        address_complement: 'Complément d\'adresse',
        siret: 'SIRET',
        tva: 'Numéro de TVA'
    };
    const enProfile = {
        identity: 'Identity',
        first_name: 'First name',
        last_name: 'Last name',
        function: 'Function',
        contact_info: 'Contact Info',
        pro_info: 'Professional Info',
        billing_address: 'Billing Address',
        address_complement: 'Address Complement',
        siret: 'Company ID (SIRET)',
        tva: 'VAT Number'
    };
    const deProfile = {
        identity: 'Identität',
        first_name: 'Vorname',
        last_name: 'Nachname',
        function: 'Funktion',
        contact_info: 'Kontaktinformationen',
        pro_info: 'Berufliche Informationen',
        billing_address: 'Rechnungsadresse',
        address_complement: 'Adresszusatz',
        siret: 'Firmennummer (SIRET)',
        tva: 'Umsatzsteuernummer'
    };
    const nlProfile = {
        identity: 'Identiteit',
        first_name: 'Voornaam',
        last_name: 'Achternaam',
        function: 'Functie',
        contact_info: 'Contactgegevens',
        pro_info: 'Professionele informatie',
        billing_address: 'Factuuradres',
        address_complement: 'Adresaanvulling',
        siret: 'Bedrijfsnummer (SIRET)',
        tva: 'Btw-nummer'
    };
    
    const prof = lang === 'fr' ? frProfile : (lang === 'en' ? enProfile : (lang === 'de' ? deProfile : nlProfile));
    for (const [k, v] of Object.entries(prof)) {
        data.dashboard.profile[k] = v;
    }
    
    if (!data.product) data.product = {};
    data.product.tax_included = lang === 'fr' ? 'TTC' : (lang === 'en' ? 'Incl. Tax' : (lang === 'de' ? 'Inkl. MwSt' : 'Incl. Btw'));
    data.product.total_ht = lang === 'fr' ? 'Total HT' : (lang === 'en' ? 'Total Excl. Tax' : (lang === 'de' ? 'Gesamt exkl. MwSt' : 'Totaal excl. Btw'));
    
    if (!data.quote) data.quote = {};
    if (!data.quote.specs) data.quote.specs = {};
    data.quote.specs.select_product = lang === 'fr' ? 'Sélectionnez un produit' : (lang === 'en' ? 'Select a product' : (lang === 'de' ? 'Wählen Sie ein Produkt' : 'Selecteer een product'));
    data.quote.specs.select_format = lang === 'fr' ? 'Sélectionnez un format...' : (lang === 'en' ? 'Select a format...' : (lang === 'de' ? 'Wählen Sie ein Format...' : 'Selecteer een formaat...'));
    
    if (!data.register) data.register = {};
    if (!data.register.form) data.register.form = {};
    data.register.form.billing_address = lang === 'fr' ? 'Adresse de facturation' : (lang === 'en' ? 'Billing Address' : (lang === 'de' ? 'Rechnungsadresse' : 'Factuuradres'));
    
    // Add missing footer keys from audit
    if (!data.footer) data.footer = {};
    data.footer.client_space_title = lang === 'fr' ? 'ESPACE CLIENT & PANIER' : (lang === 'en' ? 'CLIENT SPACE & CART' : (lang === 'de' ? 'KUNDENBEREICH & WARENKORB' : 'KLANTENRUIMTE & WINKELWAGEN'));
    data.footer.client_link_1 = lang === 'fr' ? 'Mon Panier' : (lang === 'en' ? 'My Cart' : (lang === 'de' ? 'Mein Warenkorb' : 'Mijn Winkelwagen'));
    data.footer.client_link_2 = lang === 'fr' ? 'Connexion / Inscription' : (lang === 'en' ? 'Login / Register' : (lang === 'de' ? 'Anmelden / Registrieren' : 'Inloggen / Registreren'));
    data.footer.client_link_3 = lang === 'fr' ? 'Suivi de livraison' : (lang === 'en' ? 'Delivery Tracking' : (lang === 'de' ? 'Lieferverfolgung' : 'Levering Volgen'));
    data.footer.client_link_4 = lang === 'fr' ? 'Service commercial' : (lang === 'en' ? 'Sales Department' : (lang === 'de' ? 'Vertriebsabteilung' : 'Verkoopafdeling'));
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}
console.log('Updated i18n JSONs with basic required keys.');
