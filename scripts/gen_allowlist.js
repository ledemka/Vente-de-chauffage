const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '../data/i18n');
const fr = JSON.parse(fs.readFileSync(path.join(i18nDir, 'fr.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(i18nDir, 'en.json'), 'utf8'));
const de = JSON.parse(fs.readFileSync(path.join(i18nDir, 'de.json'), 'utf8'));
const nl = JSON.parse(fs.readFileSync(path.join(i18nDir, 'nl.json'), 'utf8'));

const allowlist = {};

function compare(frObj, obj, lang, prefix = '') {
    for (const key in frObj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const frVal = frObj[key];
        const v = obj[key];
        
        if (typeof frVal === 'object' && frVal !== null) {
            compare(frVal, v || {}, lang, fullKey);
        } else {
            if (v === frVal) {
                if (!allowlist[fullKey]) allowlist[fullKey] = [];
                allowlist[fullKey].push(lang);
            }
        }
    }
}

compare(fr, en, 'en');
compare(fr, de, 'de');
compare(fr, nl, 'nl');

// Remove the ones that the user specifically requested to re-translate, so they will trigger an error until fixed
const forceRetranslate = [
    'contact.notre_quipe_dexperts_en_biomas',
    'contact.jaccepte_que_les_informations_',
    'produit.bois_sec_premium_prt__lemploi_',
    'activation.accdez__vos_grilles_tarifaires',
    'connexion.accdez__vos_grilles_tarifaires',
    'guide_choix.bon_pouvoir_calorifique_mais_c',
    'guide_choix.montent_trs_vite_en_temprature',
    'avis_clients.avis_client__ajouter__emplacem',
    'devis.ph_prcisions_sur_laccs_horaires_d',
    'livraison.le_transpalette_manuel_ncessit',
    'avis_clients.dcouvrez_pourquoi_plus_de_1_00',
    'devis.obtenez_une_tarification_sur-m',
    'contact.charbon__allume-feu__bches_de_'
];

for (const key of forceRetranslate) {
    delete allowlist[key];
}

fs.writeFileSync(path.join(__dirname, 'i18n-allowlist.json'), JSON.stringify(allowlist, null, 2));
console.log('Generated allowlist');
