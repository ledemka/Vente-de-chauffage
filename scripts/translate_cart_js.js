const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../assets/js/cart.js');
let content = fs.readFileSync(file, 'utf8');

// 1. "Articles sélectionnés"
content = content.replace(
    "titleEl.textContent = `Articles sélectionnés (${items.length})`;",
    "titleEl.textContent = (window.i18n ? window.i18n.t('cart.selected_items_count', `Articles sélectionnés (${items.length})`).replace('{count}', items.length) : `Articles sélectionnés (${items.length})`);"
);

// 2. Format
content = content.replace(
    "Format : ${item.format} / ${prod.palette_weight}",
    "<span data-i18n=\"cart.format_weight\">Format :</span> ${item.format} / ${prod.palette_weight}"
);

// 3. "Prix pour 50cm"
content = content.replace(
    "prix 50cm",
    "prix 50cm" // we can leave this or add data-i18n
).replace(
    "<span class=\"text-[10px] text-amber-700 font-normal ml-1\">prix 50cm</span>",
    "<span class=\"text-[10px] text-amber-700 font-normal ml-1\" data-i18n=\"cart.price_50cm\">prix 50cm</span>"
);

// 4. "Choisir le format"
content = content.replace(
    "<span>Choisir le format</span>",
    "<span data-i18n=\"catalog.filters.format_select\">Choisir le format</span>"
);

// 5. Sidebar strings
content = content.replace(
    '<h4 class="font-bold text-on-surface">Livraison estimée :</h4>',
    '<h4 class="font-bold text-on-surface" data-i18n="cart.delivery_est_title">Livraison estimée :</h4>'
);

content = content.replace(
    '<p class="text-body-sm text-on-surface-variant">3 à 5 jours ouvrés (France et limitrophe)</p>',
    '<p class="text-body-sm text-on-surface-variant" data-i18n="cart.delivery_est_desc">3 à 5 jours ouvrés (France et limitrophe)</p>'
);

content = content.replace(
    '<span>Votre Tarif Dégressif</span>',
    '<span data-i18n="cart.discount_title">Votre Tarif Dégressif</span>'
);

content = content.replace(
    '<span class="text-body-md text-on-surface-variant font-medium">Volume actuel :</span>',
    '<span class="text-body-md text-on-surface-variant font-medium" data-i18n="cart.current_volume">Volume actuel :</span>'
);

content = content.replace(
    '${totalQuantity} Palette(s)',
    '${totalQuantity} <span data-i18n="cart.pallets">Palette(s)</span>'
);

content = content.replace(
    '<span>Palier actuel (- ${currentTier.pct * 100}%)</span>',
    '<span><span data-i18n="cart.current_tier">Palier actuel</span> (- ${currentTier.pct * 100}%)</span>'
);

content = content.replace(
    '<span>Prochain palier (- ${nextTier.pct * 100}%)</span>',
    '<span><span data-i18n="cart.next_tier">Prochain palier</span> (- ${nextTier.pct * 100}%)</span>'
);

content = content.replace(
    'Plus que <span class="font-bold text-primary">${palettesMissing} palette(s)</span> pour - ${nextTier.pct * 100}% !',
    '<span data-i18n="cart.more_than">Plus que</span> <span class="font-bold text-primary">${palettesMissing} <span data-i18n="cart.pallets">palette(s)</span></span> <span data-i18n="cart.for">pour</span> - ${nextTier.pct * 100}% !'
);

content = content.replace(
    '🎉 Vous avez atteint la remise maximale (-10%) !',
    '<span data-i18n="cart.max_discount">🎉 Vous avez atteint la remise maximale (-10%) !</span>'
);

content = content.replace(
    '<span>Sous-total TTC</span>',
    '<span data-i18n="cart.subtotal_ttc">Sous-total TTC</span>'
);

content = content.replace(
    '<span>Remise volume (-${currentTier.pct * 100}%)</span>',
    '<span><span data-i18n="cart.volume_discount">Remise volume</span> (-${currentTier.pct * 100}%)</span>'
);

content = content.replace(
    '<span>Frais de livraison</span>',
    '<span data-i18n="cart.shipping_fees">Frais de livraison</span>'
);

content = content.replace(
    '<span class="font-bold">Calculés à la validation</span>',
    '<span class="font-bold" data-i18n="cart.calc_at_checkout">Calculés à la validation</span>'
);

content = content.replace(
    '<span class="text-headline-md font-headline-md">Total TTC</span>',
    '<span class="text-headline-md font-headline-md" data-i18n="cart.total_ttc">Total TTC</span>'
);

content = content.replace(
    '<span>Valider ma commande</span>',
    '<span data-i18n="cart.validate_order">Valider ma commande</span>'
);

content = content.replace(
    '<span class="material-symbols-outlined text-[14px]">lock</span> Paiement sécurisé B2B par Virement',
    '<span class="material-symbols-outlined text-[14px]">lock</span> <span data-i18n="cart.secure_payment">Paiement sécurisé B2B par Virement</span>'
);

content = content.replace(
    "if(window.i18n) window.i18n.translateDOM(container);",
    "if(window.i18n) window.i18n.translateDOM(container);\n        if(window.i18n && sidebar) window.i18n.translateDOM(sidebar);"
);

fs.writeFileSync(file, content);
console.log('cart.js translated.');

// Now add the keys to the JSONs
const dir = path.join(__dirname, '../data/i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const newKeys = {
    'fr': {
        'selected_items_count': 'Articles sélectionnés ({count})',
        'format_weight': 'Format :',
        'price_50cm': 'prix 50cm',
        'delivery_est_title': 'Livraison estimée :',
        'delivery_est_desc': '3 à 5 jours ouvrés (France et limitrophe)',
        'discount_title': 'Votre Tarif Dégressif',
        'current_volume': 'Volume actuel :',
        'pallets': 'Palette(s)',
        'current_tier': 'Palier actuel',
        'next_tier': 'Prochain palier',
        'more_than': 'Plus que',
        'for': 'pour',
        'max_discount': '🎉 Vous avez atteint la remise maximale (-10%) !',
        'subtotal_ttc': 'Sous-total TTC',
        'volume_discount': 'Remise volume',
        'shipping_fees': 'Frais de livraison',
        'calc_at_checkout': 'Calculés à la validation',
        'total_ttc': 'Total TTC',
        'validate_order': 'Valider ma commande',
        'secure_payment': 'Paiement sécurisé B2B par Virement'
    },
    'en': {
        'selected_items_count': 'Selected items ({count})',
        'format_weight': 'Format:',
        'price_50cm': 'price for 50cm',
        'delivery_est_title': 'Estimated delivery:',
        'delivery_est_desc': '3 to 5 business days (France & neighbors)',
        'discount_title': 'Your Volume Discount',
        'current_volume': 'Current volume:',
        'pallets': 'Pallet(s)',
        'current_tier': 'Current tier',
        'next_tier': 'Next tier',
        'more_than': 'Only',
        'for': 'more for',
        'max_discount': '🎉 You have reached the maximum discount (-10%)!',
        'subtotal_ttc': 'Subtotal (incl. tax)',
        'volume_discount': 'Volume discount',
        'shipping_fees': 'Shipping fees',
        'calc_at_checkout': 'Calculated at checkout',
        'total_ttc': 'Total (incl. tax)',
        'validate_order': 'Checkout',
        'secure_payment': 'Secure B2B Payment by Bank Transfer'
    },
    'de': {
        'selected_items_count': 'Ausgewählte Artikel ({count})',
        'format_weight': 'Format:',
        'price_50cm': 'Preis für 50cm',
        'delivery_est_title': 'Voraussichtliche Lieferung:',
        'delivery_est_desc': '3 bis 5 Werktage (Frankreich & Nachbarländer)',
        'discount_title': 'Ihr Mengenrabatt',
        'current_volume': 'Aktuelles Volumen:',
        'pallets': 'Palette(n)',
        'current_tier': 'Aktuelle Stufe',
        'next_tier': 'Nächste Stufe',
        'more_than': 'Nur noch',
        'for': 'für',
        'max_discount': '🎉 Sie haben den maximalen Rabatt erreicht (-10%)!',
        'subtotal_ttc': 'Zwischensumme (inkl. MwSt)',
        'volume_discount': 'Mengenrabatt',
        'shipping_fees': 'Versandkosten',
        'calc_at_checkout': 'An der Kasse berechnet',
        'total_ttc': 'Gesamtsumme (inkl. MwSt)',
        'validate_order': 'Bestellung aufgeben',
        'secure_payment': 'Sichere B2B-Zahlung per Überweisung'
    },
    'nl': {
        'selected_items_count': 'Geselecteerde artikelen ({count})',
        'format_weight': 'Formaat:',
        'price_50cm': 'prijs voor 50cm',
        'delivery_est_title': 'Verwachte levering:',
        'delivery_est_desc': '3 tot 5 werkdagen (Frankrijk & buren)',
        'discount_title': 'Uw Volumekorting',
        'current_volume': 'Huidig volume:',
        'pallets': 'Pallet(s)',
        'current_tier': 'Huidige trede',
        'next_tier': 'Volgende trede',
        'more_than': 'Nog',
        'for': 'voor',
        'max_discount': '🎉 U heeft de maximale korting bereikt (-10%)!',
        'subtotal_ttc': 'Subtotaal (incl. btw)',
        'volume_discount': 'Volumekorting',
        'shipping_fees': 'Verzendkosten',
        'calc_at_checkout': 'Berekend bij het afrekenen',
        'total_ttc': 'Totaal (incl. btw)',
        'validate_order': 'Afrekenen',
        'secure_payment': 'Veilige B2B-betaling via bankoverschrijving'
    }
};

langs.forEach(lang => {
    let data = JSON.parse(fs.readFileSync(path.join(dir, lang + '.json'), 'utf8'));
    if (!data.cart) data.cart = {};
    for (let k in newKeys[lang]) {
        data.cart[k] = newKeys[lang][k];
    }
    fs.writeFileSync(path.join(dir, lang + '.json'), JSON.stringify(data, null, 2));
});
console.log('JSONs updated.');
