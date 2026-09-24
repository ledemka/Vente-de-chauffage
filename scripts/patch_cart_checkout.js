const fs = require('fs');
const path = require('path');

const jsPath = path.join(__dirname, '../assets/js/cart.js');
let js = fs.readFileSync(jsPath, 'utf8');

// 1. Table headers
js = js.replace(
    '<th class="py-3 pr-2 text-label-md font-label-md uppercase text-on-surface-variant">Produit</th>',
    '<th class="py-3 pr-2 text-label-md font-label-md uppercase text-on-surface-variant" data-i18n="checkout.product">Produit</th>'
);
js = js.replace(
    '<th class="py-3 px-2 text-label-md font-label-md uppercase text-on-surface-variant text-center">Qté</th>',
    '<th class="py-3 px-2 text-label-md font-label-md uppercase text-on-surface-variant text-center" data-i18n="checkout.qty">Qté</th>'
);
js = js.replace(
    '<th class="py-3 pl-2 text-label-md font-label-md uppercase text-on-surface-variant text-right">Total TTC</th>',
    '<th class="py-3 pl-2 text-label-md font-label-md uppercase text-on-surface-variant text-right" data-i18n="checkout.total_ttc">Total TTC</th>'
);

// 2. "remisé"
js = js.replace(
    '<span class="text-xs text-primary font-bold block">-${item.discount_percent}% remisé</span>',
    '<span class="text-xs text-primary font-bold block">-${item.discount_percent}% <span data-i18n="checkout.discounted">remisé</span></span>'
);

// 3. "À calculer"
js = js.replace(
    "document.getElementById('checkout-shipping').textContent = 'À calculer';",
    "document.getElementById('checkout-shipping').textContent = (window.i18n ? window.i18n.t('checkout.to_be_calculated', 'À calculer') : 'À calculer');"
);
js = js.replace(
    "shippingCostEl.textContent = 'À calculer';",
    "shippingCostEl.textContent = (window.i18n ? window.i18n.t('checkout.to_be_calculated', 'À calculer') : 'À calculer');"
);

// 4. Modal translations
js = js.replace(
    "Confirmer l'adresse",
    "<span data-i18n=\"checkout.confirm_address\">Confirmer l'adresse</span>"
);
js = js.replace(
    '<span class="text-label-sm uppercase text-outline-variant tracking-wider">Adresse</span>',
    '<span class="text-label-sm uppercase text-outline-variant tracking-wider" data-i18n="checkout.address">Adresse</span>'
);
js = js.replace(
    '<span class="text-label-sm uppercase text-outline-variant tracking-wider">Code Postal</span>',
    '<span class="text-label-sm uppercase text-outline-variant tracking-wider" data-i18n="checkout.zip">Code Postal</span>'
);
js = js.replace(
    '<span class="text-label-sm uppercase text-outline-variant tracking-wider">Ville</span>',
    '<span class="text-label-sm uppercase text-outline-variant tracking-wider" data-i18n="checkout.city">Ville</span>'
);
js = js.replace(
    '<button id="btn-modal-cancel" class="flex-1 py-3 border-2 border-outline hover:border-primary text-on-surface rounded-md font-label-md transition-colors shadow-sm">Modifier</button>',
    '<button id="btn-modal-cancel" class="flex-1 py-3 border-2 border-outline hover:border-primary text-on-surface rounded-md font-label-md transition-colors shadow-sm" data-i18n="checkout.edit">Modifier</button>'
);
js = js.replace(
    '<button id="btn-modal-confirm" class="flex-1 py-3 bg-primary hover:bg-primary-container text-on-primary rounded-md font-label-md transition-colors shadow-sm">Confirmer</button>',
    '<button id="btn-modal-confirm" class="flex-1 py-3 bg-primary hover:bg-primary-container text-on-primary rounded-md font-label-md transition-colors shadow-sm" data-i18n="checkout.confirm">Confirmer</button>'
);
js = js.replace(
    "document.body.insertAdjacentHTML('beforeend', modalHtml);",
    "document.body.insertAdjacentHTML('beforeend', modalHtml);\n                                    if (window.i18n) window.i18n.translateDOM(document.getElementById('address-confirm-modal'));"
);

// 5. Read-only widget translations
js = js.replace(
    '<div class="text-label-md font-bold text-[#802813] mb-1">Adresse validée</div>',
    '<div class="text-label-md font-bold text-[#802813] mb-1" data-i18n="checkout.address_validated">Adresse validée</div>'
);
js = js.replace(
    'await calculateCheckoutShipping(item.address.label);',
    'if (window.i18n) window.i18n.translateDOM(widget);\n                                        await calculateCheckoutShipping(item.address.label);'
);

// 6. translateDOM(itemsContainer)
js = js.replace(
    "itemsContainer.innerHTML = html;",
    "itemsContainer.innerHTML = html;\n        if (window.i18n) window.i18n.translateDOM(itemsContainer);"
);

fs.writeFileSync(jsPath, js);
console.log('Patched checkout logic in cart.js');
