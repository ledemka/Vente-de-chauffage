const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const langs = ['fr', 'en', 'de', 'nl'];
const pages = [
    'inscription.html',
    'connexion.html',
    'panier.html',
    'recapitulatif-commande.html',
    'confirmation-commande.html'
];

// Helper to update i18n
const i18nKeys = {
    "auth": {
        "login_title": "Connexion",
        "register_title": "Création de compte",
        "email": "Adresse Email",
        "password": "Mot de passe",
        "company": "Société",
        "siret": "SIRET (Optionnel)",
        "contact_name": "Nom du contact",
        "phone": "Téléphone",
        "login_btn": "Se connecter",
        "register_btn": "Créer mon compte",
        "guest_btn": "Continuer sans compte",
        "logout": "Se déconnecter"
    },
    "cart": {
        "title": "Votre Panier",
        "empty": "Votre panier est vide",
        "checkout_btn": "Valider la commande",
        "subtotal": "Sous-total HT",
        "discount": "Remise Volume",
        "total": "Total HT",
        "remove": "Supprimer"
    },
    "checkout": {
        "title": "Récapitulatif de commande",
        "delivery_details": "Détails de livraison",
        "address": "Adresse de livraison",
        "truck_access": "Accès Poids Lourd",
        "payment_method": "Mode de paiement",
        "bank_transfer_only": "Virement bancaire uniquement",
        "bank_transfer_desc": "Nos coordonnées bancaires vous seront transmises après validation de la commande.",
        "confirm_btn": "Confirmer la commande"
    },
    "confirmation": {
        "title": "Commande confirmée",
        "ref": "Référence de votre commande :",
        "msg1": "Votre commande a bien été enregistrée.",
        "msg2": "Virement bancaire uniquement. Un email contenant nos coordonnées bancaires vient de vous être envoyé.",
        "back_home": "Retour à l'accueil"
    }
};

langs.forEach(lang => {
    const jsonPath = path.join(root, 'data', 'i18n', `${lang}.json`);
    if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        // Just merge blindly for this prototype. Real translation would be done manually later.
        data.auth = i18nKeys.auth;
        data.cart = i18nKeys.cart;
        data.checkout = i18nKeys.checkout;
        data.confirmation = i18nKeys.confirmation;
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    }
});

// Helper to get base HTML
const baseHtml = fs.readFileSync(path.join(root, 'contact.html'), 'utf8');

pages.forEach(page => {
    langs.forEach(lang => {
        const isRoot = lang === 'fr';
        const destDir = isRoot ? root : path.join(root, lang);
        const relPath = isRoot ? '.' : '..';
        
        let content = baseHtml;
        
        // Fix relative paths
        content = content.replace(/href="\.\//g, `href="${relPath}/`);
        content = content.replace(/src="\.\//g, `src="${relPath}/`);
        
        // Inject script
        content = content.replace('</head>', `    <script src="${relPath}/assets/js/cart.js"></script>\n</head>`);

        // Replace main content with a placeholder so we can see it's the right page
        const mainRegex = /<main.*?>[\s\S]*?<\/main>/i;
        
        let pageSpecificContent = `<div class="max-w-[1440px] mx-auto px-margin-desktop py-16"><div class="bg-surface-container rounded-xl p-8 shadow-sm flex flex-col gap-6"><h1 class="text-headline-xl text-on-surface" data-i18n="${page.replace('.html', '')}.title">${page}</h1><p class="text-body-md text-on-surface-variant">Contenu en cours de construction. Integration de cart.js et auth.js à venir.</p></div></div>`;
        
        if (page === 'panier.html') {
             pageSpecificContent = `<div class="max-w-[1440px] mx-auto px-margin-desktop py-16"><h1 class="text-headline-xl text-on-surface mb-8" data-i18n="cart.title">Votre Panier</h1><div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter"><div class="lg:col-span-8 bg-surface-container rounded-xl p-8 shadow-sm" id="cart-items-container"><p data-i18n="cart.empty">Votre panier est vide</p></div><div class="lg:col-span-4 bg-surface-container-highest rounded-xl p-8 shadow-sm h-fit"><div class="flex justify-between mb-4"><span data-i18n="cart.subtotal">Sous-total HT</span><span class="font-data-mono" id="cart-subtotal">0.00€</span></div><div class="flex justify-between mb-4 text-primary"><span data-i18n="cart.discount">Remise Volume</span><span class="font-data-mono" id="cart-discount">-0.00€</span></div><div class="flex justify-between mb-8 text-headline-md border-t border-outline/30 pt-4"><span data-i18n="cart.total">Total HT</span><span class="font-data-mono" id="cart-total">0.00€</span></div><a href="${relPath}/recapitulatif-commande.html" class="block text-center w-full bg-primary hover:bg-primary-container text-on-primary py-3 rounded-md uppercase font-bold" data-i18n="cart.checkout_btn">Valider la commande</a></div></div></div>`;
        }

        content = content.replace(mainRegex, `<main class="w-full pt-[128px] bg-background">${pageSpecificContent}</main>`);

        // Update canonical and hreflang
        content = content.replace(/contact\.html/g, page);

        fs.writeFileSync(path.join(destDir, page), content);
    });
});

console.log('Pages generated successfully.');
