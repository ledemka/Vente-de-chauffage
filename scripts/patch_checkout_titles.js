const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../data/i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const dict = {
  'fr': {
    'title': 'Récapitulatif de commande',
    'auth_modal_title': 'Un compte est nécessaire',
    'auth_modal_desc': "Pour suivre votre commande et être notifié de son avancement, merci de vous connecter ou de créer un compte. Votre panier est conservé, vous n'avez rien à ressaisir.",
    'auth_modal_login': "J'ai déjà un compte",
    'auth_modal_register': "Créer un compte",
    'delivery_details': 'Détails de livraison',
    'custom_quote': "Veuillez effectuer une demande de devis sur mesure.",
    'request_quote': "Faire une demande de devis",
    'delivery_fee': "Frais de livraison",
    'confirm_btn': "Confirmer la commande"
  },
  'en': {
    'title': 'Order Summary',
    'auth_modal_title': 'Account required',
    'auth_modal_desc': "To track your order and be notified of its progress, please log in or create an account. Your cart is saved, you don't have to re-enter anything.",
    'auth_modal_login': "I already have an account",
    'auth_modal_register': "Create an account",
    'delivery_details': 'Delivery Details',
    'custom_quote': "Please request a custom quote.",
    'request_quote': "Request a quote",
    'delivery_fee': "Delivery fee",
    'confirm_btn': "Confirm order"
  },
  'de': {
    'title': 'Bestellübersicht',
    'auth_modal_title': 'Konto erforderlich',
    'auth_modal_desc': "Um Ihre Bestellung zu verfolgen und über deren Fortschritt benachrichtigt zu werden, melden Sie sich bitte an oder erstellen Sie ein Konto. Ihr Warenkorb ist gespeichert, Sie müssen nichts neu eingeben.",
    'auth_modal_login': "Ich habe bereits ein Konto",
    'auth_modal_register': "Konto erstellen",
    'delivery_details': 'Lieferdetails',
    'custom_quote': "Bitte fordern Sie ein individuelles Angebot an.",
    'request_quote': "Ein Angebot anfordern",
    'delivery_fee': "Liefergebühr",
    'confirm_btn': "Bestellung bestätigen"
  },
  'nl': {
    'title': 'Besteloverzicht',
    'auth_modal_title': 'Account vereist',
    'auth_modal_desc': "Om uw bestelling te volgen en op de hoogte te worden gehouden van de voortgang, dient u in te loggen of een account aan te maken. Uw winkelwagen wordt opgeslagen, u hoeft niets opnieuw in te voeren.",
    'auth_modal_login': "Ik heb al een account",
    'auth_modal_register': "Een account aanmaken",
    'delivery_details': 'Leveringsgegevens',
    'custom_quote': "Vraag een offerte op maat aan.",
    'request_quote': "Een offerte aanvragen",
    'delivery_fee': "Leveringskosten",
    'confirm_btn': "Bestelling bevestigen"
  }
};

langs.forEach(lang => {
    let data = JSON.parse(fs.readFileSync(path.join(dir, lang + '.json'), 'utf8'));
    if (!data.checkout) data.checkout = {};
    for (let k in dict[lang]) {
        data.checkout[k] = dict[lang][k];
    }
    fs.writeFileSync(path.join(dir, lang + '.json'), JSON.stringify(data, null, 2));
});
console.log('Added missing checkout titles to JSON.');
