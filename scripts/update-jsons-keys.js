const fs = require('fs');
const path = require('path');

function getNested(obj, keyPath) {
    return keyPath.split('.').reduce((o, k) => (o || {})[k], obj);
}

function setNested(obj, keyPath, value) {
    const keys = keyPath.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
}

function delNested(obj, keyPath) {
    const keys = keyPath.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) return;
        current = current[keys[i]];
    }
    delete current[keys[keys.length - 1]];
}

const dir = path.join(__dirname, '../data/i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const newKeys = {
    'fr': {
        'blog.alt_stacked_logs': 'Aperçu de bûches empilées',
        'blog.alt_pellet_plant': 'Usine de pellets',
        'auth.show_password': 'Afficher le mot de passe',
        'auth.hide_password': 'Masquer le mot de passe',
        'contact.title': '<span class="text-primary italic font-serif pr-2">Contactez</span> notre équipe',
        'quote.title': '<span class="text-primary italic font-serif pr-2">Demande de</span> devis B2B',
        'nav.prev': 'Précédent',
        'nav.next': 'Suivant'
    },
    'en': {
        'blog.alt_stacked_logs': 'Stacked logs view',
        'blog.alt_pellet_plant': 'Pellet plant',
        'auth.show_password': 'Show password',
        'auth.hide_password': 'Hide password',
        'contact.title': '<span class="text-primary italic font-serif pr-2">Contact</span> our team',
        'quote.title': '<span class="text-primary italic font-serif pr-2">Request for</span> B2B Quote',
        'nav.prev': 'Previous',
        'nav.next': 'Next'
    },
    'de': {
        'blog.alt_stacked_logs': 'Gestapelte Holzscheite',
        'blog.alt_pellet_plant': 'Pelletwerk',
        'auth.show_password': 'Passwort anzeigen',
        'auth.hide_password': 'Passwort verbergen',
        'contact.title': '<span class="text-primary italic font-serif pr-2">Kontaktieren Sie</span> unser Team',
        'quote.title': '<span class="text-primary italic font-serif pr-2">Anfrage für</span> B2B-Angebot',
        'nav.prev': 'Zurück',
        'nav.next': 'Weiter'
    },
    'nl': {
        'blog.alt_stacked_logs': 'Gestapelde houtblokken',
        'blog.alt_pellet_plant': 'Pelletfabriek',
        'auth.show_password': 'Wachtwoord tonen',
        'auth.hide_password': 'Wachtwoord verbergen',
        'contact.title': '<span class="text-primary italic font-serif pr-2">Neem contact op met</span> ons team',
        'quote.title': '<span class="text-primary italic font-serif pr-2">Aanvraag voor</span> B2B-offerte',
        'nav.prev': 'Vorige',
        'nav.next': 'Volgende'
    }
};

const keysToRemove = [
    'devis.demande_de', 'devis.industrielle', 'contact.contactez', 'contact.notre_quipe',
    'blog.alt_a_macro_shot_of_stacked_premiu', 'blog.alt_a_sleek_modern_industrial_pell'
];

langs.forEach(lang => {
    const file = path.join(dir, lang + '.json');
    let data = JSON.parse(fs.readFileSync(file));
    
    // Add new keys
    for (const [k, v] of Object.entries(newKeys[lang])) {
        setNested(data, k, v);
    }
    
    // Remove old keys
    for (const k of keysToRemove) {
        delNested(data, k);
    }
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

console.log('JSON files updated with new keys and old keys removed.');
