const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langs = ['fr', 'en', 'de', 'nl'];

const privatePages = [
    'tableau-de-bord.html',
    'admin-commandes.html',
    'connexion.html',
    'inscription.html',
    'panier.html',
    'recapitulatif-commande.html',
    'merci-contact.html',
    'merci-devis.html',
    'merci-inscription.html',
    'confirmation-commande.html',
    'activation.html'
];

const titles = {
    fr: {
        'tableau-de-bord.html': 'Tableau de bord | sotramsbois',
        'admin-commandes.html': 'Administration des commandes | sotramsbois',
        'connexion.html': 'Connexion | sotramsbois',
        'inscription.html': 'Inscription | sotramsbois',
        'panier.html': 'Panier | sotramsbois',
        'recapitulatif-commande.html': 'Récapitulatif de commande | sotramsbois',
        'merci-contact.html': 'Message envoyé | sotramsbois',
        'merci-devis.html': 'Demande de devis envoyée | sotramsbois',
        'merci-inscription.html': 'Inscription réussie | sotramsbois',
        'confirmation-commande.html': 'Commande confirmée | sotramsbois',
        'activation.html': 'Activation du compte | sotramsbois'
    },
    en: {
        'tableau-de-bord.html': 'Dashboard | sotramsbois',
        'admin-commandes.html': 'Order Administration | sotramsbois',
        'connexion.html': 'Login | sotramsbois',
        'inscription.html': 'Register | sotramsbois',
        'panier.html': 'Cart | sotramsbois',
        'recapitulatif-commande.html': 'Order Summary | sotramsbois',
        'merci-contact.html': 'Message Sent | sotramsbois',
        'merci-devis.html': 'Quote Request Sent | sotramsbois',
        'merci-inscription.html': 'Registration Successful | sotramsbois',
        'confirmation-commande.html': 'Order Confirmed | sotramsbois',
        'activation.html': 'Account Activation | sotramsbois'
    },
    de: {
        'tableau-de-bord.html': 'Dashboard | sotramsbois',
        'admin-commandes.html': 'Bestellverwaltung | sotramsbois',
        'connexion.html': 'Anmelden | sotramsbois',
        'inscription.html': 'Registrieren | sotramsbois',
        'panier.html': 'Warenkorb | sotramsbois',
        'recapitulatif-commande.html': 'Bestellübersicht | sotramsbois',
        'merci-contact.html': 'Nachricht gesendet | sotramsbois',
        'merci-devis.html': 'Angebotsanfrage gesendet | sotramsbois',
        'merci-inscription.html': 'Registrierung erfolgreich | sotramsbois',
        'confirmation-commande.html': 'Bestellung bestätigt | sotramsbois',
        'activation.html': 'Kontoaktivierung | sotramsbois'
    },
    nl: {
        'tableau-de-bord.html': 'Dashboard | sotramsbois',
        'admin-commandes.html': 'Bestellingen Beheer | sotramsbois',
        'connexion.html': 'Inloggen | sotramsbois',
        'inscription.html': 'Registreren | sotramsbois',
        'panier.html': 'Winkelwagen | sotramsbois',
        'recapitulatif-commande.html': 'Besteloverzicht | sotramsbois',
        'merci-contact.html': 'Bericht verzonden | sotramsbois',
        'merci-devis.html': 'Offerteaanvraag verzonden | sotramsbois',
        'merci-inscription.html': 'Registratie succesvol | sotramsbois',
        'confirmation-commande.html': 'Bestelling bevestigd | sotramsbois',
        'activation.html': 'Account activatie | sotramsbois'
    }
};

// 1. Update SEO JSON
langs.forEach(lang => {
    const seoFile = path.join(rootDir, 'data', 'seo', `${lang}.json`);
    if (fs.existsSync(seoFile)) {
        const seoData = JSON.parse(fs.readFileSync(seoFile, 'utf8'));
        privatePages.forEach(page => {
            seoData[page] = { title: titles[lang][page] };
        });
        fs.writeFileSync(seoFile, JSON.stringify(seoData, null, 2) + '\n');
        console.log(`Updated ${lang}.json with private titles.`);
    }
});

// 2. Add noindex to private pages HTML
langs.forEach(lang => {
    privatePages.forEach(page => {
        const filePath = lang === 'fr' ? path.join(rootDir, page) : path.join(rootDir, lang, page);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (!content.includes('name="robots" content="noindex, nofollow"')) {
                // Insert after <meta charset="utf-8"/> or similar
                content = content.replace(/<head>/i, '<head>\n    <meta name="robots" content="noindex, nofollow"/>');
                fs.writeFileSync(filePath, content);
                console.log(`Added noindex to ${filePath}`);
            }
        }
    });
});

// 3. Add i18n-loader.js to depots.html if missing
langs.forEach(lang => {
    const page = 'depots.html';
    const filePath = lang === 'fr' ? path.join(rootDir, page) : path.join(rootDir, lang, page);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        const scriptSrc = lang === 'fr' ? './assets/js/i18n-loader.js' : '../assets/js/i18n-loader.js';
        const scriptTag = `<script src="${scriptSrc}"></script>`;
        if (!content.includes('i18n-loader.js')) {
            content = content.replace(/<\/body>/i, `    ${scriptTag}\n</body>`);
            fs.writeFileSync(filePath, content);
            console.log(`Added i18n-loader.js to ${filePath}`);
        }
    }
});
